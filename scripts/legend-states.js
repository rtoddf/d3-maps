var senatorsOnly = [
	{
		"value": "al",
		"text": "Alabama"
	},
	{
		"value": "ak",
		"text": "Alaska"
	},
	{
		"value": "az",
		"text": "Arizona"
	},
	{
		"value": "ar",
		"text": "Arkansas"
	},
	{
		"value": "ca",
		"text": "California"
	},
	{
		"value": "co",
		"text": "Colorado"
	},
	{
		"value": "ct",
		"text": "Connecticutt"
	},
	{
		"value": "de",
		"text": "Deleware"
	},
	{
		"value": "fl",
		"text": "Florida"
	},
	{
		"value": "ga",
		"text": "Georgia"
	},
	{
		"value": "hi",
		"text": "Hawaii"
	},
	{
		"value": "id",
		"text": "Idaho"
	},
	{
		"value": "il",
		"text": "Illinois"
	},
	{
		"value": "in",
		"text": "Indiana"
	},
	{
		"value": "ia",
		"text": "Iowa"
	},
	{
		"value": "ks",
		"text": "Kansas"
	},
	{
		"value": "ky",
		"text": "Kentucky"
	},
	{
		"value": "la",
		"text": "Louisiana"
	},
	{
		"value": "me",
		"text": "Maine"
	},
	{
		"value": "md",
		"text": "Maryland"
	},
	{
		"value": "ma",
		"text": "Massachusetts"
	},
	{
		"value": "mi",
		"text": "Michigan"
	},
	{
		"value": "mn",
		"text": "Minnesota"
	},
	{
		"value": "ms",
		"text": "Mississippi"
	},
	{
		"value": "mo",
		"text": "Missouri"
	},
	{
		"value": "mt",
		"text": "Montana"
	},
	{
		"value": "ne",
		"text": "Nebraska"
	},
	{
		"value": "nv",
		"text": "Nevada"
	},
	{
		"value": "nh",
		"text": "New Hampshire"
	},
	{
		"value": "nj",
		"text": "New Jersey"
	},
	{
		"value": "nm",
		"text": "New Mexico"
	},
	{
		"value": "ny",
		"text": "New York"
	},
	{
		"value": "nc",
		"text": "North Carolina"
	},
	{
		"value": "nd",
		"text": "North Dakota"
	},
	{
		"value": "oh",
		"text": "Ohio"
	},
	{
		"value": "ok",
		"text": "Oklahoma"
	},
	{
		"value": "or",
		"text": "Oregon"
	},
	{
		"value": "pa",
		"text": "Pennsylvania"
	},
	{
		"value": "ri",
		"text": "Rhode Island"
	},
	{
		"value": "sc",
		"text": "South Carolina"
	},
	{
		"value": "sd",
		"text": "South Dakota"
	},
	{
		"value": "tn",
		"text": "Tennessee"
	},
	{
		"value": "tx",
		"text": "Texas"
	},
	{
		"value": "ut",
		"text": "Utah"
	},
	{
		"value": "va",
		"text": "Virginia"
	},
	{
		"value": "vt",
		"text": "Vermont"
	},
	{
		"value": "wa",
		"text": "Washington"
	},
	{
		"value": "wv",
		"text": "West Virginia"
	},
	{
		"value": "wi",
		"text": "Wisconsin"
	},
	{
		"value": "wy",
		"text": "Wyoming"
	}
]

$(document).ready(function(){
	$('.state_choice').legend({})
})

$.fn.legend = function(options){
	var defaults = {
		// includeHouse: true
	}
	options = $.extend(defaults, options)
	var stateList = []

	stateList.push.apply(stateList, senatorsOnly)

	var select_options = '<select id="states" class="form-control">'
	stateList.forEach(function(s){
		select_options += '<option value="' + s.value + '">' + s.text + '</option>'
	})
	select_options += '</select>'

	$(this).prepend(select_options)
}


