var container_parent = $('.display') ,
	chart_container = $('#map'),
	margins = {top: 0, right: 20, bottom: 20, left: 20},
	width = container_parent.width(),
	height = (width * .6),
	vis, vis_group, aspect

var defaults = {
	single_state: {
		fill: '#eee',
		over: 'orange',
		stroke: '#777',
		strokeWidth: 1
	}
}

// tooltips
var tooltip = d3.select('body').append('div')
	.attrs({
		'class': 'tooltip',
		'opacity': 1e-6
	})

var county_name

var projection = d3.geoConicConformal()
	.parallels([ 40 + 26 / 60, 41 + 42 / 60 ])
	.rotate([ 82 + 30 / 60, -39 - 40 / 60 ])
	.translate([ width / 2, height / 2 ])

var path = d3.geoPath()
	.projection(projection)

vis = d3.select('#map').append('svg')
	.attrs({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

$(document).ready(function(){
	States.get('al')

	$('#states').change(function(){
		state = {
			'shortName': $('#states :selected')[0].value,
			'longName': $('#states :selected')[0].text
		}

		d3.select('.vis_group')
		   .remove()

		States.get(state.shortName)
	})
})

var counties

var States = new function(){
	this.get = function(state){
		$('.state_name').html(state.toUpperCase())

		vis_group = vis.append('g')
			.attrs({
				'class': 'vis_group'
			})

		d3.json('data/states/' + state + '-counties.json', function(error, topology){
			counties = topojson.feature(topology, topology.objects.counties)

			projection
				.scale(1)
				.translate([ 0, 0 ])

			var bounds = path.bounds(counties),
				// the decimal is the percentage
				// the Math.max finds the larger of the 2 dimensions
				scale = .95 / Math.max((bounds[1][0] - bounds[0][0]) / width, (bounds[1][1] - bounds[0][1]) / height),
				// the translate moves the state to the center of the svg
				translate = [(width - scale * (bounds[1][0] + bounds[0][0])) / 2, (height - scale * (bounds[1][1] + bounds[0][1])) / 2]

			projection
				.scale(scale)
				.translate(translate)

			States.drawMap()
		})
	}

	this.drawMap = function(){
		vis_group.selectAll('path')
			.data(counties.features.filter(function(d){
				return d.id % 1000
			}))
				.enter().append('path')
			.attrs({
				'd': path,
				'fill': defaults.single_state.fill,
				'stroke': defaults.single_state.stroke,
				'stroke-width': defaults.single_state.strokeWidth
			})
			.style('cursor', 'pointer')
			.on('mouseover', function(){
				d3.select(this)
					.transition()
					.duration(function(d){
						county_name = d.properties.name
						return 500
					})
					.attrs({
						'fill': defaults.single_state.over
					})
				d3.select('.tooltip')
					.html(function(d){
						return '<span>' + county_name + '</span>'
					})
					.styles({
						'left': (d3.event.pageX) + 'px',
						'top': (d3.event.pageY - 28) + 'px'
					})
					.transition()
						.duration(500)
						.style('opacity', 1) 
			})
			.on('mouseout', function(){
				d3.select(this)
					.transition()
					.duration(500)
						.attrs({
							'fill': defaults.single_state.fill
						})
				d3.select('.tooltip')
					.transition()
						.duration(200)
						.style('opacity', 0) 
			})
	}

}

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attrs({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})