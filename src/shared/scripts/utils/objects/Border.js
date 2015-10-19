'use strict';

import GameObject               from '../base/GameObject.js';
import {gameObject as Config}   from '../../constants/Config';

class Border extends GameObject{
  constructor(x, y, height, width, color) {
    super();
    this.position = {x, y};
    this.size = {width, height};
    this.color = color;
    this.type = Config.type.border;
    this.movementType = Config.movementType.static;
  }

  onCollision(collision) {
    if (collision.src.type === Config.type.playerSegment &&
      collision.dest.type === Config.type.border) {
      const player = collision.src.getParent();
      player.destroy();
    }
  }  
}

export default Border;
