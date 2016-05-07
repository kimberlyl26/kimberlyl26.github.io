var config = require('.settings')
var api_key = config.api_key;
var api_url = config.api_url;

var Item = new ParseObjectType("Items_initials_here")


Item.create({title:'My first Item'}, function(){
  var $form = $('form')
  var $cityName = $('#city').val()
  var url = api_url + $cityName +',us&mode=json&appid='+api_key;

  //Make http request to Openweather app using url


  Item.getAll(function(err, results){
    if(err){
      console.error(err)
    }
    else{
      console.log(results)
    }
    
  })
})


//TODO
//Add more to form where user can specify time of day of commute outside or more details

//TODO
//Figure out how to group different weather properties you should use from API and generate clothing suggestions and map them to the conditions for that day
 

