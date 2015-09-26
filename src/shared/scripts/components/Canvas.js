'use strict';

import _                              from 'lodash';
import React, { Component,PropTypes } from 'react';

class Canvas extends Component {  

  static propTypes = {
    show: PropTypes.bool,
    onResize: PropTypes.func
  }

  static defaultProps = {
    show: true
  }  

  constructor() {
    super();
    this.state = {}
  }

  componentDidMount() {
    this._resizeCanvas();
    window.addEventListener('resize', this._resizeCanvas, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resizeCanvas, false);
  }
  
  _resizeCanvas = () => {
    let canvas = React.findDOMNode(this.refs.canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if(_.isFunction(this.props.onResize)) {
      this.props.onResize({width: window.innerWidth, height: window.innerHeight});
    }
  }

  getCanvasContext(type) {
    let canvas = React.findDOMNode(this.refs.canvas); 
    return canvas.getContext(type || '2d');
  }

  render() {
    return (
      <canvas className="playfield" ref="canvas"></canvas>
    );
  }
};

export default Canvas;