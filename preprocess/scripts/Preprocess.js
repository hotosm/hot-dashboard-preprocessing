import preProcessingService from "../preprocessor/PreProcessor";
import Global from "../preprocessor/Global";
import RamaniHuria from "../preprocessor/RamaniHuria";
import DummyProject from "../preprocessor/DummyProject";
import Writer from "../utils/Writer";
import jsdom from 'jsdom';

// This is used to call the Writer anywhere (it's used to post data to the AWS bucket)
const writer = new Writer();
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

class Preprocess {
  constructor($=null) {
    this.preProcessingService = new preProcessingService($);
    writer.setJquery($);
  }

  async process() {
    let projectsFromAPI = [];
    let dataFromAPI = {};

    //  1. Get the projects
    try {
      projectsFromAPI = await
        this.preProcessingService.getProjectsFromAPI();
    } catch (e) {
      console.error('preProcessing projects error', e);
    }
    // 2. Get the indicators
    try {
      for (let i = 0; i < projectsFromAPI.length; i++) {
        dataFromAPI[projectsFromAPI[i]["project name"]] = await
            this.preProcessingService.getDataFromProjects(projectsFromAPI, i);
      }
    } catch (e) {
      console.error('preProcessing data error', e)
    }

    // 3. Data processing
    try {
      let project = {};
      for (let i = 0; i < projectsFromAPI.length; i++) {
        switch (projectsFromAPI[i]["project name"].toLowerCase()) {
          case "ramanihuria":
            project = new RamaniHuria(dataFromAPI.ramanihuria);
            dataFromAPI.ramanihuria = project.process();
            break;
          case "dummyproject":
            project = new DummyProject(dataFromAPI.dummyproject);
            dataFromAPI.dummyproject = project.process();
            break;
          default:
            break;
        }
      }
      project = new Global(dataFromAPI);
      dataFromAPI = project.process();
    } catch (e) {
      console.error('preProcessing data error', e)
    }

    // 4. Json saving in the bucket Amazon
    try {
      writer.setJson(dataFromAPI);
    }
    catch (e) {
      console.error('Writing the json file failed', e)
    }
  }
}

exports.default = function(event, context, callback) {
  try {
    var $ = require("jquery")(window);
    new Preprocess($).process();
    callback(null, "The file rawdata.json was sucessfully updated !");
  }
  catch (e) {
    console.error("There was an error during the execution of the lambda function", e)
  }
};