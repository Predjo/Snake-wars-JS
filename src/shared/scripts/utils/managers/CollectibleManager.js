'use strict';

import _                       from 'lodash';
import EventManager            from './EventManager';
import {events as Events}      from '../../constants/Config';
import {grid as Grid}          from '../../constants/Config';
import {collectible as Config} from '../../constants/Config';
import Collectible             from '../objects/Collectible';

let instance = null;

class CollectibleManager {
  constructor(){
    if (!instance) {
      instance = this;
      this.defineEvents();
      this.setDefaults();
    }   
    
    return instance; 
  }

  setDefaults() {
    this.collectibles = [];
  }

  defineEvents() {
    EventManager.on(Events.collectibleDestroyed, (collectible) => {
      this.removeCollectible(collectible);
    });

    EventManager.on(Events.collectibleCreated, (collectible) => {
      this.addCollectible(collectible);
    });

    EventManager.on(Events.updateCollectables, (data) => {
      this.collectibles = [];
      _.each(data, (item) => {
        this.addCollectible(new Collectible(item.type, item.x, item.y, Grid.fieldSize / 2, item.color));
      });
    });

    EventManager.on(Events.resetAll, () => {
      this.setDefaults();
    });    
  }

  createNewCollectible() {
    const num = _.random(1, true);
    let type = null;
    let lastChance = 0;
    _.each(Config.type, (item) => {
      if(num > lastChance && num <= lastChance + item.chance) {
        type = item;
      }
      lastChance += item.chance;
    });
    const x = _.random(Grid.sizeX) * Grid.fieldSize;
    const y = _.random(Grid.sizeY) * Grid.fieldSize;
    const r = Grid.fieldSize / 2;
    const color = type.color;
    return new Collectible(type.name, x, y, r, color);
  }

  createCollectible(state) {
    const r = Grid.fieldSize / 2;
    const {type, x, y, id} = state;
    const color = Config.type[type].color;
    const collectible = new Collectible(type, x, y, r, color);
    collectible.id = id;
    this.addCollectible(collectible);
    return collectible;
  }

  removeCollectible(state) {
    _.remove(this.collectibles, (item) => {
      return item.id === state.id;
    });    
  }

  addCollectible(collectible) {
    this.collectibles.push(collectible);
    EventManager.trigger(Events.collectibleAdded, collectible);
  }

  updateCollectibles() {
    if (this.collectibles.length < Config.limit) {
      const collectible = this.createNewCollectible();
      this.addCollectible(collectible);
    }
  }

  getCollectibles() {
    return this.collectibles;
  }

  getSpecs() {
    return _.map(this.collectibles, (item) => {
      return item.getSpecs();
    });
  }
}

export default CollectibleManager;