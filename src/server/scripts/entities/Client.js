'use strict';

class Client {
  constructor(socket, player) {
    this.player = player;
    this.socket = socket;
  }

  getPlayer() {
    return this.player;
  }

  getSocket() {
    return this.socket;
  }

  getUID() {
    return this.player.uid;
  }

  getName() {
    return this.player.name;
  }

  getColor() {
    return this.player.color;
  }
}

export default Client;