import AbstractProject from "./AbstractProject"

// This class is the processing the data for the Global project
class Global extends AbstractProject{
  constructor(generalData) {
    super(generalData);
    this.functions.push("getTotalSubwards");
    this.functions.push("getTotalTrainings");
    this.functions.push("getTotalAttendeesAndInstitutions");
    this.functions.push("getTotalMapEdits");
    this.functions.push("getTotalOrganizationsSupported");
    this.functions.push("getTotalNbAttendeesMonthly");
    this.functions.push("getTotalNbAttendeesInstitutions");
    this.functions.push("getTotalNbAttendeesTraining");
    this.functions.push("getTotalNbWorkshops");
    this.functions.push("getTotalNbParticipantsGender");
    this.functions.push("getTotalNbParticipantsNew");
  }

  /**
   * Get the number of events (mapathons) (by year)
   * @param data - the data fetched by the reader
   * @returns {*}
   */
  getTotalSubwards(data) {
    let totalSubwardsCompleted = {};
    let projectName = "";
    let subwardsData = [];
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(data).length; i++) {
      projectName = Object.keys(data)[i];
      if (projectName !== "global") {
        for (let j = 0; j < Object.keys(data[projectName]).length; j++) {
          let subProject = Object.keys(data[projectName])[j];
          if (Object.keys(data[projectName][subProject]).includes("nbSubwardsCompleted")) {
            let divisionKeys = data[projectName].mapping.nbSubwardsCompleted;
            let divisionData = divisionKeys.data;
            let exist = false;
            // This loop is here to add the row in the right array cell in order to have a descending order
            for (let k = 0; k < divisionData.length; k++) {
              let divisionDate = divisionData[k].date;
              for (let l = 0; l < subwardsData.length && !exist; l++) {
                // If the date of the current row is greater (newer) than the item in the array
                if (divisionDate.getFullYear() > subwardsData[l].date.getFullYear() ||
                    (divisionDate.getMonth() > subwardsData[l].date.getFullYear() &&
                        subwardsData[l].date.getFullYear() === divisionDate.getFullYear())) {
                  let subwardTemp = {
                    extend: divisionData[k].extend,
                    label: divisionData[k].label,
                    date: divisionData[k].date,
                    value: divisionData[k].value
                  };
                  let res = [];
                  res = res.concat(subwardsData.splice(0, j));
                  res = res.push(subwardTemp);
                  res = res.concat(subwardsData);
                  subwardsData = res;
                  exist = true;
                }
                // If the date of the current row is equal to the date of the item in the array
                else if (divisionDate.getMonth() === subwardsData[l].date.getMonth() &&
                    divisionDate.getFullYear() === subwardsData[l].date.getFullYear()) {
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
              }
              else {
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
    data.global.mapping["totalSubwardsCompleted"] = totalSubwardsCompleted;
    return data;
  }

  /** Get the number of trainings **/
  // getTotalTrainings(data) {
  //   let totalTrainings = 0;
  //   let totalTrainingsMen = 0;
  //   let totalTrainingsWomen = 0;
  //   let totalMonthlyDivision = {
  //     title: "Total monthly training (last 6 months)",
  //     data: {}
  //   };
  //   let projectName = "";
  //   //We're going through every project except global which is this one
  //   for (let i = 0; i < Object.keys(data).length; i++) {
  //     projectName = Object.keys(data)[i];
  //     if (projectName !== "global") {
  //       for (let j = 0; j < Object.keys(data[projectName]).length; j++) {
  //         let subProject = Object.keys(data[projectName])[j];
  //         if (Object.keys(data[projectName][subProject]).includes("trainings")) {
  //           totalTrainings += data[projectName][subProject].trainings.total;
  //           totalTrainingsMen += data[projectName][subProject].trainings.men;
  //           totalTrainingsWomen += data[projectName][subProject].trainings.women;
  //         }
  //         if (Object.keys(data[projectName][subProject]).includes("monthlyDivision")) {
  //           let divisionKeys = Object.keys(data[projectName][subProject].monthlyDivision.data);
  //           let counter = 0;
  //           let notfound = true;
  //           for (let k = 0; k < divisionKeys.length && counter < 12; k++) {
  //             for (let l = 0; l < divisionKeys.length && counter < 12 && notfound; l++) {
  //               if (totalMonthlyDivision.data[divisionKeys[k]] === undefined) {
  //                 totalMonthlyDivision.data[divisionKeys[k]] = {
  //                   label: data[projectName][subProject].monthlyDivision.data[divisionKeys[k]].label,
  //                   value: data[projectName][subProject].monthlyDivision.data[divisionKeys[k]].value
  //                 };
  //                 counter++;
  //                 notfound = false;
  //               }
  //               else if (totalMonthlyDivision.data[divisionKeys[l]].label === data[projectName][subProject].monthlyDivision.data[divisionKeys[k]].label) {
  //                 totalMonthlyDivision.data[divisionKeys[l]] = {
  //                   label: totalMonthlyDivision.data[divisionKeys[l]].label,
  //                   value: totalMonthlyDivision.data[divisionKeys[l]].value + data[projectName][subProject].monthlyDivision.data[divisionKeys[k]].value
  //                 };
  //                 counter++;
  //                 notfound = false;
  //               }
  //             }
  //             notfound = true;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   data.global.capacitybuilding["monthlyDivision"] = totalMonthlyDivision;
  //   data.global.capacitybuilding["trainings"] = {
  //     total: totalTrainings,
  //     men: totalTrainingsMen,
  //     women: totalTrainingsWomen
  //   };
  //   return data;
  // }

  /** Get the number of people and organizations trained during the workshops **/
  // getTotalAttendeesAndInstitutions(data) {
  //   let projectName = "";
  //   let totalAttendees = {
  //     titleAttendees: "",
  //     titleInstitutions: "",
  //     titleWorkshop: "",
  //     workshops: 0,
  //     data: []
  //   };
  //   let attendeesData = [];
  //   //We're going through every project except global which is this one
  //   for (let i = 0; i < Object.keys(data).length; i++) {
  //     projectName = Object.keys(data)[i];
  //     if (projectName !== "global") {
  //       for (let j = 0; j < Object.keys(data[projectName]).length; j++) {
  //         let subProject = Object.keys(data[projectName])[j];
  //         if (Object.keys(data[projectName][subProject]).includes("attendeesAndInstitutions")) {
  //           let divisionKeys = data[projectName][subProject].attendeesAndInstitutions;
  //           let divisionData = divisionKeys.data;
  //           let exist = false;
  //           // This loop is here to add the row in the right array cell in order to have a descending order
  //           for (let k = 0; k < divisionData.length; k++) {
  //             for (let l = 0; l < attendeesData.length && !exist; l++) {
  //               // If the date of the current row is greater (newer) than the item in the array
  //               if (divisionData[k].date.getFullYear() > attendeesData[l].date.getFullYear() ||
  //                   (divisionData[k].date.getMonth() > attendeesData[l].date.getFullYear() &&
  //                       attendeesData[l].date.getFullYear() === divisionData[k].date.getFullYear())) {
  //                 let attendeesTemp = {
  //                   extend: divisionData[k].extend,
  //                   label: divisionData[k].label,
  //                   date: divisionData[k].date,
  //                   value: divisionData[k].value
  //                 };
  //                 let res = [];
  //                 res = res.concat(attendeesData.splice(0, j));
  //                 res = res.push(attendeesTemp);
  //                 res = res.concat(attendeesData);
  //                 attendeesData = res;
  //                 exist = true;
  //               }
  //               // If the date of the current row is equal to the date of the item in the array
  //               else if (divisionData[k].date.getMonth() === attendeesData[l].date.getMonth() &&
  //                   divisionData[k].date.getFullYear() === attendeesData[l].date.getFullYear()) {
  //                 attendeesData[l].nbAttendees += divisionData[k]["Number attendees"];
  //                 attendeesData[l].nbInstitutions += divisionData[k]["Number institutions"];
  //                 exist = true;
  //               }
  //             }
  //             // Otherwise, the current row is lower (older) than the last item of the array
  //             if (!exist) {
  //               attendeesData.push({
  //                 extend: divisionData[k].extend,
  //                 label: divisionData[k].label,
  //                 date: divisionData[k].date,
  //                 value: divisionData[k].value
  //               });
  //             }
  //             else {
  //               exist = false;
  //             }
  //           }
  //           totalAttendees = {
  //             titleAttendees: divisionKeys.titleAttendees,
  //             titleInstitutions: divisionKeys.titleInstitutions,
  //             titleWorkshop: divisionKeys.titleWorkshop,
  //             workshops: totalAttendees.workshops + divisionKeys.workshops,
  //             data: attendeesData
  //           };
  //         }
  //       }
  //     }
  //   }
  //   data.global.capacitybuilding["attendeesAndInstitutions"] = totalAttendees;
  //   return data;
  // }

  /** Get the number of map edits **/
  getTotalMapEdits(data) {
    let totalEdits = 0;
    let projectName = "";
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(data).length; i++) {
      projectName = Object.keys(data)[i];
      if (projectName !== "global") {
        for (let j = 0; j < Object.keys(data[projectName]).length; j++) {
          let subProject = Object.keys(data[projectName])[j];
          if (Object.keys(data[projectName][subProject]).includes("nbedits")) {
            totalEdits += data[projectName][subProject].nbedits.data;
          }
        }
      }
    }
    data.global.mapping["totalEditsAggregated"] = totalEdits;
    return data;
  }

  /** Get the number of organizations supported **/
  getTotalOrganizationsSupported(data) {
    let totalOrganizationsSupported = 0;
    let projectName = "";
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(data).length; i++) {
      projectName = Object.keys(data)[i];
      if (projectName !== "global") {
        for (let j = 0; j < Object.keys(data[projectName]).length; j++) {
          let subProject = Object.keys(data[projectName])[j];
          if (Object.keys(data[projectName][subProject]).includes("nborganizations")) {
            totalOrganizationsSupported += data[projectName][subProject].nborganizations.data.length;
          }
        }
      }
    }
    data.global.capacitybuilding["totalOrganizationsSupported"] = {
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
    for (let i = 0; i < Object.keys(data).length; i++) {
      projectName = Object.keys(data)[i];
      nbAttendeesData = [];
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
                if (divisionDate.getFullYear() > nbAttendeesData[l].date.getFullYear() ||
                    (divisionDate.getMonth() > nbAttendeesData[l].date.getFullYear() &&
                        nbAttendeesData[l].date.getFullYear() === divisionDate.getFullYear())) {
                  let res = [];
                  res = res.concat(nbAttendeesData.splice(0, j));
                  res = res.concat(divisionData[k]);
                  res = res.concat(nbAttendeesData);
                  nbAttendeesData = res;
                  exist = true;
                }
                // If the date of the current row is equal to the date of the item in the array
                else if (divisionDate.getMonth() === nbAttendeesData[l].date.getMonth() &&
                    divisionDate.getFullYear() === nbAttendeesData[l].date.getFullYear()) {
                  nbAttendeesData[l].value += divisionData[k].value;
                  exist = true;
                }
              }
              // Otherwise, the current row is lower (older) than the last item of the array
              if (!exist) {
                nbAttendeesData.push({
                  label : divisionData[k].label,
                  date: divisionDate,
                  value: divisionData[k].value
                });
              }
              else {
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
    data.global.capacitybuilding["totalNbAttendeesMonthly"] = totalNbAttendeesMonthly;
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
    for (let i = 0; i < Object.keys(data).length; i++) {
      projectName = Object.keys(data)[i];
      nbAttendeesData = [];
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
                nbAttendeesData.push(divisionData[k]);
              }
              else {
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
    data.global.capacitybuilding["totalNbAttendeesInstitutions"] = totalNbAttendeesInstitutions;
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
    for (let i = 0; i < Object.keys(data).length; i++) {
      projectName = Object.keys(data)[i];
      nbAttendeesData = [];
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
                nbAttendeesData.push(divisionData[k]);
              }
              else {
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
    data.global.capacitybuilding["totalNbAttendeesTraining"] = totalNbAttendeesTraining;
    return data;
  }

  /**
   * Get the number of workshops by month
   * @param data - the data fetched by the reader
   * @returns {*}
   */
  getTotalNbWorkshops(data) {
    let totalNbWorkshops = {};
    let projectName = "";
    let nbWorkshopsData = [];
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(data).length; i++) {
      projectName = Object.keys(data)[i];
      nbWorkshopsData = [];
      if (projectName !== "global") {
        for (let j = 0; j < Object.keys(data[projectName]).length; j++) {
          let subProject = Object.keys(data[projectName])[j];
          if (Object.keys(data[projectName][subProject]).includes("nbWorkshops")) {
            let divisionKeys = data[projectName][subProject].nbWorkshops;
            let divisionData = divisionKeys.data;
            let exist = false;
            // This loop is here to add the row in the right array cell in order to have a descending order
            for (let k = 0; k < divisionData.length; k++) {
              let divisionDate = divisionData[k].date;
              for (let l = 0; l < nbWorkshopsData.length && !exist; l++) {
                // If the date of the current row is greater (newer) than the item in the array
                if (divisionDate.getFullYear() > nbWorkshopsData[l].date.getFullYear() ||
                    (divisionDate.getMonth() > nbWorkshopsData[l].date.getFullYear() &&
                        nbWorkshopsData[l].date.getFullYear() === divisionDate.getFullYear())) {
                  let res = [];
                  res = res.concat(nbWorkshopsData.splice(0, j));
                  res = res.concat(divisionData[k]);
                  res = res.concat(nbWorkshopsData);
                  nbWorkshopsData = res;
                  exist = true;
                }
                // If the date of the current row is equal to the date of the item in the array
                else if (divisionDate.getMonth() === nbWorkshopsData[l].date.getMonth() &&
                    divisionDate.getFullYear() === nbWorkshopsData[l].date.getFullYear()) {
                  nbWorkshopsData[l].value += divisionData[k].value;
                  exist = true;
                }
              }
              // Otherwise, the current row is lower (older) than the last item of the array
              if (!exist) {
                nbWorkshopsData.push(divisionData[k]);
              }
              else {
                exist = false;
              }
            }
            totalNbWorkshops = {
              title: divisionKeys.title,
              data: nbWorkshopsData
            };
          }
        }
      }
    }
    data.global.capacitybuilding["totalNbWorkshops"] = totalNbWorkshops;
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
    for (let i = 0; i < Object.keys(data).length; i++) {
      projectName = Object.keys(data)[i];
      nbParticipantsData = [];
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
              if (divisionDate.getFullYear() > nbParticipantsData[l].date.getFullYear() ||
                  (divisionDate.getMonth() > nbParticipantsData[l].date.getFullYear() &&
                      nbParticipantsData[l].date.getFullYear() === divisionDate.getFullYear())) {
                let res = [];
                res = res.concat(nbParticipantsData.splice(0, j));
                res = res.concat(divisionData[k]);
                res = res.concat(nbParticipantsData);
                nbParticipantsData = res;
                exist = true;
              }
              // If the date of the current row is equal to the date of the item in the array
              else if (divisionDate.getMonth() === nbParticipantsData[l].date.getMonth() &&
                  divisionDate.getFullYear() === nbParticipantsData[l].date.getFullYear()) {
                nbParticipantsData[l].female += divisionData[k].female;
                nbParticipantsData[l].male += divisionData[k].male;
                exist = true;
              }
            }
            // Otherwise, the current row is lower (older) than the last item of the array
            if (!exist) {
              nbParticipantsData.push(divisionData[k]);
            }
            else {
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
    data.global.community["totalNbParticipantsGender"] = totalNbParticipants;
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
    for (let i = 0; i < Object.keys(data).length; i++) {
      projectName = Object.keys(data)[i];
      nbParticipantsData = [];
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
              if (divisionDate.getFullYear() > nbParticipantsData[l].date.getFullYear() ||
                  (divisionDate.getMonth() > nbParticipantsData[l].date.getFullYear() &&
                      nbParticipantsData[l].date.getFullYear() === divisionDate.getFullYear())) {
                let res = [];
                res = res.concat(nbParticipantsData.splice(0, j));
                res = res.concat(divisionData[k]);
                res = res.concat(nbParticipantsData);
                nbParticipantsData = res;
                exist = true;
              }
              // If the date of the current row is equal to the date of the item in the array
              else if (divisionDate.getMonth() === nbParticipantsData[l].date.getMonth() &&
                  divisionDate.getFullYear() === nbParticipantsData[l].date.getFullYear()) {
                nbParticipantsData[l].new += divisionData[k].new;
                nbParticipantsData[l].old += divisionData[k].old;
                exist = true;
              }
            }
            // Otherwise, the current row is lower (older) than the last item of the array
            if (!exist) {
              nbParticipantsData.push(divisionData[k]);
            }
            else {
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
    data.global.community["totalNbParticipantsNew"] = totalNbParticipants;
    return data;
  }
}

export default Global;
