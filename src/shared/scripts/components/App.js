'use strict';

import React, {Component, PropTypes} from 'react';

class App extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
  }

  constructor() {
    super();
  }

  componentDidMount() {}

  render() {

    return (
      <div className='wrap'>{this.props.children}</div>
    );
  }
}

export default App;