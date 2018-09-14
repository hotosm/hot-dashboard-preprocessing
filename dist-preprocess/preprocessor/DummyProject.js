"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ProjectCore = require("./ProjectCore");

var _ProjectCore2 = _interopRequireDefault(_ProjectCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This class is processing the data for the DummyProject project
class DummyProject extends _ProjectCore2.default {
  constructor(generalData) {
    super(generalData);
  }
  // If you want to add a preprocessing function for a specific data.
  // You'll have to add the function in the constructor to the this.functions array
}

exports.default = DummyProject;