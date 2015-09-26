'use strict';

import ee from 'event-emitter';

let emitter = ee();

class EventManager {

  static on() {
    emitter.on(...this._args(arguments));
  }

  static off() {
    emitter.off(...this._args(arguments));
  }

  static trigger() {
    emitter.emit(...this._args(arguments));
  }

  static _args(args){
    return Array.prototype.slice.call(args);
  }
}

export default EventManager;