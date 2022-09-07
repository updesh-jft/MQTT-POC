import mqttModel from '../models/mqtt';

class Mqtt {
  createRecord = (body: any) => {
    return new Promise((resolve, reject) => {
      new mqttModel(body).save((error: any, result: unknown) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      })
    })
  }

  getAllRecords = () => {
    return new Promise((resolve, reject) => {
      mqttModel.find((error: any, result: unknown) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      })
    })
  }
}


export default Mqtt;