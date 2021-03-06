'use strict';

import keyMirror from 'keymirror';

const Config = {
  player: {
    defaultSpeed       : 20,
    defaultSegmentNum  : 6,
    defaultSegmentSize : 14,
    defaultColor       : 'blue'
  },

  grid: {
    fieldSize: 14,
    sizeX: 200,
    sizeY: 100
  },

  collectible: {
    limit: 10,
    type: {
      segmentPlus : {
        name : 'segmentPlus',
        color : 'green',
        chance : 0.70
      },
      speedPlus   : {
        name : 'speedPlus',
        color : 'red',
        chance : 0.15
      },
      speedMinus : {
        name : 'speedMinus',
        color : 'orange',
        chance : 0.15
      }
    }
  },

  controls: {
    pause     : 80,
    moveUp    : 87,
    moveDown  : 83,
    moveLeft  : 65,
    moveRight : 68,
    fire      : 32
  },

  direction: {
    up    : {x:0, y:-1},
    left  : {x:-1, y:0},
    right : {x:1, y:0},
    down  : {x:0, y:1}
  },

  gameObject: {
    type: keyMirror({
      generic       : null,
      playerSegment : null,
      collectible   : null,
      bullet        : null,
      border        : null
    }),

    movementType: {
      static  : 'static',
      dynamic : 'dynamic'
    }
  },

  events: keyMirror({
    playerDestroyed        : null,
    currentPlayerDestroyed : null,
    collectibleDestroyed   : null,
    playerCreated          : null,
    playerAdded            : null,
    playerRemoved          : null,
    currentPlayerCreated   : null,
    collectibleCreated     : null,
    collectibleAdded       : null,
    windowResized          : null,
    updateCollectables     : null,
    updatePlayers          : null,
    borderAdded            : null,
    borderRemoved          : null,
    borderDestroyed        : null,
    borderCreated          : null,
  })
}

export default Config;