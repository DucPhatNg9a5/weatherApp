if ("geolocation" in navigator) {

navigator.geolocation.getCurrentPosition(async function(position) {
  let lat, lon, weather, aq;
  try {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  document.getElementById("latitude").textContent = lat.toFixed(2);
  document.getElementById("longitude").textContent = lon.toFixed(2);

  const api_url = `/weather/${lat},${lon}`;
  const weather_response = await fetch(api_url);
  const rec_data = await weather_response.json();

  console.log(rec_data);

  const weather = rec_data.weather.currently;
  const aq = rec_data.air_quality.results[0].measurements[0];

  document.getElementById("summary").textContent = weather.summary;
  document.getElementById("temperature").textContent = weather.temperature;
  document.getElementById("aq_parameter").textContent = aq.parameter;
  document.getElementById("aq_value").textContent = aq.value;
  document.getElementById("aq_unit").textContent = aq.unit;
  document.getElementById("aq_date").textContent = aq.lastUpdated;
  } catch(err) {
    console.log(err);
  }
  const out_data = {lat , lon, weather, aq};

  const button = document.getElementById("myButton");
  button.addEventListener("click", async event => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(out_data)
    };

    const response = await fetch("/api", options);
    const json = await response.json();
    console.log(json);
  });
});

} else {
console.log("geolocation IS NOT available");
}

///////////////////////////////////////////////////////////////////////////////////

document.getElementById("mapid").style.height = "220px";

var mymap = L.map('mapid').setView([0, 0], 1);

var osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
var osmURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib = '&copy; ' + osmLink;

var osmMap = L.tileLayer(osmURL, {
 attribution: osmAttrib
}).addTo(mymap);

///////////////////////////////////////////////////////////////////////////////////
getData();

async function getData() {
  const response = await fetch('/api');
  const data = await response.json();

  for (item of data) {
    //console.log(item)
    const marker = L.marker([item.lat, item.lon]).addTo(mymap);

    let txt =
`   <p>
      Latitude: ${item.lat}&deg;
      <br/>
      Longitude: ${item.lon}&deg;
    </p>
    <p>
      The weather here is ${item.weather.summary}
      <br/>
      The temperature is ${item.weather.temperature}° C.
    </p>`
    if (item.aq.value < 0) {
      txt += `No air quality reading.`;
    } else {
      txt += `<p>
      The concentration of particulate matter (${item.aq.parameter}) is ${item.aq.value} ${item.aq.unit} last read on ${item.aq.lastUpdated}.
              </p>`;
    }
    marker.bindPopup(txt);
  }


}
