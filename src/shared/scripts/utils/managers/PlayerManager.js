'use strict';

import _                          from 'lodash';
import Player                     from '../objects/Player';
import KeyBinds                   from '../KeyBinds';
import {controls as Control}      from '../../constants/Config';
import {direction as Direction}   from '../../constants/Config';
import {events as Events}         from '../../constants/Config';
import EventManager               from './EventManager';
import ServerManager              from './ServerManager';

let instance = null;

class PlayerManager {
  constructor() {
    if (!instance) {
      instance = this;
      this.defineEvents();
      this.setDefaults();
    }

    return instance;
  }

  setDefaults() {
    this.players = [];
    this.playerCount = 0; 
    this.serverManager = new ServerManager();
    this.currentPlayer = null;     
  }

  defineEvents() {
    EventManager.on(Events.playerDestroyed, (uid) => {
      this.removePlayer(uid);
    });

    EventManager.on(Events.playerCreated, (player) => {
      this.addPlayer(player);
    });

    EventManager.on(Events.resetAll, () => {
      this.setDefaults();
    });    
  }

  addPlayer(player) {
    this.players.push(player);
    EventManager.trigger(Events.playerAdded, player);
  }

  removePlayer(uid) {
    let player = this.findPlayerByUid(uid);
    if (player) {
      _.remove(this.players, (item) => {
        return item.uid === uid;
      });
      EventManager.trigger(Events.playerRemoved, player);
    } else {
      console.error('Undefined player');
    }
  }

  updateAllPlayerStates(players) {
    _.each(players, (item) => {
      this.updatePlayerState(item.uid, item);
    });    
  }

  updatePlayerState(uid, state) {
    const player = this.findPlayerByUid(uid);
    if (player) {
      player.update(state);
    }
  }

  findPlayerByUid(uid) {
    return _.find(this.players, player => {
      return player.uid === uid;
    });
  }

  createNewPlayer(uid, name, color) {
    return new Player(uid, name, color);
  }  

  createCurrentPlayer(uid, state) {
    const player = this.createPlayer(uid, state);
    this.setCurrentPlayer(player);    
    this.defineControls(player);
    return player;
  }

  createPlayer(uid, state) {
    const player = this.createNewPlayer(uid, state.name, state.color);
    player.update(state);
    this.addPlayer(player);
    return player;   
  }

  setCurrentPlayer(player) {
    this.currentPlayer = player;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  defineControls(player) {
    this.keyBinds = new KeyBinds();
    this.keyBinds.on(Control.moveUp, () => { this._movePlayer(player, Direction.up); });
    this.keyBinds.on(Control.moveLeft, () => { this._movePlayer(player, Direction.left); });
    this.keyBinds.on(Control.moveRight, () => { this._movePlayer(player, Direction.right); });
    this.keyBinds.on(Control.moveDown, () => { this._movePlayer(player, Direction.down); });
    this.keyBinds.on(84, () => {player.addSegment()});
  }

  _movePlayer(player, direction) {
    const socket = this.serverManager.getSocket();
    player.setDirection(direction);
    socket.emit('playerMove', {uid: player.uid, direction: direction});
  }

  getPlayers() {
    return this.players;
  }

  getState () {
    return _.map(this.players, player => {return player.getState()});
  }

  updatePlayers(timestamp) {
    _.each(this.players, player => {
      if (player.canMove(timestamp)) {
        player.move(timestamp);
      }
    });
  }

}

export default PlayerManager;