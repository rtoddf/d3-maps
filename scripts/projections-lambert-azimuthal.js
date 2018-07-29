// https://github.com/mbostock/d3/wiki/Geo-Projections

var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 10, right: 10, bottom: 10, left: 10},
	width = container_parent.width() - margins.left - margins.right,
	height = width - margins.top - margins.bottom,
	vis, vis_group, aspect,
	translate = [ width/2, height/2 ],
	scale = width/4 - margins.left - margins.right

var projection = d3.geoAzimuthalEqualArea()
	.clipAngle(180 - 1e-3)
	.rotate([-270, 0])
	.scale(scale)
	.translate(translate)
	.precision(.1)

var path = d3.geoPath()
	.projection(projection)

var graticule = d3.geoGraticule()

vis = d3.select('#example').append('svg')
	.attrs({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')

aspect = chart_container.width() / chart_container.height()

vis_group.append('defs')
	.append('path')
		.datum({
			type: 'Sphere'
		})
		.attrs({
			'id': 'sphere',
			'd': path
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
		'class': 'graticule',
		'd': path
	})

d3.json('data/world-50m.json', function(error, topology){
	console.log('topology: ', topology)

	vis_group.append('path')
		.datum(topojson.feature(topology, topology.objects.land))
		.attrs({
			'class': 'land',
			'd': path
		})

	vis_group.append('path')
		.datum(topojson.mesh(topology, topology.objects.countries), function(a, b){
			return a !== b
		})
		.attrs({
			'class': 'boundary',
			'd': path
		})
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attrs({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})