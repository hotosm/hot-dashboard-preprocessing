import preProcessingService from "../preprocessor/PreProcessor";
import Global from "../preprocessor/Global";
import RamaniHuria from "../preprocessor/RamaniHuria";
import ProjectTest from "../preprocessor/ProjectTest";
import Writer from "../utils/Writer";
import jsdom from 'jsdom';

const writer = new Writer();

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
        dataFromAPI[projectsFromAPI[i].projectname] = await
            this.preProcessingService.getDataFromProjects(projectsFromAPI, i);
      }
    } catch (e) {
      console.error('preProcessing data error', e)
    }

    // 3. Data processing
    try {
      let project = {};
      for (let i = 0; i < projectsFromAPI.length; i++) {
        switch (projectsFromAPI[i].projectname.toLowerCase()) {
          case "ramanihuria":
            project = new RamaniHuria(dataFromAPI.ramanihuria);
            dataFromAPI.ramanihuria = project.process();
            break;
          case "projecttest":
            project = new ProjectTest(dataFromAPI.projecttest);
            dataFromAPI.projecttest = project.process();
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

    let res = {};
    res.projects = projectsFromAPI;
    return res;
  }
}
jsdom.env("", (err, window) => {
  if (err) {
    console.error(err);
    return;
  }

  var $ = require("jquery")(window);
  new Preprocess($).process();
});
export default Preprocess;