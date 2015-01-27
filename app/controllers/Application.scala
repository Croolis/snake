package controllers

import game._
import play.api.mvc._
import play.api.Play.current
import play.api.libs.json._

object Namer {
  var i = 0
  val names = Array("Player1", "Player2")

  def apply() = {
    i += 1
    names(i % 2)
  }
}

object Application extends Controller {

  def index = Action {
    Ok(views.html.index("Hello, world!"))
  }

  def ws = WebSocket.acceptWithActor[JsValue, JsValue] { request => out =>
    PlayerConnection.props(out, Player(Namer(), "black"))
  }

}