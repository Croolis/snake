package game

import play.api.libs.json.{Json, JsValue}

class Mouse(private val snakes: Seq[Snake],
            private val fieldSize: (Int, Int),
            private var pos: (Int, Int)) {

  val ticksPerMove = 1
  private var ticks = 0

  def move(): Unit = {
    ticks = (ticks + 1) % ticksPerMove
    if (ticks != 0) return

    val (width, height) = fieldSize
    val heads = snakes map (_.head) filter (_ !=(-1, -1))
    val bodies = Set() ++ snakes flatMap (_.body)
    val availableMoves = pos +: (Orientation.orientations map
                                 (o => Orientation.step(pos, fieldSize, o)) filterNot
                                 (c => bodies contains c))

    def distance(p1: (Int, Int), p2: (Int, Int)) = {
      val ((x1, y1), (x2, y2)) = (p1, p2)
      math.min(math.abs(y2 - y1), height - math.abs(y2 - y1)) + math.min(math.abs(x2 - x1), width - math.abs(x2 - x1))
    }

    val best = availableMoves maxBy (p => heads map (distance(p, _)) min)

    pos = best
  }

  def x = pos._1

  def y = pos._2

  def position = pos

  def toJson: JsValue = Json.toJson(Seq(x, y))
}
