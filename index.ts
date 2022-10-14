import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import mqtt from 'mqtt';
import { mainContants } from './config/appConfig';
import { myDataSource } from './config/dbConnection';
import { MqttModel } from "./mqtt.entity";
import { JsonDataModel } from "./jsonData.entity";
import bodyParser from 'body-parser';
import { json } from './constants/jsonContstant';
import { generateData } from './services/helperService';

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

myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err: any) => {
    console.error("Error during Data Source initialization:", err)
  })

client.on('message', async (topic: any, payload: { toString: () => any; }) => {
  let recordData = {
    total: 0,
    success: 0,
    failed: 0
  };
  const record = await myDataSource.getRepository(MqttModel).find();
  if (record.length === 0) {
    const createRecord = await myDataSource.getRepository(MqttModel).create(JSON.parse(payload.toString()))
    await myDataSource.getRepository(MqttModel).save(createRecord)
    recordData.total = JSON.parse(payload.toString()).total
    recordData.success = JSON.parse(payload.toString()).success
    recordData.failed = JSON.parse(payload.toString()).failed
    io.send('message', recordData);
  }
  else {
    recordData.total = JSON.parse(payload.toString()).total
    recordData.success = JSON.parse(payload.toString()).success
    recordData.failed = JSON.parse(payload.toString()).failed
    const updateRecord = await myDataSource.getRepository(MqttModel).update(record[0].id,recordData)
    io.send('message', recordData);
  }
});

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/../views"));
app.use(express.static(path.join(__dirname, "/../public/")));
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', function () {
  io.send('message', {});
})

app.get('/', async (req, res) => {
  let recordData = {
    total: 0,
    success: 0,
    failed: 0
  };
  const users = await myDataSource.getRepository(MqttModel).find()
  recordData.total = users[0] ? users[0].total : 1
  recordData.success = users[0] ? users[0].success : 1
  recordData.failed = users[0] ? users[0].failed : 1
  return res.render('graph', { recordData })
});

app.get('/dataScreen', async (req, res) => {
  const dbData = await myDataSource.getRepository(JsonDataModel).find();

  return res.render('dataScreen' , { jsonData : dbData.length !== 0 ? dbData[0].jsonData : ''})
});

app.get('/jsonData', async (req, res) => {
  const dbData = await myDataSource.getRepository(JsonDataModel).find();

  return res.send(dbData.length !== 0 ? dbData[0].jsonData : '')
});

app.post('/dataScreen', async (req, res) => {
  const formData = req.body;
  let objectData: any = json;
  const dbData = await myDataSource.getRepository(JsonDataModel).find();
  if(dbData.length === 0)
  {
    const dataGenerated = generateData(formData, objectData, dbData);
    const createRecord = myDataSource.getRepository(JsonDataModel).create({ jsonData: dataGenerated })
    await myDataSource.getRepository(JsonDataModel).save(createRecord) 

    return res.redirect('/dataScreen');
  }
  const dataGenerated = generateData(formData, objectData, dbData[0].jsonData);
  await myDataSource.getRepository(JsonDataModel).update(dbData[0].id, { jsonData: dataGenerated })
 
  return res.redirect('/dataScreen');
});



http.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
})



