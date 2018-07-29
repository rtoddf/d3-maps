// http://bl.ocks.org/KoGor/5994804

var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.8) - margins.top - margins.bottom	

var vis, vis_group, aspect, focused, sens = 0.25

var defaults = {
	water: {
		fill: 'rgba(0,32,64,.15)'
	},
	globe: {
		animation_duration: 2000
	}
}

var projection = d3.geoOrthographic()
	.scale(175)
	.rotate([ 0, 0 ])
	.translate([ width/2, height/2 ])
	.clipAngle(90)

var path = d3.geoPath()
	.projection(projection)

vis = d3.select('#example').append('svg')
	.attrs({
		'width': width,
		'height': height,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width) + ' ' + (height)
	})

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

vis_group.append('path')
	.datum({
		type: 'Sphere'
	})
	.attrs({
		'd': path,
		'fill': defaults.water.fill
	})

var tooltip = d3.select('body').append('div')
	.attrs({
		'class': 'tooltip'
	})

countryList = d3.select('#countries').append('select')
	.attrs({
		'name': 'countries'
	})

d3.queue()
	.defer(d3.json, 'data/world-110m.json')
	.defer(d3.tsv, 'data/world-110m-country-names.tsv')
	.await(ready)

function ready(error, world, countryData){
	var countryById = {}
	countries = topojson.feature(world, world.objects.countries).features

	countryData.forEach(function(d){
		countryById[d.id] = d.name
		option = countryList.append('option')
		option.text(d.name)
		option.property('value', d.id)
	})

	countries.map(function(d){
		d.name = countryById[d.id]
	})

	var world = vis_group.selectAll('path.land')
		.data(countries)
			.enter().append('path')
		.attrs({
			'd': path,
			'class': 'land'
		})

	// .call(d3.behavior.drag()
	// 	.origin(function(){
	// 		var r = projection.rotate()
	// 		return {
	// 			x: r[0]/sens,
	// 			y: -r[1]/sens
	// 		}
	// 	})
	// 	.on('drag', drag)
	// )

	.on('mouseover', function(d){
		tooltip.text(function(){
			return d.name
		})
		
		tooltip.attr({
			'left': (d3.event.pageX + 7) + 'px',
			'top': (d3.event.pageY -15) + 'px',
			'display': 'block',
			'opacity': 1
		})
	})
	.on('mouseout', out)
	.on('mousemove', move)
	.on('click', function(d){
		thiscountry = d.name
	})

	d3.select('select')
		.on('change', rotateGlobe)

	// var point = vis_group.append('g')
	// 	.attrs({
	// 		'transform': function(){
	// 			return 'translate(' + projection([ 7.483333, 9.066667 ])[0] + ', ' + projection([ 7.483333, 9.066667 ])[1] + ')'
	// 		}
	// 	})

	// point.append('circle')
	// 	.attrs({
	// 		'r': 5,
	// 		'fill': 'red',
	// 		'stroke': 'black',
	// 		'stroke-width': 1
	// 	})
}

function country(text){
	var filtered = _(countries).find(function(s){
		if(s.name == text){
			return s
		}
	})
	return filtered
}

function drag(){
	var rotate = projection.rotate()
	projection.rotate([ d3.event.x * sens, -d3.event.y * sens, rotate[2] ])
	vis_group.selectAll('path.land')
		.attrs({
			'd': path
		})
	vis_group.selectAll('.focused')
		.classed({
			'focused': focused = false
		})
}

function move(){
	console.log('move')
	tooltip
		.attrs({
			'left': (d3.event.pageX + 7) + 'px',
			'top': (d3.event.pageY -15) + 'px'
		})
}

function out(){
	tooltip
		.attrs({
			'display': 'none',
			'opacity': 0
		})
}

function rotateGlobe(){
	var rotate = projection.rotate(),
	focusedCountry = country(this.options[this.selectedIndex].text),
	p = d3.geoCentroid(focusedCountry)

	vis_group.selectAll('.focused')
		.classed('focused', focused = false);

	(function transition(){
		d3.transition()
			.duration(defaults.globe.animation_duration)
			.tween('rotate', function(){
				var r = d3.interpolate(projection.rotate(), [ -p[0], -p[1] ])
				return function(t){

					projection.rotate(r(t))
					vis_group.selectAll('path')
						.attrs({
							'd': path
						})
						.classed('focused', function(d, i){
							return d.id == focusedCountry.id ? focused = d : false
						})
				}
			})
	})()
}

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attrs({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})