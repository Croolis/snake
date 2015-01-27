package controllers

import collection.mutable.ListBuffer

object GameLobby {
  var playerQueue = ListBuffer[PlayerConnection]()

  def newGame(connection: PlayerConnection) = {
    val playersToStart = 2

    connection.onClose = () =>
      playerQueue = playerQueue.filter(_.player != connection.player)

    connection.onReceive = null

    playerQueue += connection

    if (playerQueue.length >= playersToStart) {
      GameServer(playerQueue.toArray)
      playerQueue.clear()
    }
  }
}