var container_parent = $('.display') ,
	chart_container = $('#map'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width(),
	height = (width * .6) - margins.top - margins.bottom,
	vis, vis_group, aspect

var defaults = {
	water: {
		width: width,
		height: height,
		fill: 'rgba(0,120,230,.5)'
	},
	country: {
		fill: 'rgba(186,186,113,1)',
		stroke: 'rgba(119,119,119,1)',
		strokeWidth: .5,
		nameFill: 'rgba(255,255,255,1)',
		opacity: .75,
		font: '24px'
	},
	city: {
		nameFill: 'rgba(255,255,255,1)',
		markerFill: 'rgba(255,255,255,.35)',
		markerStroke: 'rgba(68,68,68,1)',
		font: '16px',
		dx: '.65em',
		dy: '.35em'
	},
	blur: 2
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

vis_group.append('svg:defs')
    .append('svg:filter')
    	.attrs({
    		'id': 'dropshadow'
    	})
    .append('svg:feGaussianBlur')
    	.attrs({
    		'stdDeviation': defaults.blur
    	})

var water = vis_group.append('rect')
	.attrs({
		'width': defaults.water.width,
		'height': defaults.water.height,
		'fill': defaults.water.fill
	})

var projection = d3.geoConicConformal()
	.parallels([ 40 + 26 / 60, 41 + 42 / 60 ])
    .rotate([ 82 + 30 / 60, -39 - 40 / 60 ])
    .translate([ width / 2, height / 2 ])

var path = d3.geoPath()
	.projection(projection)

d3.json('data/puerto_rico.json', function(error, pr) {
	var subunits = topojson.feature(pr, pr.objects.subunits),
	places = topojson.feature(pr, pr.objects.places)

	projection
		.scale(1)
		.translate([ 0, 0 ])

	var bounds = path.bounds(subunits),
		scale = .95 / Math.max((bounds[1][0] - bounds[0][0]) / width, (bounds[1][1] - bounds[0][1]) / height),
		translate = [(width - scale * (bounds[1][0] + bounds[0][0])) / 2, (height - scale * (bounds[1][1] + bounds[0][1])) / 2]

	projection
		.scale(scale)
		.translate(translate)

	vis_group.selectAll('.shadow')
		.data(topojson.feature(pr, pr.objects.subunits).features)
			.enter().append('path')
		.attrs({
			'class': 'shadow',
			'fill': 'rgba(68,68,68,.75)',
			'd': path
		})

	// draw the country
	vis_group.selectAll('.subunit')
		.data(topojson.feature(pr, pr.objects.subunits).features)
			.enter().append('path')
		.attrs({
			'd': path,
			'fill': defaults.country.fill,
			'stroke': defaults.country.stroke,
			'stroke-width': defaults.country.strokeWidth
		})

	// draw the country label
	vis_group.selectAll('text')
		.data(subunits.features)
			.enter().append('text')
		.attrs({
			'transform': function(d) {
				return 'translate(' + path.centroid(d) + ')'
			},
			'dy': '.35em',
			'fill': defaults.country.nameFill,
			'font-size': defaults.country.font,
			'text-anchor': 'middle',
			'opacity': defaults.country.opacity
		})
		.text(function(d) {
			return d.properties.name
		})

	// draw the circles for the cities
	vis_group.append('path')
		.datum(topojson.feature(pr, pr.objects.places))
		.attrs({
			'd': path,
			'fill': defaults.city.markerFill,
			'stroke': defaults.city.markerStroke
		})

	// draw the city labels
	vis_group.selectAll('.place-label')
		.data(topojson.feature(pr, pr.objects.places).features)
			.enter().append('text')
		.attrs({
			'transform': function(d) {
				return 'translate(' + path.centroid(d) + ')'
			},
			'dx': defaults.city.dx,
			'dy': defaults.city.dy,
			'fill': defaults.city.nameFill,
			'font-size': defaults.city.font
		})
		.text(function(d){
			return d.properties.name
		})
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attrs({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})