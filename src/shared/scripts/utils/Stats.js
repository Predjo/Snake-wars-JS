'use strict';

import {events as Events} from '../constants/Config';
import EventManager       from './managers/EventManager';


class Stats {
  constructor() {
    this.startTime = null;
    this.currentTimestamp = null;
    this.frameCount = 0;
    this.fps = 0;
    this.updateCallBack = null;
    this.deltaTime = 0;
    this.player = null;

    this.defineEvents();
  }

  defineEvents() {
    EventManager.on(Events.currentPlayerCreated, (player) => {
      //this.trackPlayer(player);
    });
  }

  logFrame(timeStamp){
    this.frameCount++;
    this.deltaTime = timeStamp - this.currentTimestamp;
    this.currentTimestamp = timeStamp;
    if (!this.startTime) {
      this.startTime = Date.now();
    }
    this.fps = Math.round(100000 / (this.currentTimestamp / this.frameCount)) / 100;
    if(this.updateCallback) {
      this.updateCallback(this);
    }
  }

  trackPlayer(player) {
    this.player = player
  }

  getPlayer() {
    return this.player;
  }

  getFPS(){
    return this.fps;
  }

  getDeltaTime() {
    return this.deltaTime / 1000 * 60;
  }

  getTimeStamp(){
    return this.currentTimestamp;
  }

  getElapsedTime() {
    return Math.round((Date.now() - this.startTime) / 1000);
  }

  onUpdate(callback) {
    this.updateCallback = callback;
  }
}

export default Stats;