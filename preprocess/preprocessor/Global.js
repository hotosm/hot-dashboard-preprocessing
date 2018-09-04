import AbstractProject from './AbstractProject'

class Global extends AbstractProject{
  constructor(generalData) {
    super(generalData);
    this.functions.push("getUsageOfHotData");
    this.functions.push("getTotalMapathons");
    this.functions.push("getTotalTrainings");
    this.functions.push("getTotalAttendeesAndInstitutions");
    this.functions.push("getTotalMapEdits");
  }

  process() {
    for (let i = 0; i < this.functions.length; i++) {
      //Calls every function
      this[this.functions[i]](this.data);
    }
    return this.data;
  }

  /** Get the number of total event per year **/
  getUsageOfHotData(generalData) {
    let getYearPattern = (year) => {
      return new RegExp(year + '-([0-9]{2})-([0-9]{2})');   // English date format
    };

    let usageOfHotData = {};
    for (let i = 2014; i <= 2018; i++) {
      usageOfHotData["data"+i] = generalData.global.awareness.totalEvents
          .filter(row => row.date && row.date.match(getYearPattern(i))).length;
    }
    generalData.global.main["usageOfHotData"] = usageOfHotData;
    return generalData;
  }

  /** Get the number of total people trained **/
  getTotalMapathons(generalData) {
    let totalMapathons = generalData.global.awareness.totalEvents.length;
    generalData.global.main["totalMapathons"] = totalMapathons;
    return generalData;
  }

  /** Get the number of trainings **/
  getTotalTrainings(generalData) {
    let totalTrainings = 0;
    let totalTrainingsMen = 0;
    let totalTrainingsWomen = 0;
    let totalMonthlyDivision = {
      title: "Total monthly training (last 6 months)",
      data: {}
    };
    let projectName = "";
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(generalData).length; i++) {
      projectName = Object.keys(generalData)[i];
      if (projectName !== "global") {
        for (let j = 0; j < Object.keys(generalData[projectName]).length; j++) {
          let subProject = Object.keys(generalData[projectName])[j];
          if (Object.keys(generalData[projectName][subProject]).includes("trainings")) {
            totalTrainings += generalData[projectName][subProject].trainings.total;
            totalTrainingsMen += generalData[projectName][subProject].trainings.men;
            totalTrainingsWomen += generalData[projectName][subProject].trainings.women;
          }
          if (Object.keys(generalData[projectName][subProject]).includes("monthlyDivision")) {
            let divisionKeys = Object.keys(generalData[projectName][subProject].monthlyDivision.data);
            let counter = 0;
            let notfound = true;
            for (let k = 0; k < divisionKeys.length && counter < 12; k++) {
              for (let l = 0; l < divisionKeys.length && counter < 12 && notfound; l++) {
                if (totalMonthlyDivision.data[divisionKeys[k]] === undefined) {
                  totalMonthlyDivision.data[divisionKeys[k]] = {
                    label: generalData[projectName][subProject].monthlyDivision.data[divisionKeys[k]].label,
                    value: generalData[projectName][subProject].monthlyDivision.data[divisionKeys[k]].value
                  };
                  counter++;
                  notfound = false;
                }
                else if (totalMonthlyDivision.data[divisionKeys[l]].label === generalData[projectName][subProject].monthlyDivision.data[divisionKeys[k]].label) {
                  totalMonthlyDivision.data[divisionKeys[l]] = {
                    label: totalMonthlyDivision.data[divisionKeys[l]].label,
                    value: totalMonthlyDivision.data[divisionKeys[l]].value + generalData[projectName][subProject].monthlyDivision.data[divisionKeys[k]].value
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
    generalData.global.capacitybuilding["monthlyDivision"] = totalMonthlyDivision;
    generalData.global.capacitybuilding["trainings"] = {
      total: totalTrainings,
      men: totalTrainingsMen,
      women: totalTrainingsWomen
    };
    return generalData;
  }

  /** Get the number of people and organizations trained during the workshops **/
  getTotalAttendeesAndInstitutions(generalData) {
    let projectName = "";
    let totalAttendees = [];
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(generalData).length; i++) {
      projectName = Object.keys(generalData)[i];
      if (projectName !== "global") {
        for (let j = 0; j < Object.keys(generalData[projectName]).length; j++) {
          let subProject = Object.keys(generalData[projectName])[j];
          if (Object.keys(generalData[projectName][subProject]).includes("attendeesAndInstitutions")) {
            let divisionKeys = generalData[projectName][subProject].attendeesAndInstitutions;
            let exist = false;
            // This loop is here to add the row in the right array cell in order to have a descending order
            for (let k = 0; k < divisionKeys.length; k++) {
              for (let l = 0; l < totalAttendees.length && !exist; l++) {
                // If the date of the current row is greater (newer) than the item in the array
                if (divisionKeys[k].date.getFullYear() > totalAttendees[l].date.getFullYear() || (divisionKeys[k].date.getMonth() > totalAttendees[l].date.getFullYear() && totalAttendees[l].date.getFullYear() === divisionKeys[k].date.getFullYear())) {
                  let res = [];
                  res.push(totalAttendees.splice(0, j));
                  res = res.concat(divisionKeys[k]);
                  res = res.concat(totalAttendees);
                  totalAttendees = res;
                  exist = true;
                }
                // If the date of the current row is equal to the date of the item in the array
                else if (divisionKeys[k].date.getMonth() === totalAttendees[l].date.getMonth() && divisionKeys[k].date.getFullYear() === totalAttendees[l].date.getFullYear()) {
                  totalAttendees[l].nbAttendees += divisionKeys[k]["Number attendees"];
                  totalAttendees[l].nbInstitutions += divisionKeys[k]["Number institutions"];
                  exist = true;
                }
              }
              // Otherwise, the current row is lower (older) than the last item of the array
              if (!exist) {
                totalAttendees.push(divisionKeys[k]);
              }
              else {
                exist = false;
              }
            }
          }
        }
      }
    }
    generalData.global.capacitybuilding["attendeesAndInstitutions"] = totalAttendees;
    return generalData;
  }

  /** Get the number of map edits **/
  getTotalMapEdits(generalData) {
    let totalEdits = 0;
    let projectName = "";
    //We're going through every project except global which is this one
    for (let i = 0; i < Object.keys(generalData).length; i++) {
      projectName = Object.keys(generalData)[i];
      if (projectName !== "global") {
        for (let j = 0; j < Object.keys(generalData[projectName]).length; j++) {
          let subProject = Object.keys(generalData[projectName])[j];
          if (Object.keys(generalData[projectName][subProject]).includes("edits")) {
            totalEdits += generalData[projectName][subProject].edits;
          }
        }
      }
    }
    generalData.global.main["edits"] = totalEdits;
    return generalData;
  }
}

export default Global;
