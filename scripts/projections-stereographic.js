var container_parent = $('.display') ,
	chart_container = $('#map'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * .6) - margins.top - margins.bottom,
	vis, vis_group, aspect,
	scale = width/4

var projection = d3.geoStereographic()
	.scale(scale)
	.translate([ width / 2, height / 2 ])
	.rotate([ -20, 0 ])
    .clipAngle(180 - 1e-4)
    .clipExtent([ [ 50, 50 ], [width, height] ])
    .precision(.1);

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

vis_group.append('rect')
	.attrs({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'class': 'water'
	})

vis_group.append('path')
	.datum(graticule)
	.attrs({
		'd': path,
		'class': 'graticule'
	})

d3.json('data/world-50m.json', function(error, topology){
	vis_group.append('path')
		.datum(topojson.feature(topology, topology.objects.land))
		.attrs({
			'd': path,
			'class': 'land'
		})

	vis_group.append('path')
		.datum(topojson.mesh(topology, topology.objects.countries, function(a, b){
			return a !== b
		}))
		.attrs({
			'd': path,
			'class': 'boundary'
		})
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attrs({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})