// Requirements
// - Users can type in an address and a NORAD to receive information on the next time that satellite will be visible
// - Your final website is responsive (looks good on mobile and desktop)

// Error handling

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

// .then
elemSearch.addEventListener('click', () => {

    elemPassSection.style.display = "none"

    let key = elemKey.value
    loc = elemAddress.value
    id = elemSatelite.value

    let mapboxURL = getMapboxURL(key, loc)

    fetch(mapboxURL)
        .then((webData) => {
            if (debugLog) { console.log(webData) }
            return webData.json()
        })
        .then((data) => {

            if (debugLog) { console.log(data) }
            const long = data.features[0].center[0]
            const latt = data.features[0].center[1]
            const flybyURL = getFlybyURL(latt, long, id)

            fetch(flybyURL)
                .then((webData) => {
                    if (debugLog) { console.log(webData) }
                    return webData.json()
                })
                .then((data) => {
                    if (debugLog) { console.log(data) }
                    const rise = data[0].rise.utc_datetime
                    const culm = data[0].culmination.utc_datetime
                    const set = data[0].set.utc_datetime
                    showPass(rise, culm, set)
                })
        })
        .catch(() => {
            alert("There was an error with your request.")
        })
})

function showPass(rise, culm, set) {

    elemPass.innerHTML = `Next Satellite Pass in ${loc} (#${id}):`
    elemRise.innerHTML = "Rise: " + rise
    elemCulm.innerHTML = "Culm: " + culm
    elemSet.innerHTML = "Set: " + set

    elemPassSection.style.display = "block"
}