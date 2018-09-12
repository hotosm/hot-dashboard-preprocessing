"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Constants = require("../external/Constants");

var _Constants2 = _interopRequireDefault(_Constants);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Writer {
  constructor() {
    this.setJson = this.setJson.bind(this);
  }

  /** Set the JSON datas **/
  setJson(data) {
    return (async () => {
      try {
        await (0, _request2.default)({
          method: "put",
          uri: _Constants2.default.awsBucket,
          body: data,
          json: true,
          headers: { 'content-type': 'application/json' }
        }, function (err, data) {
          console.log("write successful !");
          if (err !== null) {
            console.error("e", err);
          }
        });
      } catch (e) {
        console.error("Write error !", e);
      }
    })();
  }
}
exports.default = Writer;