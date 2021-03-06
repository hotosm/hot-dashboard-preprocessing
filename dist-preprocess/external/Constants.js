'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const CONFIG = {
  // This is the entrypoint of the preprocessing function in order to get the list of the projects and the data associated with it
  projects: ['1_zuydhVy3wJ7STqGlfNThTtWH9uEeTyyqsTMQLnrHHU', '_config'],
  // This is the beginning of the URL that needs to be completed with the key and th name of the sheet
  googleEndPoint: 'https://docs.google.com/spreadsheets/d/',
  // This is the part that is used to get a specific sheet from the google spreadsheet
  googleSheetEndUrl: '/gviz/tq?tqx=out:csv&sheet=',
  // This is where the aggregated data is stored and fetched
  awsBucket: 'https://s3.eu-central-1.amazonaws.com/hot-data-proofofwork/rawdata.json'
};
exports.default = CONFIG;