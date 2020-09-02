var container_parent = document.querySelector('.display'),
    chart_container = document.querySelector('#map'),
    margins = {top: 0, right: 20, bottom: 20, left: 20},
    width = container_parent.offsetWidth,
    height = (width * .5),
    vis, vis_group, aspect, timeout,
    data_set,
    markets = {}

// var tooltip = d3.select('.us_map').append('div')
//     .attr({
//         'class': 'tooltip'
//     })
//     .style({
//         'opacity': 1e-6
//     })

// var over_tooltip = d3.select('body').append('div')
//     .attr({
//         'class': 'over_tooltip'
//     })
//     .style({
//         'opacity': 1e-6
//     })

// var defaults = {
//     state_fill: '#999999',
//     state_hover_fill: '#666',
//     state_stroke: 2,
//     state_stroke_color: '#fff',
//     media_type_color: '#00a9e1',
//     pulse_color01: '#ffffff',
//     pulse_color02: '#595959'
// }

const defaults = {
    colors: {
        land: '#ababab',
        location: '#00b3f0',
        strokeColor: '#fff',
        strokeWidth: 2,
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
const states = "data/drawing-locations.json"
const info = "data/us-states-locations.tsv"

Promise.all([d3.json(us), d3.tsv(info)]).then(function(data) {
    const topology = data[0]

    data[1].forEach(function(d, i){
        stateData[d.id] = {
            'name': d.name,
            'code': d.code,
            'location': d.location
        }
    })

    const info = data[1]

    console.log('topology: ', topology)
    console.log('info: ', info)

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

    markerGroup = vis_group.append('g')

    // states.forEach(function(state){
    //     var properties = {}

    //     state.properties.forEach(function(city){
    //         properties[city.id] = {
    //             'name': city.name,
    //             'tooltip': city.tooltip,
    //             'latlon': city.latlon,
    //             'television': city.television,
    //             'radio': city.radio,
    //             'digital': city.digital,
    //             'newspaper': city.newspaper,
    //             'directmail': city.directmail,
    //         }
    //     })

    //     markets[state.id] = {
    //         'id': state.id,
    //         'name': state.name,
    //         'mediatypes': getMedia(properties),
    //         'properties': properties
    //     }
    // })

    // console.log('states: ', states)

    // function getMedia(properties){
    //     var mediaTypes = []
    
    //     $.each(properties, function(i, prop){
    //         if(prop['television'].length !== 0){
    //             mediaTypes.push('television') 
    //         }
    
    //         if(prop['radio'].length !== 0){
    //             mediaTypes.push('radio') 
    //         }
    
    //         if(prop['digital'].length !== 0){
    //             mediaTypes.push('digital') 
    //         }
    
    //         if(prop['newspaper'].length !== 0){
    //             mediaTypes.push('newspaper') 
    //         }
    
    //         if(prop['directmail'].length !== 0){
    //             mediaTypes.push('directmail') 
    //         }
    //     })
    
    //     return mediaTypes
    // }

    // function highlightLocations(states){
    //     d3.selectAll('.stats')
    //         .transition()
    //             .duration(400)
    //             // .ease('cubic')
    //             .attrs({
    //                 'fill': function(d){                       
    //                     if(markets[d.id] && $.inArray(d.id, states) !== -1){
    //                         return defaults.media_type_color
    //                     } else {
    //                         return defaults.state_fill
    //                     }
    //                 }
    //             })
    // }

    // function addMarketsToDropdown(ms, selectInstructions){       
    //     $('#media-select').html('')
    //     var selectOption = '<option class="instructions" rel="market-share-modal" data-type="select"><span>' + selectInstructions + '</span></option>'
    //     $('#media-select').append(selectOption)

    //     $.each(ms, function(j, market){
    //         var option = '<option rel="market-share-modal" data-type="' + market.name +'"><span>' + market.tooltip + '</span></option>'
    //         $('#media-select').append(option)
    //     })
    // }

    // function marketsSelected(){
    //     var ms = []
    //     var states = []
    //     var html = ''

    //     console.log("allMediaTypes: ", allMediaTypes)

        // $.each(allMediaTypes, function(l, mt){
        //     if($.inArray(mt, activeMediaTypes) !== -1){
        //         $('[rel="media-label-' + mt + '"]').fadeIn(300)
        //     } else {
        //         $('[rel="media-label-' + mt + '"]').fadeOut(200)
        //     }
        // })

        // $.each(markets, function(j, market){
        //     $.each(market.mediatypes, function(k, media){
        //         if($.inArray(media, activeMediaTypes) !== -1){
        //             $.each(market.properties, function(m, property){
        //                 $.each(activeMediaTypes, function(l, amt){
        //                     if (property[amt].length !== 0) {
        //                         ms.push(property)
        //                     }
        //                 })
        //             })
        //             states.push(market.id)
        //         }
        //     })
        // })

        // var selectInstructions = activeMediaTypes.length !== 0 ? 'Select a Market' : 'Please Select a Media Type Above'

        // ms = $.unique($.unique(ms))
        // addMarketsToDropdown($.unique(ms).sort(SortByName), selectInstructions)
        // pulseMarker($.unique(ms))

        // states = $.unique(states)
        // highlightLocations(states)
    // }

    // $(document).ready(function(){
    //     $('[rel="program-share-modal"]').addClass('active')

    //     marketsSelected()
    // })
})



// d3.json('data/us.json', function(error, topology){

//     $('body').on('click', '[rel="program-share-modal"]', function(e){
//         e.preventDefault()

//         if($(this).hasClass('active')){
//             $(this).removeClass('active')
//         } else {
//             $(this).addClass('active')
//         }

//         if($.inArray($(this).data('type'), activeMediaTypes) !== -1){
//             activeMediaTypes.splice($.inArray($(this).data('type'), activeMediaTypes), 1);
//         } else {
//             activeMediaTypes.push($(this).data('type'))
//         }

//         clearTimeout(timeout)
//         marketsSelected()
//     })
// })

var allMediaTypes = ['television', 'radio', 'digital', 'newspaper', 'directmail']
var activeMediaTypes = ['television', 'radio', 'digital', 'newspaper', 'directmail']

function SortByName(a, b){
    var aName = a.name.toLowerCase();
    var bName = b.name.toLowerCase(); 
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

function user_interaction(d){
    var tooltip_opacity = d3.event.type == 'mouseover' ? 1 : 0
    
    over_tooltip
        .html($(this).data('tooltip'))
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

function goToUrl(property){
    var url = 'location.html?' + property;
    $(location).attr('href', url);
    window.location = url;
}

function clicked(d){
    goToUrl(($(this).data('type')).replace(' ', ''))
}

$('#media-select').change(function() {
    $('#media-select option:selected').each(function() {
        if($(this).attr('data-type') !== 'select'){
            goToUrl($(this).attr('data-type'))
        }
    });
});
