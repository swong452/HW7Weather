
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
      //render5days(x);
   })
} // End processData


function renderCurrent(weatherObj) {
   console.log(oneCallURL);
   // Display current weekday, month, and date
   var currentDate = moment().format('dddd') + ", " + moment().format('MMM Do');
   cityDisplay = $("<div>")
      .text(city + " (" + currentDate + ")")
      .css({
         "font-weight": "bold",
         "fontSize":30,
         "padding-bottom": "10px",
      });
   var fahren = (weatherObj.current.temp - 273.15) * 1.8 + 32
   tempDisplay = $("<div>").text("Tempature: " + fahren + "F");
   humDisplay = $("<div>").text("Humidity: " + weatherObj.current.humidity + "%");
   windDisplay = $("<div>").text("Wind Speed: " + weatherObj.current.wind_speed + " MPH");
   uvDisplay = $("<div>").text("UV Index: " + weatherObj.current.uvi);

   //working https://api.openweathermap.org/data/2.5/uvi?appid=0e3be3e2387201a17d65f7f6c8b863cb&lat=42.36&lon=-71.06
   //var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + wObject.coord.lat + "&lon=" + wObject.coord.lon;
   dCurrent();
} // End renderCurrent

function dCurrent() {
   $("#today").empty();
   $("#today").append(cityDisplay, tempDisplay,humDisplay, windDisplay, uvDisplay).css ({
      "border-width": "2px",
      "border-style":"solid",
      "border-color": "lightgrey"
   });
} // End dCurrent





// Function renderCurrent
// Function renderFiveDays
// Function renderHistory

