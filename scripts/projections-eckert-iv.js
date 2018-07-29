// http://bl.ocks.org/mbostock/3734322

var container_parent = $('.display') ,
	chart_container = $('#map'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.6) - margins.top - margins.bottom,
	vis, vis_group, aspect,
	scale = width/6

var projection = d3.geoEckert4()
	.scale(scale)
	.translate([ width/2, height/2 ])
	.precision(.1)

var path = d3.geoPath()
	.projection(projection)

var graticule = d3.geoGraticule()

vis = d3.select('#map').append('svg')
	.attrs({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

vis_group.append('defs').append('path')
	.datum({
		type: 'Sphere'
	})
	.attrs({
		'd': path,
		'id': 'sphere'
	})

vis_group.append('use')
	.attrs({
		'class': 'stroke',
		'xlink:href': '#sphere'
	})

vis_group.append('use')
	.attrs({
		'class': 'water',
		'xlink:href': '#sphere'
	})

vis_group.append('path')
	.datum(graticule)
	.attrs({
		'd': path,
		'class': 'graticule'
	})

d3.json('data/world-50m.json', function(error, world){
	vis_group.append('path')
		.datum(topojson.feature(world, world.objects.land))
		.attrs({
			'd': path,
			'class': 'land'
		})

	vis_group.append('path')
		.datum(topojson.mesh(world, world.objects.countries, function(a, b){ return a !== b }))
		.attrs({
			'd': path,
			'class': 'boundary'
		})
})