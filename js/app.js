
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
var $form = $('form');

var WeatherLocation = new ParseObjectType("WeatherLocation");
// var $savedLocs = $('#saved');
$(function(){

    WeatherLocation.getAll(function(err, results) {
        if (err) {
            console.log(err);
        }
        else {
            results.forEach(renderLocation);

        }
        $('ul.saved li.location a').click(function (e) {
            e.preventDefault();
            console.log('rqwerqerqe');
            // getLocationWeather($(this))
        });

        $form.on('submit', function (e) {
            e.preventDefault();
            var $type = $('#loc_type').val();
            var $value = $('#location').val();
            var locationObj = {type: $type, value: $value};
            WeatherLocation.create(locationObj, function (err, result) {
                if (err) {
                    console.error(err);
                }
                else {
                    locationObj.objectId = result.objectId;
                    console.log(locationObj);
                    renderLocation(locationObj);

                }

            })


        });

        function getLocationWeather(locationObj) {

            //onclick use weather api to display popup of current weather for saved location clicked
        }

        function removeLocation() {
            //remove saved location
        }

        function updateLocation() {

        }

        function renderLocation(locData) {
            var source = $("#loc-template").html();
            var template = Handlebars.compile(source);
            var html = template(locData);
            $('.saved').append(html);

        }


    });

});





