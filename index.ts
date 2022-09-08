import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import dbConnection from './config/dbConnection';
import mqttService from './service/mqttService';
import path from 'path';
import mqtt from 'mqtt';
import { mainContants } from './config/appConfig';

const host = mainContants.host;
const portData = mainContants.portData
const clientId = mainContants.clientId;

const connectUrl = `mqtt://${host}:${portData}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: mainContants.username,
  password: mainContants.password,
  reconnectPeriod: 1000,
})

const topic = mainContants.topic;

client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })
})

client.on('message', (topic: any, payload: { toString: () => any; }) => {
  Mqtt.createRecord(JSON.parse(payload.toString())).then((data: any) => {
    Mqtt.getAllRecords().then((data: any) => {
      let recordData = {
        total: 0,
        success: 0,
        failed: 0
      };
      data.forEach((record: any) => {
        recordData.total += record.total
        recordData.success += record.success
        recordData.failed += record.failed
      })
      io.send('message', recordData);
    });
  });
})

const Mqtt = new mqttService();

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
dbConnection.dbConnect();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/../views"));
app.use(express.static(path.join(__dirname, "/../public/")));
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', function () {
  io.send('message', {});
})

app.get('/', (req, res) => {
  let recordData = {
    total: 0,
    success: 0,
    failed: 0
  };
  Mqtt.getAllRecords().then((data: any) => {
    data.forEach((record: any) => {
      recordData.total += record.total
      recordData.success += record.success
      recordData.failed += record.failed
    })
    return res.render('graph', { recordData })
  });
});

http.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
})



