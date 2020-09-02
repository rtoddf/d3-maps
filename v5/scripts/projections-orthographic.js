var container_parent = document.querySelector('.display'),
    chart_container = document.querySelector('#map'),
    margins = {top: 0, right: 0, bottom: 0, left: 0},
    width = container_parent.offsetWidth - margins.left - margins.right,
    height = width,
    vis, vis_group, aspect,
    translate = [ width/2, height/2 ],
    scale = width/2 - margins.left - margins.right

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

var projection = d3.geoOrthographic()
    .scale(scale)
    .rotate([-270, 0])
    .translate(translate)
    .clipAngle(90)
    .precision(.1)

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
aspect = chart_container.offsetWidth / chart_container.offsetHeight

vis_group
    .append('defs')
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
        'xlink:href': '#sphere',
        'fill': defaults.colors.water
    })

vis_group.append('path')
    .datum(graticule)
    .attrs({
        'd': path,
        'fill': defaults.colors.none,
        'stroke': defaults.colors.stroke,
        'stroke-width': defaults.colors.strokeWidth,
        'stroke-opacity': defaults.colors.strokeOpacity
    })

const url = "data/world-50m.json";

Promise.all([d3.json(url)]).then(function(data) {
    var topology = data[0]

    var countries = topojson.feature(topology, topology.objects.countries).features,
        neighbors = topojson.neighbors(topology.objects.countries.geometries)

    vis_group.selectAll('path')
        .data(countries)
            .enter().append('path')
        .attrs({
            'd': path,
            'fill': defaults.colors.land
        })

    vis_group.append('path')
        .datum(topojson.mesh(topology, topology.objects.countries), function(a, b){
            return a !== b
        })
        .attrs({
            'd': path,
            'stroke': defaults.colors.stroke,
            'stroke-width': defaults.colors.strokeWidth,
            'fill': defaults.colors.none
        })
})

window.addEventListener('resize', function (event) {
    console.log("reqsize")
    var targetWidth = container_parent.offsetWidth
    vis.attrs({
        'width': targetWidth,
        'height': Math.round(targetWidth / aspect)
    })
})