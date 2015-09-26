'use strict';

import _          from 'lodash';
import GameObject from '../base/GameObject.js';
import {gameObject as Config}   from '../../constants/Config';

class PlayerSegment extends GameObject{
  constructor() {
    super();
    this.type = Config.type.playerSegment;
    this.movementType = Config.movementType.static;
    this.isHead = false;
    this.parent = null;
    this.collisionDisabled = true;
  }

  onCollision(collision) {
    if(this.parent && _.isFunction(this.parent.onCollision)) {
      this.parent.onCollision(collision);
    }
  }  

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
    this.collisionDisabled = false;
  }

  setSize(width, height) {
    this.size.width = width;
    this.size.height = height;
  }

  setParent(parent) {
    this.parent = parent;
  }

  getState(){
    return {
      x  : this.position.x,
      y  : this.position.y,
      id : this.id
    }
  }

  update(state) {
    this.setPosition(state.x, state.y);
  }

  setHead() {
    this.movementType = Config.movementType.dynamic;
    this.isHead = true;
  }
}

export default PlayerSegment;
