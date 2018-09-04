import AbstractProject from './AbstractProject'

class RamaniHuria extends AbstractProject{
  constructor(generalData) {
    super(generalData);
    // this.functions.push("getPeopleTrained");
    // this.functions.push("getPeopleTrainedMonthly");
    this.functions.push("getAttendeesAndInstitutions");
  }

  process() {
    for (let i = 0; i < this.functions.length; i++) {
      //Calls every function
      this[this.functions[i]](this.data);
    }
    return this.data;
  }

  /** Get the number of attendees and of institutions trained during the workshops (by month) **/
  getAttendeesAndInstitutions(data) {
    let attendees = data.capacitybuilding.nbattendees;
    let attendeesArray = [];
    let exist = false;
    for (let i = 0; i < attendees.length; i++) {
      let date = (new Date(attendees[i]["End date"]));
      // This loop is here to add the row in the right array cell in order to have a descending order
      for (let j = 0; j < attendeesArray.length && !exist; j++) {
        // If the date of the current row is greater (newer) than the item in the array
        if (date.getFullYear() > attendeesArray[j].date.getFullYear() || (date.getMonth() > attendeesArray[j].date.getMonth() && attendeesArray[j].date.getFullYear() === date.getFullYear())) {
          let attendeesTemp = [];
          attendeesTemp.push({
            date : date,
            label : date.toUTCString().split(" ", 3)[2]+" "+date.toUTCString().split(" ", 4)[3],
            nbAttendees: attendees[i]["Number attendees"],
            nbInstitutions: attendees[i]["Number institutions"],
          });
          let res = [];
          res = attendeesArray.splice(0, j);
          res = res.concat(attendeesTemp);
          res = res.concat(attendeesArray);
          attendeesArray = res;
          exist = true;
        }
        // If the date of the current row is equal to the date of the item in the array
        else if (attendeesArray[j].date.getMonth() === date.getMonth() && attendeesArray[j].date.getFullYear() === date.getFullYear()) {
          attendeesArray[j].nbAttendees += attendees[i]["Number attendees"];
          attendeesArray[j].nbInstitutions += attendees[i]["Number institutions"];
          exist = true;
        }
      }
      // Otherwise, the current row is lower (older) than the last item of the array
      if(!exist) {
        attendeesArray.push({
          date : date,
          label : date.toUTCString().split(" ", 3)[2]+" "+date.toUTCString().split(" ", 4)[3],
          nbAttendees: attendees[i]["Number attendees"],
          nbInstitutions: attendees[i]["Number institutions"],
        });
      }
      else {
        exist = false;
      }
    }
    // We store the data calculated in the data stored on the rawdata
    data.capacitybuilding["attendeesAndInstitutions"] = attendeesArray;
    return data;
  }

  /** Get the number of people trained by gender and in total **/
  getPeopleTrained(data) {
    let nbPeopleTrained = data.capacitybuilding.nbtrainings;
    let genderDivisionMen = 0;
    let genderDivisionWomen = 0;
    for (let i = 0; i < nbPeopleTrained.length; i++) {
      genderDivisionMen += nbPeopleTrained[i].male;
      genderDivisionWomen += nbPeopleTrained[i].female;
    }
    data.capacitybuilding["trainings"] = {
      men: genderDivisionMen,
      women: genderDivisionWomen,
      total: genderDivisionMen+genderDivisionWomen
    };
    return data;
  }

  /** Get the number of people trained monthly */
  getPeopleTrainedMonthly(data) {
    let nbPeopleTrained = data.capacitybuilding.nbtrainings;
    let getYearPattern = (month, year) => {
      return new RegExp('([0-9]{2})/' + month + '/' + year);   // French date format
    };
    const currentDate = (new Date());
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    let lastMonth = currentMonth;
    let lastYear = currentYear;
    let monthlyDivisionData = {};
    let counter = 0;
    for (let i = currentYear; i >= 2014 && counter < 12; i--) {
      let maxMonth = (i === currentYear) ? currentMonth + 1 : 12;
      for (let j = maxMonth; j >= 1 && counter < 12; j--) {
        let month = "";
        if (j <= 9)
          month = "0" + j;
        else
          month = j;
        let nbPeopleTrainedAMonth = nbPeopleTrained.filter(row => row.male !== 0 && row.date.match(getYearPattern(month, i)));
        let tabSize = nbPeopleTrainedAMonth.length;
        if (tabSize > 0) {
          let nbPerMonth = 0;
          while (tabSize > 0) {
            nbPerMonth += nbPeopleTrainedAMonth[tabSize - 1]["#people trained"];
            tabSize--;
          }
          monthlyDivisionData["data" + (12 - counter)] = {
            "label": month + "/" + i,
            "value": nbPerMonth
          };
          lastMonth = month;
          lastYear = i;
          counter++;
        }
      }
    }
    //In case there is not enough data, generation of empty months
    let month = lastMonth - 1;
    while (counter < 12) {
      if (month <= 9) {
        lastMonth = "0" + month;
      }
      else {
        lastMonth = month;
      }
      monthlyDivisionData["data" + (12 - counter)] = {
        "label": lastMonth + "/" + lastYear,
        "value": 0
      };
      month--;
      if (month <= 0) {
        lastYear--;
        month = 12;
      }
      counter++;
    }

    data.capacitybuilding["monthlyDivision"] = {
      data : monthlyDivisionData,
      title : "Monthly training (last 6 months)"
    };
    return data;
  }
}

export default RamaniHuria;
