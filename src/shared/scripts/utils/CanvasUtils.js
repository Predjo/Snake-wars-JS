'use strict';

import _ from 'lodash';

class CanvasUtils {

  static paintCell(ctx, x, y, height, width, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, height, width);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, height, width);
  }

  static paintCircle(ctx, x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x + r, y + r, r, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();    
  }

  static paintBackground(ctx, color, stroke){
    let w = window.innerWidth;
    let h = window.innerHeight;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = stroke || color;
    ctx.strokeRect(0, 0, w, h);    
  }

  static paintPlayer(ctx, player) {
    let segmets = player.getSegments();
    _.each(segmets, (segment) => {
      let {x, y, width, height, color} = segment.getSpecs();
      this.paintCell(ctx, x, y, width, height, color);
    });
  }

  static paintCollectible(ctx, collectible) {
    let {x, y, radius, color} = collectible.getSpecs();
    this.paintCircle(ctx, x, y, radius, color);
  }

  static paintPlayers(ctx, players) {
    _.each(players, (player) => {
      CanvasUtils.paintPlayer(ctx, player);
    });
  }

  static paintCollectibles(ctx, collectibles) {
    _.each(collectibles, (collectible) => {
      CanvasUtils.paintCollectible(ctx, collectible);
    });    
  }  
}

export default CanvasUtils;