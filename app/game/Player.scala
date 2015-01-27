package game

import play.api.libs.json._

case class Player(username: String, color: String) {
  def serialize() = Json.toJson(Map(
    "username" -> Json.toJson(username),
    "color" -> Json.toJson(color)
  ))
}