const searchInput = document.getElementById("searchId");
const submitBtn = document.getElementById("submitBtn");

const ipAdressP = document.getElementById("ipAdressP");
const locationP = document.getElementById("locationP");
const timezoneP = document.getElementById("timezoneP");
const ispP = document.getElementById("ispP");
let lat = 0;
let lng = 0;
let userIpAdress = "";

let map;

let searchActive = false;

const API_KEY = "at_OFj4mpAD7hFRCENf4FSGUTCJJ0kDO";
const ACCESS_TOKEN =
  "pk.eyJ1IjoiYmFydGVrbW5lbW8iLCJhIjoiY2wyZXdwdzNjMDUydzNubmI5NHQyZDR4ayJ9.31JnC-ptw4Ju-_tvpPhC8g";

const getMap = () => {
  if (!searchActive) {
    map = L.map("map").setView([lat, lng], 13);
    L.tileLayer(
      `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${ACCESS_TOKEN}`,
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "your.mapbox.access.token",
      }
    ).addTo(map);

    var marker = L.marker([lat, lng]).addTo(map);
  } else {
    map.panTo(new L.LatLng(lat, lng));
    searchActive = false;
  }
};

function getIpInfo(ipAdress) {
  if (ipAdress.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
    url = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=`;
  } else {
    url = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&domain=`;
  }
  fetch(url + ipAdress, { cache: "no-cache" })
    .then((res) => {
      if (res.ok) return res.json();
      else {
        return null;
      }
    })
    .then((data) => {
      ipAdressP.textContent = data.ip;
      locationP.textContent = `${data.location.city}, ${
        data.location.country
      } ${data.location.postalCode ? `,${data.location.postalCode}` : ""}`;
      timezoneP.textContent = `UTC${data.location.timezone}`;
      ispP.textContent = data.isp;
      lat = data.location.lat;
      lng = data.location.lng;
      getMap();
    })
    .catch((err) => {
      console.log(JSON.stringify(err));
    });
}

const getUserIp = () => {
  fetch("https://api.ipify.org/?format=json", { cache: "no-cache" })
    .then((response) => response.json())
    .then((data) => {
      userIpAdress = data;
    })
    .catch((err) => {
      console.log(JSON.stringify(err));
    });
};

getUserIp();
getIpInfo(userIpAdress);

submitBtn.addEventListener("click", () => {
  searchActive = true;
  userIpAdress = searchInput.value;
  getIpInfo(userIpAdress);
});
