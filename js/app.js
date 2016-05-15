//Wind chill doesn't have fahrenheit units so this is necessary
function kelvinToF(k){
    var f = ((k - 273)* 1.8 + 32.0);
    return (parseInt(f));
}
var params = {
    api_url:'http://api.openweathermap.org/data/2.5/weather?',
    api_key: '2b29981d2c60843b266ebfeb3f464e47'

}

//Using US for the country, json for the mode, fahrenheit(imperial) for the units for now

var WeatherLocation = new ParseObjectType("WeatherLocation");
$(function(){
    var $form = $('form');
    //On add location(submit) a location of type zip or city is saved.
    $form.on('submit', function (e) {
        e.preventDefault();
        var $type = $("#loctype").val();
        var $value = $("#location").val();
        var $stripped = $value.replace(/ /g, '');

        console.log($stripped);
        //Location object
        var locationObj = {type: $type, value: $stripped};
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

    //Gets all locations upon page load and displays them
    WeatherLocation.getAll(function(err, results) {
        if (err) {
            console.log(err);
        }
        else {
            results.forEach(renderLocation);

        }

        //
        $('.saved li a').on('click', function(e) {
            e.preventDefault();

            var $weatherObj = $(this).parent();
            console.log($weatherObj);
            var $weatherType = $weatherObj.attr('data-type');
            console.log($weatherType);
            var $weatherValue = $weatherObj.attr('data-value');
            console.log($weatherValue);
            //There are different url parameters for retrieving weather by zip
            if($weatherType === 'zip'){

                getWeatherByZip($weatherValue);
            }
            else{

                getWeatherByCity($weatherValue);

            }

        });
        $('.saved li i').on('click', function(e){
            e.preventDefault();
            var $this = $(this);
            removeLocation($this.parent());
        })



    function getWeatherByZip(zip){
        var url = params.api_url +'zip='+zip+',us&mode=json&units=imperial&appid='+params.api_key;
        console.log(url);
        getLocationWeather(url);

    }

    function getWeatherByCity(city){
        console.log(city);
        var newCity = city.replace(/ /g, '');
        //Strips spaces from city for url
        // var newCity = city.replace(/ /g, '');
        //
        console.log(newCity)
        var url = params.api_url +'q='+newCity+',us&mode=json&units=imperial&appid='+params.api_key;
        console.log(url);
        getLocationWeather(url);
    }

    function getLocationWeather(url) {
        //OPWM defaults to the country in the parameter if zip or city value is a bunch of nonsense.  
        $.get(url, function (response){
            console.log(response);
            var weatherObj = {
                name: response.name,
                main: response.weather[0].main + ': '+ response.weather[0].description,
                temp: 'Temp: '+response.main.temp +' degrees F',
                wind:
                {
                    speed: 'Speed: ' + response.wind.speed,
                    chill: 'Wind Chill: '+kelvinToF(response.wind.deg)+' degrees F'
                }
            };

            var $current =$('div#current');
            var $weather =$current.find('ul#weather');
            $current.addClass('hidden');
            $weather.addClass('hidden');

            //console.log($weather);

            var heading = '<h4>'+weatherObj.name+'</h4>';
            var weatherHtml = '<li>'+weatherObj.main+'</li><li>'+weatherObj.temp+'</li><li>'+weatherObj.wind.speed+'<br>'+weatherObj.wind.chill+'</li><br><br>';

            $current.html(heading + weatherHtml);
            $current.removeClass('hidden');


     });

    }

        function removeLocation($location) {
            //remove saved location
            var locationId = $location.data('id');

            WeatherLocation.remove(locationId, function(err) {
                if (err) {
                  console.error(err);
                } else {
                  $('[data-id="' + locationId + '"]').remove();
                }
            });
        }

        
        function updateLocation() {

        }




    });

    //Uses handle bars to display saved location
    function renderLocation(locData) {
            var source = $("#loc-template").html();
            var template = Handlebars.compile(source);
            var html = template(locData);
            $('.saved').append(html);

    }

});







