import Baby    from 'babyparse';
import request from 'request';

class Reader {
  constructor() {
    this.getCsv   = this.getCsv.bind(this);
    this.getJson   = this.getJson.bind(this);
  }

  /**
   * Get the CSV datas
   * We use the Papaparse library in order to get a JSON file from a csv
   * https://www.papaparse.com/docs
   */
  getCsv(uri, callback) {
    return new Promise((resolve, reject) => {
      request(
          {uri: uri},
          function(err, data){
            Baby.parse(data.body, {
              download      : false,
              header        : true,
              dynamicTyping : true,
              complete      : (results) => {
                resolve(callback(results));
              },
              error         : (error) => {
                reject(error);
              }
            });
            if(err !== null){
              console.error(err);
            }
          }
      );
    });
  }

  /**
   * Get the JSON datas
   * This function fetch a json data with a get request to the url
   * @param configUrl the URL of the JSON file
   * @param configName the name of the attribute to get from the JSON
   * @returns {*}
   */
  getJson(configUrl, configName) {
    if(configUrl) {
      return new Promise((resolve, reject) => {
        request(
            {url: configUrl},
            function(err, data){
              if(err !== null){
                console.error(err);
                reject(err);
              }
              else {
                resolve(data.body);
              }
            }
        )
      })
          .then((findResponse) => {
            return this.getPropByString(findResponse, configName)
          });
    }
    else {
      return {};
    }
  }

  /** Get the property name in the new created array **/
  /** https://stackoverflow.com/questions/6906108/in-javascript-how-can-i-dynamically-get-a-nested-property-of-an-object **/
  getPropByString(object, propertyString) {  // propertyString  = name, name.lastname, etc..
    if (!propertyString)
      return null;

    // Babyparse often returns a string instead of a JSON object
    if (typeof object === 'string') {
      object = JSON.parse(object);
    }
    var prop, props = propertyString.split('.');
    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
      prop = props[i];

      var candidate = object[prop];
      if (candidate !== undefined) {
        object = candidate;
      } else {
        break;
      }
    }
    return object[props[i]]; // return you value requested in the parameter "propertyString"
  }
}

export default Reader;