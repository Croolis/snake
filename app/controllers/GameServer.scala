import play.api.libs.iteratee.Concurrent._
import play.api.libs.json.JsValue

package controllers {

import game.GameState

class GameServer(val players: Array[Channel[JsValue]]) extends Runnable {
  val gameState = new GameState(2, 40, 40)

  def changeDirection(player: Int, direction: JsValue) = {
    gameState.changeDirection(player, game.Orientation.fromString(direction.toString()))
  }

  def run() {
    while (true) {
      gameState.update()
      players.zipWithIndex foreach { case (x, y) => x.push(gameState.serialize())}
      Thread.sleep(500)
    }
  }
}

object GameServer {
  var playerQueue: List[(Channel[JsValue], (GameServer, Int) => Unit)] = Nil

  def newGame(chan: Channel[JsValue], onGameStart: (GameServer, Int) => Unit) = {
    playerQueue = (chan, onGameStart) :: playerQueue
    if (playerQueue.length >= 2) {
      val (channels, callbacks) = playerQueue.unzip
      val server = new GameServer(channels.toArray)
      new Thread(server).start()
      callbacks.zipWithIndex foreach { case (f, i) => f(server, i)}
    }
  }
}



}