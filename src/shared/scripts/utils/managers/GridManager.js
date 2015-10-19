'use strict';

import _                       from 'lodash';
import EventManager            from './EventManager';
import {events as Events}      from '../../constants/Config';
import {grid as Grid}          from '../../constants/Config';
import Border                  from '../objects/Border';

let instance = null;

class GridManager {
  constructor(){
    if (!instance) {
      instance = this;
      this.defineEvents();
      this.setDefaults();
    }   

    return instance; 
  }

  setDefaults() {
    this.borders = [];
  }

  defineEvents() {
    EventManager.on(Events.borderDestroyed, (border) => {
      this.removeBorder(border);
    });

    EventManager.on(Events.borderCreated, (border) => {
      this.addBorder(border);
    });  
  }

  createDefaultBorders() {
    const color = 'white';
    this.addBorder(this.createNewBorder(0,0, Grid.fieldSize, Grid.sizeX * Grid.fieldSize, color));
    this.addBorder(this.createNewBorder(0,0, Grid.sizeY * Grid.fieldSize, Grid.fieldSize, color));
    this.addBorder(this.createNewBorder((Grid.sizeX - 1) * Grid.fieldSize,0, Grid.sizeY * Grid.fieldSize, Grid.fieldSize * 2, color));
    this.addBorder(this.createNewBorder(0,(Grid.sizeY - 1) * Grid.fieldSize, Grid.fieldSize * 2, Grid.sizeX * Grid.fieldSize, color));
  }

  createNewBorder(x, y, width, height, color) {
    return new Border(x, y, width, height, color);
  }

  createCollectible(state) {
    let {x, y, height, width, id} = state;
    let color = 'white';
    let border = new Border(x, y, height, width, color);
    border.id = id;
    this.addBorder(border);
    return border;
  }

  removeBorder(state) {
    _.remove(this.collectibles, (item) => {
      return item.id === state.id;
    });    
  }

  addBorder(border) {
    this.borders.push(border);
    EventManager.trigger(Events.borderAdded, border);
  }

  getBorders() {
    return this.borders;
  }

  getSpecs() {
    return _.map(this.borders, (item) => {
      return item.getSpecs();
    });
  }
}

export default GridManager;