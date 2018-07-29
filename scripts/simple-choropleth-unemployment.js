// http://bl.ocks.org/mbostock/4060606
var rateById = d3.map();

var quantize = d3.scaleQuantize()
	.domain([ 0, .15 ])
	.range(d3.range(9).map(function(i) {
		return 'q' + i + '-9'
	}))

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
	.defer(d3.json, 'data/us.json')
	.defer(d3.tsv, 'data/unemployment.tsv', function(d) {
		rateById.set(d.id, +d.rate)
	})
	.await(ready)

function ready(error, us) {
    console.log('us: ', us)
	vis_group.append('g')
		.attrs({
            'class': 'counties'
        })
		.selectAll('path')
			.data(topojson.feature(us, us.objects.counties).features)
		.enter().append('path')
			.attrs({
                'class': function(d) {
    				return quantize(rateById.get(d.id))
    			},
                'd': path
            })

	vis_group.append('path')
        .datum(topojson.mesh(us, us.objects.states, function(a, b) {
            return a !== b
        }))
        .attrs({
            'd': path,
            'fill': 'none'
        })
}
