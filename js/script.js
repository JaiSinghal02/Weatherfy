const key = 'a4f5282e1bb6203e2bfdf687d34b2c6f'

function updatePreferenceCookie(place){
    var array = JSON.parse(localStorage.getItem('preference'))
    if(!array) array=[]
    for(let i in array){
        if(array[i]===place.toLowerCase()) return
    }
    if(array.length===5) array.pop()
    array.unshift(place.toLowerCase())
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

function showPreferenceTags(){
    const preferenceElementBox = document.getElementsByClassName('preference-box')[0]
    preferenceElementBox.style.contentVisibility = 'visible'
    const preferenceTagBox = preferenceElementBox.getElementsByClassName('preference-tags')[0]
    var preferences = JSON.parse(localStorage.getItem('preference'))
    if(!preferences){
        preferences = []
        preferenceElementBox.style.contentVisibility = 'hidden'
    }
    preferenceTagBox.innerHTML=''
    preferences.forEach((preference)=>{
        preferenceTagBox.innerHTML +=`
            <div class="preference-tag" onclick="preferenceTagSearch(this.innerText)" >${preference}</div> 
        `

    })
}
async function preferenceTagSearch(cityTag){
    console.log(checkRepeatedData(cityTag))
    if(!checkRepeatedData(cityTag)){
        const [lat,lon,name] = await getCoordinates(cityTag)
        if(lat!==null){
            const data = await getWeatherData(lat,lon)
            // console.log(data)
            const maxTemp = data.main.temp_max
            const minTemp = data.main.temp_min
            const temp = data.main.temp
            const weather = data.weather[0].description
            const iconId = data.weather[0].icon
            showResult(name,temp,iconId,weather)
            // console.log(maxTemp,minTemp)
        }
    }
}

function showResult (cityName,cityTemp,cityWeatherIcon,cityWeather){
    const resultBoxElement = document.getElementsByClassName('result-box-div')[0]
    const resultBoxes = resultBoxElement.getElementsByClassName('result-box')
    const numberOfResultBoxes = resultBoxes.length
    let id = 0
    if(numberOfResultBoxes > 0) {
        id=parseInt(resultBoxes[numberOfResultBoxes-1].id.split("-")[1])+1
    }
    if(numberOfResultBoxes >=3){
        // const indexToBeRemoved = (3*(Math.floor(numberOfResultBoxes/3)-1)) + (numberOfResultBoxes%3)
        // resultBoxes[indexToBeRemoved].style.display = 'none'
        resultBoxes[0].remove()
    }
    resultBoxElement.style.contentVisibility = 'visible'
    resultBoxElement.innerHTML += `
    <div class="result-box" id="box-${id}">
        <p class="city-name">${cityName}</p>
        <p class="city-temp">${cityTemp} <sup id="degree">&#8451;</sup></p>
        <div class="weather-div">
            <div class="weather-icon" style="background-image: url(http://openweathermap.org/img/wn/${cityWeatherIcon}@2x.png)"></div>
            <div class="weather-name">${cityWeather}</div>
        </div>
    </div>`
}

async function getCoordinates(location){
    try{
        var data = await (await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${key}`)).json()
        // console.log(data)
        var data = data[0]
        const lat = data.lat
        const lon = data.lon
        const name = data.name
        return [lat,lon,name]
    }
    catch(err){
        console.log(err)
        return [null,null,null]
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
function checkRepeatedData(cityName){
    const cities = document.getElementsByClassName('city-name')
    for(let i=0;i<cities.length;++i){
        const city = cities[i].innerText.toLowerCase()
        if(city===cityName.toLowerCase()) return true
    }
    return false
}


async function fetchCityWeather(button){
    buttonOff(button)
    const city = document.getElementById('city-input').value
    if(!checkRepeatedData(city)){
        const [lat,lon,name] = await getCoordinates(city)
        if(lat!==null){
            const data = await getWeatherData(lat,lon)
            // console.log(data)
            const maxTemp = data.main.temp_max
            const minTemp = data.main.temp_min
            const temp = data.main.temp
            const weather = data.weather[0].description
            const iconId = data.weather[0].icon
            updatePreferenceCookie(city)
            showResult(name,temp,iconId,weather)
            showPreferenceTags()
            // console.log(maxTemp,minTemp)
        }
    }
    
    buttonOn(button)
}




window.onload = showPreferenceTags()

// for icon url http://openweathermap.org/img/wn/10d@2x.png