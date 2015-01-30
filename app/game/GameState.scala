package game

import language.postfixOps
import scala.collection.mutable
import scala.util.Random
import play.api.libs.json._

class GameState(playerSeq: Seq[Player], val width: Int = 40, val height: Int = 20) {
  // Margin between field border and snake
  private val margin = 5
  // Initial snake positions.
  private val initialSnakes = List(new Snake((margin, margin), (width, height), Right),
                                   new Snake((width - margin, margin), (width, height), Left),
                                   new Snake((margin, height - margin), (width, height), Right),
                                   new Snake((width - margin, height - margin), (width, height), Right))
  // Amount of segments, added to snake after eating an apple.
  private val foodPower = 2
  // Amount of segments, added to snake after eating a mouse.
  private val mousePower = 5
  // Value, which is inversely proportional to the probability of mouse spawn.
  private val mouseSpawnPeriod = 20
  // Collection of pairs (Player, Snake)
  private val players = playerSeq map (_.username) zip initialSnakes toArray
  // Queue, used to store messages, that should be sent to players.
  private val messageQueue = mutable.Queue[Message]()
  // Queue, used to store players, that should fight a duel.
  private val duelQueue = mutable.Queue[(String, String)]()
  // Current duel
  private var duelState: DuelState = _
  // Array with food coordinates.
  private val food = Array((0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)) take players.length
  private var mouse: Mouse = _
  // Map, used to find player's snake efficiently
  private val playerIndex = Map(players: _*)
  private var _gameOver = false

  private def sendMessage(msg: Message) =
    messageQueue.enqueue(msg)

  private def sendMessage(msg: String, data: JsValue = null) =
    messageQueue.enqueue(Message(msg, data))

  def update(): Unit =
    if (duelState != null)
      if (duelState.win) {
        playerIndex(duelState.winner).feed((playerIndex(duelState.loser).length + 1) / 2)
        kill(duelState.loser)
        duelState = null
        update()
      }
      else
        sendMessage(duelState.update())
    else
    if (duelQueue.nonEmpty) {
      val (player1, player2) = duelQueue.dequeue()
      duelState = new DuelState(player1, playerIndex(player1), player2, playerIndex(player2))
      update()
    }
    else if (!gameOver)
      updateField()


  private def updateField(): Unit = {
    // Move snakes.
    val snakes = players.unzip._2
    snakes foreach (_.move())
    if (mouse != null)
      mouse.move()

    sendMessage("move", Json.toJson(
      (Seq(mouse) filter (_ != null) map (m => JsObject(Seq("mouse" -> m.toJson)))) ++
      (food map (a => JsObject(Seq("apple" -> Json.toJson(Seq(a._1, a._2)))))) ++
      (players map {
        case (player, snake) => {
          JsObject(Seq("player" -> JsObject(Seq(
            "name" -> JsString(player),
            "snake" -> snake.toJson
          ))))
        }
      })))

    // Find duels.
    duelQueue.enqueue((for {
      (player1, snake1) <- players
      (player2, snake2) <- players
      if snake2.alive
      if player1 < player2
      if (0 to 1) contains snake1.indexOfSegment(snake2.head)
    } yield (player1, player2)): _*)

    // Find cuts.
    for {
      (player1, predator) <- players
      (player2, victim) <- players
      pos = victim.indexOfSegment(predator.head)
      if pos >= 2
    } {
      predator.feed((victim.length - pos + 1) / 2)
      victim.cut(predator.head)
      sendMessage("cut", JsObject(Seq("predator" -> JsString(player1), "victim" -> JsString(player2))))
    }

    // Feed snakes.
    for ((player, snake) <- players) {
      val index = food indexOf snake.head
      if (index != -1) {
        snake.feed(foodPower)
        food(index) = (Random.nextInt(width), Random.nextInt(height))
        sendMessage("apple eaten", JsObject(Seq("eater" -> JsString(player))))
      }
      if (mouse != null && mouse.position == snake.head) {
        mouse = null
        snake.feed(mousePower)
        sendMessage("mouse eaten", JsObject(Seq("eater" -> JsString(player))))
      }
    }

    // Spawn mouse
    if (mouse == null && Random.nextInt(mouseSpawnPeriod) == 0)
      mouse = new Mouse(snakes, (width, height), (Random.nextInt(width), Random.nextInt(height)))
  }

  def kill(player: String) = {
    val snake = playerIndex(player)
    if (snake.alive) {
      snake.kill()
      sendMessage("died", JsString(player))
      if (players.count({ case (p, s) => s.alive }) == 1) {
        _gameOver = true
        sendMessage("game over", JsObject(Seq("winner" -> JsString(players.find(_._2.alive).get._1))))
      }
    }
  }

  def playerAction(player: String, action: Orientation) =
    if (duelState == null)
      playerIndex(player).changeOrientation(action)
    else
      duelState.playerAction(player, action)

  def hasMessages = messageQueue.nonEmpty

  def popMessage() = messageQueue.dequeue()

  def gameOver = _gameOver
}
