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
  private final val foodPower = 4

  private var snakes = initialSnakes take playersCount
  private var food: List[(Int, Int)] = Nil
  private var battleState: BattleState = null
  private var winner = -1

  def update(): Unit = {
    if (winner != -1)
      return
    if (battleState == null) {
      snakes foreach (x => x.move())
      val fighters = for {
        i <- 0 until playersCount
        j <- 0 until playersCount
        if i < j && snakes(i).head == snakes(j).head
      } yield (snakes(i), snakes(j))
      if (fighters.length > 1) {
        winner = -2
        snakes = Nil
        return
      }
      fighters foreach { case (s1, s2) => battleState = new BattleState(s1, s2)}

      val cuttings = for {
        predator <- snakes
        victim <- snakes
        if victim.head != predator.head
        if victim.body.contains(predator.head)
      } yield (victim, predator)
      cuttings.foreach({ case (v, p) => p.feed(v.cut(p.head) / 2)})

      snakes foreach (s => {
        val yumyum = food.indexOf(s.head)
        if (yumyum != -1) {
          s.feed(foodPower)
          food = food.take(yumyum) ++ food.drop(yumyum + 1)
        }
      })

      food = (Random.nextInt(width), Random.nextInt(height)) :: food
    }
  }

  def changeDirection(snake: Int, dir: Orientation) = {
    snakes(snake).changeOrientation(dir)
  }

  def serialize() = Json.toJson(Map(
    "snakes" -> Json.toJson(Seq(snakes map (_.serialize()))),
    "battle" -> (battleState match {
      case null => Json.toJson(false)
      case bs => bs.serialize()
    }),
    "food" -> Json.toJson(food.map { case (x, y) => Json.toJson(Seq(x, y))}),
    "winner" -> Json.toJson(winner)
  ))
}

}
