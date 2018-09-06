import AbstractProject from './AbstractProject'

// This class is the processing the data for the RamaniHuria project
class Global extends AbstractProject{
  constructor(generalData) {
    super(generalData);
    this.functions.push("getUsageOfHotData");
    this.functions.push("getTotalMapathons");
    this.functions.push("getTotalTrainings");
    this.functions.push("getTotalAttendeesAndInstitutions");
    this.functions.push("getTotalMapEdits");
    this.functions.push("getTotalSubwards");
  }

  /**
   * Get the number of events (mapathons) (by year)
   * HOT is used every time an event is added
   * @param data - the data fetched by the reader
   * @returns {*}
   */
  getUsageOfHotData(data) {
    // This function is used to convert a year to a regex expression
    let getYearPattern = (year) => {
      return new RegExp(year + '-([0-9]{2})-([0-9]{2})');   // English date format
    };

    let usageOfHotData = {};
    let yearMax = (new Date().getFullYear());
    let yearMin = yearMax;
    data.global.mappingcommunity.totalEvents.data.filter(function(row) {
      let rowYear = (new Date(row.date).getFullYear());
      if (rowYear<yearMin) {
        yearMin = rowYear;
      }
    });
    for (; yearMin <= yearMax; yearMin++) {
      // Each year will be a set of data, every event has a date so each year will store the number of event (mapathon) that took place this year
      usageOfHotData[yearMax-yearMin] = data.global.mappingcommunity.totalEvents.data
          .filter(row => row.date && row.date.match(getYearPattern(yearMin))).length;
    }
    data.global.main["usageOfHotData"] = usageOfHotData;
    return data;
  }

  /**
   * Get the number of events (mapathons) (by year)
   * HOT is used every time an event is added
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
      subwardsData = [];
      if (projectName !== "global") {
        for (let j = 0; j < Object.keys(data[projectName]).length; j++) {
          let subProject = Object.keys(data[projectName])[j];
          if (Object.keys(data[projectName][subProject]).includes("nbsubwardscompleted")) {
            let divisionKeys = data[projectName][subProject].nbsubwardscompleted;
            let divisionData = divisionKeys.data;
            let exist = false;
            // This loop is here to add the row in the right array cell in order to have a descending order
            for (let k = 0; k < divisionData.length; k++) {
              let divisionDate = (new Date(divisionData[k].Date));
              for (let l = 0; l < subwardsData.length && !exist; l++) {
                // If the date of the current row is greater (newer) than the item in the array
                if (divisionDate.getFullYear() > subwardsData[l].date.getFullYear() ||
                    (divisionDate.getMonth() > subwardsData[l].date.getFullYear() &&
                        subwardsData[l].date.getFullYear() === divisionDate.getFullYear())) {
                  let res = [];
                  res.push(subwardsData.splice(0, j));
                  res = res.concat(divisionData[k]);
                  res = res.concat(subwardsData);
                  subwardsData = res;
                  exist = true;
                }
                // If the date of the current row is equal to the date of the item in the array
                else if (divisionDate.getMonth() === subwardsData[l].date.getMonth() &&
                    divisionDate.getFullYear() === subwardsData[l].date.getFullYear()) {
                  subwardsData[l].TOTAL += divisionData[k].TOTAL;
                  exist = true;
                }
              }
              // Otherwise, the current row is lower (older) than the last item of the array
              if (!exist) {
                subwardsData.push({
                  label : divisionDate.toUTCString().split(" ", 3)[2]+" "+divisionDate.toUTCString().split(" ", 4)[3],
                  date: divisionDate,
                  total: divisionData[k].TOTAL
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
    data.global.main["totalSubwardsCompleted"] = totalSubwardsCompleted;
    return data;
  }

  /**
   * Get the number of mapathons done
   * @param data - the data fetched by the reader
   * @returns {object} The data with the attribute "totalMapathons" which will be used to display the data associated
   */
  getTotalMapathons(data) {
    let totalMapathons = {
      // Each event is a mapathon so the number of mapathons is the length of the array of events
      data : data.global.mappingcommunity.totalEvents.data.length,
      title : data.global.mappingcommunity.totalEvents.title
    };
    data.global.main["totalMapathons"] = totalMapathons;
    return data;
  }

  /** Get the number of trainings **/
  getTotalTrainings(data) {
    let totalTrainings = 0;
    let totalTrainingsMen = 0;
    let totalTrainingsWomen = 0;
    let totalMonthlyDivision = {
      title: "Total monthly training (last 6 months)",
      data: {}
    };
    let projectName = "";
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(data).length; i++) {
      projectName = Object.keys(data)[i];
      if (projectName !== "global") {
        for (let j = 0; j < Object.keys(data[projectName]).length; j++) {
          let subProject = Object.keys(data[projectName])[j];
          if (Object.keys(data[projectName][subProject]).includes("trainings")) {
            totalTrainings += data[projectName][subProject].trainings.total;
            totalTrainingsMen += data[projectName][subProject].trainings.men;
            totalTrainingsWomen += data[projectName][subProject].trainings.women;
          }
          if (Object.keys(data[projectName][subProject]).includes("monthlyDivision")) {
            let divisionKeys = Object.keys(data[projectName][subProject].monthlyDivision.data);
            let counter = 0;
            let notfound = true;
            for (let k = 0; k < divisionKeys.length && counter < 12; k++) {
              for (let l = 0; l < divisionKeys.length && counter < 12 && notfound; l++) {
                if (totalMonthlyDivision.data[divisionKeys[k]] === undefined) {
                  totalMonthlyDivision.data[divisionKeys[k]] = {
                    label: data[projectName][subProject].monthlyDivision.data[divisionKeys[k]].label,
                    value: data[projectName][subProject].monthlyDivision.data[divisionKeys[k]].value
                  };
                  counter++;
                  notfound = false;
                }
                else if (totalMonthlyDivision.data[divisionKeys[l]].label === data[projectName][subProject].monthlyDivision.data[divisionKeys[k]].label) {
                  totalMonthlyDivision.data[divisionKeys[l]] = {
                    label: totalMonthlyDivision.data[divisionKeys[l]].label,
                    value: totalMonthlyDivision.data[divisionKeys[l]].value + data[projectName][subProject].monthlyDivision.data[divisionKeys[k]].value
                  };
                  counter++;
                  notfound = false;
                }
              }
              notfound = true;
            }
          }
        }
      }
    }
    data.global.capacitybuilding["monthlyDivision"] = totalMonthlyDivision;
    data.global.capacitybuilding["trainings"] = {
      total: totalTrainings,
      men: totalTrainingsMen,
      women: totalTrainingsWomen
    };
    return data;
  }

  /** Get the number of people and organizations trained during the workshops **/
  getTotalAttendeesAndInstitutions(data) {
    let projectName = "";
    let totalAttendees = {
      titleAttendees: "",
      titleInstitutions: "",
      titleWorkshop: "",
      workshops: 0,
      data: []
    };
    let attendeesData = [];
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(data).length; i++) {
      projectName = Object.keys(data)[i];
      attendeesData = [];
      if (projectName !== "global") {
        for (let j = 0; j < Object.keys(data[projectName]).length; j++) {
          let subProject = Object.keys(data[projectName])[j];
          if (Object.keys(data[projectName][subProject]).includes("attendeesAndInstitutions")) {
            let divisionKeys = data[projectName][subProject].attendeesAndInstitutions;
            let divisionData = divisionKeys.data;
            let exist = false;
            // This loop is here to add the row in the right array cell in order to have a descending order
            for (let k = 0; k < divisionData.length; k++) {
              for (let l = 0; l < attendeesData.length && !exist; l++) {
                // If the date of the current row is greater (newer) than the item in the array
                if (divisionData[k].date.getFullYear() > attendeesData[l].date.getFullYear() ||
                    (divisionData[k].date.getMonth() > attendeesData[l].date.getFullYear() &&
                        attendeesData[l].date.getFullYear() === divisionData[k].date.getFullYear())) {
                  let res = [];
                  res.push(attendeesData.splice(0, j));
                  res = res.concat(divisionData[k]);
                  res = res.concat(attendeesData);
                  attendeesData = res;
                  exist = true;
                }
                // If the date of the current row is equal to the date of the item in the array
                else if (divisionData[k].date.getMonth() === attendeesData[l].date.getMonth() &&
                    divisionData[k].date.getFullYear() === attendeesData[l].date.getFullYear()) {
                  attendeesData[l].nbAttendees += divisionData[k]["Number attendees"];
                  attendeesData[l].nbInstitutions += divisionData[k]["Number institutions"];
                  exist = true;
                }
              }
              // Otherwise, the current row is lower (older) than the last item of the array
              if (!exist) {
                attendeesData.push(divisionData[k]);
              }
              else {
                exist = false;
              }
            }
            totalAttendees = {
              titleAttendees: divisionKeys.titleAttendees,
              titleInstitutions: divisionKeys.titleInstitutions,
              titleWorkshop: divisionKeys.titleWorkshop,
              workshops: totalAttendees.workshops + divisionKeys.workshops,
              data: attendeesData
            };
          }
        }
      }
    }
    data.global.capacitybuilding["attendeesAndInstitutions"] = totalAttendees;
    return data;
  }

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
    data.global.main["totalEditsAggregated"] = totalEdits;
    return data;
  }
}

export default Global;
