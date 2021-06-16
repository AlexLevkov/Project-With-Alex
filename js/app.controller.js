import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
// הערה
window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
// window.onMapClick = onMapClick;

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready');
    })
    .catch(() => console.log('Error: cannot init map'));
  renderLocations();
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onAddMarker() {
  console.log('Adding a marker');
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs);
    document.querySelector('.locs').innerText = JSON.stringify(locs);
  });
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log('User position is:', pos.coords);
      console.log('User pos is:', pos);
      mapService.panTo(pos.coords.latitude, pos.coords.longitude);
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
    })
    .catch((err) => {
      console.log('err!!!', err);
    });
}

function onPanTo(ltd = 139.6917, lng = 35.6895) {
  console.log('Panning the Map');
  mapService.panTo(ltd, lng);
}

function renderLocations() {
  let locations = mapService.getLocations();
  console.log('locations', locations);
  var elContainer = document.querySelector('.locs');
  console.log('elContainer', elContainer);
  var strHtml = locations.map((location, idx) => {
    return `<ul>
     <li data-ltd="${location.ltd}" data-lng="${location.lng}"  class="${location.id} location" onclick="onPanTo(${location.ltd},${location.lng},)"> ${location.name}</li>
     </ul>`;
  });
  console.log('strHtml', strHtml);
  elContainer.innerHTML = strHtml.join('');

  // var ElLocation = document.querySelectorAll('.location');
  // ElLocation.addEventListner('click', ( el.dataset.ltd,el.dataset.lng  ) => {
  //   onPanTo();
  // });
}
