package game

import play.api.libs.json.{JsString, Json, JsValue}

case class Message(msg: String, data: JsValue = null) {
  def toJson = {
    var mp = Map[String, JsValue]("message" -> JsString(msg))
    if (data != null)
      mp += ("data" -> data)
    Json.toJson(mp)
  }
}
