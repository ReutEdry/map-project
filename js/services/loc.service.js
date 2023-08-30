import { utilService } from './util.js'


export const locService = {
    getLocs,
    addLocation
}

const LOCATION_KEY = 'locationsDB'

var gLocs = utilService.load(LOCATION_KEY) || []
// { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
// { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }

function getLocs() {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs)
        }, 2000)
    })
}

function addLocation(name, lat, lng) {
    let newLoc = {
        id: utilService.id(),
        name,
        lat,
        lng,
        createdAt: Date.now(),
        updateAt: '15:40'
    }
    gLocs.push(newLoc)
    console.log(gLocs)
    utilService.save(LOCATION_KEY, gLocs)
}

