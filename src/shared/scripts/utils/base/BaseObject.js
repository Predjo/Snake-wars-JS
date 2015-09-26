'use strict';

class BaseObject {
  constructor() {
    this.id = this._generateId();
  }

  _generateId() {
    return Math.random(); 
  }

  getId() {
    return this.id;
  }
}

export default BaseObject;