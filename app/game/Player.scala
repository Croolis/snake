package game

import play.api.libs.json._

case class Player(username: String, color: (Int, Int, Int)) {
  def toJson: JsValue = JsObject(Seq(
    "username" -> Json.toJson(username),
    "color" -> Json.toJson(Seq(color._1, color._2, color._3))
  ))
}