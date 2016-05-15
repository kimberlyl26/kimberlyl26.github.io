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
$(function() {

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
        WeatherLocation.create({type: $type, value: $stripped}, function (err, result) {
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
});

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
                main: response.weather[0].main + ': ' + response.weather[0].description,
                temp: 'Temp: ' + response.main.temp + ' degrees F',
                wind: {
                    speed: 'Speed: ' + response.wind.speed,
                    chill: 'Wind Chill: ' + kelvinToF(response.wind.deg) + ' degrees F'
                }
            };

            var $current = $('div#current');
            var $weather = $current.find('ul#weather');
            $current.addClass('hidden');
            $weather.addClass('hidden');

            //console.log($weather);

            var heading = '<h4>' + weatherObj.name + '</h4>';
            var weatherHtml = '<li>' + weatherObj.main + '</li><li>' + weatherObj.temp + '</li><li>' + weatherObj.wind.speed + '<br>' + weatherObj.wind.chill + '</li><br><br>';

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



