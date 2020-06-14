var APIKey = "0e3be3e2387201a17d65f7f6c8b863cb";
var wURL;
var city;

var cityDisplay;
var tempDisplay;
var humDisplay;
var windDisplay;
var uvDisplay;
var uviDisplay;
var iconDisplay;
var forecastDay = 1;
var uvPara;
var uvTotal;
var arrayLC = [];

//localStorage.clear();

dCityList();

// Display Searched City List History
// Dyamically create an Li base on the length of the arrayLC
// Display/attach to class .list-group-history
function dCityList() {
   
   // Clear history list content first
   $(".list-group-history").empty();

   // Retrieve back the localStorage as String first
   var cityStr = localStorage.getItem("cityList");
   //console.log("In Display City, city object is", cityStr, typeof(cityStr));

   // Convert this back to an Array Obj 
   var cityObj = JSON.parse(cityStr);

   // Reinitalize the arryLC array with the retreived localstorage info
   // else, everytime you refresh the page, the arrayLC used to store city,
   // wil not have previous user entered info; and start the array new with first user input
   // in java script, cannot just have one array = another. need to use Array.from syntax
   // to copy the content of 1 x array to another.
   // Only do so , if cityObj is NOT null (cityObj then evaulated to TRUE), then set arrayLC=cityObj
   if (cityObj) {
      arrayLC = Array.from(cityObj);
   }
   

   //console.log("Enter dCityList, After JSON parse; cityObj value ", cityObj, typeof (cityObj));

   // If first time, cityObj is null -> do not need to loop
   // Else, Loop thru each city and create new element & append(display) to list-group-history
   if (cityObj){
      for (x = 0; x < cityObj.length; x++) {
         var cityLi = $("<div>").text(cityObj[x]).css({
            "border-style": "solid",
            "margin": 0,
            "padding": 0
         });
         $(".list-group-history").append(cityLi);
      } // End For
   }
} // end dCity List


// Wait for user click Search Button
$("#search-button").on("click", fetchData);


// Function fetchData Make API call to retrieve current and 5 days objects
// Then pass to each respective function for further processing
function fetchData(event) {
   event.stopPropagation();
   event.preventDefault();

   // Retrieve user input city
   city = $("#search-value").val();

   // Add this user entered city to the local storage array
   arrayLC.push(city);

   //console.log("After pushed, array first index 0 value:", arrayLC[0], typeof(arrayLC));
   // arrayLC.forEach(function(z){
   //    console.log("Check each item in the arrayLC:",z);
   // })

   // Local Storage only store Strings, not Object like array
   // Hence, need JSON stringify to convert the array as string first
   localStorage.setItem("cityList", JSON.stringify(arrayLC));

   // After user click search, should Reflect lastest Search history list
   dCityList();

   // Fetch current weather data
   wURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

   $.ajax({
      url: wURL,
      method: "GET"
   }).then(processData)
} // End fetchData

// This function will use the input obj, extract the Lat and Longtitude info
// Lat/Lon are required parameters to make oneCall API, which give current and 5 days forecast data
function processData(wObject) {

   //working:  https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&%20&exclude=minutely,hourly&appid=0e3be3e2387201a17d65f7f6c8b863cb
   oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + wObject.coord.lat + "&lon=" + wObject.coord.lon + "&exclude=minutely, hourly&appid=" + APIKey;
   $.ajax({
      url: oneCallURL,
      method: "GET"
   }).then(function (onecallObj) {
      //console.log("Processed object is a one call obj:", onecallObj);
      renderCurrent(onecallObj);
      $("#forecast").empty();
      $("#forecast").append($("<div>").text("5 day Forecast: ") // Add a title before displaying 5 days forecast
         .css({
            "font-weight": "bold",
            "fontSize": 30,
            "padding-bottom": "10px",
            "color": "salmon"
         }));

      // Display 5 days forecast, one by one
      for (var i = 1; i <= 5; i++) {
         render5days(onecallObj, i);
      }

   })
} // End processData

// Prepare Current Weather Data
function renderCurrent(weatherObj) {

   var currentDate = moment().format('l')
   // iconDisplay = $("<img>").attr("src", "http://openweathermap.org/img/wn/10d@2x.png");
   iconDisplay = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + weatherObj.current.weather[0].icon + "@2x.png");

   cityDisplay = $("<div>")
      .text(city + " (" + currentDate + ")")
      .css({
         "font-weight": "bold",
         "fontSize": 30,
         "padding-bottom": "10px",
      }).append(iconDisplay);

   tempDisplay = $("<div>").text("Tempature: " + kelvinToF(weatherObj.current.temp) + "F");
   humDisplay = $("<div>").text("Humidity: " + weatherObj.current.humidity + "%");
   windDisplay = $("<div>").text("Wind Speed: " + weatherObj.current.wind_speed + " MPH");

   //Create a seperate container for UV Display

   uvDisplay = $("<div>").text(weatherObj.current.uvi).css({
      "border-width": "1px",
      "border-style": "solid",
      "border-color": "black",
      //"background-color":"purple",
      "color": "black",
      "border-radius": "10px",
      "width": "30%"
   });

   if (weatherObj.current.uvi > 10) {
      uvDisplay.css({
         "background": "red",
         "float": "left",
         //"display":"inline-block"
      });
   } else {
      uvDisplay.css({
         "background": "green",
         "float": "left"
      });
   } // end Else

   uvPara = $("<div>").text("UV Index:").css({
      "float": "left",
   });
   uvTotal = $("<div>").append(uvPara, uvDisplay).css({
      "display": "inline-block"
   });

   // Call dCurrent to display Weather data
   dCurrent();
} // End renderCurrent


// Display Current Weather
function dCurrent() {
   $("#today").empty();

   // CHANGE uvDISPLAY to uvTotal
   $("#today").append(cityDisplay, tempDisplay, humDisplay, windDisplay, uvTotal).css({
      "border-width": "2px",
      "border-style": "solid",
      "border-color": "lightgrey"
   });
} // End dCurrent


// Prepare forecast data
function render5days(forecastObj, fDay) {
   // .add function add number of day from current date
   var fDate = $("<div>").text(moment().add(fDay, 'day').format('l'));
   var fTemp = $("<div>").text("Temp: " + kelvinToF(forecastObj.daily[fDay].temp.max) + "F");
   var fHum = $("<div>").text("Humidity: " + forecastObj.daily[fDay].humidity + "%");
   var fIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + forecastObj.daily[fDay].weather[0].icon + "@2x.png");
   dForecast(fDate, fTemp, fHum, fIcon, fDay);
}

// Display Forecast Data
function dForecast(fDate, fTemp, fHum, fIcon, fDay) {
   var oneDayContainer = $("<div>").append(fDate, fIcon, fTemp, fHum)
      .css({
         "border-width": "2px",
         "border-style": "solid",
         "border-color": "lightgrey",
         "width": "20%",
         "background-color": "lightblue",
         "display": "inline-block"       //so each div line up horizontally
      });

   $("#forecast").append(oneDayContainer);
} // End dForecast

function kelvinToF(kelvin) {
   var fahran = ((kelvin - 273.15) * 1.8 + 32).toFixed(2);
   return fahran
}
