var container_parent = $('.display') ,
    chart_container = $('#map'),
    margins = {top: 0, right: 20, bottom: 20, left: 20},
    width = container_parent.width(),
    height = (width * .6),
    vis, vis_group, aspect

var defaults = {
    land: {
        fill: '#baba71',
        stroke: '#61613b',
        strokeWidth: .5
    },
    states: {
        fill: '#baba71',
        stroke: '#61613b',
        strokeWidth: .5
    },
    districts: {
        fill: 'none',
        stroke: '#fff',
        strokeWidth: .5
    },
    counties: {
        fill: '#baba71',
        stroke: '#fff',
        strokeWidth: .5
    },
    single_state: {
        fill: '#eee',
        over: 'orange',
        stroke: '#777',
        strokeWidth: 1
    }
}

var projection = d3.geoAlbersUsa()
    .scale(width)
    .translate([ width/2, height/2 ]);

var path = d3.geoPath()
    .projection(projection);

// tooltips
var tooltip = d3.select('body').append('div')
    .attrs({
        'class': 'tooltip',
        'opacity': 1e-6
    })

$(window).on('resize', function() {
    var targetWidth = container_parent.width()
    vis.attrs({
        'width': targetWidth,
        'height': Math.round(targetWidth / aspect)
    })
})
