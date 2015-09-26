'use strict';

import _                                  from 'lodash';
import Collision                          from './Collision';
import {gameObject as GameObjectConfig}   from '../../constants/Config';

class CollisionDetector {
  constructor() {}

  static checkObjectCollision(firstObject, secondObject) {
    let {x: x1, y: y1} = firstObject.getSpecs();
    let {x: x2, y: y2} = secondObject.getSpecs();

    if(firstObject.collisionDisabled || secondObject.collisionDisabled) {
      return false;
    }

    if(x1 === x2 && y1 === y2) {
      return true;
    } else {
      return false;
    }
  }

  static dispachCollision(firstObject, secondObject) {
    let collision = new Collision(firstObject, secondObject);
    if(_.isFunction(firstObject.onCollision)) {
      firstObject.onCollision(collision);
    }
    if(_.isFunction(secondObject.onCollision)) {
      secondObject.onCollision(collision);
    } 
  }

  static checkWorldCollision() {
    return false;
  }

  static detectCollisions(gameObjects) {
    let length = gameObjects.length;
    for (let i = 0; i < length; i++) {
      if(gameObjects[i].getMovementType() === GameObjectConfig.movementType.dynamic){
        for (let j = 0; j < length; j++) {
          let firstObject = gameObjects[i];
          let secondObject = gameObjects[j];
          if(firstObject !== secondObject && CollisionDetector.checkObjectCollision(firstObject, secondObject)) {
            CollisionDetector.dispachCollision(firstObject, secondObject);
          }
        }
      }
    }
  }  
}

export default CollisionDetector;