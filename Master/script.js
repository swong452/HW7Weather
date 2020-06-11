// Listener on search-button
$("#search-button").on("click", fetchData);
   
var APIKey = "0e3be3e2387201a17d65f7f6c8b863cb";
var wURL; 
var city;

var cityDisplay;
var tempDisplay;
var humDisplay;
var windDisplay;
var uvDisplay;
var iconDisplay;
var forecastDay = 1;


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
      $("#forecast").empty();
      $("#forecast").append($("<div>").text("5 day Forecast: ") // Add a title before displaying 5 days forecast
      .css({
         "font-weight": "bold",
         "fontSize":30,
         "padding-bottom": "10px",
         "color": "salmon"
      }));

      // Display 5 days forecast, one by one
      for (var i = 1; i <=5 ; i++){
         render5days(onecallObj, i);
      }
      
   })
} // End processData

// Prepare Current Weather Data
function renderCurrent(weatherObj) {

   var currentDate = moment().format('l')
   console.log("Forecast day:", forecastDay, typeof(forecastDay));
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

   // Call dCurrent to display Weather data
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
function render5days(forecastObj, fDay) {
   // .add function add number of day from current date
   var fDate = $("<div>").text(moment().add(fDay, 'day').format('l'));
   var fTemp = $("<div>").text("Temp: " +  kelvinToF(forecastObj.daily[fDay].temp.max) + "F");
   var fHum = $("<div>").text("Humidity: " + forecastObj.daily[fDay].humidity + "%");
   var fIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + forecastObj.daily[fDay].weather[0].icon + "@2x.png");
   dForecast(fDate, fTemp, fHum, fIcon, fDay);
} 

// Display Forecast Data
function dForecast(fDate, fTemp, fHum, fIcon, fDay) {
   var oneDayContainer = $("<div>").append(fDate, fIcon, fTemp, fHum)
   .css({
      "border-width": "2px",
      "border-style":"solid",
      "border-color": "lightgrey",
      "width": "20%",
      "background-color": "lightblue",
      "display": "inline-block"       //so each div line up horizontally
   });

   $("#forecast").append(oneDayContainer);
} // End dForecast

function kelvinToF (kelvin) {
   var fahran = ((kelvin - 273.15) * 1.8 + 32).toFixed(2);
   return fahran
}


// Function renderHistory

