$(document).ready(function(){ mapSetUp() })

var map, elevationService, chart, polyline,
	infoWindow = new google.maps.InfoWindow()

var victoria = new google.maps.LatLng(48.524223, -123.437651),
	seattle = new google.maps.LatLng(47.606209, -122.332071),
	salem = new google.maps.LatLng(44.942898, -123.035096),
	ocean = new google.maps.LatLng(34.170908, -120.81665),
	mapCenter = new google.maps.LatLng(42.747012 , -111.621094),
	sanfrancisco = new google.maps.LatLng(37.774929, -122.419416),
	lasvegas = new google.maps.LatLng(36.114646, -115.172816),
	phoenix = new google.maps.LatLng(33.448377, -112.074037),
	santafe = new google.maps.LatLng(35.686975, -105.937799),
	austin = new google.maps.LatLng(30.267153 , -97.743061)

var samples = 128,
	zoom = 4,
	center = mapCenter,
	line_color = 'black',
	line_weight = 1,
	line_opacity = 1,
	circle_radius = 16090*2

var path = [victoria, seattle, salem, sanfrancisco, ocean, lasvegas, phoenix, santafe, austin]
var elevation_colors = ['#ca9b76', '#b09881', '#b09881', '#a06757', '#8291a0']

var container_parent = $('.display') ,
	chart_container = $('#elevation_chart'),
	margins = {top:20, right:5, bottom:5, left:20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.7) - margins.top - margins.bottom,
	vis, vis_group, aspect

var tooltip = d3.select('body').append('div')
	.attrs({
		'class': 'tooltip',
		'opacity': 1e-6
	})

function mapSetUp(){
	var myMapOptions = {
		center: center,
		zoom: zoom,
		mapTypeId: 'terrain'
	}
	
	map = new google.maps.Map($('#map_canvas').get(0), myMapOptions)

	elevationService = new google.maps.ElevationService()
	drawPath()
}

function drawPath(){
	var pathRequest = {
		'path': path,
		'samples': samples
	}
	//initiate the path request
	elevationService.getElevationAlongPath(pathRequest, plotElevation)

	for (var city in path) {
		var circleOptions = {
			strokeColor: line_color,
			strokeOpacity: line_opacity,
			strokeWeight: line_weight,
			fillColor: line_color,
			fillOpacity: line_opacity,
			map: map,
			center: path[city],
			radius: circle_radius
		}
		circle = new google.maps.Circle(circleOptions)
	}
}

function plotElevation(results, status){
	if (status == google.maps.ElevationStatus.OK){
		elevations = results

		var elevationPath = []
		for (var i=0; i < elevations.length; i++){
			elevationPath.push(elevations[i].location)
		}

		var lineSymbol = {
			path: 'M 0,-1 0,5',
			strokeOpacity: line_opacity,
			scale: 2
		}

		var pathOptions = {
			path: elevationPath,
			strokeColor: line_color,
			strokeOpacity: 0,
			icons: [{
				icon: lineSymbol,
				offset: 0,
				repeat: '20px'
			}],
			map: map
		}

		var line = new google.maps.Polyline(pathOptions)

		drawChart(elevations)
	}
}

function drawChart(data){
	vis = d3.select('#elevation_chart').append('svg')
		.attrs({
			'width': width + margins.left + margins.right,
			'height': height + margins.top + margins.bottom,
			'preserveAspectRatio': 'xMinYMid',
			'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
		})

	vis_group = vis.append('g')
		.attrs({
			'transform': 'translate(' + margins.left + ',' + margins.top + ')'
		})

	aspect = chart_container.width() / chart_container.height()

	// var x = d3.scaleOrdinal()
	//     .rangeRoundBands([0, width], .2)

	var x = d3.scaleBand()
		.rangeRound([0, width])
		.padding(0.2)

	var y = d3.scaleLinear()
    	.range([height, 0])

	var yAxis = d3.axisLeft()
    	.scale(y);

	x.domain(d3.range(data.length))  
    y.domain(d3.extent(data, function(d) {
		return d.elevation
	}))	

	var max_elevation = d3.max(data, function(d){
		return d.elevation
	})

	var g = vis_group.selectAll('.bar')
		.data(data)
    		.enter().append('g')
    	.attrs({
    		'class': 'bar'
    	})

    g.append('rect')
		.attrs({
			'x': function(d, i) {
				return x(i)
			},
			'y': function(d) {
				return y(Math.max(0, d.elevation))
			},
			
			'width': x.bandwidth(),
			'height': function(d) {
				return Math.abs(y(d.elevation) - y(0))
			},
			'fill': function(d){
				// there's a better way to do this
				if(d.elevation > 0 && d.elevation <= max_elevation * .25){
					return elevation_colors[0]
				} else if(d.elevation > max_elevation * .25 && d.elevation <= max_elevation * .5) {
					return elevation_colors[1]
				} else if(d.elevation > max_elevation * .5 && d.elevation <= max_elevation * .75) {
					return elevation_colors[2]
				} else if(d.elevation > max_elevation * .75 && d.elevation <= max_elevation) {
					return elevation_colors[3]
				} else if(d.elevation <= 0) {
					return elevation_colors[4]
				}
			},
			'opacity': .5
		})

		g.selectAll('rect')
			.on('mouseover', function(d) {
				tooltip.transition()
					.duration(200)
					.attrs({
						'opacity': 1
					})

				d3.select(this)
					.transition()
						.duration(100)
						.attrs({
							'opacity': 1
						})
			})

		g.selectAll('rect')
			.on('mouseout', function(d) {
				tooltip.transition().duration(200).style('opacity', 0)
				d3.select(this)
					.transition()
						.duration(100)
						.attrs({
							'opacity': .5
						})
			})


	g.on('mousemove', function(d, i) {
		var elevation_latlng = new google.maps.LatLng(d.location.lb, d.location.mb)
		var geocoder = new google.maps.Geocoder()

		var isDefined = function(obj){
		    return typeof(obj) !== 'undefined' && obj !== null ? obj : ''
		}

		var result

		geocoder.geocode({'latLng': elevation_latlng}, function(results, status){
			if(status == google.maps.GeocoderStatus.OK){
				console.log('results: ', results)
				if (results[0]) {
					// result = {
					// 	formattedAddress: isDefined(results[0].formatted_address),
					// 	neighborhood: isDefined(results[0].address_components[0].short_name),
					// 	neighborhood_political: isDefined(results[0].address_components[1].short_name),
					// 	locality: isDefined(results[0].address_components[2].short_name),
					// 	admAreaLevel2: isDefined(results[0].address_components[3].long_name),
					// 	admAreaLevel2_political: isDefined(results[0].address_components[3].short_name),
					// 	state: isDefined(results[0].address_components[4].long_name),
					// 	state_political: isDefined(results[0].address_components[4].short_name),
					// 	country: isDefined(results[0].address_components[5].long_name),
					// 	country_political: isDefined(results[0].address_components[5].short_name),
					// 	postalCode: isDefined(results[0].address_components[6].short_name)
					// }
					// console.log('result: ', result)
				}
			}
		})

		var elevation  = d.elevation.toFixed(2)
		if (d3.mouse(this)[0] < 0) {
			tooltip.transition().duration(200).style('opacity', 0)
		} else {
			tooltip.html(function(d) {
				// console.log(d)
				var tooltip_data = ''
				tooltip_data += '<span><strong>Elevation:</strong><br />' + elevation + ' (m)</span>'
				return tooltip_data
			})
			.attrs({
				'left': (d3.event.pageX + 10) + 'px',
				'top': (d3.event.pageY) + 'px'
			})
		}
	})

	vis_group.append('g')
		.attrs({
			'class': 'axis y',
			// why do we have to do this?
			'transform': 'translate(' + 20 + ', 0)'
		})
		.call(yAxis)
			.append('text')
				.attrs({
					'transform': 'rotate(-90)',
					'y': margins.top,
					'font-size': '12px',
					'text-anchor': 'end',
					'fill': '#999'
				})
				.text('Elevation (m)')
}

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attrs({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})