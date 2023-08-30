import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onDeleteLoc = onDeleteLoc
window.goToMyLocation = goToMyLocation

function onInit() {
    mapService.initMap()
        .then(map => onClickMap(map))
        .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('locs', locs)
            renderLocations(locs)
        })
}

function renderLocations(locations) {
    const strHtmls = locations.map(location => {
        return `<tr>
        <td>${location.id}</td>
        <td>${location.name}</td>
        <td>${location.lat}</td>
        <td>${location.lng}</td>
        <td>${location.createdAt}</td>
        <td>${location.updateAt}</td>
        <td>
        <section>
            <button onclick="onDeleteLoc('${location.id}')">X</button>
            <button onclick="onPanTo(${location.lat}, ${location.lng})">Go</button>
        </section>
    </td>
        </tr>`
    })
    document.querySelector('.locs').innerHTML = strHtmls.join('')
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onPanTo(lat, lng) {
    console.log(lat, lng)
    mapService.panTo(lat, lng)
}

function onClickMap(map) {
    map.addListener('click', ev => {
        const name = 'reut'
        const lat = ev.latLng.lat()
        const lng = ev.latLng.lng()
        locService.addLocation(name, lat, lng)
        locService.getLocs()
            .then(onGetLocs)
    })
}

function onDeleteLoc(id) {
    locService.deleteLocation(id)

    locService.getLocs()
        .then(onGetLocs)
}

function goToMyLocation() {
    var laLatLng = navigator.geolocation.getCurrentPosition(pos => {
        const position = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        }
        console.log('position:', position)
    })
}