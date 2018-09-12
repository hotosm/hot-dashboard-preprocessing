'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * This abstract class is here in order to make sure every preprocessor (one for each project) have the same architecture
 */
class AbstractProject {
  constructor(data) {
    if (this.constructor === AbstractProject) {
      throw new TypeError('Abstract class "AbstractProject" cannot be instantiated directly.');
    }
    this.data = data;
    this.functions = [];
  }

  /**
   * This function simply execute every function that is manipulating the data
   * @returns {object} The data with the new attributes or just aggregated data
   */
  process() {
    for (let i = 0; i < this.functions.length; i++) {
      //Calls every function
      this[this.functions[i]](this.data);
    }
    return this.data;
  }
}

exports.default = AbstractProject;