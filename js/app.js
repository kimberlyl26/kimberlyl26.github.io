
var api_url = 'http://api.openweathermap.org/data/2.5/';

var params = {
    prefixes: {
        weather: 'weather?',
        zip: 'zip',
        city: 'q',
        mode: 'mode',
        appid: 'appid', 
        units: 'units'
    },
    //Using US for the country, json for the mode, fahrenheit(imperial) for the units 
    country: 'us' ,
    mode: 'json',
    units: 'imperial',
    api_key:'2b29981d2c60843b266ebfeb3f464e47'
    
}
var WeatherLocation = new ParseObjectType("WeatherLocation")
// var $savedLocs = $('#saved_locs');
$(document).ready(function(){
    var $form = $('form');
    getSavedLocations();
  $form.on('submit', function(e) {
      e.preventDefault();
      var $type = $('#loc_type').val();
      var $value = $('#location').val();

      saveLocation($type, $value);

  })

    function getSavedLocations(){
        WeatherLocation.getAll(function(err, result){
            if(err){
                console.log(err);
            }
            else{
                console.log(result);
                for(var i=0; i<result.length; i++){
                    displaySavedLocation(result[i]);
                }

            }
        })
    }


    function saveLocation($type, $value){
        var weatherObj = {type: $type, value: $value}
        WeatherLocation.create({type: $type, value: $value}, function(err, result){
            if(err){
                console.error(err);
            }
            else{
                weatherObj.objectId = result.objectId;
                console.log(weatherObj);
                displaySavedLocation(weatherObj)

                //$savedLocs.append('<li><a href = "#" id='+value+')

            }
        })

    }
    function displaySavedLocation(weatherObj){
        var html = '<li><a href="#">'+weatherObj.value+'</a></li>';
        $('ul#saved_locs').append(html);
    }
    function getLocationWeather($location){
        //onclick use weather api to display popup of current weather for saved location clicked
    }
    function removeLocation () {
        //remove saved location
    }

    function updateLocation () {

    }

})




