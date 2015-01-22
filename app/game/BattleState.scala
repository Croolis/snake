import scala.util.Random
import play.api.libs.json._

package game {

class BattleState(val s1: Snake, val s2: Snake) {
  private final val tick = 5

  private var _pow1 = 100 * s1.length / (s1.length + s2.length)
  private var _pow2 = 100 * s2.length / (s1.length + s2.length)

  private var _orient1 = Orientation.orientations(Random.nextInt(4))
  private var _orient2 = Orientation.orientations(Random.nextInt(4))

  def pow1 = _pow1

  def pow2 = _pow2

  def orient1 = _orient1

  def orient2 = _orient2

  def win = pow1 >= 100 || pow2 >= 100

  def update(): Unit = {
    if (win)
      return
    if (s1.orientation == _orient1)
      _pow1 += tick
    if (s2.orientation == _orient2)
      _pow2 += tick
    _orient1 = Orientation.orientations(Random.nextInt(4))
    _orient2 = Orientation.orientations(Random.nextInt(4))
  }

  def serialize(): JsValue = Json.toJson(Map(
    "win" -> Json.toJson(win),
    "pow1" -> Json.toJson(pow1),
    "pow2" -> Json.toJson(pow2),
    "orient1" -> Json.toJson(orient1.toString),
    "orient2" -> Json.toJson(orient2.toString)
  ))
}

}
