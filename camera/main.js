
var mymap = L.map('mapid').setView([51.505, -0.09], 2);

var osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
var osmURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib = '&copy; ' + osmLink;

document.getElementById("mapid").style.height = "200px";


var osmMap = L.tileLayer(osmURL, {
 attribution: osmAttrib
}).addTo(mymap);

const marker = L.marker([-999, -999]).addTo(mymap);

// getLocation();



///////////////////////////////////////////////////////////////////////////////////

function setup() {
  noCanvas();
  const video = createCapture(VIDEO);
  video.size(100,100);
  const button = document.getElementById("myButton");
  button.addEventListener("click", async event => {
  if ("geolocation" in navigator) {

  console.log("geolocation is available");

  navigator.geolocation.getCurrentPosition(async function(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    video.loadPixels();
    const image64 = video.canvas.toDataURL();
    document.getElementById("latitude").textContent = lat;
    document.getElementById("longitude").textContent = lon;

    const api_url = `/weather/${lat},${lon}`;
    const weather_response = await fetch(api_url);
    const rec_data = await weather_response.json();
    const weather = rec_data.weather.currently.summary;


    marker.setLatLng([lat,lon]);
    mymap.setView([lat,lon], 10);

    const mood = document.getElementById("myInput").value;

    const data = {lat , lon, mood, image64, weather};

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    const response = await fetch("/api", options);
    const json = await response.json();
    console.log(json);
  });

  } else {
  console.log("geolocation IS NOT available");
  }
});
}
