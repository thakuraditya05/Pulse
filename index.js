// Bhai, OOPS ke saare circuits humne test kar liye hain. Ab hum ek real-world "ECE Lab Inventory Manager" banayenge. Isme humne jo bhi seekha hai sab use hoga:

// Classes: Components (Resistors, Capacitors) ko represent karne ke liye.

// Inheritance: Component -> Resistor.

// Encapsulation: Quantity aur Price ko # private rakhne ke liye.

// DOM & Events: Data UI par dikhane aur delete karne ke liye.

// LocalStorage: Sabse zaroori! Taaki refresh karne par data gayab na ho.



class Component{
    constructor(id,name,type,qty){
        this.id = id;
        this.name = name;
        this.type = type;
        this.qty = qty;
    }
}

let inventory=JSON.parse(localStorage.getItem('manit_lab_data')) || [];

const form = document.querySelector("#inventory-form");
const list = document.querySelector("#inventory-list");

function displayInventory(){
    list.innerHTML="";

    inventory.forEach((item)=>{
        const row=document.createElement("div");
        row.classList.add('item-row');
        row.innerHTML=`<span>${item.name}</span>
                        <span>${item.type}</span>
                        <span>${item.qty}</span>
                        <button class="del-btn" data-id="${item.id}">Delete</button>`;
        list.appendChild(row);
    });
}
function saveToStorage(){
    localStorage.setItem("manit_lab_data",JSON.stringify(inventory));
}

form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const name=document.querySelector('#comp-name').value;
    const type=document.querySelector('#comp-type').value;
    const qty=document.querySelector('#comp-qty').value;

    const id=Date.now()

    const newComp=new Component(id,name,type,qty);
    inventory.push(newComp);
    saveToStorage();
    displayInventory();

    form.reset();
});




list.addEventListener('click',(e)=>{
    if(e.target.classList.contains('del-btn')){
        const idToDel=e.target.getAttribute('data-id');
        inventory=inventory.filter((item)=>(item.id!=idToDel));
        saveToStorage();
        displayInventory();
    }
});


displayInventory();





// axios 
// import axios from 'axios';
// async function getBhopalWeather(){
//     try{
//         const res=await axios.get('https://api.open-meteo.com/v1/forecast?latitude=23.2599&longitude=77.4126&current_weather=true');
//         const weather=res.data.current_weather;

//         document.getElementById('weather-data').innerHTML=`
//         <div class="temp">${weather.temperature}°C</div>
//         <div class="wind">Wind: ${weather.windspeed} km/h</div>
//         <p>Condition: Clear Sky (2026 Vibes! ☀️)</p>`;
//     }catch(err){
//         document.getElementById('weather-data').innerHTML="Weather offline ☁️";
//         console.error("Axios Error:", err);
//     }
// }
// getBhopalWeather();

function getTechQuote(){
    fetch('https://dummyjson.com/quotes/random')
    .then((res)=>{
        if(!res.ok)throw new Error("Network response was not ok");
        return  res.json();
    })
    .then((data)=>{
        document.getElementById("quote-data").innerHTML=`
        <p>"${data.quote}"</p>
        <small>-${data.author}</small>
        `;
    })
    .catch((err)=>{
        document.getElementById('quote-data').innerText = "V=IR: Knowledge is Power! (API Offline)";
        console.error("Fetch Error:", err);
    });
}
getTechQuote();

const weatherBtn=document.querySelector('#search-weather-btn');
const cityInput=document.querySelector('#city-input');









async function getWeatherByCity(cityName){
    const weatherDataDiv=document.getElementById("weather-data");
    weatherDataDiv.innerText="Searching... 🔍";


    try{

        const geoRes=await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`);
        if(!(geoRes.data.results)){
            weatherDataDiv.innerText="City not found! ❌";
            return ;
        }else{
            const {latitude, longitude, name, country}=geoRes.data.results[0];
            const weatherRes=await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const w=weatherRes.data.current_weather;

            // ui 
            weatherDataDiv.innerHTML=`
                <div class="temp">${w.temperature}°C</div>
                <p><strong>${name}, ${country}</strong></p>
                <p>Wind: ${w.windspeed} km/h</p>
            `;
        }


    }catch(err){
        weatherDataDiv.innerText = "Error fetching weather! ☁️";
        console.error(error);
    }
}


weatherBtn.addEventListener('click', () => {
    const city=cityInput.value.trim();
    if(city){
        getWeatherByCity(city);
    }
    cityInput.value="";
});



async function getCityFromCoords(lat, lon) {
    try {
        // Reverse Geocoding API call
        const response = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        
        // City ya Locality nikalna
        const cityName = response.data.city || response.data.locality || "Unknown Location";
        getWeatherByCity(cityName);
    } catch (error) {
        console.error("Reverse Geocoding Error:", error);
        return "Current Location";
    }
}

function useCurrentLocation() {
    const display = document.getElementById('weather-data');
    if (navigator.geolocation) {
            display.innerText = "Accessing GPS... 📡";
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    // Ab in coordinates se weather fetch karo
                    getCityFromCoords(lat, lon);
                },
                (error) => {
                    console.error("Location Error:", error);
                    display.innerText = "GPS Denied. Loading Bhopal... 📍";
                     getWeatherByCity("Bhopal");; // Agar user block karde toh default Bhopal
                }
            );
        } else {
            display.innerText = "Geolocation not supported.";
            getWeatherByCity("Bhopal")
            
        }
}

useCurrentLocation();



// weatherBtn.addEventListener('click', () => {
//     const city=cityInput.value.trim();
//     if(city){
//         getWeatherByCity(city);
//     }
//     cityInput.value="";
// });

const quoteBtn=document.querySelector('#search-queto-btn');
quoteBtn.addEventListener('click',()=>{
    getTechQuote();
})

function updateClock() {
    const now = new Date();
    document.getElementById('live-time').innerText = now.toLocaleTimeString();
    document.getElementById('live-date').innerText = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
setInterval(updateClock, 1000);