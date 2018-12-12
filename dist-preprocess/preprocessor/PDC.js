"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ProjectCore = require("./ProjectCore");

var _ProjectCore2 = _interopRequireDefault(_ProjectCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This class is processing the data for the PDC project
class PDC extends _ProjectCore2.default {
  constructor(generalData) {
    super(generalData);
  }
}

exports.default = PDC;