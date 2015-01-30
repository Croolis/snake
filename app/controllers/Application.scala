package controllers

import game._
import play.api.mvc._
import play.api.Play.current
import play.api.libs.json._

object Application extends Controller {

  def index = Action {
    Ok(views.html.index("Hello, world!"))
  }

  def ws = WebSocket.acceptWithActor[JsValue, JsValue] { request => out =>
    PlayerConnection.props(out, Player("Player", (0, 0, 0)))
  }

}
