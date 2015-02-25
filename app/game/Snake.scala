package game

import scala.collection.mutable
import play.api.libs.json._

class Snake(position: (Int, Int),
            private val fieldSize: (Int, Int),
            private var _orientation: Orientation) {
  private var _body = mutable.Queue(position, Orientation.step(position, fieldSize, _orientation))
  private var _food = 0
  private var prevOrientation = orientation

  // Returns body of the snake from its head.
  def body = _body.reverseIterator.toList

  def head =
    if (_body.length > 0)
      _body.last
    else
      (-1, -1)

  def food = _food

  def length = _body.length

  def orientation = _orientation

  def alive = _body.length > 0

  def indexOfSegment(segment: (Int, Int), from: Int = 0) = (body drop from indexOf segment) + from

  def move() = {
    if (length > 0) {
      _body.enqueue(Orientation.step(_body.last, fieldSize, _orientation))
      if (_food == 0) {
        _body.dequeue()
      }
      else {
        _food -= 1
      }
    }
    prevOrientation = orientation
  }

  def kill() =
    _body.clear()

  def changeOrientation(newOrientation: Orientation) =
    if (prevOrientation != Orientation.opposite(newOrientation))
      _orientation = newOrientation

  def feed(amount: Int) =
    _food += amount

  def cut(pos: (Int, Int)): Int = {
    val cutSize = _body.indexOf(pos) + 1
    _body = _body.drop(cutSize)
    cutSize
  }

  def toJson: JsValue = JsArray(body map { case (x, y) => Json.toJson(Seq(x, y)) })
}
