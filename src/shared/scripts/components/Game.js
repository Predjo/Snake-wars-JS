'use strict';

import React, {Component} from 'react';

import Canvas             from './Canvas';
import StatScreen         from './StatScreen';

import Game               from '../utils/Game';
import EventManager       from '../utils/managers/EventManager';
import {events as Events} from '../constants/Config';

class Main  extends Component {

  constructor() {
    super();
    this.state = {
      game: null
    }
  }

  componentDidMount() {
    let ctx = this.refs.canvas.getCanvasContext('2d');
    let game = new Game();
    
    game.init(ctx);
    game.start();
    this.setGame(game);
  }

  setGame(game) {
    this.setState({game});
  }

  onResize(data) {
    EventManager.trigger(Events.windowResized, data);
  }

  render() {
    let stats = this.state.game ? this.state.game.getStats() : null;

    return (
      <div className='app-wrap'>
        <Canvas ref="canvas" show onResize={this.onResize}/>
        <StatScreen stats={stats} />
      </div>
    );
  }
}

export default Main;