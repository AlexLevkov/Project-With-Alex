'use strict';

import { utilService } from './util-service.js';
import { storageService } from './storage-service.js';

const KEY = 'locationsDB';

export const mapService = {
  initMap,
  addMarker,
  panTo,
  getLocations,
};

var gLocations = storageService.load(KEY) || [];

// window.gLocations = storageService.load(KEY) || [];

var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log('InitMap');
  return _connectGoogleApi().then(() => {
    console.log('google available');
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    });
    console.log('Map!', gMap);
    console.log('getting to on Map click event');

    gMap.addListener('click', (mapsMouseEvent) => {
      var position = mapsMouseEvent.latLng;
      console.log('position', position.toJSON());
      createLocation(position.toJSON());
    });

    // onMapClick();
  });
}

function createLocation({ lat, lng }) {
  const location = {
    id: utilService.makeId(),
    name: prompt('name please'),
    lat,
    lng,
    weather: 'good',
    createdAt: Date.now(),
    updtaedAt: Date.now(),
  };
  console.log('location', location);
  gLocations.push(location);
  storageService.save(KEY, gLocations);
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  });
  return marker;
}

function panTo(lat, lng) {
  console.log('pan to');
  console.log('lat', lat);
  console.log('lng', lng);
  var laLatLng = new google.maps.LatLng(lat, lng);
  gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  const API_KEY = 'AIzaSyBkXRKeDsKOa1qh717CgliMSCZYzfb_UBA'; //TODO: Enter your API Key
  var elGoogleApi = document.createElement('script');
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject('Google script failed to load');
  });
}

// FIX

var url = 'https://github.io/me/travelTip/index.html?lat=3.14&lng=1.63';

var lat = getParameterByName('lat', url);
var lng = getParameterByName('lng', url);

var x = 0;

console.log('lat', lat);
console.log('lng', lng);

function getParameterByName(name, url) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
//123

function onMapClick() {
  console.log('on map click');
  const myLatlng = { lat: -25.363, lng: 131.044 };
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: myLatlng,
  });
  // Create the initial InfoWindow.
  let infoWindow = new google.maps.InfoWindow({
    content: 'Click the map to get Lat/Lng!',
    position: myLatlng,
  });
  infoWindow.open(map);
  // Configure the click listener.
  map.addListener('click', (mapsMouseEvent) => {
    // Close the current InfoWindow.
    infoWindow.close();
    // Create a new InfoWindow.
    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
    });
    infoWindow.setContent(
      JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
    );
    infoWindow.open(map);
  });
}

function makeId(length = 6) {
  var txt = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return txt;
}

function saveToStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function loadFromStorage(key) {
  var val = localStorage.getItem(key);
  return JSON.parse(val);
}

function getLocations() {
  return gLocations;
}
