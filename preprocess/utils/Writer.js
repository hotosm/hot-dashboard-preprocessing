import CONFIG  from "../external/Constants";
import request from 'request';

class Writer {
  constructor() {
    this.setJson   = this.setJson.bind(this);
  }

  /**
   * This function writes the preprocessed data to the amazon bucket
   * @param data
   * @returns {Promise<void>}
   */
  setJson(data) {
    return (async () => {
      try {
        await request({
              method: "put",
              uri: CONFIG.awsBucket,
              body: data,
              json: true,
              headers: {'content-type': 'application/json'}
              },
              function (err, data) {
                console.log("write successful !");
                if(err !== null){
                  console.error("e", err);
                }
              }
        );
      }
      catch (e) {
        console.error("Write error !", e)
      }
    })();
  }
}
export default Writer;