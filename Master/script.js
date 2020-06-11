
// Call main() funciton
   // today.empty()
  // forecase.empty()
  // call renderHistory - to display histoical searched city

// Listener on search-button
$("#search-button").on("click", fetchData);
   
// Function fetchData:
  // Extract Value from search-value
  // Save to local storage array. 
  // make API call to weather. 
var APIKey = "0e3be3e2387201a17d65f7f6c8b863cb";
var wURL; 
var city;

var cityDisplay;
var tempDisplay;
var humDisplay;
var windDisplay;
var uvDisplay;
var iconDisplay;


// Make API call to retrieve current and 5 days objects
// Then pass to each respective function for further processing
function fetchData (event) {
   event.stopPropagation();
   event.preventDefault();

   // Retrieve user input city
   city = $("#search-value").val();

   // Fetch current weather data
   wURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
   
   $.ajax({
      url: wURL,
      method: "GET"
   }).then(processData)
} // End fetchData

// This function will use the input obj, extract the Lat and Longtitude info
// Lat/Lon are required parameters to make oneCall API, which give current and 5 days forecast data
function processData (wObject) {
   console.log("Pre processed wObject is: ", wObject);

   //working:  https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&%20&exclude=minutely,hourly&appid=0e3be3e2387201a17d65f7f6c8b863cb
   oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + wObject.coord.lat + "&lon=" + wObject.coord.lon + "&exclude=minutely, hourly&appid=" + APIKey;
   $.ajax({
      url: oneCallURL,
      method:"GET"
   }).then(function(onecallObj) {
      console.log("Processed object is a one call obj:", onecallObj);
      renderCurrent(onecallObj);
      render5days(onecallObj);
   })
} // End processData

// Prepare Current Data
function renderCurrent(weatherObj) {
   console.log(oneCallURL);
   // Display current weekday, month, and date
   //var currentDate = moment().format('dddd') + ", " + moment().format('MMM Do');
   var currentDate = moment().format('l')

   // iconDisplay = $("<img>").attr("src", "http://openweathermap.org/img/wn/10d@2x.png");
   iconDisplay = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + weatherObj.current.weather[0].icon + "@2x.png");

   cityDisplay = $("<div>")
      .text(city + " (" + currentDate + ")")
      .css({
         "font-weight": "bold",
         "fontSize":30,
         "padding-bottom": "10px",
      }).append(iconDisplay);
   

   tempDisplay = $("<div>").text("Tempature: " + kelvinToF(weatherObj.current.temp) + "F");
   humDisplay = $("<div>").text("Humidity: " + weatherObj.current.humidity + "%");
   windDisplay = $("<div>").text("Wind Speed: " + weatherObj.current.wind_speed + " MPH");
   uvDisplay = $("<div>").text("UV Index: " + weatherObj.current.uvi);

   dCurrent();
} // End renderCurrent

// Display Current Weather
function dCurrent() {
   $("#today").empty();
   $("#today").append(cityDisplay, tempDisplay,humDisplay, windDisplay, uvDisplay).css ({
      "border-width": "2px",
      "border-style":"solid",
      "border-color": "lightgrey"
   });
} // End dCurrent


// Prepare forecast data
function render5days(forecastObj) {
   var fDate = $("<div>").text(moment().add(1, 'day').format('l'));
   var fTemp = $("<div>").text("Temp: " +  kelvinToF(forecastObj.daily[1].temp.max) + "F");
   var fHum = $("<div>").text("Humidity: " + forecastObj.daily[1].humidity + "%");
   var fIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + forecastObj.daily[1].weather[0].icon + "@2x.png");
   dForecast(fDate, fTemp, fHum, fIcon);
} 

// Display Forecast Data
function dForecast(fDate, fTemp, fHum, fIcon) {
   var oneDayContainer = $("<div>").append(fDate, fIcon, fTemp, fHum)
   .css({
      "border-width": "2px",
      "border-style":"solid",
      "border-color": "lightgrey",
      "width": "20%",
      "background-color": "lightblue"
   });
   $("#forecast").append(oneDayContainer);
   //$("#forecast").append(fDate, fIcon, fTemp, fHum);

}

function kelvinToF (kelvin) {
   var fahran = ((kelvin - 273.15) * 1.8 + 32).toFixed(2);
   return fahran
}




// Function renderCurrent
// Function renderFiveDays
// Function renderHistory

