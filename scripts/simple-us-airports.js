var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 70},
	width = container_parent.width(),
	height = (width * .6) - margins.top - margins.bottom,
	vis, vis_group, aspect,
	scale_amount = '.90'

var projection = d3.geo.albers()

var path = d3.geo.path()
	.projection(projection)
	.pointRadius(1.5)

vis = d3.select('#example').append('svg')
	.attr({
		'width': width,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + width + ' ' + height
	})

vis_group = vis.append('g')
	.attr({
        'transform': 'translate(' + -(margins.left) + ', ' + -(margins.top) + ') scale(' + scale_amount + ')'
    })

aspect = chart_container.width() / chart_container.height()

queue()
	.defer(d3.json, 'data/us.json')
	.defer(d3.json, 'data/airports.json')
	.await(ready)

function ready(error, us, airports){
	vis_group.append('path')
		.datum(topojson.feature(us, us.objects.land))
		.attr({
			'd': path,
			'fill': '#ccc'
		})

	vis_group.append('path')
		.datum(topojson.mesh(us, us.objects.states, function(a, b){
			return a !== b
		}))
		.attr({
			'd': path,
			'fill': 'none',
			'stroke': 'rgba(255,255,255,1)',
			'stroke-width': 2
		})

	vis_group.append('path')
		.datum(topojson.feature(airports, airports.objects.airports))
		.attr({
			'd': path
		})
}

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})