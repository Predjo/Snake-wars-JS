'use strict';

import React, {Component} from 'react';
import { Link } from 'react-router'; 


class Login extends Component {

  constructor() {
    super();
  }

  componentDidMount() {}

  render() {

    return (
      <div className='login-wrap'>
        <span>Hello welcome to Snake Wars. Click </span>
        <Link to="/game">this</Link>
        <span> to start.</span>
      </div>
    );
  }
}

export default Login;