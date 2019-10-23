console.log("hello world");
document.getElementById("mapid").style.height = "180px";


var mymap = L.map('mapid').setView([51.505, -0.09], 2);

var osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
var osmURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib = '&copy; ' + osmLink;

var osmMap = L.tileLayer(osmURL, {
 attribution: osmAttrib
}).addTo(mymap);

var myIcon = L.icon({
    iconUrl: 'iss_img.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

const marker = L.marker([0, 0], {icon: myIcon}).addTo(mymap);

/////////////////////////////////////////////////////////////////////////

setInterval(getData , 3000);

let firstTime = true;

async function getData() {
  const response = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
  const data = await response.json();
  const {latitude,longitude} = data;

  document.getElementById('lat').textContent = latitude;
  document.getElementById('long').textContent = longitude;
  marker.setLatLng([latitude,longitude]);
  if (firstTime){
  mymap.setView([latitude, longitude], 2);
  firstTime = false;
  }
}
/////////////////////////////////////////////////////////////////////////
