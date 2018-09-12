'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AbstractProject = require('./AbstractProject');

var _AbstractProject2 = _interopRequireDefault(_AbstractProject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This class is the processing the data for the ProjectTest project
class ProjectTest extends _AbstractProject2.default {
  constructor(generalData) {
    super(generalData);
  }
}

exports.default = ProjectTest;