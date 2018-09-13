"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ProjectCore = require("./ProjectCore");

var _ProjectCore2 = _interopRequireDefault(_ProjectCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This class is the processing the data for the RamaniHuria project
class RamaniHuria extends _ProjectCore2.default {
  constructor(generalData) {
    super(generalData);
  }
}

exports.default = RamaniHuria;