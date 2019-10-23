const express = require("express");
const Datastore = require("nedb");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
app.use(express.static("weather"));
app.use(express.json());

const db = new Datastore('database.db');
db.loadDatabase();

app.get('/api', (request, response) => {
  db.find({},(err, data) => {
    if (err) {
      console.log(err);
      response.end();
      return;
    }
    response.json(data);
  });
});

app.post('/api', (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  db.insert(data);
  response.json(data);
});

app.get("/weather/:latlon", async (request, response) => {
  const latlon = request.params.latlon.split(',');
  const lat = latlon[0];
  const lon = latlon[1];
  const myAPI = process.env.API_KEY;
  const weather_url = `https://api.darksky.net/forecast/${myAPI}/${lat},${lon}/?units=si`;
  const weather_response = await fetch(weather_url);
  const weather_json = await weather_response.json();

  const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
  const aq_response = await fetch(aq_url);
  const aq_json = await aq_response.json();

  const data = {
    weather: weather_json,
    air_quality: aq_json
  };
  response.json(data);
})
