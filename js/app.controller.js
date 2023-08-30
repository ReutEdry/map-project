import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onDeleteLoc = onDeleteLoc
window.goToMyLocation = goToMyLocation
window.onSearchLoc = onSearchLoc
window.onCopyLink = onCopyLink
window.setQueryParam = setQueryParam
window.renderQueryParams = renderQueryParams

function onInit() {
    mapService.initMap()
        .then(map => onClickMap(map))
        .catch(() => console.log('Error: cannot init map'))
    renderQueryParams()

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
    document.querySelector('.table-layout').hidden = false
    locService.getLocs()
        .then(locs => {
            console.log('locs', locs)
            renderLocations(locs)
        })
}

function renderLocations(locations) {
    const strHtmls = locations.map(location => {
        const { id, name, lat, lng, createdAt, updateAt } = location
        return `<tr>
        <td>${id}</td>
        <td>${name}</td>
        <td>${lat}</td>
        <td>${lng}</td>
        <td>${createdAt}</td>
        <td>${updateAt}</td>
        <td>
        <section>
            <button onclick="onDeleteLoc('${id}')">X</button>
            <button onclick="onPanTo(${lat}, ${lng})">Go</button>
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
    // setQueryParam(lat, lng)
    mapService.panTo(lat, lng)
    console.log('lat', lat)
    console.log('lng', lng)
}

function onClickMap(map) {
    map.addListener('click', ev => {
        const name = 'reut'
        const lat = ev.latLng.lat()
        const lng = ev.latLng.lng()
        locService.addLocation(name, lat, lng)
        locService.getLocs()
            .then(onGetLocs)
        setQueryParam(lat, lng)

    })
}

function onDeleteLoc(id) {
    locService.deleteLocation(id)

    locService.getLocs()
        .then(onGetLocs)
}

function goToMyLocation() {
    navigator.geolocation.getCurrentPosition(pos => {
        const position = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        }
        mapService.panTo(position.lat, position.lng)
        // setQueryParam(position.lat, position.lng)

    })
}

function onSearchLoc(inputVal) {
    mapService.searchLoc(inputVal)
}

function setQueryParam(lat, lng) {
    const querryParams = `?lat=${lat}&lng=${lng}`
    const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + querryParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderQueryParams() {
    const querryParams = new URLSearchParams(window.location.search)
    const location = {
        lat: querryParams.get('lat') || 0,
        lng: querryParams.get('lng') || 0
    }

    if (!location.lat && !location.lng) return

    mapService.initMap(+location.lat, +location.lng)
}

function onCopyLink() {

    const querryParams = new URLSearchParams(window.location.search)
    const location = {
        lat: querryParams.get('lat') || 0,
        lng: querryParams.get('lng') || 0
    }
    const gitUrl = `https://reutedry.github.io/map-project/index.html?lat=${location.lat}&lng=${location.lng}`


    console.log(navigator.clipboard)
    navigator.clipboard
        .writeText(gitUrl)
}