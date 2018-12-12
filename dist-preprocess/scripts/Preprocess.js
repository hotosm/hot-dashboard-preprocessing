"use strict";

var _PreProcessor = require("../preprocessor/PreProcessor");

var _PreProcessor2 = _interopRequireDefault(_PreProcessor);

var _Global = require("../preprocessor/Global");

var _Global2 = _interopRequireDefault(_Global);

var _RamaniHuria = require("../preprocessor/RamaniHuria");

var _RamaniHuria2 = _interopRequireDefault(_RamaniHuria);

var _PDC = require("../preprocessor/PDC");

var _PDC2 = _interopRequireDefault(_PDC);

var _DummyProject = require("../preprocessor/DummyProject");

var _DummyProject2 = _interopRequireDefault(_DummyProject);

var _Writer = require("../utils/Writer");

var _Writer2 = _interopRequireDefault(_Writer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This is used to call the Writer anywhere (it's used to post data to the AWS bucket)
const writer = new _Writer2.default();

class Preprocess {
  constructor() {
    this.preProcessingService = new _PreProcessor2.default();
  }

  async process() {
    const projectName = "project name";
    let projectsFromAPI = [];
    let dataFromAPI = {
      projectNames: {}
    };

    //  1. Get the projects
    try {
      projectsFromAPI = await this.preProcessingService.getProjectsFromAPI();
    } catch (e) {
      console.error('preProcessing projects error', e);
    }
    // 2. Get the indicators
    try {
      for (let i = 0; i < projectsFromAPI.length; i++) {
        // Because some project name have spaces, we would remove them in order to get acces easily to the data
        dataFromAPI.projectNames[projectsFromAPI[i][projectName]] = projectsFromAPI[i][projectName].toLowerCase().replace(/\s+/g, '');
        // https://stackoverflow.com/questions/5964373/is-there-a-difference-between-s-g-and-s-g
        dataFromAPI[projectsFromAPI[i][projectName].toLowerCase().replace(/\s+/g, '')] = await this.preProcessingService.getDataFromProjects(projectsFromAPI, i);
      }
    } catch (e) {
      console.error('preProcessing data error', e);
    }

    // 3. Data processing
    try {
      let project = {};
      for (let i = 0; i < projectsFromAPI.length; i++) {
        switch (dataFromAPI["projectNames"][projectsFromAPI[i][projectName]]) {
          case "ramanihuria":
            project = new _RamaniHuria2.default(dataFromAPI.ramanihuria, 'ramanihuria');
            console.log('ramanihuria');
            dataFromAPI.ramanihuria = project.process();
            break;
          case "pdc":
            project = new _PDC2.default(dataFromAPI.pdc, 'pdc');
            console.log('pdc');
            dataFromAPI.pdc = project.process();
            break;
          case "dummyproject":
            project = new _DummyProject2.default(dataFromAPI.dummyproject);
            dataFromAPI.dummyproject = project.process();
            break;
          default:
            break;
        }
      }
      project = new _Global2.default(dataFromAPI);
      dataFromAPI = project.process();
    } catch (e) {
      console.error('preProcessing data error', e);
    }

    // 4. Json saving in the bucket Amazon
    try {
      writer.setJson(dataFromAPI);
    } catch (e) {
      console.error('Writing the json file failed', e);
    }
  }
}

/**
 * This is the entrypoint for the lambda function
 * @param event
 * @param context
 * @param callback
 */
exports.default = function (event, context, callback) {
  try {
    new Preprocess().process();
    callback(null, "The file rawdata.json was sucessfully updated !");
  } catch (e) {
    console.error("There was an error during the execution of the lambda function", e);
  }
};