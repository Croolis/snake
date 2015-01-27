package game

import scala.util.Random
import play.api.libs.json._

/**
 * Describes a state of a game
 */
class GameState(val players: Seq[Player], val width: Int = 40, val height: Int = 20) {
  private final val margin = 5
  private final val initialSnakes = List(new Snake((margin, margin), (width, height), Right),
    new Snake((width - margin, margin), (width, height), Left),
    new Snake((margin, height - margin), (width, height), Right),
    new Snake((width - margin, height - margin), (width, height), Right))
  private final val foodPower = 2

  private val playersCount = players.length

  private var snakes = initialSnakes take playersCount
  private var food = List[(Int, Int)]()
  private var battleState: BattleState = null
  private var _winner = -1

  def winner = _winner

  private def snakesAlive = snakes.withFilter(_ != null)

  def update(): Unit = {
    if (_winner != -1)
      return
    if (battleState == null) {
      snakesAlive foreach (x => x.move())
      val fighters = for {
        i <- 0 until playersCount
        j <- 0 until playersCount
        if i < j
        if snakes(i) != null && snakes(j) != null
        if snakes(i).head == snakes(j).head ||
           snakes(j).length >= 2 && snakes(i).head == snakes(j).body.init.last ||
           snakes(i).length >= 2 && snakes(j).head == snakes(i).body.init.last
      } yield (i, j)
      if (fighters.length > 1) {
        _winner = -2
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
          _winner = snakes.indexWhere(_ != null)
        battleState = null
      }
      else
        battleState.update()
    }
  }

  def kill(player: Int) = {
    snakes = (snakes take player) ++ (null :: (snakes drop (player + 1)))
    if (battleState != null) {
      if (battleState.s1index == player)
        battleState = null
      if (battleState.s2index == player)
        battleState = null
    }
    if (snakes.count(_ != null) == 1)
      _winner = snakes.indexWhere(_ != null)
  }

  def changeDirection(snake: Int, dir: Orientation) = {
    snakes(snake).changeOrientation(dir)
  }

  def serialize() = Json.toJson(Map(
    "players" -> Json.toJson(players map (p => p.serialize())),
    "snakes" -> Json.toJson(snakes map {
      case null => JsNull
      case x => x.serialize()}),
    "battle" -> (battleState match {
      case null => JsNull
      case bs => bs.serialize()
    }),
    "food" -> Json.toJson(food.map { case (x, y) => Json.toJson(Seq(x, y))}),
    "winner" -> Json.toJson(_winner)
  ))
}