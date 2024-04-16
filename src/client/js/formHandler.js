import { validateInputs } from "./validateInput";
import { countDownDays } from "./calculate";

/* Global Variables */
const serverURL = 'http://localhost:8090';

document.getElementById('add-trip-button').addEventListener('click', handleAddTripClick);
document.getElementById('remove-trip-button').addEventListener('click', removeTripInfo);
document.getElementById('save-trip-button').addEventListener('click', saveTripInfo);

// Handler for clicking the add trip button
async function handleAddTripClick(event) {
    event.preventDefault(); 

    const cityName = document.getElementById('cityInput').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    validateInputs(cityName, startDate, endDate);

    try {
        const tripDetails = await fetchTripDetails(cityName, startDate);
        displayTripInformation(tripDetails, startDate);
    } catch (error) {
        console.error(`Failed to process trip details: ${error}`);
    }
}

// Fetch city data, weather, and image and compile trip details
async function fetchTripDetails(cityName, startDate) {
    const cityData = await fetchCityData(cityName);
    if (!cityData) {
        throw new Error(`Failed to fetch city data for ${cityName}`);
    }
    console.log(cityData.lat, cityData.lng, cityData.country);
    const weatherData = await fetchWeather(cityData.lat, cityData.lng, cityData.country);
    console.log(weatherData);
    const cityImageData = await fetchCityImage(cityName);

    return { cityData, weatherData, cityImageData, startDate };
}

// Display trip details on the UI
function displayTripInformation({ cityData, weatherData, cityImageData, startDate }) {
    if (!cityData || !weatherData) {
        console.error("Trip details are incomplete.");
        return;
    }
    if (!cityImageData) {
        console.log('I was called');
        document.getElementById('trip-image').src = '../media/city_default.jpg';
    } else {
        document.getElementById('trip-image').src = cityImageData[0].webformatURL;
    }

    const tripInfoElement = document.querySelector('.trip-info');
    tripInfoElement.style.display = 'flex';
    document.getElementById('trip-title').textContent = `${cityData.name}, ${cityData.districtName}, ${cityData.country}`;
    document.getElementById('trip-departing').textContent = `Departure: ${startDate}`;
    document.getElementById('trip-countdown').textContent = `${cityData.name} is ${countDownDays(startDate)} days away`;
    document.getElementById('trip-weather').textContent = `Temperature: ${weatherData.data[0].app_temp} °C, ${weatherData.data[0].weather.description}`;
    document.getElementById('trip-image').alt = `Image of ${cityName}`;
}

async function fetchCityData(cityName) {
    const url = `${serverURL}/city/geodata/${cityName}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok for city data');
    }
    const data = await response.json();
    if (!data || !Array.isArray(data.geonames) || data.geonames.length === 0) {
        console.error("Invalid or empty geonames data");
        return null;
    }
    const { lat, lng, countryName, toponymName, adminName1 } = data.geonames[0];
    if (lat == null || lng == null || countryName == null) {
        throw new Error("Necessary geolocation data is missing");
    }
    return {
        lat,
        lng,
        country: countryName,
        name: toponymName,
        districtName: adminName1
    };
}

//fetch Weather
async function fetchWeather(lat, lng, countryName) {
    const url = new URL(`${serverURL}/city/weather`);
    url.searchParams.append('lat', lat);
    url.searchParams.append('lng', lng);
    url.searchParams.append('countryName', countryName);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error fetching weather data! status: ${response.status}`);
    }
    return await response.json();
}

//fetch Image
async function fetchCityImage(cityName) {
    try {
        const response = await fetch(`${serverURL}/city/image/${cityName}`);
        if (!response.ok) {
            throw new Error('Failed to fetch city image');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching image for ${cityName}: ${error}`);
        return null;
    }
}

function removeTripInfo() {
    const tripInfoElement = document.querySelector('.trip-info');
    if (tripInfoElement) {
        tripInfoElement.style.display = 'none';
    } else {
        console.log("No trip info to remove.");
    }
}

//save trip by sending to server
async function saveTripInfo() {
    const tripInfoElement = document.querySelector('.trip-info');
    if (!tripInfoElement) {
        console.error('Trip info element not found');
        return;
    }

    const tripData = {
        title: document.getElementById('trip-title').textContent,
        departing: document.getElementById('trip-departing').textContent,
        countdown: document.getElementById('trip-countdown').textContent,
        weather: document.getElementById('trip-weather').textContent,
        imageUrl: document.getElementById('trip-image').src,
        imageAlt: document.getElementById('trip-image').alt
    };

    try {
        const response = await fetch('http://localhost:8090/trip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tripData)
        });

        if (!response.ok) {
            throw new Error('Failed to save trip info');
        }

        const responseData = await response.json();
        console.log('Trip info saved:', responseData);
    } catch (error) {
        console.error('Error saving trip info:', error);
    }
}


export { handleAddTripClick };
