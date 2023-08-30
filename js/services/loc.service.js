import { storageService } from './asyncStorage.service.js'


export const locService = {
    getLocs,
    addLocation,
    deleteLocation,

}

const LOCATION_KEY = 'locationsDB'
// { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
// { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }

function getLocs() {
    const gLocs = storageService.query(LOCATION_KEY) || []

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs)
        }, 2000)
    })
}

function addLocation(name, lat, lng) {
    let newLoc = {
        id: storageService.makeId(),
        name,
        lat,
        lng,
        createdAt: Date.now(),
        updateAt: '15:40'
    }
    storageService.post(LOCATION_KEY, newLoc)
}

function deleteLocation(id) {
    storageService.remove(LOCATION_KEY, id)
}


