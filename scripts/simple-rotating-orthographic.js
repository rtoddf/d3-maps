var container_parent = $('.display') ,
	chart_container = $('#map'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = width,
	vis, vis_group, aspect

var rotate = [ 10, -10 ],
	velocity = [ .003, -.003 ],
	time = Date.now(),
	coordinates = [ [-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0] ]

var projection = d3.geo.orthographic()
	.scale(280)
	.translate([ width / 2, height / 2 ])
	.clipAngle(90 + 1e-6)
	.precision(.3)

var path = d3.geo.path()
	.projection(projection)

var graticule = d3.geo.graticule()

vis = d3.select('#map').append('svg')
	.attr({
		'width': width,
		'height': height,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width) + ' ' + (height)
	})

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

var defaults = {
	path: {
		fill: 'none',
		stroke: '#666',
		strokeWidth: 2,
		strokeLinejoin: 'round'
	},
	graticule: {
		stroke: '#999',
		strokeWidth: 1,
	},
	equator: {
		stroke: 'rgba(0,50,100,1)',
		strokeWidth: 1,
	}
}

vis_group.append('path')
	.datum({
		type: 'Sphere'
	})
	.attr({
		'd': path,
		'fill': defaults.path.fill,
		'stroke': defaults.path.stroke,
		'stroke-width': defaults.path.strokeWidth,
		'stroke-linejoin': defaults.path.strokeLinejoin
	})

vis_group.append('path')
	.datum(graticule)
	.attr({
		'd': path,
		'fill': defaults.path.fill,
		'stroke': defaults.graticule.stroke,
		'stroke-width': defaults.graticule.strokeWidth,
		'stroke-linejoin': defaults.path.strokeLinejoin
	})

vis_group.append('path')
	.datum({
		type: 'LineString',
		coordinates: coordinates
	})
	.attr({
		'd': path,
		'fill': defaults.path.fill,
		'stroke': defaults.equator.stroke,
		'stroke-width': defaults.path.strokeWidth,
		'stroke-linejoin': defaults.path.strokeLinejoin
	})

var feature = vis_group.selectAll('path')

d3.timer(function(){
	var dt = Date.now() - time
	projection.rotate([ rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt ])
	feature.attr({
		'd': path
	})
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})