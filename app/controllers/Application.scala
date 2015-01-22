import play.api._
import play.api.libs.iteratee.{Iteratee, Concurrent}
import play.api.mvc._
import scala.concurrent.ExecutionContext.Implicits.global

package controllers {

import play.api.libs.json.JsValue

object Application extends Controller {

  def index = Action {
    Ok(views.html.index("Hello, world!"))
  }

  def ws = WebSocket.using[JsValue] { request =>
    var server: GameServer = null
    var player: Int = -1

    val (out, chan) = Concurrent.broadcast[JsValue]
    val in = Iteratee.foreach[JsValue](x => {
      if (server != null) {
        server.changeDirection(player, x)
      }
    })

    GameServer.newGame(chan, { case (srv, plr) => {
      server = srv
      player = plr
    }
    })

    (in, out)
  }

}

}