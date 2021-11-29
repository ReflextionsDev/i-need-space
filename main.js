// Requirements
// - Users can type in an address and a NORAD to receive information on the next time that satellite will be visible
// - Your final website is responsive (looks good on mobile and desktop)

// --- Document Elements ---
const elemSearch = document.querySelector('#search')
const elemKey = document.querySelector('#api-key')
const elemAddress = document.querySelector('#address')
const elemSatelite = document.querySelector('#norad')

// --- URL Functions ---

function getMapboxURL(key, loc) {

    const urlBase = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
    const urlAppend = '.json?access_token='

    let url = urlBase + loc + urlAppend + key
    return url

}

function getFlybyURL() {

    const urlBase = 'https://satellites.fly.dev/passes/25544?lat=-34.91&lon=-57.93&limit=1&days=15&visible_only=true'

}


// --- Document Events ---

elemSearch.addEventListener('click', () => {

    const key = elemKey.value
    const loc = elemAddress.value

    let mapboxURL = getMapboxURL(key, loc)

    console.log(encodeURI(mapboxURL))


    fetch(mapboxURL)
        .then((webData) => {
            console.log(webData)
            return webData.json()
        })
        .then((data) => {
            console.log(data)

            // long
            console.log(data.features[0].center[0])

            // lad

            console.log(data.features[0].center[1])
        })
})
