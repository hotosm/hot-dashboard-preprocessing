'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Constants = require('../external/Constants');

var _Constants2 = _interopRequireDefault(_Constants);

var _Reader = require('../utils/Reader');

var _Reader2 = _interopRequireDefault(_Reader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Constants **/
const reader = new _Reader2.default();

/** Services **/

const projectConfigUrl = "project configuration url";
const sheetName = "sheet name";
const url = "url";

class PreProcessor {
  constructor() {
    this.getAllDatas = this.getAllDatas.bind(this);
    this.getDataFromProjects = this.getDataFromProjects.bind(this);
    this.getProjectsFromAPI = this.getProjectsFromAPI.bind(this);
    this.getDataFromProjectsFile = this.getDataFromProjectsFile.bind(this);
  }

  getFileKey(url) {
    return url.split("/", 6)[5];
  }

  //------------------------------------------------------------------------//
  //---------------------------------- Init --------------------------------//
  //------------------------------------------------------------------------//

  /** Get the projects from the API **/
  getProjectsFromAPI() {
    return new Promise((resolve, reject) => {
      reader.getCsv(_Constants2.default.googleEndPoint + _Constants2.default.projects[0] + _Constants2.default.googleSheetEndUrl + _Constants2.default.projects[1], this.getDataFromProjectsFile).then(allProjects => {
        resolve(allProjects);
      }).catch(error => {
        reject(error);
      });
    });
  }

  /** Initilize the data received from the API **/
  getDataFromProjects(projectSource, i) {
    return new Promise((resolve, reject) => {
      reader.getCsv(_Constants2.default.googleEndPoint + this.getFileKey(projectSource[i][projectConfigUrl]) + _Constants2.default.googleSheetEndUrl + projectSource[i][sheetName], this.getAllDatas).then(allDatasFromAPIwithLinks => {
        resolve(allDatasFromAPIwithLinks);
      }).catch(error => {
        reject(error);
      });
    });
  }

  //------------------------------------------------------------------------//
  //------------------------------- Projects -------------------------------//
  //------------------------------------------------------------------------//
  getDataFromProjectsFile(result) {
    return result.data;
  }

  //------------------------------------------------------------------------//
  //---------------------------------- Data --------------------------------//
  //------------------------------------------------------------------------//

  /** Update all datas to the 'allDatasFromAPIwithLinks' value **/
  async getAllDatas(result) {
    const allDatasFromAPIwithLinks = result.data;
    let generalData = {
      mapping: {},
      capacitybuilding: {},
      awareness: {},
      community: {},
      main: {}
    }; // Array of data with all the indicators we want

    // For each little objects on the big object
    for (let i = 0; i < allDatasFromAPIwithLinks.length; i++) {

      // Control if the 'link' attribute in the object is not undefined
      if (allDatasFromAPIwithLinks[i][url] !== undefined) {
        let dataGeneratedWithLink = {
          data: undefined,
          title: ""
        };
        switch (allDatasFromAPIwithLinks[i].type.toLowerCase()) {
          // If there is a JSON file or if it is an API
          case "api":
          case "json":
            dataGeneratedWithLink.data = await reader.getJson(allDatasFromAPIwithLinks[i][url], allDatasFromAPIwithLinks[i].name);
            break;
          // If there is a csv file
          case "csv":
            dataGeneratedWithLink.data = await reader.getCsv(allDatasFromAPIwithLinks[i][url], result => result.data);
            break;
          case "google sheet":
            dataGeneratedWithLink.data = await reader.getCsv(_Constants2.default.googleEndPoint + this.getFileKey(allDatasFromAPIwithLinks[i][url]) + _Constants2.default.googleSheetEndUrl + allDatasFromAPIwithLinks[i][sheetName], result => result.data);
            break;
          default:
        }
        // Associate the title to data of the widget which will be displayed
        dataGeneratedWithLink.title = allDatasFromAPIwithLinks[i].title;
        switch (allDatasFromAPIwithLinks[i].category.toLowerCase()) {
          case "mapping":
            generalData.mapping[allDatasFromAPIwithLinks[i].name] = dataGeneratedWithLink;
            break;
          case "awareness":
            generalData.awareness[allDatasFromAPIwithLinks[i].name] = dataGeneratedWithLink;
            break;
          case "capacity building":
            generalData.capacitybuilding[allDatasFromAPIwithLinks[i].name] = dataGeneratedWithLink;
            break;
          case "community":
            generalData.community[allDatasFromAPIwithLinks[i].name] = dataGeneratedWithLink;
            break;
          case "main":
            generalData.main[allDatasFromAPIwithLinks[i].name] = dataGeneratedWithLink;
            break;
          default:
        }
      }
    }
    return generalData;
  }
}

exports.default = PreProcessor;