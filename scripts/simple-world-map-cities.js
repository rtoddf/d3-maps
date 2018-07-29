var container_parent = $('.display') ,
	chart_container = $('#map'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width(),
	height = (width * .6) - margins.top - margins.bottom,
	vis, vis_group, aspect

var defaults = {
	countries: {
		fill: 'rgba(0,0,0,.2)',
		stroke: 'rgba(255,255,255,1)',
		strokeWidth: .5
	},
	cities: {
		fill: 'orange',
		stroke: 'rgba(0,0,0,1)',
		strokeWidth: 1,
		dx: '.7em',
		dy: '.35em',
		fontSize: '14px',
		fontWeight: 'bold'
	}
}

var projection = d3.geoMercator()
	.scale((width + 1) / 2 / Math.PI)
	.translate([ width / 2, height / 2 ])
	.precision(.1)

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

d3.queue()
	.defer(d3.json, 'data/world-110m.json')
	.defer(d3.csv, 'data/cities.csv')
	.await(ready)

function ready(error, topology, cities){
	vis_group.append('path')
		.datum(topojson.feature(topology, topology.objects.countries))
		.attrs({
			'd': path,
			'fill': defaults.countries.fill,
			'stroke': defaults.countries.stroke,
			'stroke-width': defaults.countries.strokeWidth
		})

		vis_group.selectAll('circle')
			.data(cities)
				.enter().append('circle')
			.attrs({
				'cx': function(d){
					return projection([ d.lon, d.lat ])[0]
				},
				'cy': function(d){
					return projection([ d.lon, d.lat ])[1]
				},
				'r': 5,
				'fill': defaults.cities.fill,
				'stroke': defaults.cities.stroke,
				'stroke-width': defaults.cities.strokeWidth
			})

		vis_group.selectAll('text')
			.data(cities)
				.enter().append('text')
			.attrs({
				'x': function(d){
					return projection([ d.lon, d.lat ])[0]
				},
				'y': function(d){
					return projection([ d.lon, d.lat ])[1]
				},
				'dx': function(d){
					if(projection([ d.lon, d.lat ])[0] > 690){
						return '-.8em'
					} else {
						return defaults.cities.dx
					}
				},
				'dy': defaults.cities.dy,
				'font-size': defaults.cities.fontSize,
				'font-weight': defaults.cities.fontWeight,
				'text-anchor': function(d){
					if(projection([ d.lon, d.lat ])[0] > 690){
						return 'end'
					}
				}
			})
			.text(function(d){
				return d.city
			})
}