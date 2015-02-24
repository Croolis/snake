package controllers

import game._
import play.api.mvc._
import play.api.Play.current
import play.api.libs.json._

object Application extends Controller {

  def index = Action { request =>
    Ok(views.html.index("ws:" + request.host + "/test"))
  }

  def ws = WebSocket.acceptWithActor[JsValue, JsValue] { request => out =>
    PlayerConnection.props(out, Player("Player", (0, 0, 0)))
  }
}
