import preProcessingService from "../preprocessor/PreProcessor";
import Global from "../preprocessor/Global";
import RamaniHuria from "../preprocessor/RamaniHuria";
import PDC from "../preprocessor/PDC";
import DummyProject from "../preprocessor/DummyProject";
import Writer from "../utils/Writer";

// This is used to call the Writer anywhere (it's used to post data to the AWS bucket)
const writer = new Writer();

class Preprocess {
  constructor() {
    this.preProcessingService = new preProcessingService();
  }

  async process() {
    const projectName = "project name";
    let projectsFromAPI = [];
    let dataFromAPI = {
      projectNames: {}
    };

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
        // Because some project name have spaces, we would remove them in order to get acces easily to the data
        dataFromAPI.projectNames[projectsFromAPI[i][projectName]] = projectsFromAPI[i][projectName].toLowerCase().replace(/\s+/g, '');
        // https://stackoverflow.com/questions/5964373/is-there-a-difference-between-s-g-and-s-g
        dataFromAPI[projectsFromAPI[i][projectName].toLowerCase().replace(/\s+/g, '')] = await
            this.preProcessingService.getDataFromProjects(projectsFromAPI, i);
      }
    } catch (e) {
      console.error('preProcessing data error', e)
    }

    // 3. Data processing
    try {
      let project = {};
      for (let i = 0; i < projectsFromAPI.length; i++) {
        switch (dataFromAPI["projectNames"][projectsFromAPI[i][projectName]]) {
          case "ramanihuria":
            project = new RamaniHuria(dataFromAPI.ramanihuria, 'ramanihuria');
            console.log('ramanihuria')
            dataFromAPI.ramanihuria = project.process();
            break;
          case "pdc":
            project = new PDC(dataFromAPI.pdc, 'pdc');
            console.log('pdc')
            dataFromAPI.pdc = project.process();
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

/**
 * This is the entrypoint for the lambda function
 * @param event
 * @param context
 * @param callback
 */
exports.default = function(event, context, callback) {
  try {
    new Preprocess().process();
    callback(null, "The file rawdata.json was sucessfully updated !");
  }
  catch (e) {
    console.error("There was an error during the execution of the lambda function", e)
  }
};