'use strict';

import PlayerManager       from './PlayerManager';
import CollectibleManager  from './CollectibleManager';

let instance = null;
let socket = null;

class ServerManager {

  connect() {
    if (!instance) {
      instance = this;
      if (!socket) {
        socket = window.io.connect();
      }
      this.playerManager = new PlayerManager();
      this.collectibleManager = new CollectibleManager();
      this.defineEvents();
    }
    return instance;
  }

  getSocket() {
    return socket;
  }

  defineEvents() {
    if (socket) {
      socket.on('connect', () => {
        socket.emit('join', 'Hello from client');
      });

      socket.on('currentPlayerCreate', (data) => {
        let {uid} = data;
        console.log('Current Player Created', data);
        this.playerManager.createCurrentPlayer(uid, data);
      });

      socket.on('playerCreate', (data) => {
        let {uid} = data;
        console.log('Player Created', data);
        this.playerManager.createPlayer(uid, data);
      });

      socket.on('playerDestroy', (data) => {
        let {uid} = data;
        console.log('Player Destroyed', data);
        this.playerManager.removePlayer(uid, data);
      });          

      socket.on('updatePlayers', (data) => {
        console.log('updatePlayers', data);
        this.playerManager.updateAllPlayerStates(data);
      });

      socket.on('collectibleCreate', (data) => {
        console.log('Collectible created', data);
        this.collectibleManager.createCollectible(data);
      });

      socket.on('collectibleDestroy', (data) => {
        console.log('Collectible destroyed', data);
        this.collectibleManager.removeCollectible(data);
      });           

    } else {
      throw 'Socket is not defined';
    }
  }
}

export default ServerManager;