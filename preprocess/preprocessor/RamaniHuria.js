import AbstractProject from './AbstractProject'

// This class is the processing the data for the RamaniHuria project
class RamaniHuria extends AbstractProject{
  constructor(generalData) {
    super(generalData);
    // this.functions.push("getPeopleTrained");
    // this.functions.push("getPeopleTrainedMonthly");
    this.functions.push("getNbAttendeesMonthly");
    this.functions.push("getNbAttendeesInstitutions");
    this.functions.push("getNbAttendeesTraining");
    this.functions.push("getNbWorkshops");
    this.functions.push("getNbEvents");
    this.functions.push("getNbParticipants");
  }

  /**
   * Get the number of attendees and of institutions trained during the workshops and aggregate it by month
   * @param data - the data fetched by the reader
   * @returns {object} The data with the attribute "nbAttendeesMonthly" containing the data for the corresponding indicator : number workshops attendees per month
   * The advantage to have an descending array allow us to display the last 6 months or the last 3 months according to our needs
   */
  getNbAttendeesMonthly(data) {
    const nbAttendees = "Number attendees";
    const nbInstitutions = "Number institutions";
    const endDate = "End date";

    let attendees = data.capacitybuilding.nbattendeesmonthly.data;
    // This array will hold the final data
    let attendeesArray = [];
    // This variable will be used when data is inserted in the array
    let exist = false;
    for (let i = 0; i < attendees.length; i++) {
      let date = (new Date(attendees[i][endDate]));
      // This loop is here to add the row in the right array cell in order to have a descending order
      for (let j = 0; j < attendeesArray.length && !exist; j++) {
        // If the date of the current row is greater (newer) than the item in the array (year greater or same yeah but month greater)
        if (date.getFullYear() > attendeesArray[j].date.getFullYear() || (date.getMonth() > attendeesArray[j].date.getMonth() && attendeesArray[j].date.getFullYear() === date.getFullYear())) {
          // This array will store the data to be added in the middle of the old one
          let attendeesTemp = [];
          attendeesTemp.push({
            date : date,
            label : date.toUTCString().split(" ", 3)[2]+" "+date.toUTCString().split(" ", 4)[3],
            nbAttendees: attendees[i][nbAttendees],
            nbInstitutions: attendees[i][nbInstitutions],
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
          attendeesArray[j].nbAttendees += attendees[i][nbAttendees];
          attendeesArray[j].nbInstitutions += attendees[i][nbInstitutions];
          exist = true;
        }
      }
      // Otherwise, the current row is lower (older) than the last item of the array
      if(!exist) {
        // If so, it also means that there is no data for this month so it's added at the end of the array
        attendeesArray.push({
          date : date,
          label : date.toUTCString().split(" ", 3)[2]+" "+date.toUTCString().split(" ", 4)[3],
          nbAttendees: attendees[i][nbAttendees],
          nbInstitutions: attendees[i][nbInstitutions],
        });
      }
      else {
        exist = false;
      }
    }
    // This will be the final data stored in the json file
    let nbAttendeesMonthly = {
      title    : data.capacitybuilding.nbattendeesmonthly.title,
      data              : attendeesArray
    };
    // We store the data calculated in the global data
    data.capacitybuilding["nbAttendeesMonthly"] = nbAttendeesMonthly;
    delete data.capacitybuilding.nbattendeesmonthly;
    return data;
  }

  /**
   * Get the number of attendees trained during the workshops and aggregate it by institutions
   * @param data - the data fetched by the reader
   * @returns {object} The data with the attribute "nbAttendeesMonthly" containing the data for the corresponding indicator : number workshops attendees per institutions
   */
  getNbAttendeesInstitutions(data) {
    let nbAttendeesInstitutionsFromData = data.capacitybuilding.nbattendeesinstitutions;
    let nbAttendeesInstitutions = {
      title: nbAttendeesInstitutionsFromData.title,
      data: [
        {
          label: "University of Dar es Salaam and Ardhi University",
          shorten: "DSAU",
          nbAttendees : 0
        },
        {
          label: "WB Consultants",
          shorten: "WB",
          nbAttendees : 0
        },
        {
          label: "Red Cross",
          shorten: "RC",
          nbAttendees : 0
        },
        {
          label: "Municipal Councils representative",
          shorten: "MCR",
          nbAttendees : 0
        },
        {
          label: "City Council Representatives",
          shorten: "CCR",
          nbAttendees : 0
        },
        {
          label: "National Bureau of Statistics",
          shorten: "NBS",
          nbAttendees : 0
        },
        {
          label: "Energy and Water Utility Regulatory Authority",
          shorten: "EWA",
          nbAttendees : 0
        },
        {
          label: "Ministry of Health",
          shorten: "MoH",
          nbAttendees : 0
        },
        {
          label: "Ministry of Water (DAWASA & DAWASCO)",
          shorten: "MoW",
          nbAttendees : 0
        },
        {
          label: "Tanzania Petroleum Development Corporation",
          shorten: "TPDC",
          nbAttendees : 0
        },
        {
          label: "Commission of Science and Technology",
          shorten: "CST",
          nbAttendees : 0
        },
        {
          label: "Local Government Authority (LGA) leaders",
          shorten: "LGA",
          nbAttendees : 0
        },
        {
          label: "Community members",
          shorten: "CM",
          nbAttendees : 0
        }
      ]
    };
    for (let i = 0; i < nbAttendeesInstitutionsFromData.data.length; i++) {
      for (let j = 0; j < nbAttendeesInstitutions.data.length; j++) {
        nbAttendeesInstitutions.data[j].nbAttendees += nbAttendeesInstitutionsFromData.data[i][nbAttendeesInstitutions.data[j].label];
      }
    }
    // We store the data calculated in the global data
    data.capacitybuilding["nbAttendeesInstitutions"] = nbAttendeesInstitutions;
    delete data.capacitybuilding.nbattendeesinstitutions;
    return data;
  }

  /**
   * Get the number of attendees trained during the workshops and aggregate it by type of trainings
   * @param data - the data fetched by the reader
   * @returns {object} The data with the attribute "nbAttendeesTraining" containing the data for the corresponding indicator : number workshops attendees per training type
   */
  getNbAttendeesTraining(data) {
    const nbAttendees = "Number attendees";
    let nbAttendeesTrainingFromData = data.capacitybuilding.nbattendeestraining.data;
    let nbAttendeesTraining = {
      title: data.capacitybuilding.nbattendeestraining.title,
      data: [
        {
          extend: "Drainage mapping",
          label: "Drainage",
          value : 0
        },
        {
          extend: "OSM",
          label: "OSM",
          value : 0
        },
        {
          extend: "ODK Form Management and Data Collection",
          label: "ODK",
          value : 0
        },
        {
          extend: "OsmAnd application and Map Reading",
          label: "Osm",
          value : 0
        }
      ]
    };
    for (let i = 0; i < nbAttendeesTrainingFromData.length; i++) {
      for (let j = 0; j < nbAttendeesTraining.data.length; j++) {
        if (nbAttendeesTrainingFromData[i][nbAttendeesTraining.data[j].extend] !== 0) {
          nbAttendeesTraining.data[j].value += nbAttendeesTrainingFromData[i][nbAttendees];
        }
      }
    }
    // We store the data calculated in the global data
    data.capacitybuilding["nbAttendeesTraining"] = nbAttendeesTraining;
    delete data.capacitybuilding.nbattendeestraining;
    return data;
  }

  /**
   * Get the number of workshops and aggregate it by month
   * @param data - the data fetched by the reader
   * @returns {object} The data with the attribute "nbWorkshopsMonthly" containing the data for the corresponding indicator : number of technical workshops per month
   * The advantage to have an descending array allow us to display the last 6 months or the last 3 months according to our needs
   */
  getNbWorkshops(data) {
    const endDate = "End date";
    let yearMax = (new Date().getFullYear());
    let currentMonth = (new Date().getMonth());
    let yearMin = yearMax;
    let nbWorkshops = [];
    data.capacitybuilding.nbworkshops.data.filter(function(row) {
      let rowYear = (new Date(row[endDate]).getFullYear());
      if (rowYear<yearMin) {
        yearMin = rowYear;
      }
    });
    let counter = 0;
    for (; yearMax >= yearMin; yearMax--) {
      let month = 11;
      if (yearMax === yearMin) {
        month = currentMonth;
      }
      for (; month >= 0; month--) {
        let nbWorkshopsFiltered = data.capacitybuilding.nbworkshops.data
            .filter(row => row[endDate] && (new Date(row[endDate]).getFullYear()) === yearMax && (new Date(row[endDate]).getMonth()) === month);
        if (nbWorkshopsFiltered.length > 0) {
          nbWorkshops[counter] =
              {
                value: nbWorkshopsFiltered.length,
                label: (new Date(nbWorkshopsFiltered[0][endDate])).toUTCString().split(" ", 3)[2]+" "+(new Date(nbWorkshopsFiltered[0][endDate])).toUTCString().split(" ", 4)[3]
              };
          counter++;
        }
      }
    }
    let nbWorkshopsStored = {
      title: data.capacitybuilding.nbworkshops.title,
      data: nbWorkshops
    };
    // We store the data calculated in the global data
    data.capacitybuilding["nbWorkshops"] = nbWorkshopsStored;
    delete data.capacitybuilding.nbworkshops;
    return data;
  }

  /**
   * Get the number of events conducted
   * @param data - the data fetched by the reader
   * @returns {object} The data with the attribute "nbEvents" containing the data for the corresponding indicator and the title
   */
  getNbEvents(data) {
    // We store the data calculated in the global data
    data.mappingcommunity["nbEvents"] = {
      title: data.mappingcommunity.nbevents.title,
      data: data.mappingcommunity.nbevents.data.filter(row => row["No."] !== "").length
    };
    delete data.mappingcommunity.nbevents;
    return data;
  }

  /**
   * Get the number of participants of each event
   * @param data - the data fetched by the reader
   * @returns {object} The data with the attribute "nbParticipants" containing the data for the corresponding indicator and the title
   */
  getNbParticipants(data) {
    let nbParticipantsFromData = data.mappingcommunity.nbparticipants.data;
    // This array will hold the final data
    let nbParticipants = [];
    // This variable will be used when data is inserted in the array
    let exist = false;
    for (let i = 0; i < nbParticipantsFromData.length; i++) {
      let date = (new Date(nbParticipantsFromData[i].Date));
      if (nbParticipantsFromData[i].Number > 0) {
        // This loop is here to add the row in the right array cell in order to have a descending order
        for (let j = 0; j < nbParticipants.length && !exist; j++) {
          // If the date of the current row is greater (newer) than the item in the array (year greater or same yeah but month greater)
          if (date.getFullYear() > nbParticipants[j].date.getFullYear() || (date.getMonth() > nbParticipants[j].date.getMonth() && date.getFullYear()) === nbParticipants[j].date.getFullYear()) {
            // This array will store the data to be added in the middle of the old one
            let participantTemp = [];
            participantTemp.push({
              date: date,
              label: date.toUTCString().split(" ", 3)[2] + " " + date.toUTCString().split(" ", 4)[3],
              female: nbParticipantsFromData[i].Female === "" ? 0 : nbParticipantsFromData[i].Female,
              male: nbParticipantsFromData[i].Male === "" ? 0 : nbParticipantsFromData[i].Male,
              new: nbParticipantsFromData[i].New === "" ? 0 : nbParticipantsFromData[i].New,
              old: nbParticipantsFromData[i].Old === "" ? 0 : nbParticipantsFromData[i].Old
            });
            // This array will store the ordered data
            let res = [];
            res = nbParticipants.splice(0, j);
            res = res.concat(participantTemp);
            res = res.concat(nbParticipants);
            nbParticipants = res;
            exist = true;
          }
          // If the date of the current row is equal to the date of the item in the array (month and year because it's filtered this way)
          else if (nbParticipants[j].date.getMonth() === date.getMonth() && nbParticipants[j].date.getFullYear() === date.getFullYear()) {
            // We update the values of the data
            nbParticipants[j].female += nbParticipantsFromData[i].Female;
            nbParticipants[j].male += nbParticipantsFromData[i].Male;
            nbParticipants[j].new += nbParticipantsFromData[i].New;
            nbParticipants[j].old += nbParticipantsFromData[i].Old;
            exist = true;
          }
        }
        // Otherwise, the current row is lower (older) than the last item of the array
        if (!exist) {
          // If so, it also means that there is no data for this month so it's added at the end of the array
          nbParticipants.push({
            date: date,
            label: date.toUTCString().split(" ", 3)[2] + " " + date.toUTCString().split(" ", 4)[3],
            female: nbParticipantsFromData[i].Female === "" ? 0 : nbParticipantsFromData[i].Female,
            male: nbParticipantsFromData[i].Male === "" ? 0 : nbParticipantsFromData[i].Male,
            new: nbParticipantsFromData[i].New === "" ? 0 : nbParticipantsFromData[i].New,
            old: nbParticipantsFromData[i].Old === "" ? 0 : nbParticipantsFromData[i].Old
          });
        }
        else {
          exist = false;
        }
      }
    }
    // We store the data calculated in the global data
    data.mappingcommunity["nbParticipants"] = {
      title: data.mappingcommunity.nbparticipants.title,
      data: nbParticipants
    };
    delete data.mappingcommunity.nbparticipants;
    return data;
  }
}

export default RamaniHuria;
