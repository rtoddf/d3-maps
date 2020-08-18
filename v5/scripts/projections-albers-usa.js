var container_parent = document.querySelector('.display'),
    chart_container = document.querySelector('#map'),
    margins = {top: 0, right: 20, bottom: 20, left: 20},
    width = container_parent.offsetWidth,
    height = (width * .6),
    vis, vis_group, aspect

var defaults = {
    colors: {
        none: 'none',
        land: '#baba71',
        water: '#a8e1f8',
        stroke: '#333',
        strokeWidth: .5,
        strokeOpacity: .5
    }
}

var projection = d3.geoAlbersUsa()
    .scale(width)
    .translate([ width/2, height/2 ]);

var path = d3.geoPath()
    .projection(projection);

vis = d3.select('#map').append('svg')
    .attrs({
        'width': width + margins.left + margins.right,
        'height': height + margins.top + margins.bottom,
        'preserveAspectRatio': 'xMinYMid',
        'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
    })

vis_group = vis.append('g')
aspect = chart_container.offsetWidth / chart_container.offsetHeight

const url = "data/us.json";

Promise.all([d3.json(url)]).then(function(data) {
    console.log("data:", data)
    var topology = data[0]

    vis_group.append('path')
        .datum(topojson.feature(topology, topology.objects.land))
        .attrs({
            'd': path,
            'fill': defaults.colors.land,
            'stroke': defaults.colors.stroke,
            'stroke-width': defaults.colors.strokeWidth
        })

    vis_group.append('path')
        .datum(topojson.mesh(topology, topology.objects.states, function(a, b){
            return a !== b
        }))
        .attrs({
            'd': path,
            'fill': 'none',
            'stroke': defaults.colors.stroke,
            'stroke-width': defaults.colors.strokeWidth
        })
})