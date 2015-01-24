import scala.util.Random

package game {

import play.api.libs.json._

/**
 * Describes a state of a game
 */
class GameState(val playersCount: Int, val width: Int, val height: Int) {
  private final val margin = 5
  private final val initialSnakes = List(new Snake((margin, margin), (width, height), Right),
    new Snake((width - margin, margin), (width, height), Left),
    new Snake((margin, height - margin), (width, height), Right),
    new Snake((width - margin, height - margin), (width, height), Right))
  private final val foodPower = 3

  private var snakes = initialSnakes take playersCount
  private var food: List[(Int, Int)] = Nil
  private var battleState: BattleState = null
  private var winner = -1

  def snakesAlive = snakes.withFilter(_ != null)

  def update(): Unit = {
    if (winner != -1)
      return
    if (battleState == null) {
      snakesAlive foreach (x => x.move())
      val fighters = for {
        i <- 0 until playersCount
        j <- 0 until playersCount
        if i < j
        if snakes(i) != null && snakes(j) != null
        if snakes(i).head == snakes(j).head ||
           snakes(j).length >= 2 && snakes(i).head == snakes(j).body(1) ||
           snakes(i).length >= 2 && snakes(j).head == snakes(i).body(1)
      } yield (i, j)
      if (fighters.length > 1) {
        winner = -2
        snakes = snakes map (x => null)
        return
      }
      fighters foreach { case (s1, s2) => battleState = new BattleState(s1, snakes(s1), s2, snakes(s2))}

      val cuttings = for {
        predator <- snakesAlive
        victim <- snakesAlive
        if victim.head != predator.head
        if victim.body.contains(predator.head)
      } yield (victim, predator)
      cuttings.foreach({ case (v, p) => p.feed(v.cut(p.head) / 2)})

      snakesAlive foreach (s => {
        val yumyum = food.indexOf(s.head)
        if (yumyum != -1) {
          s.feed(foodPower)
          food = food.take(yumyum) ++ food.drop(yumyum + 1)
        }
      })

      if (food.length < snakes.length)
        food = (Random.nextInt(width), Random.nextInt(height)) :: food
    } else {
      if (battleState.win) {
        val (alive, dead) = if (battleState.pow1 < battleState.pow2)
          (battleState.s1index, battleState.s2index)
        else
          (battleState.s2index, battleState.s1index)
        snakes(alive).feed(snakes(dead).length / 2)
        snakes = (snakes take dead) ++ (null :: (snakes drop (dead + 1)))
        if (snakes.count(_ != null) == 1)
          winner = snakes.indexWhere(_ != null)
        battleState = null
      }
      else
        battleState.update()
    }
  }

  def changeDirection(snake: Int, dir: Orientation) = {
    snakes(snake).changeOrientation(dir)
  }

  def serialize() = Json.toJson(Map(
    "snakes" -> Json.toJson(snakes map {
      case null => JsNull
      case x => x.serialize()}),
    "battle" -> (battleState match {
      case null => JsNull
      case bs => bs.serialize()
    }),
    "food" -> Json.toJson(food.map { case (x, y) => Json.toJson(Seq(x, y))}),
    "winner" -> Json.toJson(winner)
  ))
}

}
