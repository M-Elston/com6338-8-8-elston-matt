// Your code here

    const weatherApp = document.querySelector("#weather-app");
    const weatherSection = weatherApp.querySelector("#weather");
    
    if (weatherSection && weatherApp && weatherSection.parentNode !== weatherApp) {
        weatherApp.appendChild(weatherSection);
    }

    const form = weatherApp.querySelector("form");
    const input = document.querySelector('input[name="search"]');
    
    const API_Key = "6a0888f3963b1b35a33ecb1b78280346";
     
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const userQuery = input.value.trim();
        if (!userQuery) return false;
        const success = await fetchWeather(userQuery);
        if (success) {
            input.value = "";
            weatherSection.innerHTML = "";
        }
        return success;
    });

    async function fetchWeather(city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=imperial&appid=${API_Key}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                displayNotFound();
                return false;    
            }
            const data = await response.json();
            displayWeather(data);
            return true;
        } catch (error) {
            displayNotFound();
            return false;
        }
    }

    function displayWeather(data) {
        const { name, sys, coord, weather, main, dt } = data;
        const iconCode = weather[0].icon;
        const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const lastUpdated = new Date(dt * 1000).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
    });

    weatherSection.innerHTML = `
        <h2>${name}, ${sys.country}</h2>
        <a href="https://www.google.com/maps/search/?api=1&query=${coord.lat},${coord.lon}" target="_blank">
        Click to view map
        </a>
        <img src="${iconURL}">
        <p style="text-transform: capitalize;">${weather[0].description}</p><br>
        <p>Current: ${main.temp.toFixed(2)}° F</p>
        <p>Feels like: ${main.feels_like.toFixed(2)}° F</p><br>
        <p>Last updated: ${lastUpdated}</p>
        `;  
    }

    function displayNotFound() {
        weatherSection.innerHTML = `<h2>Location not found</h2>`;
    }

    window.fetchWeather = fetchWeather;
    window.displayNotFound = displayNotFound;