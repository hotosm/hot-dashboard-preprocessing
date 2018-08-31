/** Constants **/
import CONFIG from '../external/Constants'

/** Services **/
import Reader   from '../utils/Reader';

const reader = new Reader();

class PreProcessor {
  constructor($=null) {
    this.getAllDatas = this.getAllDatas.bind(this);
    this.getDataFromProjects = this.getDataFromProjects.bind(this);
    this.getProjectsFromAPI = this.getProjectsFromAPI.bind(this);
    this.getDataFromProjectsFile = this.getDataFromProjectsFile.bind(this);
    reader.setJquery($);
  }

  //------------------------------------------------------------------------//
  //---------------------------------- Init --------------------------------//
  //------------------------------------------------------------------------//

  /** Get the projects from the API **/
  getProjectsFromAPI(){
    return new Promise((resolve,reject) => {
      reader.getCsv(CONFIG.projects, this.getDataFromProjectsFile)
          .then((allProjects) =>{
            resolve(allProjects);
          })
          .catch((error) =>{
            reject(error);
          });
    });
  }

  /** Initilize the data received from the API **/
  getDataFromProjects(projectSource, i){
    return new Promise((resolve,reject) => {
      reader.getCsv(projectSource[i].configfileurl, this.getAllDatas)
          .then((allDatasFromAPIwithLinks) =>{
            resolve(allDatasFromAPIwithLinks);
          })
          .catch((error) =>{
            reject(error);
          });
    });
  }

  //------------------------------------------------------------------------//
  //------------------------------- Projects -------------------------------//
  //------------------------------------------------------------------------//
  getDataFromProjectsFile(result){
    return result.data;
  }


  //------------------------------------------------------------------------//
  //---------------------------------- Data --------------------------------//
  //------------------------------------------------------------------------//

  /** Update all datas to the 'allDatasFromAPIwithLinks' value **/
  async getAllDatas(result){
    // console.log(result.data);
    const allDatasFromAPIwithLinks = result.data;
    let generalData = {
      main: {},
      capacitybuilding: {},
      awareness: {}
    }; // Array of data with all the indicators we want

    // For each little objects on the big object
    for(let i=0; i<allDatasFromAPIwithLinks.length; i++) {

      // Control if the 'link' attribute in the object is not undefined
      if (allDatasFromAPIwithLinks[i].link !== undefined) {
        let dataGeneratedWithLink = undefined;
        switch (allDatasFromAPIwithLinks[i].type.toLowerCase()) {
          // If there is a JSON file or if it is an API
          case "api":
          case "json":
            dataGeneratedWithLink = await reader.getJson(allDatasFromAPIwithLinks[i]);
            break;
          // If there is a csv file
          case "csv":
            dataGeneratedWithLink = await reader.getCsv(allDatasFromAPIwithLinks[i].link, (result) => result.data);
            break;
          default:
        }
        switch (allDatasFromAPIwithLinks[i].category.toLowerCase()) {
          case "mapping":
            generalData.main[allDatasFromAPIwithLinks[i].name] = dataGeneratedWithLink;
            break;
          case "awareness":
            generalData.awareness[allDatasFromAPIwithLinks[i].name] = dataGeneratedWithLink;
            break;
          case "capacitybuilding":
            generalData.capacitybuilding[allDatasFromAPIwithLinks[i].name] = dataGeneratedWithLink;
            break;
          default:
        }
      }
    }
    return generalData;
  }
}

export default PreProcessor;
