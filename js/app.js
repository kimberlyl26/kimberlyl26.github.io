
var api_url = 'http://api.openweathermap.org/data/2.5/';

var params = {
    forecast: 'forecast?',
    current: 'weather?',
    zip: 'zip',
    city: 'q'
}
var api_key='2b29981d2c60843b266ebfeb3f464e47';
var WeatherLocation = new ParseObjectType("WeatherLocation")

$(document).ready(function(){
  var $form = $('form')
  var url = api_url + params.forecast + ',us&mode=json&units=imperial&appid=' +api_key;

  $form.on('submit', function(e){
    e.preventDefault();

    var weatherObj = {
      city: $city
    $.get(url, function (err, response){
        if(err) {
          console.log(err)
        }
        else{
          console.log(response)
        }
    });
    // WeatherType.create({city:})
    // $.ajax({
    //   url: url,
    //   method: "post",
    //   data: {
    //
    //   }
    // })


  })
    
    function saveLocation(){
        var type = //do jquery grab
            var value = //do jquery grab
       WeatherLocation.create({type: type, value: value }, function(err, result){
           if(err){
               console.error(err);
           }
           else{
             //make save button and add location name to list 
               
           }
       })
    }
    function getLocationWeather($location){
        //onclick use weather api to display popup of current weather 
    }
    function removeLocation () {
        
    }

    function updateLocation () {

    }

})




