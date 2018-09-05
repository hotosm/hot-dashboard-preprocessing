const CONFIG = {
  // This is the entrypoint of the preprocessing function in order to get the list of the projects and the data associated with it
  projects: 'https://s3.eu-central-1.amazonaws.com/hot-data-proofofwork/dashboard_projects_list+-+_config.csv',
  // This is where the aggregated data is stored and fetched
  awsBucket: 'https://s3.eu-central-1.amazonaws.com/hot-data-proofofwork/rawdata.json'
};
export default CONFIG;