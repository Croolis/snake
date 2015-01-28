package game

import scala.util.Random
import play.api.libs.json._

class DuelState(val player1: String, val snake1: Snake, val player2: String, val snake2: Snake) {
  private final val inc = 5

  private var _pow1 = 100 * snake1.length / (snake1.length + snake2.length)
  private var _pow2 = 100 * snake2.length / (snake1.length + snake2.length)

  private var _orient1 = Orientation.orientations(Random.nextInt(4))
  private var _orient2 = Orientation.orientations(Random.nextInt(4))

  def playerAction(player: String, action: Orientation) =
    if (player == player1) {
      if (action == orient1)
        _pow1 += inc
      else
        _pow1 -= inc
      _orient1 = Orientation.orientations(Random.nextInt(4))
    }
    else if (player == player2) {
      if (action == orient2)
        _pow2 += inc
      else
        _pow2 -= inc
      _orient2 = Orientation.orientations(Random.nextInt(4))
    }

  def pow1 = _pow1

  def pow2 = _pow2

  def orient1 = _orient1

  def orient2 = _orient2

  def win = pow1 >= 100 || pow2 >= 100

  def winner = if (pow1 > pow2) player1 else player2

  def loser = if (pow2 >= pow1) player2 else player1

  def update(): Message = {
    _pow1 += inc
    _pow2 += inc
    if (win)
      Message("duel ended", JsObject(Seq("winner" -> JsString(winner), "loser" -> JsString(loser))))
    else
      Message("duel", toJson)
  }


  def toJson: JsValue = JsObject(Seq(
    "player1" -> JsString(player1),
    "player2" -> JsString(player2),
    "pow1" -> JsNumber(pow1),
    "pow2" -> JsNumber(pow2),
    "orient1" -> JsString(orient1.toString),
    "orient2" -> JsString(orient2.toString)
  ))
}
