import AbstractProject from './AbstractProject'
// import PDC from "./PDC"
// import RamaniHuria from "./RamaniHuria"


// This class is processing the data for the core indicators of every project
class ProjectCore extends AbstractProject {
  constructor(generalData) {
    super(generalData);
    this.functions.push("getNbSubwards");
    this.functions.push("getNbAttendeesMonthly");
    this.functions.push("getNbAttendeesInstitutions");
    this.functions.push("getNbAttendeesTraining");
    this.functions.push("getNbWorkshopsMonthly");
    this.functions.push("getNbTrainings");
    this.functions.push("getNbEvents");
    this.functions.push("getNbParticipantsGender");
    this.functions.push("getNbParticipantsNew");
    this.functions.push("getNbParticipantsType");
  }

  /**
   * Get the number of subwards achieved by month
   * @param data - the data fetched by the reader
   * @returns {object}
   */
  getNbSubwards(data) {
    
    let nbSubwardsCompleted = {};
    // This array will hold the final data
    let nbSubwards = [];
    console.log(JSON.stringify(data))
    if (data.mapping.hasOwnProperty('nbSubwardsCompleted')) {
      let nbSubwardsFromData = data.mapping.nbSubwardsCompleted.data.filter(row => row["Ward"] === "TOTAL")[0];
      // This variable will be used when data is inserted in the array
      let exist = false;
      // This loop is here to add the row in the right array cell in order to have a descending order
      // We start at the 4th object because we know that the firsts columns are 'Population' and 'Area'
      for (let k = 3; k < Object.keys(nbSubwardsFromData).length; k++) {
        let exist = false;
        let divisionData = Object.values(nbSubwardsFromData)[k];
        if (divisionData > 0) {
          let nbElements = Object.keys(nbSubwardsFromData)[k].split(" ").length;
          // We know that the date will be at the end of the header and is 9 characters long (3 char for the month et 4 for for the year and the spaces)
          let subwardType = Object.keys(nbSubwardsFromData)[k].substring(0, Object.keys(nbSubwardsFromData)[k].length - 10);
          let month = Object.keys(nbSubwardsFromData)[k].split(" ", nbElements)[nbElements - 2];
          let year = Object.keys(nbSubwardsFromData)[k].split(" ", nbElements)[nbElements - 1];
          let divisionDate = (new Date(month + " 1 " + year));
          for (let l = 0; l < nbSubwards.length && !exist; l++) {
            // If the date of the current row is greater (newer) than the item in the array
            if (divisionDate.getFullYear() > nbSubwards[l].date.getFullYear() ||
                (divisionDate.getMonth() > nbSubwards[l].date.getMonth() &&
                    nbSubwards[l].date.getFullYear() === divisionDate.getFullYear())) {
              let divisionDataTemp = {
                extend: subwardType,
                label: divisionDate.toUTCString().split(" ", 3)[2] + " " + divisionDate.toUTCString().split(" ", 4)[3],
                date: divisionDate,
                value: divisionData
              };
              let res = [];
              res = res.concat(nbSubwards.splice(0, l));
              res = res.concat(divisionDataTemp);
              res = res.concat(nbSubwards);
              nbSubwards = res;
              exist = true;
            }
            // If the date of the current row is equal to the date of the item in the array
            else if (divisionDate.getMonth() === nbSubwards[l].date.getMonth() &&
                divisionDate.getFullYear() === nbSubwards[l].date.getFullYear()) {
              nbSubwards[l].value += Object.values(nbSubwardsFromData)[k];
              exist = true;
            }
          }
          // Otherwise, the current row is lower (older) than the last item of the array
          if (!exist) {
            nbSubwards.push({
              extend : subwardType,
              label  : divisionDate.toUTCString().split(" ", 3)[2] + " " + divisionDate.toUTCString().split(" ", 4)[3],
              date   : divisionDate,
              value  : divisionData
            });
          }
          else {
            exist = false;
          }
        }
        nbSubwardsCompleted = {
          title: data.mapping.nbSubwardsCompleted.title,
          data: nbSubwards
        };
      }
      data.mapping["nbSubwardsCompleted"] = nbSubwardsCompleted;
      // We remove the data because it has been processed so we don't need it anymore
      delete data.mapping.nbSubwardsCompleted;
      return data;
    } 
  }

  /**
   * Get the number of attendees and of institutions trained during the workshops and aggregate it by month
   * @param data - the data fetched by the reader
   * @returns {object} The data with the attribute "nbAttendeesMonthly" containing the data for the corresponding indicator : number workshops attendees per month
   * The advantage to have an descending array allow us to display the last 6 months or the last 3 months according to our needs
   */
  getNbAttendeesMonthly(data) {
    console.log('getNbAttendeesMonthly')
    const nbAttendees = "Number attendees";
    const endDate = "End date";
    if (data.capacitybuilding.hasOwnProperty('nbattendeesmonthly')) {
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
              date  : date,
              label : date.toUTCString().split(" ", 3)[2]+" "+date.toUTCString().split(" ", 4)[3],
              value : attendees[i][nbAttendees]
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
            // We update the value of the data
            attendeesArray[j].value += attendees[i][nbAttendees];
            exist = true;
          }
        }
        // Otherwise, the current row is lower (older) than the last item of the array
        if(!exist) {
          // If so, it also means that there is no data for this month so it's added at the end of the array
          attendeesArray.push({
            date  : date,
            label : date.toUTCString().split(" ", 3)[2]+" "+date.toUTCString().split(" ", 4)[3],
            value : attendees[i][nbAttendees],
          });
        }
        else {
          exist = false;
        }
      }
      // This will be the final data stored in the json file
      let nbAttendeesMonthly = {
        title    : data.capacitybuilding.nbattendeesmonthly.title,
        data     : attendeesArray
      };
      // We store the data calculated in the global data
      data.capacitybuilding["nbAttendeesMonthly"] = nbAttendeesMonthly;
      // We remove the data because it has been processed so we don't need it anymore
      delete data.capacitybuilding.nbattendeesmonthly;
      return data;
    }
  }

  /**
   * Get the number of attendees trained during the workshops and aggregate it by institutions
   * @param data - the data fetched by the reader
   * @returns {object} The data with the attribute "nbAttendeesMonthly" containing the data for the corresponding indicator : number workshops attendees per institutions
   */
  getNbAttendeesInstitutions(data) {
    console.log('getNbAttendeesInstitutions')
    if (data.capacitybuilding.hasOwnProperty('nbattendeesinstitutions')) {
      let nbAttendeesInstitutionsFromData = data.capacitybuilding.nbattendeesinstitutions;
      let nbAttendeesInstitutions;
      let constructorName = this.constructor.name;
      if (constructorName === 'RamaniHuria'){
        nbAttendeesInstitutions = {
          title: nbAttendeesInstitutionsFromData.title,
          data: [
            {
              extend : "University of Dar es Salaam and Ardhi University",
              label  : "DSAU",
              value  : 0
            },
            {
              extend : "WB Consultants",
              label  : "WB",
              value  : 0
            },
            {
              extend : "Red Cross",
              label  : "RC",
              value  : 0
            },
            {
              extend : "Municipal Councils representative",
              label  : "MCR",
              value  : 0
            },
            {
              extend : "City Council Representatives",
              label  : "CCR",
              value  : 0
            },
            {
              extend : "National Bureau of Statistics",
              label  : "NBS",
              value  : 0
            },
            {
              extend : "Energy and Water Utility Regulatory Authority",
              label  : "EWA",
              value  : 0
            },
            {
              extend : "Ministry of Health",
              label  : "MoH",
              value  : 0
            },
            {
              extend : "Ministry of Water (DAWASA & DAWASCO)",
              label  : "MoW",
              value  : 0
            },
            {
              extend : "Tanzania Petroleum Development Corporation",
              label  : "TPDC",
              value  : 0
            },
            {
              extend : "Commission of Science and Technology",
              label  : "CST",
              value  : 0
            },
            {
              extend : "Local Government Authority (LGA) leaders",
              label  : "LGA",
              value  : 0
            },
            {
              extend : "Community members",
              label  : "CM",
              value  : 0
            }
          ]} 
     } else if (constructorName === 'PDC'){
        nbAttendeesInstitutions = {
          title: nbAttendeesInstitutionsFromData.title,
          data: [{
            extend : "Surabaya Institute of Technology",
            label  : "SIT",
            value  : 0
          },
          {
            extend : "University of Indonesia",
            label  : "UoI",
            value  : 0
          },
          {
            extend : "Semarang State University",
            label  : "SSU",
            value  : 0
          },	
          {
            extend : "Public Works Ministry",
            label  : "PWM",
            value  : 0
          },
          {
            extend : "Ministry of Tourism	",
            label  : "MoTr",
            value  : 0
          },
          {
            extend : "Department of Politic and Local Government",
            label  : "DoPLG",
            value  : 0
          },
          {
            extend : "Ministry of Transportation",
            label  : "MoT",
            value  : 0
          },
          {
            extend : "Ministry of Agriculture",
            label  : "MoA",
            value  : 0
          },
          {
            extend : "City Planning Council",
            label  : "SIT",
            value  : 0
          },
          {
            extend : "East Java Local Disaster Management Agency",
            label  : "EJLDMA",
            value  : 0
          },
          {
            extend : "Jakarta Local Disaster Management Agency",
            label  : "JLDMA",
            value  : 0
          },
          {
            extend : "Semarang Local Disaster Management Agency",
            label  : "SLDMA",
            value  : 0
          }	
        ]}
      }
      for (let i = 0; i < nbAttendeesInstitutionsFromData.data.length; i++) {
        for (let j = 0; j < nbAttendeesInstitutions.data.length; j++) {
          nbAttendeesInstitutions.data[j].value += nbAttendeesInstitutionsFromData.data[i][nbAttendeesInstitutions.data[j].extend];
        }
      }
      // We store the data calculated in the global data
      data.capacitybuilding["nbAttendeesInstitutions"] = nbAttendeesInstitutions;
      delete data.capacitybuilding.nbattendeesinstitutions;
      return data;
    }
  }

  /**
   * Get the number of attendees trained during the workshops and aggregate it by type of trainings
   * @param data - the data fetched by the reader
   * @returns {object} The data with the attribute "nbAttendeesTraining" containing the data for the corresponding indicator : number workshops attendees per training type
   */
  getNbAttendeesTraining(data) {
    console.log('getNbAttendeesTraining')
    const nbAttendees = "Number attendees";
    if (data.capacitybuilding.hasOwnProperty('nbattendeestraining')){
      let nbAttendeesTrainingFromData = data.capacitybuilding.nbattendeestraining.data;
      let nbAttendeesTraining;
      let constructorName = this.constructor.name;
      if (constructorName === 'RamaniHuria'){
       nbAttendeesTraining = {
        title: data.capacitybuilding.nbattendeestraining.title,
        // We're forced to hardcode these data because it's the row headers and that's what we will use to fetch the data
        data: [
          {
            extend : "Drainage mapping",
            label  : "Drainage",
            value  : 0
          },
          {
            extend : "OSM",
            label  : "OSM",
            value  : 0
          },
          {
            extend : "ODK Form Management and Data Collection",
            label  : "ODK",
            value  : 0
          },
          {
            extend : "OsmAnd application and Map Reading",
            label  : "Osm & Map",
            value  : 0
          }
        ]
      };
    } else if (constructorName === 'PDC') {
      nbAttendeesTraining = {
        title: data.capacitybuilding.nbattendeestraining.title,
        // We're forced to hardcode these data because it's the row headers and that's what we will use to fetch the data
        data: [
          {
            extend : "OSM",
            label  : "OSM",
            value  : 0
          },
          {
            extend : "ODK Form Management and Data Collection",
            label  : "ODK",
            value  : 0
          },
          {
            extend : "JOSM",
            label  : "JOSM",
            value  : 0
          },
          {
            extend : "Tasking Manager",
            label  : "TM",
            value  : 0
          },
          {
            extend : "HOT Export",
            label  : "Export",
            value  : 0
          },
          {
            extend : "QGIS",
            label  : "QGIS",
            value  : 0
          },
          {
            extend : "InAWARE",
            label  : "InAWARE",
            value  : 0
          },
          {
            extend : "InaSAFE",
            label  : "InaSAFE",
            value  : 0
          }
                  
        ]
      };
    }
    
    for (let i = 0; i < nbAttendeesTrainingFromData.length; i++) {
      for (let j = 0; j < nbAttendeesTraining.data.length; j++) {
        if (nbAttendeesTrainingFromData[i][nbAttendeesTraining.data[j].extend] !== 0) {
          nbAttendeesTraining.data[j].value += nbAttendeesTrainingFromData[i][nbAttendees];
        }
      }
    }
    // We store the data calculated in the global data
    data.capacitybuilding["nbAttendeesTraining"] = nbAttendeesTraining;
    // We remove the data because it has been processed so we don't need it anymore
    delete data.capacitybuilding.nbattendeestraining;
    return data;
    }  
  }

  /**
   * Get the number of workshops and aggregate it by month
   * @param data - the data fetched by the reader
   * @returns {object} The data with the attribute "nbWorkshopsMonthly" containing the data for the corresponding indicator : number of technical workshops per month
   * The advantage to have an descending array allow us to display the last 6 months or the last 3 months according to our needs
   */
  getNbWorkshopsMonthly(data) {
    console.log('getNbWorkshopsMonthly')
    const endDate = "End date";
    let yearMax = (new Date().getFullYear());
    let currentMonth = (new Date().getMonth());
    let yearMin = yearMax;
    let nbWorkshops = [];
    if (data.capacitybuilding.hasOwnProperty('nbworkshopsmonthly')) {
      data.capacitybuilding.nbworkshopsmonthly.data.filter(function(row) {
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
          let nbWorkshopsFiltered = data.capacitybuilding.nbworkshopsmonthly.data
              .filter(row => row[endDate] && (new Date(row[endDate]).getFullYear()) === yearMax && (new Date(row[endDate]).getMonth()) === month);
          if (nbWorkshopsFiltered.length > 0) {
            nbWorkshops[counter] =
                {
                  value : nbWorkshopsFiltered.length,
                  date  : (new Date(nbWorkshopsFiltered[0][endDate])),
                  label : (new Date(nbWorkshopsFiltered[0][endDate])).toUTCString().split(" ", 3)[2]+" "+(new Date(nbWorkshopsFiltered[0][endDate])).toUTCString().split(" ", 4)[3]
                };
            counter++;
          }
        }
      }
      let nbWorkshopsStored = {
        title : data.capacitybuilding.nbworkshopsmonthly.title,
        data  : nbWorkshops
      };
      // We store the data calculated in the global data
      data.capacitybuilding["nbWorkshopsMonthly"] = nbWorkshopsStored;
      // We remove the data because it has been processed so we don't need it anymore
      delete data.capacitybuilding.nbworkshopsmonthly;
      return data;
    } 
  }

  /**
   * Get the number of trainings conducted
   * @param data - the data fetched by the reader
   * @returns {object}
   */
  getNbTrainings(data) {
    console.log('getNbTrainings')
    if (data.capacitybuilding.hasOwnProperty('nbtrainings')) {
      // The number of trainings is only the number of line of the data
      data.capacitybuilding["nbtrainings"] = {
        title: data.capacitybuilding.nbtrainings.title,
        value: data.capacitybuilding.nbtrainings.data.length
      };
      // We remove the data because it has been processed so we don't need it anymore
      delete data.capacitybuilding.nbtrainings;
      return data;
    }
    
  }

  /**
   * Get the number of events conducted
   * @param data - the data fetched by the reader
   * @returns {object} The data with the attribute "nbEvents" containing the data for the corresponding indicator and the title
   */
  getNbEvents(data) {
    console.log('getNbEvents')
    if (data.community.hasOwnProperty('nbevents')) {
      data.community["nbEvents"] = {
        title: data.community.nbevents.title,
        value: data.community.nbevents.data.filter(row => row["No."] !== "").length
      };
      // We remove the data because it has been processed so we don't need it anymore
      delete data.community.nbevents;
      return data;
    } 
  }

  /**
   * Get the number of participants of each event focusing on the gender
   * @param data - the data fetched by the reader
   * @returns {object} The data with the attribute "nbParticipants" containing the data for the corresponding indicator and the title
   */
  getNbParticipantsGender(data) {
    console.log('getNbParticipantsGender')
    if (data.community.hasOwnProperty('nbparticipantsgender')) {
      let nbParticipantsFromData = data.community.nbparticipantsgender.data;
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
              date   : date,
              label  : date.toUTCString().split(" ", 3)[2] + " " + date.toUTCString().split(" ", 4)[3],
              female : nbParticipantsFromData[i].Female === "" ? 0 : nbParticipantsFromData[i].Female,
              male   : nbParticipantsFromData[i].Male === "" ? 0 : nbParticipantsFromData[i].Male
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
            nbParticipants[j].male   += nbParticipantsFromData[i].Male;
            exist = true;
          }
        }
        // Otherwise, the current row is lower (older) than the last item of the array
        if (!exist) {
          // If so, it also means that there is no data for this month so it's added at the end of the array
          nbParticipants.push({
            date   : date,
            label  : date.toUTCString().split(" ", 3)[2] + " " + date.toUTCString().split(" ", 4)[3],
            female : nbParticipantsFromData[i].Female === "" ? 0 : nbParticipantsFromData[i].Female,
            male   : nbParticipantsFromData[i].Male === "" ? 0 : nbParticipantsFromData[i].Male
          });
        }
        else {
          exist = false;
        }
      }
    }
    // We store the data calculated in the global data
    data.community["nbParticipantsGender"] = {
      title: data.community.nbparticipantsgender.title,
      data: nbParticipants
    };
    // We remove the data because it has been processed so we don't need it anymore
    delete data.community.nbparticipantsgender;
    return data;
    }
  }

  /**
   * Get the number of participants of each event focusing on the old/new division
   * @param data - the data fetched by the reader
   * @returns {object} The data with the attribute "nbParticipants" containing the data for the corresponding indicator and the title
   */
  getNbParticipantsNew(data) {
    console.log('getNbParticipantsNew')
    if (data.community.hasOwnProperty('nbparticipantsnew')) {
      let nbParticipantsFromData = data.community.nbparticipantsnew.data;
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
              date  : date,
              label : date.toUTCString().split(" ", 3)[2] + " " + date.toUTCString().split(" ", 4)[3],
              new   : nbParticipantsFromData[i].New === "" ? 0 : nbParticipantsFromData[i].New,
              old   : nbParticipantsFromData[i].Old === "" ? 0 : nbParticipantsFromData[i].Old
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
            nbParticipants[j].new += nbParticipantsFromData[i].New;
            nbParticipants[j].old += nbParticipantsFromData[i].Old;
            exist = true;
          }
        }
        // Otherwise, the current row is lower (older) than the last item of the array
        if (!exist) {
          // If so, it also means that there is no data for this month so it's added at the end of the array
          nbParticipants.push({
            date  : date,
            label : date.toUTCString().split(" ", 3)[2] + " " + date.toUTCString().split(" ", 4)[3],
            new   : nbParticipantsFromData[i].New === "" ? 0 : nbParticipantsFromData[i].New,
            old   : nbParticipantsFromData[i].Old === "" ? 0 : nbParticipantsFromData[i].Old
          });
        }
        else {
          exist = false;
        }
      }
    }
    // We store the data calculated in the global data
    data.community["nbParticipantsNew"] = {
      title: data.community.nbparticipantsnew.title,
      data: nbParticipants
    };
    // We remove the data because it has been processed so we don't need it anymore
    delete data.community.nbparticipantsnew;
    return data;
    }
  }

  /**
   * Get the number of participants of each event focusing on the event type
   * @param data - the data fetched by the reader
   * @returns {object} The data with the attribute "nbParticipants" containing the data for the corresponding indicator and the title
   */
  getNbParticipantsType(data) {
    console.log('getNbParticipantsType')
    if (data.community.hasOwnProperty('nbparticipantstype')) {
      let nbParticipantsFromData = data.community.nbparticipantstype.data;
    // This array will hold the final data
    let nbParticipants = [];
    // This variable will be used when data is inserted in the array
    let exist = false;
    for (let i = 0; i < nbParticipantsFromData.length; i++) {
      if (nbParticipantsFromData[i].Number > 0) {
        for (let j = 0; j < nbParticipants.length && !exist; j++) {
          // If the type of the current row is equal to the one of the item in the array we're iterating on
          if (nbParticipants[j].label === nbParticipantsFromData[i].Type) {
            // We update the values of the data
            nbParticipants[j].value += nbParticipantsFromData[i].Number;
            exist = true;
          }
        }
        if (!exist) {
          // If so, it means that there is no data for this event type so it's added at the end of the array
          nbParticipants.push({
            label : nbParticipantsFromData[i].Type,
            value : nbParticipantsFromData[i].Number === "" ? 0 : nbParticipantsFromData[i].Number
          });
        }
        else {
          exist = false;
        }
      }
    }
    // We store the data calculated in the global data
    data.community["nbParticipantsType"] = {
      title: data.community.nbparticipantstype.title,
      data: nbParticipants
    };
    // We remove the data because it has been processed so we don't need it anymore
    delete data.community.nbparticipantstype;
    return data;
    }
    
  }
}

export default ProjectCore;