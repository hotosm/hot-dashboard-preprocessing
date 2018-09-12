'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const CONFIG = {
  // This is the entrypoint of the preprocessing function in order to get the list of the projects and the data associated with it
  projects: 'https://docs.google.com/spreadsheets/d/1_zuydhVy3wJ7STqGlfNThTtWH9uEeTyyqsTMQLnrHHU/gviz/tq?tqx=out:csv&sheet=full',
  // This is where the aggregated data is stored and fetched
  awsBucket: 'https://s3.eu-central-1.amazonaws.com/hot-data-proofofwork/rawdata.json'
};
exports.default = CONFIG;