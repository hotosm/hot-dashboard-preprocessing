"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AbstractProject = require("./AbstractProject");

var _AbstractProject2 = _interopRequireDefault(_AbstractProject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This class is the processing the data for the Global project
class Global extends _AbstractProject2.default {
  constructor(generalData) {
    super(generalData);
    this.functions.push("getTotalSubwards");
    this.functions.push("getTotalOrganizationsSupported");
    this.functions.push("getTotalNbAttendeesMonthly");
    this.functions.push("getTotalNbAttendeesInstitutions");
    this.functions.push("getTotalNbAttendeesTraining");
    this.functions.push("getTotalNbWorkshopsMonthly");
    this.functions.push("getTotalNbTrainings");
    this.functions.push("getTotalNbParticipantsGender");
    this.functions.push("getTotalNbParticipantsNew");
    this.functions.push("getTotalNbParticipantsType");
    this.functions.push("getTotalNbEvents");
  }

  /**
   * Get the number of subwards (by month)
   * @param data - the data fetched by the reader
   * @returns {*}
   */
  getTotalSubwards(data) {
    let totalSubwardsCompleted = {};
    let projectName = "";
    let subwardsData = [];
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(data.projectNames).length; i++) {
      projectName = Object.values(data.projectNames)[i];
      if (projectName !== "global") {
        for (let j = 0; j < Object.keys(data[projectName]).length; j++) {
          let subProject = Object.keys(data[projectName])[j];
          // In order to add the data, every project must have the same key name
          if (Object.keys(data[projectName][subProject]).includes("nbSubwardsCompleted")) {
            let divisionKeys = data[projectName].mapping.nbSubwardsCompleted;
            let divisionData = divisionKeys.data;
            let exist = false;
            // This loop is here to add the row in the right array cell in order to have a descending order
            for (let k = 0; k < divisionData.length; k++) {
              let divisionDate = divisionData[k].date;
              for (let l = 0; l < subwardsData.length && !exist; l++) {
                // If the date of the current row is greater (newer) than the item in the array
                if (divisionDate.getFullYear() > subwardsData[l].date.getFullYear() || divisionDate.getMonth() > subwardsData[l].date.getFullYear() && subwardsData[l].date.getFullYear() === divisionDate.getFullYear()) {
                  // We create a temp value to store the data in order to not modify it when whe add them
                  let subwardTemp = {
                    extend: divisionData[k].extend,
                    label: divisionData[k].label,
                    date: divisionData[k].date,
                    value: divisionData[k].value
                  };
                  let res = [];
                  res = res.concat(subwardsData.splice(0, j));
                  res.push(subwardTemp);
                  res = res.concat(subwardsData);
                  subwardsData = res;
                  exist = true;
                }
                // If the date of the current row is equal to the date of the item in the array
                else if (divisionDate.getMonth() === subwardsData[l].date.getMonth() && divisionDate.getFullYear() === subwardsData[l].date.getFullYear()) {
                    subwardsData[l].value += divisionData[k].value;
                    exist = true;
                  }
              }
              // Otherwise, the current row is lower (older) than the last item of the array
              if (!exist) {
                subwardsData.push({
                  extend: divisionData[k].extend,
                  label: divisionData[k].label,
                  date: divisionData[k].date,
                  value: divisionData[k].value
                });
              } else {
                exist = false;
              }
            }
            totalSubwardsCompleted = {
              title: divisionKeys.title,
              data: subwardsData
            };
          }
        }
      }
    }
    // We finally append the data to the object
    data.global.main["totalSubwardsCompleted"] = totalSubwardsCompleted;
    return data;
  }

  /**
   * Get the number of organizations supported
   * @param data - the data fetched by the reader
   * @returns {*}
   */
  getTotalOrganizationsSupported(data) {
    let totalOrganizationsSupported = 0;
    let projectName = "";
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(data.projectNames).length; i++) {
      projectName = Object.values(data.projectNames)[i];
      if (projectName !== "global") {
        for (let j = 0; j < Object.keys(data[projectName]).length; j++) {
          let subProject = Object.keys(data[projectName])[j];
          if (Object.keys(data[projectName][subProject]).includes("nborganizations")) {
            totalOrganizationsSupported += data[projectName][subProject].nborganizations.data.length;
          }
        }
      }
    }
    data.global.main["totalOrganizationsSupported"] = {
      title: "Number of organizations supported",
      value: totalOrganizationsSupported
    };
    return data;
  }

  /**
   * Get the number of attendees monthly for every project
   * @param data - the data fetched by the reader
   * @returns {*}
   */
  getTotalNbAttendeesMonthly(data) {
    let totalNbAttendeesMonthly = {};
    let projectName = "";
    let nbAttendeesData = [];
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(data.projectNames).length; i++) {
      projectName = Object.values(data.projectNames)[i];
      if (projectName !== "global") {
        for (let j = 0; j < Object.keys(data[projectName]).length; j++) {
          let subProject = Object.keys(data[projectName])[j];
          if (Object.keys(data[projectName][subProject]).includes("nbAttendeesMonthly")) {
            let divisionKeys = data[projectName][subProject].nbAttendeesMonthly;
            let divisionData = divisionKeys.data;
            let exist = false;
            // This loop is here to add the row in the right array cell in order to have a descending order
            for (let k = 0; k < divisionData.length; k++) {
              let divisionDate = divisionData[k].date;
              for (let l = 0; l < nbAttendeesData.length && !exist; l++) {
                // If the date of the current row is greater (newer) than the item in the array
                if (divisionDate.getFullYear() > nbAttendeesData[l].date.getFullYear() || divisionDate.getMonth() > nbAttendeesData[l].date.getFullYear() && nbAttendeesData[l].date.getFullYear() === divisionDate.getFullYear()) {
                  let nbAttendeesTemp = {
                    label: divisionData[k].label,
                    date: divisionData[k].date,
                    value: divisionData[k].value
                  };
                  let res = [];
                  res = res.concat(nbAttendeesData.splice(0, j));
                  res.push(nbAttendeesTemp);
                  res = res.concat(nbAttendeesData);
                  nbAttendeesData = res;
                  exist = true;
                }
                // If the date of the current row is equal to the date of the item in the array
                else if (divisionDate.getMonth() === nbAttendeesData[l].date.getMonth() && divisionDate.getFullYear() === nbAttendeesData[l].date.getFullYear()) {
                    nbAttendeesData[l].value += divisionData[k].value;
                    exist = true;
                  }
              }
              // Otherwise, the current row is lower (older) than the last item of the array
              if (!exist) {
                nbAttendeesData.push({
                  label: divisionData[k].label,
                  date: divisionData[k].date,
                  value: divisionData[k].value
                });
              } else {
                exist = false;
              }
            }
            totalNbAttendeesMonthly = {
              title: divisionKeys.title,
              data: nbAttendeesData
            };
          }
        }
      }
    }
    data.global.main["totalNbAttendeesMonthly"] = totalNbAttendeesMonthly;
    return data;
  }

  /**
   * Get the number of attendees per institutions for every project
   * @param data - the data fetched by the reader
   * @returns {*}
   */
  getTotalNbAttendeesInstitutions(data) {
    let totalNbAttendeesInstitutions = {};
    let projectName = "";
    let nbAttendeesData = [];
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(data.projectNames).length; i++) {
      projectName = Object.values(data.projectNames)[i];
      if (projectName !== "global") {
        for (let j = 0; j < Object.keys(data[projectName]).length; j++) {
          let subProject = Object.keys(data[projectName])[j];
          if (Object.keys(data[projectName][subProject]).includes("nbAttendeesInstitutions")) {
            let divisionKeys = data[projectName][subProject].nbAttendeesInstitutions;
            let divisionData = divisionKeys.data;
            let exist = false;
            // This loop is here to add the row in the right array cell in order to have a descending order
            for (let k = 0; k < divisionData.length; k++) {
              for (let l = 0; l < nbAttendeesData.length && !exist; l++) {
                // If the institution of the current row is the same
                if (divisionData.extend === nbAttendeesData[l].extend) {
                  nbAttendeesData[l].value += divisionData[k].value;
                  exist = true;
                }
              }
              // Otherwise, the current row is lower (older) than the last item of the array
              if (!exist) {
                nbAttendeesData.push({
                  extend: divisionData[k].extend,
                  label: divisionData[k].label,
                  value: divisionData[k].value
                });
              } else {
                exist = false;
              }
            }
            totalNbAttendeesInstitutions = {
              title: divisionKeys.title,
              data: nbAttendeesData
            };
          }
        }
      }
    }
    data.global.main["totalNbAttendeesInstitutions"] = totalNbAttendeesInstitutions;
    return data;
  }

  /**
   * Get the number of attendees per training for every project
   * @param data - the data fetched by the reader
   * @returns {*}
   */
  getTotalNbAttendeesTraining(data) {
    let totalNbAttendeesTraining = {};
    let projectName = "";
    let nbAttendeesData = [];
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(data.projectNames).length; i++) {
      projectName = Object.values(data.projectNames)[i];
      if (projectName !== "global") {
        for (let j = 0; j < Object.keys(data[projectName]).length; j++) {
          let subProject = Object.keys(data[projectName])[j];
          if (Object.keys(data[projectName][subProject]).includes("nbAttendeesTraining")) {
            let divisionKeys = data[projectName][subProject].nbAttendeesTraining;
            let divisionData = divisionKeys.data;
            let exist = false;
            // This loop is here to add the row in the right array cell in order to have a descending order
            for (let k = 0; k < divisionData.length; k++) {
              for (let l = 0; l < nbAttendeesData.length && !exist; l++) {
                // If the institution of the current row is the same
                if (divisionData.extend === nbAttendeesData[l].extend) {
                  nbAttendeesData[l].value += divisionData[k].value;
                  exist = true;
                }
              }
              // Otherwise, the current row is lower (older) than the last item of the array
              if (!exist) {
                nbAttendeesData.push({
                  extend: divisionData[k].extend,
                  label: divisionData[k].label,
                  value: divisionData[k].value
                });
              } else {
                exist = false;
              }
            }
            totalNbAttendeesTraining = {
              title: divisionKeys.title,
              data: nbAttendeesData
            };
          }
        }
      }
    }
    data.global.main["totalNbAttendeesTraining"] = totalNbAttendeesTraining;
    return data;
  }

  /**
   * Get the number of workshops by month
   * @param data - the data fetched by the reader
   * @returns {*}
   */
  getTotalNbWorkshopsMonthly(data) {
    let totalNbWorkshopsMonthly = {};
    let projectName = "";
    let nbWorkshopsMonthlyData = [];
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(data.projectNames).length; i++) {
      projectName = Object.values(data.projectNames)[i];
      if (projectName !== "global") {
        for (let j = 0; j < Object.keys(data[projectName]).length; j++) {
          let subProject = Object.keys(data[projectName])[j];
          if (Object.keys(data[projectName][subProject]).includes("nbWorkshopsMonthly")) {
            let divisionKeys = data[projectName][subProject].nbWorkshopsMonthly;
            let divisionData = divisionKeys.data;
            let exist = false;
            // This loop is here to add the row in the right array cell in order to have a descending order
            for (let k = 0; k < divisionData.length; k++) {
              let divisionDate = divisionData[k].date;
              for (let l = 0; l < nbWorkshopsMonthlyData.length && !exist; l++) {
                // If the date of the current row is greater (newer) than the item in the array
                if (divisionDate.getFullYear() > nbWorkshopsMonthlyData[l].date.getFullYear() || divisionDate.getMonth() > nbWorkshopsMonthlyData[l].date.getFullYear() && nbWorkshopsMonthlyData[l].date.getFullYear() === divisionDate.getFullYear()) {
                  let nbWorkshopTemp = {
                    date: divisionData[k].date,
                    label: divisionData[k].label,
                    value: divisionData[k].value
                  };
                  let res = [];
                  res = res.concat(nbWorkshopsMonthlyData.splice(0, j));
                  res.push(nbWorkshopTemp);
                  res = res.concat(nbWorkshopsMonthlyData);
                  nbWorkshopsMonthlyData = res;
                  exist = true;
                }
                // If the date of the current row is equal to the date of the item in the array
                else if (divisionDate.getMonth() === nbWorkshopsMonthlyData[l].date.getMonth() && divisionDate.getFullYear() === nbWorkshopsMonthlyData[l].date.getFullYear()) {
                    nbWorkshopsMonthlyData[l].value += divisionData[k].value;
                    exist = true;
                  }
              }
              // Otherwise, the current row is lower (older) than the last item of the array
              if (!exist) {
                nbWorkshopsMonthlyData.push({
                  date: divisionData[k].date,
                  label: divisionData[k].label,
                  value: divisionData[k].value
                });
              } else {
                exist = false;
              }
            }
            totalNbWorkshopsMonthly = {
              title: divisionKeys.title,
              data: nbWorkshopsMonthlyData
            };
          }
        }
      }
    }
    data.global.main["totalNbWorkshopsMonthly"] = totalNbWorkshopsMonthly;
    return data;
  }

  /**
   * Get the number of trainings
   * @param data - the data fetched by the reader
   * @returns {*}
   */
  getTotalNbTrainings(data) {
    let totalNbTrainings = 0;
    let title = "";
    let projectName = "";
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(data.projectNames).length; i++) {
      projectName = Object.values(data.projectNames)[i];
      if (projectName !== "global") {
        for (let j = 0; j < Object.keys(data[projectName]).length; j++) {
          let subProject = Object.keys(data[projectName])[j];
          if (Object.keys(data[projectName][subProject]).includes("nbTrainings")) {
            totalNbTrainings += data[projectName][subProject].nbTrainings.value;
            title = data[projectName][subProject].nbTrainings.title;
          }
        }
      }
    }
    data.global.main["totalNbTrainings"] = {
      title: title,
      value: totalNbTrainings
    };;
    return data;
  }

  /**
   * Get the number of participants by month and gender
   * @param data - the data fetched by the reader
   * @returns {*}
   */
  getTotalNbParticipantsGender(data) {
    let totalNbParticipants = {};
    let projectName = "";
    let nbParticipantsData = [];
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(data.projectNames).length; i++) {
      projectName = Object.values(data.projectNames)[i];
      if (projectName !== "global") {
        // Because we know that this kind of data is displayed in the category "community"
        if (Object.keys(data[projectName].community).includes("nbParticipantsGender")) {
          let divisionKeys = data[projectName].community.nbParticipantsGender;
          let divisionData = divisionKeys.data;
          let exist = false;
          // This loop is here to add the row in the right array cell in order to have a descending order
          for (let k = 0; k < divisionData.length; k++) {
            let divisionDate = divisionData[k].date;
            for (let l = 0; l < nbParticipantsData.length && !exist; l++) {
              // If the date of the current row is greater (newer) than the item in the array
              if (divisionDate.getFullYear() > nbParticipantsData[l].date.getFullYear() || divisionDate.getMonth() > nbParticipantsData[l].date.getFullYear() && nbParticipantsData[l].date.getFullYear() === divisionDate.getFullYear()) {
                let nbParticipantsTemp = {
                  date: divisionData[k].date,
                  label: divisionData[k].label,
                  female: divisionData[k].female,
                  male: divisionData[k].male
                };
                let res = [];
                res = res.concat(nbParticipantsData.splice(0, j));
                res.push(nbParticipantsTemp);
                res = res.concat(nbParticipantsData);
                nbParticipantsData = res;
                exist = true;
              }
              // If the date of the current row is equal to the date of the item in the array
              else if (divisionDate.getMonth() === nbParticipantsData[l].date.getMonth() && divisionDate.getFullYear() === nbParticipantsData[l].date.getFullYear()) {
                  nbParticipantsData[l].female += divisionData[k].female;
                  nbParticipantsData[l].male += divisionData[k].male;
                  exist = true;
                }
            }
            // Otherwise, the current row is lower (older) than the last item of the array
            if (!exist) {
              nbParticipantsData.push({
                date: divisionData[k].date,
                label: divisionData[k].label,
                female: divisionData[k].female,
                male: divisionData[k].male
              });
            } else {
              exist = false;
            }
          }
          totalNbParticipants = {
            title: divisionKeys.title,
            data: nbParticipantsData
          };
        }
      }
    }
    data.global.main["totalNbParticipantsGender"] = totalNbParticipants;
    return data;
  }

  /**
     * Get the number of participants by month (old/new)
     * @param data - the data fetched by the reader
     * @returns {*}
     */
  getTotalNbParticipantsNew(data) {
    let totalNbParticipants = {};
    let projectName = "";
    let nbParticipantsData = [];
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(data.projectNames).length; i++) {
      projectName = Object.values(data.projectNames)[i];
      if (projectName !== "global") {
        // Because we know that this kind of data is displayed in the category "community"
        if (Object.keys(data[projectName].community).includes("nbParticipantsNew")) {
          let divisionKeys = data[projectName].community.nbParticipantsNew;
          let divisionData = divisionKeys.data;
          let exist = false;
          // This loop is here to add the row in the right array cell in order to have a descending order
          for (let k = 0; k < divisionData.length; k++) {
            let divisionDate = divisionData[k].date;
            for (let l = 0; l < nbParticipantsData.length && !exist; l++) {
              // If the date of the current row is greater (newer) than the item in the array
              if (divisionDate.getFullYear() > nbParticipantsData[l].date.getFullYear() || divisionDate.getMonth() > nbParticipantsData[l].date.getFullYear() && nbParticipantsData[l].date.getFullYear() === divisionDate.getFullYear()) {
                let nbParticipantTemp = {
                  date: divisionData[k].date,
                  label: divisionData[k].label,
                  new: divisionData[k].new,
                  old: divisionData[k].old
                };
                let res = [];
                res = res.concat(nbParticipantsData.splice(0, j));
                res;push(nbParticipantTemp);
                res = res.concat(nbParticipantsData);
                nbParticipantsData = res;
                exist = true;
              }
              // If the date of the current row is equal to the date of the item in the array
              else if (divisionDate.getMonth() === nbParticipantsData[l].date.getMonth() && divisionDate.getFullYear() === nbParticipantsData[l].date.getFullYear()) {
                  nbParticipantsData[l].new += divisionData[k].new;
                  nbParticipantsData[l].old += divisionData[k].old;
                  exist = true;
                }
            }
            // Otherwise, the current row is lower (older) than the last item of the array
            if (!exist) {
              nbParticipantsData.push({
                date: divisionData[k].date,
                label: divisionData[k].label,
                new: divisionData[k].new,
                old: divisionData[k].old
              });
            } else {
              exist = false;
            }
          }
          totalNbParticipants = {
            title: divisionKeys.title,
            data: nbParticipantsData
          };
        }
      }
    }
    data.global.main["totalNbParticipantsNew"] = totalNbParticipants;
    return data;
  }

  /**
   * Get the number of participants by event type
   * @param data - the data fetched by the reader
   * @returns {*}
   */
  getTotalNbParticipantsType(data) {
    let totalNbParticipants = {};
    let projectName = "";
    let nbParticipantsData = [];
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(data.projectNames).length; i++) {
      projectName = Object.values(data.projectNames)[i];
      if (projectName !== "global") {
        // Because we know that this kind of data is displayed in the category "community"
        if (Object.keys(data[projectName].community).includes("nbParticipantsType")) {
          let divisionKeys = data[projectName].community.nbParticipantsType;
          let divisionData = divisionKeys.data;
          let exist = false;
          // This loop is here to add the row in the right array cell in order to have a descending order
          for (let k = 0; k < divisionData.length; k++) {
            for (let l = 0; l < nbParticipantsData.length && !exist; l++) {
              // If the type of the current row is equal to the one of the item in the array we're iterating on
              if (nbParticipantsData[l].label === divisionData[k].label) {
                nbParticipantsData[l].value += divisionData[k].value;
                exist = true;
              }
            }
            // Otherwise, the current row is lower (older) than the last item of the array
            if (!exist) {
              nbParticipantsData.push({
                label: divisionData[k].label,
                value: divisionData[k].value
              });
            } else {
              exist = false;
            }
          }
          totalNbParticipants = {
            title: divisionKeys.title,
            data: nbParticipantsData
          };
        }
      }
    }
    data.global.main["totalNbParticipantsType"] = totalNbParticipants;
    return data;
  }

  /**
   * Get the number of events conducted
   * @param data - the data fetched by the reader
   * @returns {*}
   */
  getTotalNbEvents(data) {
    let totalEdits = 0;
    let title = "";
    let projectName = "";
    let subProject = "";
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(data.projectNames).length; i++) {
      projectName = Object.values(data.projectNames)[i];
      if (projectName !== "global") {
        for (let j = 0; j < Object.keys(data[projectName]).length; j++) {
          subProject = Object.keys(data[projectName])[j];
          if (Object.keys(data[projectName][subProject]).includes("nbEvents")) {
            totalEdits += data[projectName][subProject].nbEvents.value;
            title = data[projectName][subProject].nbEvents.title;
          }
        }
      }
    }
    data.global.main["totalNbEvents"] = {
      title: title,
      value: totalEdits
    };
    return data;
  }
}

exports.default = Global;