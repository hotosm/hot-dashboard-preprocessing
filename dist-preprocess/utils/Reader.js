'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babyparse = require('babyparse');

var _babyparse2 = _interopRequireDefault(_babyparse);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Reader {
  constructor() {
    this.getCsv = this.getCsv.bind(this);
    this.getJson = this.getJson.bind(this);
  }

  /** Get the CSV datas **/
  getCsv(uri, callback) {
    return new Promise((resolve, reject) => {
      (0, _request2.default)({ uri: uri }, function (err, data) {
        _babyparse2.default.parse(data.body, {
          download: false,
          header: true,
          dynamicTyping: true,
          complete: results => {
            resolve(callback(results));
          },
          error: error => {
            reject(error);
          }
        });
        if (err !== null) {
          console.error(err);
        }
      });
    });
  }

  /** Get the JSON datas **/
  getJson(configUrl, configName) {
    if (configUrl) {
      return new Promise((resolve, reject) => {
        (0, _request2.default)({ url: configUrl }, function (err, data) {
          if (err !== null) {
            console.error(err);
            reject(err);
          } else {
            resolve(data.body);
          }
        });
      }).then(findResponse => {
        return this.getPropByString(findResponse, configName);
      });
    } else {
      return {};
    }
  }

  /** Get the property name in the new created array **/
  /** https://stackoverflow.com/questions/6906108/in-javascript-how-can-i-dynamically-get-a-nested-property-of-an-object **/
  getPropByString(object, propertyString) {
    // propertyString  = name, name.lastname, etc..
    if (!propertyString) return null;

    // Babyparse often returns a string instead of a JSON object
    if (typeof object === 'string') {
      object = JSON.parse(object);
    }
    var prop,
        props = propertyString.split('.');
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

exports.default = Reader;