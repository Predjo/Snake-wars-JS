'use strict';

//import _          from 'lodash';
import GameObject                     from '../base/GameObject.js';
import {gameObject as ObjectConfig}   from '../../constants/Config';
import {collectible as Config}        from '../../constants/Config';
import {events as Events}             from '../../constants/Config';

import EventManager                   from '../managers/EventManager';

class Collectible extends GameObject{
  constructor(type, x, y, r, color) {
    super();
    this.type            = ObjectConfig.type.collectible;
    this.collectibleType = type;
    this.movementType    = ObjectConfig.movementType.static;
    this.position        = {x, y};
    this.radius          = r;
    this.color           = color;
  }

  onCollision(collision) {
    if (collision.src.type === ObjectConfig.type.playerSegment && collision.dest.type === ObjectConfig.type.collectible) {
      let player = collision.src.getParent();
      this.applyPlayerEffect(player);
      EventManager.trigger(Events.collectibleDestroyed, this);
    }
  }

  applyPlayerEffect(player) {
    switch(this.collectibleType) {
    case Config.type.segmentPlus.name:
      player.addSegment();
      break;
    case Config.type.speedPlus.name:
      player.setSpeed(player.getSpeed() + 1);
      break;
    case Config.type.speedMinus.name:
      player.setSpeed(player.getSpeed() - 1);
      break;      
    default:
      console.error('Undefined collectible type');
    }
  }

  getSpecs () {
    return {
      x      : this.position.x,
      y      : this.position.y,
      color  : this.color,
      radius : this.radius,
      height : this.radius * 2,
      width  : this.radius * 2,
      type   : this.collectibleType,
      id     : this.id
    }
  }

  getState(){
    return {
      x     : this.position.x,
      y     : this.position.y,
      type  : this.collectibleType,
      id    : this.id
    }    
  }

  getPosition() {
    return this.position;
  }
}

export default Collectible;
