import scala.collection.mutable
import play.api.libs.json._

package game {

/**
 * Describes state fo a snake
 */
class Snake(position: (Int, Int), val fieldSize: (Int, Int), private var _orientation: Orientation) {
  private var _body = mutable.Queue(position, Orientation.step(position, fieldSize, _orientation))
  private var _food = 0

  def body = _body

  def food = _food

  def length = _body.length

  def move() = {
    _body.enqueue(Orientation.step(_body.last, fieldSize, _orientation))
    if (_food == 0) {
      _body.dequeue()
    }
    else {
      _food -= 1
    }
  }

  def orientation = _orientation

  def changeOrientation(newOrientation: Orientation) = {
    _orientation = newOrientation
  }

  def feed(amount: Int) = _food += amount

  def cut(pos: (Int, Int)): Int = {
    val cutsize = _body.indexOf(pos) + 1
    _body = _body.drop(cutsize)
    cutsize
  }

  def head = _body.last

  def serialize() = Json.toJson(body.reverse.map { case (x, y) => Json.toJson(Seq(x, y))})
}

}