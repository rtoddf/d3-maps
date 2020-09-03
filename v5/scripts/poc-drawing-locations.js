var container_parent = document.querySelector('.display'),
    chart_container = document.querySelector('#map'),
    margins = {top: 0, right: 20, bottom: 20, left: 20},
    width = container_parent.offsetWidth,
    height = (width * .5),
    vis, vis_group, aspect, timeout,
    data_set,
    markets = {}

var tooltip = d3.select('.us_map').append('div')
    .attrs({
        'class': 'tooltip'
    })
    .style({
        'opacity': 1e-6
    })

var over_tooltip = d3.select('body').append('div')
    .attrs({
        'class': 'over_tooltip'
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

let stateData = {}

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

    function state_location_fill(d){
        if(stateData[d.id]){
            return stateData[d.id].location == 'true' ? defaults.colors.location : defaults.colors.land
        }
    }

    // draws the state shapes
    vis_group.selectAll('path')
        .data(topojson.feature(topology, topology.objects.states).features)
            .enter().append('path')
            .attrs({
                'd': path,
                'class': 'stats',
                'fill': function(d){
                    return state_location_fill(d)
                },
                'stroke': defaults.colors.strokeColor,
                'strokeWidth': defaults.colors.strokeWidth
            })
            // .each(function(d) {
            //     d3.select(this).on('mouseover', user_interaction)
            //     d3.select(this).on('mouseout', user_interaction)
            // })

    vis_group.selectAll('circle')
        .data(info)
            .enter().append('circle')
        .attrs({
            'class': 'marker',
            'cx': function(d){
                if(d.longitude != 0 && d.latitude != 0){
                    var lat = parseFloat(d.latitude)
                    var lon = parseFloat(d.longitude)
                    return projection([ parseFloat(d.longitude), parseFloat(d.latitude) ])[0]
                }
            },
            'cy': function(d){
                if(d.longitude != 0 && d.latitude != 0){
                    var lat = parseFloat(d.latitude)
                    var lon = parseFloat(d.longitude)
                    return projection([ parseFloat(d.longitude), parseFloat(d.latitude) ])[1]
                }
            },
            'r': 5
        })

    vis_group.selectAll('.marker')
        .each(function(d) {
            // d3.select(this).on('click', clicked)
            d3.select(this).on('mouseover', user_interaction)
            d3.select(this).on('mouseout', user_interaction)
        })
})

function user_interaction(d){
    console.log('hover: ', d)

    var tooltip_opacity = d3.event.type == 'mouseover' ? 1 : 0
    
    over_tooltip
        // .html($(this).data('tooltip'))
        .style({
            'left': (d3.event.pageX) + 'px',
            'top': (d3.event.pageY - 28) + 'px'
        })
        .transition()
            .duration(500)
            .style({
                'opacity': tooltip_opacity
            }) 
}


function pulseMarker(properties) {
    $.each(properties, function(i, city){
        var lat = city.latlon[0]
        var lng = city.latlon[1]

        var marker = markerGroup.append('circle')
            .attrs({
                'class': 'marker',
                'data-type': function(d){
                    return city.name
                },
                'data-tooltip': function(d){
                    return city.tooltip
                },
                'cx': function(d){
                    if(lng !== 0 && lat !== 0){
                        return projection([ lng, lat ])[0]
                    }
                },
                'cy': function(d){
                    if(lng !== 0 && lat !== 0){
                        return projection([ lng, lat ])[1]
                    }
                },
                'r': 5,
                'fill': function(d){
                    return defaults.pulse_color02
                },
                'stroke-width': 1,
                'stroke': function(d){
                    return defaults.pulse_color01
                }
            })
            .style({
                    'cursor': 'pointer'
                })
            .transition()
                .duration(700)
                // .ease(Math.sqrt)
                .attr('r', 10)
                .style('fill-opacity', 1e-6)
            .each('end', function(){
                d3.select(this)
                    .transition()
                        .duration(400)
                        // .ease(Math.sqrt)
                        .attr('r', 20)
                        .style('stroke-opacity', 1e-6)
                    .remove()
            })
        })
    
    timeout = setTimeout(pulseMarker, 1500, properties)

    markerGroup.selectAll('.marker')
        .each(function(d) {
            d3.select(this).on('click', clicked)
            d3.select(this).on('mouseover', user_interaction)
            d3.select(this).on('mouseout', user_interaction)
        })
}