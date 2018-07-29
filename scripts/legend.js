var cities = [
	{
		"value": "atlanta",
		"text": "Atlanta, GA"
	},
	{
		"value": "boston",
		"text": "Boston, MA"
	},
	{
		"value": "chicago",
		"text": "Chicago, IL"
	},
	{
		"value": "dallas",
		"text": "Dallas, TX"
	},
	{
		"value": "detroit",
		"text": "Detroit, MI"
	},
	{
		"value": "los-angeles",
		"text": "Los Angeles, CA"
	},
	{
		"value": "minneapolis",
		"text": "Minneapolis, MN"
	},
	{
		"value": "new-york",
		"text": "New York, NY"
	},
	{
		"value": "philadelphia",
		"text": "Philadelphia, PA"
	},
	{
		"value": "seattle",
		"text": "Seattle, WA"
	}	
]

$(document).ready(function(){
	$('.location_choice').legend({})
})

$.fn.legend = function(options){
	var defaults = {
		// includeHouse: true
	}
	options = $.extend(defaults, options)
	var cityList = []

	cityList.push.apply(cityList, cities)

	var select_options = '<select id="cities" class="form-control">'
	cityList.forEach(function(s){
		select_options += '<option value="' + s.value + '">' + s.text + '</option>'
	})
	select_options += '</select>'

	$(this).prepend(select_options)
}