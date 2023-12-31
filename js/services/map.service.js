
export const mapService = {
    initMap,
    addMarker,
    panTo,
    searchLoc
}


// Var that is used throughout this Module (not global)
var gMap


function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            return gMap
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    console.log(lat, lng)
    var laLatLng = new google.maps.LatLng(lat, lng)
    console.log(laLatLng)
    gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()

    const API_KEY = 'AIzaSyBxA1yD2IiqcC2bsHTZMwGHI4MuMir4dsw'
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function searchLoc(valInput) {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': valInput }, function (results, status) {
        if (status == 'OK') {
            gMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: gMap,
                position: results[0].geometry.location
            })
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}


