var container_parent = $('.display') ,
	chart_container = $('#map'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width(),
	height = (width * .5) - margins.top - margins.bottom,
	vis, vis_group, aspect,
	scale = width

var projection = d3.geoAlbersUsa()
	.scale(scale)
    .translate([width / 2, height / 2])

var path = d3.geoPath()
	.projection(projection)

var selected = {
  '6': 1, '9': 1, '10': 1, '15': 1, '19': 1, '25': 1, '27': 1, '33': 1, '34': 1, '36': 1,
  '44': 1, '50': 1, '23': 1, '24': 1, '53': 1, '11': 1
}

var defaults = {
	state: {
		fill: '#ccc',
		stroke: '#fff',
		strokeWidth: 1,
		selectedFill: 'orange'
	}
}

var vis = d3.select('#map').append('svg')
	.attrs({
		'width': width,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

d3.json('data/us.json', function(error, topology){

	var states = topojson.feature(topology, topology.objects.states),
		selection = {
			type: 'FeatureCollection',
			features: states.features.filter(function(d){
				return d.id in selected
			})
		}

	vis_group.append('path')
		.datum(states)
		.attrs({
			'd': path,
			'fill': defaults.state.fill
		})


	vis_group.append('path')
		.datum(topojson.mesh(topology, topology.objects.states, function(a, b){
			return a !== b
		}))
		.attrs({
			'd': path,
			'fill': 'none',
			'stroke': defaults.state.stroke,
			'stroke-width': defaults.state.strokeWidth
		})

	vis_group.append('path')
		.datum(selection)
		.attrs({
			'd': path,
			'fill': defaults.state.selectedFill
		})
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attrs({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})