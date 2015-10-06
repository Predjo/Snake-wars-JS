'use strict';

import React, {Component} from 'react';
import { Link } from 'react-router'; 


class Login extends Component {

  constructor() {
    super();
  }

  componentDidMount() {}

  setPlayerName(event) {
    this.setState({
      playerName: event.target.value
    });
  }

  render() {

    return (
      <div className='login-wrap'>
        <div>
          <span>Hello welcome to Snake Wars. Click </span>
          <Link to="/game">this</Link>
          <span> to start.</span>
        </div>
        <div>
          <input onInput={this.setPlayerName} ref="playerName"/>
        </div>
      </div>
    );
  }
}

export default Login;