package game

import play.api.libs.json._

case class Player(username: String, color: String) {
  def toJson: JsValue = JsObject(Seq(
    "username" -> Json.toJson(username),
    "color" -> Json.toJson(color)
  ))
}