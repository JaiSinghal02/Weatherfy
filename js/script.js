const key = 'a4f5282e1bb6203e2bfdf687d34b2c6f'

function updatePreferenceCookie(place){
    var array = JSON.parse(localStorage.getItem('preference'))
    if(!array) array=[]
    if(array.length===5) array.pop()
    array.unshift(place)
    localStorage.setItem('preference',JSON.stringify(array))
}
function buttonOff(button){
    button.classList.add('disabled-button')
    button.value = 'Fetching'
}
function buttonOn(button){
    button.classList.remove('disabled-button')
    button.value = 'Search'
}
async function getCoordinates(location){
    try{
        var data = await (await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${key}`)).json()
        console.log(data)
        var data = data[0]
        const lat = data.lat
        const lon = data.lon
        return [lat,lon]
    }
    catch(err){
        console.log(err)
        return [null,null]
    }
}
async function getCities(country){
    const body = {country}
    console.log(body)
    try{
        var cities = (await fetch('https://shivammathur.com/countrycity/cities/india')).data
        return cities
    }
    catch(err){
        console.log(err.data)
        return null
    }
}
async function getWeatherData(lat,lon){
    try{
        var data = await (await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`)).json()
        return data
    }
    catch(err){
        console.log(err)
    }
}

async function fetchPlaceWeather(){
    const place = 'london'
    updatePreferenceCookie(place)
    const [lat,lon] = await getCoordinates(place)
    if(lat!==null){
        const data = await getWeatherData(lat,lon)
        console.log(data)
        const maxTemp = data.main.temp_max
        const minTemp = data.main.temp_min
        const temp = data.main.temp
        const weather = data.weather[0].description
        const iconId = data.weather[0].icon
    }
    console.log(maxTemp,minTemp)
}

async function fetchCountryWeather(button){
    buttonOff(button)
    const country = document.getElementById('country-input').value
    const cities = getCities(country)
    var maxTemp = -1000,minTemp=1000
    if(cities!==null){
        for(let i in cities){
            const [lat,lon] = await getCoordinates(cities[i])
            if(lat!=null){
                const data = await getWeatherData(lat,lon)
                maxTemp = Math.max(maxTemp,data.main.temp_max)
                minTemp = Math.min(minTemp,data.main.temp_min)
            }
        }
    }
    
    buttonOn(button)

}


// for icon url http://openweathermap.org/img/wn/10d@2x.png