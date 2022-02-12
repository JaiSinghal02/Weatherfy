const key = 'a4f5282e1bb6203e2bfdf687d34b2c6f'

function updatePreferenceCookie(place){
    var array = JSON.parse(localStorage.getItem('preference'))
    if(!array) array=[]
    if(array.length===5) array.pop()
    array.unshift(place)
    localStorage.setItem('preference',JSON.stringify(array))
}
async function getCoordinates(location){
    var data = await (await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${key}`)).json()
    var data = data[0]
    const lat = data.lat
    const lon = data.lon
    return [lat,lon]
}
async function getWeatherData(lat,lon){
    var data = await (await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`)).json()
    return data
}

async function fetchPlaceWeather(){
    const place = 'london'
    updatePreferenceCookie(place)
    const [lat,lon] = await getCoordinates(place)
    const data = await getWeatherData(lat,lon)
    console.log(data)
    const maxTemp = data.main.temp_max
    const minTemp = data.main.temp_min
    const temp = data.main.temp
    const weather = data.weather[0].description
    const iconId = data.weather[0].icon
    console.log(maxTemp,minTemp)
}

function fetchCountryWeather(){
    const country = 'Britain'
    const [lat,lon] = await getCoordinates(country)
    const data = await getWeatherData(lat,lon)
    const maxTemp = data.main.temp_max
    const minTemp = data.main.temp_min

}


// for icon url http://openweathermap.org/img/wn/10d@2x.png