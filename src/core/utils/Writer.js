import CONFIG from "../external/Constants";

class Writer {
  constructor() {
    this.setJson   = this.setJson.bind(this);
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
          url: CONFIG.awsBucket,
          data: JSON.stringify(data),
          success: function (data) {
            console.log("write successful !");
          },
          error: function (d) {
            console.error("e", d);
          }
        })
      }
      catch (e) {
        console.error("Write error !", e)
      }
    })();
  }

}
export default Writer;