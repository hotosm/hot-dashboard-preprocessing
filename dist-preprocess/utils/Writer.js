"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Constants = require("../external/Constants");

var _Constants2 = _interopRequireDefault(_Constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Writer {
  constructor() {
    this.setJson = this.setJson.bind(this);
    this.jquery = null;
  }

  setJquery($) {
    this.jquery = $;
  }

  /** Set the JSON datas **/
  setJson(data) {
    return (async () => {
      try {
        await this.jquery.ajax({
          contentType: "application/json",
          method: "put",
          url: _Constants2.default.awsBucket,
          data: JSON.stringify(data),
          success: function (data) {
            console.log("write successful !");
          },
          error: function (d) {
            console.error("e", d);
          }
        });
      } catch (e) {
        console.error("Write error !", e);
      }
    })();
  }

}
exports.default = Writer;