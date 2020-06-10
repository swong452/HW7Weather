
// Call main() funciton
   // today.empty()
  // forecase.empty()
  // call renderHistory - to display histoical searched city

// Listener on search-button
$("#search-button").on("click", startReport);
   
// Function startReport:
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

function startReport (event) {
   event.stopPropagation();
   event.preventDefault();

   city = $("#search-value").val();
   wURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
   $.ajax({
      url: wURL,
      method: "GET"
   }).then(wReport)
} // End startReport


function wReport (wObject) {
   console.log("wObject is: ", wObject);
   renderCurrent(wObject);
   render5days(wObject);
} // End wReport


function renderCurrent(wObject) {
   console.log(wURL);
   // Display current weekday, month, and date
   var currentDate = moment().format('dddd') + ", " + moment().format('MMM Do');
   cityDisplay = $("<div>")
      .text(city + " (" + currentDate + ")")
      .css({
         "font-weight": "bold",
         "fontSize":30,
         "padding-bottom": "10px",
      });
   var fahren = (wObject.main.temp - 273.15) * 1.8 + 32
   tempDisplay = $("<div>").text("Tempature: " + fahren + "F");
   humDisplay = $("<div>").text("Humidity: " + wObject.main.humidity + "%");
   windDisplay = $("<div>").text("Wind Speed: " + wObject.wind.speed + " MPH");
   //working https://api.openweathermap.org/data/2.5/uvi?appid=0e3be3e2387201a17d65f7f6c8b863cb&lat=42.36&lon=-71.06
   var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + wObject.coord.lat + "&lon=" + wObject.coord.lon;
   
   $.ajax({
      url: uvURL,
      method: "GET"
   }).then(dCurrent)


} // End renderCurrent

function dCurrent(uvObject) {
   var uvDisplay = $("<div>").text("UV Level: " + uvObject.value);
   $("#today").append(cityDisplay, tempDisplay,humDisplay, windDisplay, uvDisplay);
}



  // call renderCurrent (response)
     // today.empty
 // call renderFivedays(response)
   // forecast.empty




// Function renderCurrent
// Function renderFiveDays
// Function renderHistory

