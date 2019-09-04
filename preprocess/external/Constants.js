const CONFIG = {
  // This is the entrypoint of the preprocessing function in order to get the list of the projects and the data associated with it
  projects: ['1Clm9iHgIKBwGbQEXTNenppFqYOdgHaV7nqfrfQBe8to', '_config'],
  // This is the beginning of the URL that needs to be completed with the key and th name of the sheet
  googleEndPoint: 'https://docs.google.com/spreadsheets/d/',
  // This is the part that is used to get a specific sheet from the google spreadsheet
  googleSheetEndUrl: '/gviz/tq?tqx=out:csv&sheet=',
  // This is where the aggregated data is stored and fetched
  awsBucket: 'https://s3.us-east-2.amazonaws.com/hot-dashboard-data/rawdata.json'
};
export default CONFIG;
