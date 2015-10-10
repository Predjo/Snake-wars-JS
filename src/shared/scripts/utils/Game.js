'use strict';

import CanvasManger               from './managers/CanvasManager';
import Stats                      from './Stats';
import KeyBinds                   from './KeyBinds';
import {controls as Control}      from '../constants/Config';
import {events as Events}         from '../constants/Config';
import ObjectManager              from './managers/ObjectManager';
import PlayerManager              from './managers/PlayerManager';
import EventManager               from './managers/EventManager';
import CollectibleManager         from './managers/CollectibleManager';
import ServerManager              from './managers/ServerManager';

class Game {
  constructor() {
    this.state = {
      ctx : null,
      gameLoop: null,
      running: false
    }
    this.player = null;
  }

  init(ctx) {
    this.state.ctx = ctx;
    this.stats = new Stats();
    this.canvasManger = new CanvasManger(ctx);
    this.objectManager = new ObjectManager();
    this.playerManager = new PlayerManager();
    this.collectibleManager = new CollectibleManager();
    this.serverManager = new ServerManager();
    this.serverManager.connect();
    this.defineControls();
    this.defineEvents();
  }

  defineEvents() {
    EventManager.on(Events.playerDestroyed, (/*args*/) => {
      this.pause();
    });
  }

  defineControls() {
    this.keyBinds = new KeyBinds();
    this.keyBinds.on(Control.pause, () => {if(this.state.running) {this.pause();} else {this.start();}});
  }

  start() {
    this.state.running = true;
    window.requestAnimationFrame(this.loop);
  }

  pause() {
    this.state.running = false;
  }

  loop = (timestamp) => {

    this.update(timestamp);
    this.render();

    if (this.state.running) {
      window.requestAnimationFrame(this.loop);
    }
  }

  update(timestamp) {
    this.stats.logFrame(timestamp);
    const currentPlayer = this.playerManager.getCurrentPlayer();
    this.canvasManger.updatePlayerWindow(currentPlayer && currentPlayer.getHeadSpecs());
    //this.playerManager.updatePlayers(timestamp);
    //this.collectibleManager.updateCollectibles(timestamp);
    //this.objectManager.detectCollisions();
  }

  render() {
    this.canvasManger.paintBackground('black', 'white');
    this.canvasManger.paintPlayers(this.playerManager.getPlayers());
    this.canvasManger.paintCollectibles(this.collectibleManager.getCollectibles());
  }

  getStats() {
    return this.stats;
  }
}

export default Game;