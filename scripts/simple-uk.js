var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width(),
	height = width - margins.top - margins.bottom,
	vis, vis_group, aspect,
	scale_amount = '.85'

var projection = d3.geoAlbers()
    .center([0, 55.4])
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(6000)
    .translate([width / 2, height / 2])

var path = d3.geoPath()
    .projection(projection)
    .pointRadius(2)

var vis = d3.select('#example').append('svg')
	.attrs({
		'width': width,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')
	.attrs({
        'transform': 'scale(' + scale_amount + ')'
    })

aspect = chart_container.width() / chart_container.height()

d3.json('data/uk.json', function(error, uk) {
	var subunits = topojson.feature(uk, uk.objects.subunits),
	places = topojson.feature(uk, uk.objects.places)

	vis_group.selectAll('.subunit')
		.data(topojson.feature(uk, uk.objects.subunits).features)
			.enter().append('path')
		.attrs({
			'class': function(d){ 
				return 'subunit ' + d.id
			},
			'd': path
		})

	vis_group.append('path')
	    .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { 
	    	return a !== b && a.id !== 'IRL' 
	    }))
	    .attrs({
	    	'd': path,
			'class': 'subunit-boundary'
		})

	vis_group.append('path')
		.datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) {
			return a === b && a.id === 'IRL'
		}))
		.attrs({
			'd': path,
			'class': 'subunit-boundary IRL'
		})

	vis_group.append('path')
		.datum(topojson.feature(uk, uk.objects.places))
		.attrs({
			'd': path,
			'class': 'place'
		})

	vis_group.selectAll('.subunit-label')
		.data(subunits.features)
			.enter().append('text')
		.attrs({
			'class': function(d) {
				return 'subunit-label ' + d.id
			},
			'transform': function(d) {
				return 'translate(' + path.centroid(d) + ')'
			},
			'dy': '.35em'
		})
		.text(function(d) {
			return d.properties.name
		})

	vis_group.append('path')
		.data(places)
		.attrs({
			'd': path,
			'class': 'place'
		})

	vis_group.selectAll('.place-label')
		.data(places.features)
			.enter().append('text')
		.attrs({
			'class': 'place-label',
			'transform': function(d) {
				return 'translate(' + projection(d.geometry.coordinates) + ')'
			},
			'x': function(d) {
				return d.geometry.coordinates[0] > -1 ? 6 : -6
			},
			'dy': '.35em'
		})
		.style('text-anchor', function(d) {
			return d.geometry.coordinates[0] > -1 ? 'start' : 'end'
		})
		.text(function(d) {
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