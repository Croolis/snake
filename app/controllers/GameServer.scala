package controllers

import game._
import collection.mutable.ListBuffer
import collection.mutable
import play.api.libs.json._

class GameServer(private val players: Array[PlayerConnection]) {
  private var _alive = true
  private val gameState = new GameState(players map (_.player))

  players foreach (p => {
    p.onReceive = msg => receive(p.player, msg)
    p.onClose = () => playerLeave(p.player)
  })

  def alive = _alive

  private def playerLeave(player: Player) = {
    gameState.kill(players.indexWhere(_.player == player))
    //TODO: Send message to other players.
  }

  private def receive(player: Player, msg: JsValue) = {
    //TODO: Make message parsing adequate.
    if (gameState.players.exists(_ == player))
      gameState.changeDirection(players.indexWhere(_.player == player), Orientation.fromString(msg.toString().tail.init))
  }

  private def sendBroadband(msg: JsValue) = {
    players foreach (p => p.send(msg))
  }

  private def tick() = {
    gameState.update()
    sendBroadband(gameState.serialize())
    if (gameState.winner != -1)
      //TODO: Send GAMEOVER message to players.
      stop()
  }

  def stop() = {
    _alive = false
  }
}

object GameServer {
  class Ticker(val timing: Int) extends Runnable {
    private var servers = mutable.MutableList[GameServer]()
    private var _alive = true
    val thread = new Thread(this)
    thread.start()

    def run() =
      while (_alive) {
        servers = servers.filter(s => {
          s.tick()
          s.alive
        })
        Thread.sleep(timing)
      }

    def kill() =
      _alive = false

    def add(server: GameServer) =
      servers += server

    def alive = _alive

    def size = servers.length
  }

  final val timing = 150
  final var maxServersPerTicker = 4

  private var tickers = ListBuffer(new Ticker(timing))

  def apply(players: Array[PlayerConnection]) = {
    val server = new GameServer(players)
    tickers = tickers.filter(_.alive)
    val minimumLoad = tickers.minBy(_.size)
    if (minimumLoad.size < maxServersPerTicker)
      minimumLoad.add(server)
    else {
      tickers += new Ticker(timing)
      tickers.last.add(server)
    }
    server
  }
}