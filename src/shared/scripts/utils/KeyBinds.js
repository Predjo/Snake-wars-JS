'use strict';

import _ from 'lodash';

class KeyBinds {
  constructor() {
    this.listeners = new Map();
    this.addListeners();
  }

  addListeners() {
    document.addEventListener('keydown', (e) => {
      let key = e.which;
      var callback = this.listeners.get(key);
      if (_.isFunction(callback)) {
        callback();
      }
    });
  }

  on (control, callback) {
    this.listeners.set(control, callback);
  }
}

export default KeyBinds;
