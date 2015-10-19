'use strict';

import _                        from 'lodash';
import CollisionDetector        from '../collision/CollisionDetector';
import EventManager             from './EventManager';
import {events as Events}       from '../../constants/Config';

let instance;

class ObjectManager {
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
    this.collectibles = [];
    this.bullets = [];
    this.borders = [];  
  }

  defineEvents() {
    EventManager.on(Events.playerAdded, (player) => {
      this.registerPlayer(player);
    });

    EventManager.on(Events.playerRemoved, (player) => {
      this.unRegisterPlayer(player);
    });

    EventManager.on(Events.collectibleAdded, (collectible) => {
      this.registerCollectable(collectible);
    });

    EventManager.on(Events.collectibleDestroyed, (collectible) => {
      this.unRegisterCollectable(collectible);
    });

    EventManager.on(Events.borderAdded, (border) => {
      this.registerBorder(border);
    });

    EventManager.on(Events.borderRemoved, (border) => {
      this.unRegisterBorder(border);
    });    

    EventManager.on(Events.resetAll, () => {
      this.setDefaults();
    });       
  }

  registerBorder(border) {
    this.borders.push(border);
  }

  unRegisterBorder(border) {
    _.remove(this.borders, (item) => {
      return item === border;
    });
  }

  registerCollectable (collectable) {
    this.collectibles.push(collectable);
  }

  unRegisterCollectable(collectable) {
    _.remove(this.collectibles, (item) => {
      return item === collectable;
    });
  }  

  registerBullet (bullet) {
    this.bullet.push(bullet);
  }

  registerPlayer(player) {
    this.players.push(player);
  }

  unRegisterPlayer(player) {
    _.remove(this.players, (item) => {
      return item === player;
    });
  }

  getAllGameObjects () {
    return _.flattenDeep([_.pluck(this.players, 'segments'), this.borders, this.collectibles, this.bullets]);
  }

  detectCollisions() {
    let gameObjects = this.getAllGameObjects();
    CollisionDetector.detectCollisions(gameObjects);
  }
}

export default ObjectManager;