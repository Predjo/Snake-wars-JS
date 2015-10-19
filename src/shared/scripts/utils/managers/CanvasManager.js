'use strict';

import _ from 'lodash';
import {grid as Grid} from '../../constants/Config';

class CanvasManager {

  constructor(ctx) {
    this.ctx = ctx;
    this.playerWindow = {
      x:0,
      y:0
    };
    this.tresholdSize = 175;
  }

  isVisible(x, y, width, height) {
    if (x > this.playerWindow.x + window.innerWidth || x + width < this.playerWindow.x ||
      y >  this.playerWindow.y + window.innerHeight || y + height < this.playerWindow.y) {
      return false;
    } else {
      return true;
    }
  }

  updatePlayerWindow(specs) {
    if (specs) {
      let {x, y, width, height} = specs;
      width++;
      height++;
      const tresholdLeft = this.playerWindow.x + this.tresholdSize;
      const tresholdRight = this.playerWindow.x + window.innerWidth - this.tresholdSize;
      const tresholdUp = this.playerWindow.y + this.tresholdSize;
      const tresholdDown = this.playerWindow.y + window.innerHeight - this.tresholdSize;

      if (x + width > tresholdRight && tresholdRight < Grid.fieldSize * Grid.sizeX - this.tresholdSize) {
        this.playerWindow.x = Math.min(width + this.playerWindow.x, Grid.fieldSize * Grid.sizeX);
      } 

      if (x < tresholdLeft) {
        this.playerWindow.x = Math.max(this.playerWindow.x - width, 0);
      }

      if (y + height > tresholdDown && tresholdDown < Grid.fieldSize * Grid.sizeY - this.tresholdSize) {
        this.playerWindow.y = Math.min(width + this.playerWindow.y, Grid.fieldSize * Grid.sizeY);
      }

      if (y < tresholdUp) {
        this.playerWindow.y = Math.max(this.playerWindow.y - height, 0);
      }
    }
  }

  paintCell(x, y, height, width, color){
    if (this.isVisible(x, y, height, width)) {
      x-=this.playerWindow.x;
      y-=this.playerWindow.y;
      this.ctx.lineWidth = 1;
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, height, width);
      this.ctx.strokeStyle = 'black';
      this.ctx.strokeRect(x, y, height, width);
    }
  }

  paintCircle(x, y, r, color) {
    if (this.isVisible(x, y, r, r)) {
      x-=this.playerWindow.x;
      y-=this.playerWindow.y;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.arc(x + r, y + r, r, 0, Math.PI*2, true); 
      this.ctx.closePath();
      this.ctx.fillStyle = color;
      this.ctx.fill();
    }    
  }

  paintBorder(border) {
    const {x, y, height, width, color} = border; 
    this.paintCell(x, y, width, height, color);
  }  

  paintBackground(color, stroke){
    let w = window.innerWidth;
    let h = window.innerHeight;
    this.ctx.lineWidth = 1;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, w, h);
    this.ctx.strokeStyle = stroke || color;
    this.ctx.strokeRect(0, 0, w, h);    
  }

  paintPlayer(player) {
    let segmets = player.getSegments();
    _.each(segmets, (segment) => {
      let {x, y, width, height, color} = segment.getSpecs();
      this.paintCell(x, y, width, height, color);
    });
  }

  paintCollectible(collectible) {
    let {x, y, radius, color} = collectible.getSpecs();
    this.paintCircle(x, y, radius, color);
  }

  paintPlayers(players) {
    _.each(players, player => {
      this.paintPlayer(player);
    });
  }

  paintCollectibles(collectibles) {
    _.each(collectibles, collectible => {
      this.paintCollectible(collectible);
    });    
  }

  paintWorld(borders) {
    _.each(borders, border => {
      this.paintBorder(border);
    });
  }
}

export default CanvasManager;