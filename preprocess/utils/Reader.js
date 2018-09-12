import Baby           from 'babyparse';

class Reader {
  constructor() {
    this.getCsv   = this.getCsv.bind(this);
    this.getJson   = this.getJson.bind(this);
    this.jquery = null;
  }

  setJquery($) {
    this.jquery = $;
  }

  /** Get the CSV datas **/
  getCsv(url, callback) {
    return new Promise((resolve, reject) => {
      this.jquery.ajax({
        url: url,
        data: {},
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        success: function( data ) {
          Baby.parse(data, {
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
        },
        error: function (e) {
          console.error("getCsv error: ", e);
        }
      });
    });
  }

  /** Get the JSON datas **/
  getJson(config) {
    if(config.link) {
      const url = config.link;
      const name = config.name;
      return this.jquery.ajax({
        url: url,
        data: {},
        success: function( data ) {
          return data;
        },
        error: function (e) {
          console.error("GetJson error: ", e);
        }
      })
          .then((findResponse) => {
            return this.getPropByString(findResponse, name);
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