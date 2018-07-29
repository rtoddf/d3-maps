var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * .6) - margins.top - margins.bottom,
	vis, vis_group, aspect

var defaults = {
	city: {
		radius: 5,
		fill: 'rgba(255,255,255,1)',
		stroke: 'rgba(0,0,0,1)',
		strokeWidth: 2,
		fontSize: '12px',
		fontY: 10,
		fontOffset: '.71em',
		textAnchor: 'middle'
	},
	countries: {
		fill: 'rgba(102,102,102,.5)',
		stroke: 'rgba(255,255,255,1)',
		strokeWidth: .5
	},
	route: {
		fill: 'none',
		stroke: 'rgba(0,0,0,1)',
		strokeWidth: 3
	},
	graticule: {
		fill: 'none',
		stroke: 'rgba(119,119,119,1)',
		strokeWidth: .5,
		opacity: .5
	}
}

var projection = d3.geoMercator()
	.scale((width + 1) / 2 / Math.PI)
	.translate([ width / 2, height / 2 ])
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

vis_group.append('path')
	.datum(graticule)
	.attrs({
		'd': path,
		'fill': defaults.graticule.fill,
		'stroke': defaults.graticule.stroke,
		'stroke-width': defaults.graticule.strokeWidth,
		'opacity': defaults.graticule.opacity
	})

d3.queue()
	.defer(d3.json, 'data/world-110m.json')
	.defer(d3.csv, 'data/cities03.csv')
	.await(ready)

function ready(error, topology, cities){
	var route = function(){
		var coordinates = cities.map(function(c){
			return [parseInt(c.lon), parseInt(c.lat)]
		})
		return {
			type: 'LineString',
			coordinates: coordinates
		}
	}

	vis_group.append('path')
		.datum(topojson.feature(topology, topology.objects.land))
		.attrs({
			'd': path,
			'fill': defaults.countries.fill,
			'stroke': defaults.countries.stroke,
			'stroke-width': defaults.countries.strokeWidth
		})

	vis_group.append('path')
		.datum(topojson.mesh(topology, topology.objects.countries, function(a, b) { 
			return a !== b
		}))
		.attrs({
			'd': path,
			'fill': 'none',
			'stroke': defaults.countries.stroke,
			'stroke-width': defaults.countries.strokeWidth
		})

	vis_group.append('path')
		.datum(route)
		.attrs({
			'd': path,
			'fill': defaults.route.fill,
			'stroke': defaults.route.stroke,
			'stroke-width': defaults.route.strokeWidth
		})

	var point = vis_group.append('g')
		.attrs({
			'class': 'points'
		})
		.selectAll('g')
			.data(cities)
				.enter().append('g')
			.attrs({
				'transform': function(d){
					return 'translate(' + projection([ d.lon, d.lat ])[0] + ', ' + projection([ d.lon, d.lat ])[1] + ')'
				}
			})

	point.append('circle')
		.attrs({
			'r': defaults.city.radius,
			'fill': defaults.city.fill,
			'stroke': defaults.city.stroke,
			'stroke-width': defaults.city.strokeWidth
		})

	point.append('text')
		.attrs({
			'y': defaults.city.fontY,
			'dy': defaults.city.fontOffset,
			'font-size': defaults.city.fontSize,
			'text-anchor': defaults.city.textAnchor
		})
		.text(function(d){
			return d.code
		})
}

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attrs({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})