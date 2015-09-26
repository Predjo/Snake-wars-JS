'use strict';

import _                            from 'lodash';
import {player as Config}           from '../../constants/Config';
import {gameObject as GameObject}   from '../../constants/Config';
import {grid as Grid}               from '../../constants/Config';
import {direction as Direction}     from '../../constants/Config';
import {events as Events}           from '../../constants/Config';
import Segment                      from './PlayerSegment';
import BaseObject                   from '../base/BaseObject';
import EventManager                 from '../managers/EventManager';

class Player extends BaseObject{
  constructor(uid, name, color) {
    super();
    this.name = name;
    this.uid = uid;
    this.color = color;    
    this.speed = Config.defaultSpeed;
    this.segments = [];
    this.direction = Direction.right;
    this.lastTick = 0;
    this.initSegments();
    this.canChangeDirection = true;
    this.score = 0;
  }

  initSegments() {
    _.each(_.range(Config.defaultSegmentNum), () => {
      this.addSegment();
    });
  }

  addSegment() {
    let segment = new Segment();
    
    if (_.isEmpty(this.segments)) {
      segment.setPosition(0, 0);
      segment.setHead();
    } else {
      let lastSegment = _.last(this.segments);
      let {x, y} = lastSegment.getPosition();
      segment.setPosition(x, y);
    }
    segment.collisionDisabled = true;
    segment.setSize(Grid.fieldSize - 1, Grid.fieldSize - 1);
    segment.setParent(this);
    segment.setColor(this.color);
    this.segments.push(segment);
  }

  move() {
    var lastSegmentPos = {}; 
    _.each(this.segments, (segment, index) => {
      let {x, y} = segment.getPosition();

      if(index === 0) {
        segment.setPosition(x + this.direction.x * (Grid.fieldSize), y + this.direction.y * (Grid.fieldSize));
      }else {
        segment.setPosition(lastSegmentPos.x, lastSegmentPos.y);
      } 

      lastSegmentPos = {x, y};
      this.canChangeDirection = true;
    });  
  }

  canMove(timestamp) {
    let tickTime = 1000 / this.speed;
    if((this.lastTick + tickTime) < timestamp) {
      this.lastTick = timestamp;
      return true;
    } else {
      return false;
    }
  }

  destroy() {
    EventManager.trigger(Events.playerDestroyed, this.uid);
  }

  onCollision(collision) {
    if(collision.src.parent === this && collision.dest.parent === this) {
      this.setSpeed(0);
      this.destroy();
    } else if (collision.src.parent === this && collision.dest.parent !== this &&
      collision.dest.type === GameObject.type.playerSegment) {
      let player = collision.dest.parent;
      player.score += this.getSegments().length;
      this.setSpeed(0);
      this.destroy();
    }
  }

  setDirection(direction) {
    if (this.canChangeDirection) {
      let {x: nx, y: ny} = direction;
      let {x: ox, y: oy} = this.direction;
      if (nx !== ox && ny !== oy) {
        this.direction = direction;
      }
      this.canChangeDirection = false;
    }
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  getDirection() {
    return this.direction;
  }

  getSpeed() {
    return this.speed;
  }

  getSize() {
    return this.segments.length;
  }

  getSegments() {
    return this.segments;
  }

  update(state) {
    if (state.speed) {
      this.setSpeed(state.speed);
    }
    if (state.color) {
      this.color = state.color;
    }
    if (state.direction) {
      this.setDirection(state.direction);
    }
    if (this.segments) {
      _.each(state.segments, (segment, index) => {
        if (this.segments[index]) {
          this.segments[index].update(segment);
        } else {
          this.addSegment();
        }
      });
    }
  }

  getState() {
    return {
      uid: this.uid,
      speed: this.speed,
      color: this.color,
      direction: this.direction,
      name: this.name,
      segments: _.map(this.segments, (segment) => {
        return segment.getState();
      }),
      score: this.score
    }
  }
}

export default Player;
