
var degToCard = function(deg){
  if (deg>11.25 && deg<=33.75){
    return "NNE";
  }else if (deg>33.75 && deg<=56.25){
    return "ENE";
  }else if (deg>56.25 && deg<=78.75){
    return "E";
  }else if (deg>78.75 && deg<=101.25){
    return "ESE";
  }else if (deg>101.25 && deg<=123.75){
    return "ESE";
  }else if (deg>123.75 && deg<=146.25){
    return "SE";
  }else if (deg>146.25 && deg<=168.75){
    return "SSE";
  }else if (deg>168.75 && deg<=191.25){
    return "S";
  }else if (deg>191.25 && deg<=213.75){
    return "SSW";
  }else if (deg>213.75 && deg<=236.25){
    return "SW";
  }else if (deg>236.25 && deg<=258.75){
    return "WSW";
  }else if (deg>258.75 && deg<=281.25){
    return "W";
  }else if (deg>281.25 && deg<=303.75){
    return "WNW";
  }else if (deg>303.75 && deg<=326.25){
    return "NW";
  }else if (deg>326.25 && deg<=348.75){
    return "NNW";
  }else{
    return "N";
  }
};
var params = {
    api_url:'http://api.openweathermap.org/data/2.5/weather?',
    api_key: '2b29981d2c60843b266ebfeb3f464e47'

}
var icon_url = 'http://openweathermap.org/img/w/';


//Using US for the country, json for the mode, fahrenheit(imperial) for the units for now


$(function() {
    var WeatherLocation = new ParseObjectType("WeatherLocation");
    var $form = $('form');
    $form.on('submit', function (e) {
        e.preventDefault();
        //var $saved = $('.saved');
        //$saved.addClass('hidden');
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

                var update = [locationObj];
                getAllLocations(update);
            }
        })


    });
    getAllLocations();


    //On add location(submit) a location of type zip or city is saved.

    function getAllLocations(update) {

    WeatherLocation.getAll(function (err, results) {
        if (err) {
            console.log(err);
        }
        else {
            if (update){
                renderLocation(update[0]);
             }
            else{
            results.forEach(renderLocation);
            }

            $('.saved li a').on('click', function (e) {
                e.preventDefault();
                var $weatherObj = $(this).parent();
                var $id = $weatherObj.attr('data-id');
                WeatherLocation.get($id, function (err, result) {
                    if (err) {
                    console.error(err)
                    }
                else {

                    var url = params.api_url + 'zip=' + result.value+ ',us&mode=json&units=imperial&appid=' + params.api_key;
                    console.log(url);
                    getLocationWeather(url);
                }
                });


            });
            $('.saved li i').on('click', function (e) {
                e.preventDefault();
                var $this = $(this);
                removeLocation($this.parent());
            });
        }

    });

}
function getLocationWeather(url) {

        //OPWM defaults to the country in the parameter if zip or city value is a bunch of nonsense.
        $.get(url, function (response) {
            console.log(response);
            var weatherObj = {
                name: response.name,
                main: response.weather[0].main,
                icon: icon_url + response.weather[0].icon +'.png',
                temp: 'Temp: ' + response.main.temp + ' degrees F',
                wind: {
                    speed: 'Wind Speed: ' + response.wind.speed,
                    chill: 'Wind Direction: ' + degToCard(response.wind.deg) + ' ('+ parseInt(response.wind.deg)+ ')'
                }
            };

            var $current = $('div#current');
            var $weather = $current.find('ul#weather');
            $current.addClass('hidden');
            $weather.addClass('hidden');

            //console.log($weather);

            var heading = '<h4>' + weatherObj.name + '</h4>';
            var weatherHtml = '<br><li><h4>'+weatherObj.main+'<img src="'+weatherObj.icon+'" /></h4></li><li>' + weatherObj.temp + '</li><li>' + weatherObj.wind.speed + '<br>' + weatherObj.wind.chill + '</li><br><br>';

            $current.html(heading + weatherHtml);
            $current.removeClass('hidden');


        });

    }
function renderLocation(locData) {
    var html = compile(locData);
    $('.saved').append(html);
}
function compile(locData){
    var source = $("#loc-template").html();
    var template = Handlebars.compile(source);
    var html = template(locData);
    return html;
}


function removeLocation($location) {
        //remove saved location
        var locationId = $location.data('id');

        WeatherLocation.remove(locationId, function (err) {
            if (err) {
                console.error(err);
            } else {
                $('[data-id="' + locationId + '"]').remove();
            }
        });
    }
});







