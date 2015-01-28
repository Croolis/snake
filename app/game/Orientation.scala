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

  val opposite = Map[Orientation, Orientation](Left -> Right, Right -> Left, Up -> Down, Down -> Up)

  def fromString = Map("Left" -> Left, "Right" -> Right, "Up" -> Up, "Down" -> Down)
}

}
