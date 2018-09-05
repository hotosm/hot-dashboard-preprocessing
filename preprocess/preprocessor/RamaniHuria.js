import AbstractProject from './AbstractProject'

// This class is the processing the data for the RamaniHuria project
class RamaniHuria extends AbstractProject{
  constructor(generalData) {
    super(generalData);
    // this.functions.push("getPeopleTrained");
    // this.functions.push("getPeopleTrainedMonthly");
    this.functions.push("getAttendeesAndInstitutions");
  }

  /**
   * Get the number of attendees and of institutions trained during the workshops (by month)
   * @param data - the data fetched by the reader
   * @returns {object} The data with the attribute "attendeesAndInstitutions" containing the data for the 3 indicators : number of people and institutions trained and the number of workshops
   * The advantage to have an descending array allow us to display the last 6 months or the last 3 months if we want
   */
  getAttendeesAndInstitutions(data) {
    // Because we know the data is the same for the three indicators, we will only use this one
    let attendees = data.capacitybuilding.nbattendees.data;
    // This array will hold the final data
    let attendeesArray = [];
    // This variable will be used when data is inserted in the array
    let exist = false;
    for (let i = 0; i < attendees.length; i++) {
      let date = (new Date(attendees[i]["End date"]));
      // This loop is here to add the row in the right array cell in order to have a descending order
      for (let j = 0; j < attendeesArray.length && !exist; j++) {
        // If the date of the current row is greater (newer) than the item in the array (year greater or same yeah but month greater)
        if (date.getFullYear() > attendeesArray[j].date.getFullYear() || (date.getMonth() > attendeesArray[j].date.getMonth() && attendeesArray[j].date.getFullYear() === date.getFullYear())) {
          // This array will store the data to be added in the middle of the old one
          let attendeesTemp = [];
          attendeesTemp.push({
            date : date,
            label : date.toUTCString().split(" ", 3)[2]+" "+date.toUTCString().split(" ", 4)[3],
            nbAttendees: attendees[i]["Number attendees"],
            nbInstitutions: attendees[i]["Number institutions"],
          });
          // This array will store the ordered data
          let res = [];
          res = attendeesArray.splice(0, j);
          res = res.concat(attendeesTemp);
          res = res.concat(attendeesArray);
          attendeesArray = res;
          exist = true;
        }
        // If the date of the current row is equal to the date of the item in the array (month and year because it's filtered this way)
        else if (attendeesArray[j].date.getMonth() === date.getMonth() && attendeesArray[j].date.getFullYear() === date.getFullYear()) {
          // We update the values of the data
          attendeesArray[j].nbAttendees += attendees[i]["Number attendees"];
          attendeesArray[j].nbInstitutions += attendees[i]["Number institutions"];
          exist = true;
        }
      }
      // Otherwise, the current row is lower (older) than the last item of the array
      if(!exist) {
        // If so, it also means that there is no data for this month so it's added at the end of the array
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
    // This will be the final data stored in the json file
    let attendeesAndInstitutions = {
      titleWorkshop     : data.capacitybuilding.nbWorkshops.title,
      titleAttendees    : data.capacitybuilding.nbattendees.title,
      titleInstitutions : data.capacitybuilding.nbinstitutions.title,
      workshops         : attendees.length,
      data              : attendeesArray
    };
    // We store the data calculated in the global data
    data.capacitybuilding["attendeesAndInstitutions"] = attendeesAndInstitutions;
    return data;
  }

  // /** Get the number of people trained by gender and in total **/
  // getPeopleTrained(data) {
  //   let nbPeopleTrained = data.capacitybuilding.nbtrainings;
  //   let genderDivisionMen = 0;
  //   let genderDivisionWomen = 0;
  //   for (let i = 0; i < nbPeopleTrained.length; i++) {
  //     genderDivisionMen += nbPeopleTrained[i].male;
  //     genderDivisionWomen += nbPeopleTrained[i].female;
  //   }
  //   data.capacitybuilding["trainings"] = {
  //     men: genderDivisionMen,
  //     women: genderDivisionWomen,
  //     total: genderDivisionMen+genderDivisionWomen
  //   };
  //   return data;
  // }
  //
  // /** Get the number of people trained monthly */
  // getPeopleTrainedMonthly(data) {
  //   let nbPeopleTrained = data.capacitybuilding.nbtrainings;
  //   let getYearPattern = (month, year) => {
  //     return new RegExp('([0-9]{2})/' + month + '/' + year);   // French date format
  //   };
  //   const currentDate = (new Date());
  //   const currentYear = currentDate.getFullYear();
  //   const currentMonth = currentDate.getMonth();
  //   let lastMonth = currentMonth;
  //   let lastYear = currentYear;
  //   let monthlyDivisionData = {};
  //   let counter = 0;
  //   for (let i = currentYear; i >= 2014 && counter < 12; i--) {
  //     let maxMonth = (i === currentYear) ? currentMonth + 1 : 12;
  //     for (let j = maxMonth; j >= 1 && counter < 12; j--) {
  //       let month = "";
  //       if (j <= 9)
  //         month = "0" + j;
  //       else
  //         month = j;
  //       let nbPeopleTrainedAMonth = nbPeopleTrained.filter(row => row.male !== 0 && row.date.match(getYearPattern(month, i)));
  //       let tabSize = nbPeopleTrainedAMonth.length;
  //       if (tabSize > 0) {
  //         let nbPerMonth = 0;
  //         while (tabSize > 0) {
  //           nbPerMonth += nbPeopleTrainedAMonth[tabSize - 1]["#people trained"];
  //           tabSize--;
  //         }
  //         monthlyDivisionData["data" + (12 - counter)] = {
  //           "label": month + "/" + i,
  //           "value": nbPerMonth
  //         };
  //         lastMonth = month;
  //         lastYear = i;
  //         counter++;
  //       }
  //     }
  //   }
  //   //In case there is not enough data, generation of empty months
  //   let month = lastMonth - 1;
  //   while (counter < 12) {
  //     if (month <= 9) {
  //       lastMonth = "0" + month;
  //     }
  //     else {
  //       lastMonth = month;
  //     }
  //     monthlyDivisionData["data" + (12 - counter)] = {
  //       "label": lastMonth + "/" + lastYear,
  //       "value": 0
  //     };
  //     month--;
  //     if (month <= 0) {
  //       lastYear--;
  //       month = 12;
  //     }
  //     counter++;
  //   }
  //
  //   data.capacitybuilding["monthlyDivision"] = {
  //     data : monthlyDivisionData,
  //     title : "Monthly training (last 6 months)"
  //   };
  //   return data;
  // }
}

export default RamaniHuria;
