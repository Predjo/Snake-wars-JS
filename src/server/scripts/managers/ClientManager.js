'use strict';

import _                  from 'lodash';
import EventManager       from '../../../shared/scripts/utils/managers/EventManager';
import PlayerManager      from '../../../shared/scripts/utils/managers/PlayerManager';
import CollectibleManager from '../../../shared/scripts/utils/managers/CollectibleManager';
import Client             from '../entities/Client';
import {events as Events} from '../../../shared/scripts/constants/Config';
import uuid               from 'node-uuid';
import randomcolor        from 'randomcolor';

class ClientManager {
  constructor(socket) {
    this.socket = socket;
    this.playerManager = new PlayerManager();
    this.collectibleManager = new CollectibleManager();
    this.clients = [];
    this.clientNum = 0;
    this.defineEvents();
    this.defineNetworkEvents();
  }

  addClient (client) {
    if (!_.includes(this.clients, client)) {
      this.clients.push(client);
      EventManager.trigger(Events.playerCreated, client.getPlayer());
    }
  }

  removeClient (client) {
    _.remove(this.clients, (item) => {
      if(client === item) {
        EventManager.trigger(Events.playerDestroyed, client.getPlayer().uid);
        return true;
      }
    });
  }

  findClientBySocket(socket) {
    return _.find(this.clients, (item) => {
      return item.getSocket().id === socket.id;
    });
  }

  updatePlayers() {
    this.socket.emit('updatePlayers', this.playerManager.getState());
  }

  updateClients() {
    this.updatePlayers();
  } 

  defineNetworkEvents() {
    this.socket.on('connection', (socket) => {  
      console.log('Client connected...');

      socket.on('join', () => {
        //Report on existing players
        _.each(this.playerManager.getPlayers(), (existingPlayer) => {
          socket.emit('playerCreate', existingPlayer.getState());
        });

        //Report on existing Collectibles
        console.log(this.collectibleManager.getCollectibles())
        _.each(this.collectibleManager.getCollectibles(), (existingCollectible) => {
          socket.emit('collectibleCreate', existingCollectible.getState());
        });        

        //Create current Player
        let uid    = uuid();
        let color  = randomcolor();
        let name   = 'Player' + this.clientNum;
        let player = this.playerManager.createNewPlayer(uid, name, color);
        let client = new Client(socket, player);
        this.addClient(client);
        socket.emit('currentPlayerCreate', {uid, name, color});
        socket.broadcast.emit('playerCreate', {uid, name, color});
        this.clientNum ++;

        console.log(`Player joined, uid: ${uid} name: ${name} color: ${color}`);
      });

      socket.on('disconnect', () => {
        let client = this.findClientBySocket(socket);
        if (client) {
          let player = client.getPlayer();
          let {uid, name, color} = player;
          console.log(`Player left, uid: ${uid} name: ${name} color: ${color}`);
          this.socket.emit('playerDestroy', player.getState());
          this.removeClient(client);
        } else {
          console.error('Client undefined');
        }
      });

      socket.on('playerMove', (data) => {
        this.playerManager.updatePlayerState(data.uid, data);
      });

      socket.on('error', (err) => {
        console.error(err);
      });      
    });    
  }

  defineEvents() {
    EventManager.on(Events.collectibleDestroyed, (collectible) => {
      console.log('Destroy collectible', collectible.getState());
      this.socket.emit('collectibleDestroy', collectible.getState());
    });

    EventManager.on(Events.collectibleAdded, (collectible) => {
      console.log('Create collectible', collectible.getState())
      this.socket.emit('collectibleCreate', collectible.getState());
    });

    EventManager.on(Events.playerRemoved, (player) => {
      console.log('Destroy player', player.getState())
      this.socket.emit('playerDestroy', player.getState());
    });    
  }
}

export default ClientManager;