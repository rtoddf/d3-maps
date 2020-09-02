var container_parent = document.querySelector('.display'),
    chart_container = document.querySelector('#map'),
    margins = {top: 0, right: 20, bottom: 20, left: 20},
    width = container_parent.offsetWidth,
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

var path = d3.geoPath().projection(projection);

// tooltips
var tooltip = d3.select('body').append('div')
    .attrs({
        'class': 'tooltip',
        'opacity': 1e-6
    })

var tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 1e-6)

vis = d3.select('#map').append('svg')
    .attrs({
        'width': width + margins.left + margins.right,
        'height': height + margins.top + margins.bottom,
        'preserveAspectRatio': 'xMinYMid',
        'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
    })

    console.log("bloop")

vis_group = vis.append('g')
aspect = chart_container.offsetWidth/ chart_container.offsetHeight
var names = {}
var data_set
var party_map = true,
    same_sex_map = false,
    age_of_consent_map = false

// TODO: clean these functions up
function state_party_fill(d){
    var party = names[d.id].party
    if(party == 'Republican'){
        return '#e91d0e'
    } else if(party == 'Democrat'){
        return '#003264'
    } else if(party == 'Split'){
        return 'purple'
    } else {
        return 'white'
    }
}

const us = "data/us.json";
const states = "data/us-state-names.tsv";

Promise.all([d3.json(us), d3.tsv(states)]).then(function(data) {
    const topology = data[0]
    const tsv = data[1]

    tsv.forEach(function(d, i){
        names[d.id] = {
            'name': d.name,
            'code': d.code,
            'party': d.party,
            'same_sex_marriage': d.same_sex_marriage,
            'age_of_consent': d.age_of_consent
        }
    })

    console.log('tsv: ', tsv)

    vis_group.selectAll('path')
            .data(topojson.feature(topology, topology.objects.states).features)
        .enter().append('path')
        .attrs({
            'd': path,
            'class': 'stats',
            'fill': function(d){
                return state_party_fill(d)
            },
            'stroke': '#fff',
            'strokeWidth': 2,
        })
        .style('cursor', 'pointer')
        .each(function() {
            d3.select(this).on('mouseover', user_interaction)
            d3.select(this).on('mouseout', user_interaction)
        })

    function user_interaction(d){
        var fill = function(){
            // TODO: clean this up
            if(party_map){
                return state_party_fill(d)
            } else if(age_of_consent_map){
                return state_consent_fill(d, data_set)
            } else if(same_sex_map) {
                return state_data_fill(d, data_set)
            }
        }

        var html = function(){
            // TODO: clean this up
            if(party_map){
                return names[d.id]['party']
            } else if(age_of_consent_map){
                return names[d.id]['age_of_consent']
            } else if(same_sex_map) {
                return names[d.id]['same_sex_marriage']
            }
        }

        var tooltip_opacity = d3.event.type == 'mouseover' ? 1 : 0
        var fill_color = d3.event.type == 'mouseover' ? '#666' : fill()
        
        d3.select('.tooltip')
            .html( '<span>' + names[d.id]['code'] + ': ' + html() + '</span>' )
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px')
            .transition()
                .duration(500)
                .style('opacity', tooltip_opacity) 

        d3.select(this)
            .transition()
                .duration(200)
                .attrs({
                    'fill': fill_color
                })
    }

    function animate(data_set){
        // TODO: clean this up
        if(data_set == 'same_sex_marriage'){
            party_map = false
            same_sex_map = true
            age_of_consent_map = false

            d3.selectAll('.stats')
                .transition()
                    .duration(400)
                    .ease('cubic')
                    .attrs({
                        'fill': function(d){
                            return state_data_fill(d, data_set)
                        }
                    })
        } else if(data_set == 'age_of_consent'){
            party_map = false
            same_sex_map = false
            age_of_consent_map = true

            d3.selectAll('.stats')
                .transition()
                    .duration(400)
                    .ease('cubic')
                    .attrs({
                        'fill': function(d){
                            return state_consent_fill(d, data_set)
                        }
                    })
        } else if(data_set == 'party'){
            party_map = true
            same_sex_map = false
            age_of_consent_map = false

            d3.selectAll('.stats')
                .transition()
                    .duration(400)
                    .ease('cubic')
                    .attrs({
                        'fill': function(d){
                            return state_party_fill(d)
                        }
                    })
        }
    }

    $('body').on('click', '[rel="program-share-modal"]', function( e ) {
        console.log('click')
        e.preventDefault()
        data_set = $(this).data('type')

        animate(data_set)
    })
})

// d3.tsv('data/us-state-names.tsv', function(tsv){
    // tsv.forEach(function(d, i){
    //     names[d.id] = {
    //         'name': d.name,
    //         'code': d.code,
    //         'party': d.party,
    //         'same_sex_marriage': d.same_sex_marriage,
    //         'age_of_consent': d.age_of_consent
    //     }
    // })
// })

// d3.json('data/us.json', function(error, topology){
//     // draws the state shapes
    // vis_group.selectAll('path')
    //         .data(topojson.feature(topology, topology.objects.states).features)
    //     .enter().append('path')
    //     .attr({
    //         'd': path,
    //         'class': 'stats',
    //         'fill': function(d){
    //             return state_party_fill(d)
    //         },
    //         'stroke': '#fff',
    //         'strokeWidth': 2,
    //     })
    //     .style({
    //         'cursor': 'pointer'
    //     })
    //     .each(function(d) {
    //         d3.select(this).on('mouseover', user_interaction)
    //         d3.select(this).on('mouseout', user_interaction)
    //     })

//     function user_interaction(d){
//         var fill = function(){
//             // TODO: clean this up
//             if(party_map){
//                 return state_party_fill(d)
//             } else if(age_of_consent_map){
//                 return state_consent_fill(d, data_set)
//             } else if(same_sex_map) {
//                 return state_data_fill(d, data_set)
//             }
//         }

//         var html = function(){
//             // TODO: clean this up
//             if(party_map){
//                 return names[d.id]['party']
//             } else if(age_of_consent_map){
//                 return names[d.id]['age_of_consent']
//             } else if(same_sex_map) {
//                 return names[d.id]['same_sex_marriage']
//             }
//         }

//         var tooltip_opacity = d3.event.type == 'mouseover' ? 1 : 0
//         var fill_color = d3.event.type == 'mouseover' ? '#666' : fill()
        
//         d3.select('.tooltip')
//             .html( '<span>' + names[d.id]['code'] + ': ' + html() + '</span>' )
//             .style({
//                 'left': (d3.event.pageX) + 'px',
//                 'top': (d3.event.pageY - 28) + 'px'
//             })
//             .transition()
//                 .duration(500)
//                 .style({
//                     'opacity': tooltip_opacity
//                 }) 

//         d3.select(this)
//             .transition()
//                 .duration(200)
//                 .attr({
//                     'fill': fill_color
//                 })
//     }

//     function animate(data_set){
//         // TODO: clean this up
//         if(data_set == 'same_sex_marriage'){
//             party_map = false
//             same_sex_map = true
//             age_of_consent_map = false

//             d3.selectAll('.stats')
//                 .transition()
//                     .duration(400)
//                     .ease('cubic')
//                     .attr({
//                         'fill': function(d){
//                             return state_data_fill(d, data_set)
//                         }
//                     })
//         } else if(data_set == 'age_of_consent'){
//             party_map = false
//             same_sex_map = false
//             age_of_consent_map = true

//             d3.selectAll('.stats')
//                 .transition()
//                     .duration(400)
//                     .ease('cubic')
//                     .attr({
//                         'fill': function(d){
//                             return state_consent_fill(d, data_set)
//                         }
//                     })
//         } else if(data_set == 'party'){
//             party_map = true
//             same_sex_map = false
//             age_of_consent_map = false

//             d3.selectAll('.stats')
//                 .transition()
//                     .duration(400)
//                     .ease('cubic')
//                     .attr({
//                         'fill': function(d){
//                             return state_party_fill(d)
//                         }
//                     })
//         }
//     }

//     // window.addEventListener('click', function(e){
//     //     e.preventDefault()
//     //     data_set = $(this).data('type')
//     //     animate(data_set)

//     //     console.log('data_set: ', data_set)
//     // })

//     $('body').on('click', '[rel="program-share-modal"]', function( e ) {
//         console.log("click")
//         e.preventDefault()
//         data_set = $(this).data('type')

//         animate(data_set)
//     })
// })

// $(window).on('resize', function() {
//     var targetWidth = container_parent.offsetWidth
//     vis.attr({
//         'width': targetWidth,
//         'height': Math.round(targetWidth / aspect)
//     })
// })
