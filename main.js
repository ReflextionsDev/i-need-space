// Requirements
// - Your final website is responsive (looks good on mobile and desktop)

// --- Document Elements ---
const elemSearch = document.querySelector('#search')
const elemKey = document.querySelector('#api-key')
const elemAddress = document.querySelector('#address')
const elemSatelite = document.querySelector('#norad')
const elemRise = document.querySelector('.rise')
const elemCulm = document.querySelector('.culm')
const elemSet = document.querySelector('.set')
const elemPass = document.querySelector('.pass')
const elemPassSection = document.querySelector('.passSection')
const body = document.querySelector('body')


// --- Global Variables ---
let loc = '', id = '', debugLog = 1

// --- Startup ---
elemPassSection.style.display = "none"

// --- URL Functions ---

function getMapboxURL(key, loc) {

    const urlBase = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
    const urlAppend = '.json?access_token='

    let url = urlBase + loc + urlAppend + key
    return encodeURI(url)

}

function getFlybyURL(latt, long, id) {

    const urlBase = 'https://satellites.fly.dev/passes/'
    const urlNORAD = id + '?'
    const urlLatt = 'lat=' + latt
    const urlLong = '&lon=' + long
    const urlAppend = '&limit=1&days=15&visible_only=true'

    let url = urlBase + urlNORAD + urlLatt + urlLong + urlAppend

    return encodeURI(url)
}


// --- Document Events ---

elemSearch.addEventListener('click', async () => {

    // Hide old data
    elemPassSection.style.display = "none"

    // User input
    let key = elemKey.value
    loc = elemAddress.value
    id = elemSatelite.value

    try {

        // Mapbox request
        let mapboxURL = getMapboxURL(key, loc)

        const mapboxResponse = await fetch(mapboxURL)
        if (debugLog) { console.log(mapboxResponse) }

        const mapboxData = await mapboxResponse.json()
        if (debugLog) { console.log(mapboxData) }

        const long = mapboxData.features[0].center[0]
        const latt = mapboxData.features[0].center[1]
        const flybyURL = getFlybyURL(latt, long, id)

        // Flyby request
        let flybyResponse = await fetch(flybyURL)
        if (debugLog) { console.log(flybyResponse) }

        let flybyData = await flybyResponse.json()
        if (debugLog) { console.log(flybyData) }

        // Display data
        const rise = flybyData[0].rise.utc_datetime
        const culm = flybyData[0].culmination.utc_datetime
        const set = flybyData[0].set.utc_datetime
        showPass(rise, culm, set)
    } catch {
        alert('There was an error with your request.')
    }

})

function showPass(rise, culm, set) {

    elemPass.innerHTML = `Next Satellite Pass in ${loc} (#${id}):`
    elemRise.innerHTML = "Rise: " + rise
    elemCulm.innerHTML = "Culm: " + culm
    elemSet.innerHTML = "Set: " + set

    elemPassSection.style.display = "block"
}