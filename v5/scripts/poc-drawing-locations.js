var container_parent = document.querySelector('.display'),
    chart_container = document.querySelector('#map'),
    margins = {top: 0, right: 20, bottom: 20, left: 20},
    width = container_parent.offsetWidth,
    height = (width * .5),
    vis, vis_group, aspect, timeout,
    stateData = {}

var tooltip = d3.select('body').append('div')
    .attrs({
        'class': 'tooltip'
    })
    .style({
        'opacity': 1e-6
    })

const defaults = {
    colors: {
        land: '#ababab',
        location: '#00b3f0',
        strokeColor: '#fff',
        strokeWidth: 2,
        pulse_color01: '#000',
        pulse_color02: '#ffffff'
    }
}

var projection = d3.geoAlbersUsa()
    .scale(width)
    .translate([ width/2, height/2 ]);

var path = d3.geoPath().projection(projection)

vis = d3.select('#map').append('svg')
    .attrs({
        'width': width + margins.left + margins.right,
        'height': height + margins.top + margins.bottom,
        'preserveAspectRatio': 'xMinYMid',
        'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
    })

// aspect = chart_container.offsetWidth / chart_container.offsetHeight
vis_group = vis.append('g')

const us = "data/us.json";
const info = "data/us-states-locations.tsv"

Promise.all([d3.json(us), d3.tsv(info)]).then(function(data) {
    const topology = data[0]

    data[1].forEach(function(d, i){
        stateData[d.id] = {
            'name': d.name,
            'code': d.code,
            'location': d.location,
            'latitude': d.latitude,
            'longitude': d.longitude,
            'city': d.city
        }
    })

    const info = data[1]

    // draws the state shapes
    vis_group.selectAll('path')
        .data(topojson.feature(topology, topology.objects.states).features)
            .enter().append('path')
            .attrs({
                'd': path,
                'fill': (d) => stateData[d.id] && stateData[d.id].location == 'true' ? defaults.colors.location : defaults.colors.land,
                'stroke': defaults.colors.strokeColor,
                'strokeWidth': defaults.colors.strokeWidth
            })

    vis_group.selectAll('circle')
        .data(info)
            .enter().append('circle')
        .attrs({
            'class': 'marker',
            'cx': (d) => d.longitude != 0 && d.latitude != 0 ? projection([ parseFloat(d.longitude), parseFloat(d.latitude) ])[0]: '',
            'cy': (d) => d.longitude != 0 && d.latitude != 0 ? projection([ parseFloat(d.longitude), parseFloat(d.latitude) ])[1]: '',
            'r': 5
        })
        .style('cursor', 'pointer')
        .on('mouseover', function(d){
            d3.select('.tooltip')
                .html('<span>' + d.city + '</span>')
                .styles({
                    'left': (d3.event.pageX) + 'px',
                    'top': (d3.event.pageY - 35) + 'px'
                })
                .transition()
                    .duration(500)
                    .style('opacity', 1) 
        })
        .on('mouseout', function(d){
            d3.select(this)
                .transition()
                .duration(200)
            d3.select('.tooltip')
                .transition()
                    .duration(200)
                    .style('opacity', 0) 
        })
})