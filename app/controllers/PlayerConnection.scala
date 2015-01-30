package controllers

import akka.actor._
import game._
import play.api.libs.json.JsValue

object PlayerConnection {
  def props(out: ActorRef, player: Player) = Props(new PlayerConnection(out, player))
}

class PlayerConnection(private val out: ActorRef, private var _player: Player) extends Actor {
  GameLobby.newGame(this)

  var onReceive: (JsValue => Unit) = _
  var onClose: (() => Unit) = _

  def receive = {
    case msg: JsValue => {
      if (onReceive != null)
        onReceive(msg)
    }
  }

  def close() =
    self ! PoisonPill

  override def postStop() =
    if (onClose != null)
      onClose()

  def rename(name: String) =
    _player = Player(name, _player.color)

  def player = _player

  def send(msg: JsValue) = out ! msg
}