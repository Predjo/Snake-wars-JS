'use strict';

import React, { Component,PropTypes } from 'react';

class StatScreen  extends Component {  
  static propTypes = {
    stats: PropTypes.object
  }

  static defaultProps = {
    stats: null
  }  

  constructor() {
    super();
    this.state = {
      time  : 0,
      fps   : 0,
      delta : 0
    }
  }

  componentDidUpdate() {
    let stats = this.props.stats;
    if(stats) {
      stats.onUpdate(() => {
        let player = stats.getPlayer();
        this.setState({
          time  : stats.getElapsedTime(),
          fps   : stats.getFPS(),
          delta : stats.getDeltaTime(),
          speed : player ? player.getSpeed() : 0,
          size  : player ? player.getSize() : 0
        });
      });
    }
  }
  
  render() {
    let {time, fps, delta, size, speed} = this.state;

    return (
      <div className="stat-screen-wrap">
        <ul className="stat-screen-list">
          <li className="stat-screen-item-wrap">
            <span className="stat-screen-item-name">Time:</span>
            <span className="stat-screen-item-value">{`${time}s`}</span>
          </li>
          <li className="stat-screen-item">
            <span className="stat-screen-item-name">FPS:</span>
            <span className="stat-screen-item-value">{fps}</span>
          </li>
          <li className="stat-screen-item">
            <span className="stat-screen-item-name">Delta:</span>
            <span className="stat-screen-item-value">{delta}</span>
          </li>  
          <li className="stat-screen-item">
            <span className="stat-screen-item-name">Size:</span>
            <span className="stat-screen-item-value">{size}</span>
          </li> 
          <li className="stat-screen-item">
            <span className="stat-screen-item-name">Speed:</span>
            <span className="stat-screen-item-value">{speed}</span>
          </li>                             
        </ul>
      </div>
    );
  }
};

export default StatScreen;