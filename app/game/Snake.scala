import scala.collection.immutable.Queue
import play.api.libs.json._

package game {

sealed abstract class Orientation

case object Left extends Orientation

case object Right extends Orientation

case object Up extends Orientation

case object Down extends Orientation

object Orientation {
  def step(pos: (Int, Int), fieldSize: (Int, Int), direction: Orientation) = pos match {
    case (x, y) => {
      var (x1, y1) = direction match {
        case Left => (x - 1, y)
        case Right => (x + 1, y)
        case Up => (x, y - 1)
        case Down => (x, y + 1)
      }
      val (width, height) = fieldSize
      if (x1 == width)
        x1 = 0
      if (x1 == -1)
        x1 = width
      if (y1 == height)
        y1 = 0
      if (y1 == -1)
        y1 = height
      (x1, y1)
    }
  }

  def orientations = List(Left, Right, Up, Down)
  def fromString = Map("Left" -> Left, "Right" -> Right, "Up" -> Up, "Down" -> Down)
}

/**
 * Describes state fo a snake
 */
class Snake(position: (Int, Int), val fieldSize: (Int, Int), private var _orientation: Orientation) {
  private var _body = Queue(position)
  private var _food = 0

  def body = _body

  def food = _food

  def length = _body.length

  def move() = {
    _body = _body enqueue Orientation.step(_body.last, fieldSize, _orientation)
    if (_food == 0) {
      _body = _body.dequeue._2
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

  def serialize() = Json.toJson(body map { case (x, y) => Json.toJson(Seq(x, y))})
}

}