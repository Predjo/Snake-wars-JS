'use strict';

import BaseObject               from './BaseObject';
import {gameObject as Config}   from '../../constants/Config';

class GameObject extends BaseObject{
  constructor() {
    super();
    this.position = {
      x: 0,
      y: 0
    };

    this.size = {
      width: 0,
      height: 0,
    };

    this.color = 'white';
    this.parent = null;
    this.type = Config.type.generic;
    this.movementType = Config.movementType.static;
    this.collisionDisabled = false;
  }

  getSpecs () {
    return {
      width  : this.size.width,
      height : this.size.height,
      x      : this.position.x,
      y      : this.position.y,
      color  : this.color
    }
  }

  getPosition() {
    return this.position;
  }  

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  getSize() {
    return this.size;
  } 

  setSize(width, height) {
    this.size.width = width;
    this.size.height = height;
  }    

  getType() {
    return this.type;
  }

  getMovementType() {
    return this.movementType;
  }

  setParent (parent) {
    this.parent = parent;
  }

  getParent() {
    return this.parent;
  }

  setColor(color) {
    this.color = color;
  }

  getColor() {
    return this.color;
  }   
}

export default GameObject;