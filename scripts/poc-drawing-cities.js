// http://bl.ocks.org/phil-pedruco/6646844
// https://github.com/codeforamerica/click_that_hood/tree/master/public/data

var container_parent = $('.display') ,
    chart_container = $('#map'),
    margins = {top: 0, right: 20, bottom: 50, left: 70},
    width = container_parent.width(),
    height = (width * 1.2) - margins.top - margins.bottom,
    vis, vis_group, aspect,
    scale_amount = '.90'

var city,
    cityData,
    cityCenter,
    address,
    scale,
    markerGroup;

vis = d3.select('#map').append('svg')
    .attr({
        'width': width + margins.left + margins.right,
        'height': height + margins.top + margins.bottom,
        'preserveAspectRatio': 'xMinYMid',
        'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
    })

aspect = chart_container.width() / chart_container.height()

$(document).ready(function(){
    Cities.get('atlanta')

    $('#cities').change(function(){
        
        city = {
            'shortName': $('#cities :selected')[0].value,
            'longName': $('#cities :selected')[0].text
        }

        d3.select('.city')
           .remove()

        markerGroup.selectAll('.marker')
            .each(function(d) {
                d3.select(this).remove()
            })

        Cities.get(city.shortName)
    })
})

var Cities = new function(){
    this.get = function(city){

        switch (city){
            case 'atlanta':
                cityData = 'atlanta.json'
                cityCenter = [-84.387982, 33.748995]
                locationCenter = [-84.356098, 33.846508]
                scale = 60000
                address = '945 East Paces Ferry Road'
                cityState = 'Atlanta, GA 30369'
                email = 'helloatlanta@coxreps.com'
                phone = '404-848-0800'
                break;
            case 'boston':
                cityData = 'boston.json'
                cityCenter = [-71.058880, 42.360082]
                locationCenter = [-71.079229, 42.349885]
                scale = 60000
                address = '699 Boylston Street'
                cityState = 'Boston, MA 02116'
                email = 'helloboston@coxreps.com'
                phone = '617-247-2555'
                break;
            case 'chicago':
                cityData = 'chicago.json'
                cityCenter = [-87.629798, 41.878114]
                locationCenter = [-87.623555, 41.885967]
                scale = 25000
                address = '205 North Michigan Avenue'
                cityState = 'Chicago, IL 60601'
                email = 'hellochicago@coxreps.com'
                phone = '312-228-6600 / 312-228-7000'
                break;
            case 'dallas':
                cityData = 'dallas.json'
                cityCenter = [-96.796988, 32.776664]
                locationCenter = [-96.816738, 32.924654]
                scale = 25000
                address = '5400 LBJ Freeway'
                cityState = 'Dallas, TX 75240'
                email = 'hellodallas@coxreps.com'
                phone = '972-404-8737'
                break;
            case 'detroit':
                cityData = 'detroit.json'
                cityCenter = [-83.045754, 42.331427]
                locationCenter = [-83.243757, 42.475428]
                scale = 35000
                address = '1000 Town Center'
                cityState = 'Southfield, MI 48075'
                email = 'hellodetroit@coxreps.com'
                phone = '248-359-8100'
                break;
            case 'los-angeles':
                cityData = 'los-angeles.json'
                cityCenter = [-118.243685, 34.052234]
                locationCenter = [-118.35216, 34.062007]
                scale = 20000
                address = '5670 Wilshire Boulevard'
                cityState = 'Los Angeles, CA 90036'
                email = 'hellolosangeles@coxreps.com'
                phone = '323-937-4644'
                break;
            case 'minneapolis':
                cityData = 'minneapolis.json'
                cityCenter = [-93.265011, 44.977753]
                locationCenter = [-93.266637, 44.974117]
                scale = 50000
                address = '701 4th Avenue South'
                cityState = 'Minneapolis, MN 55415'
                email = 'hellominneapolis@coxreps.com'
                phone = '612-332-7333'
                break;
            case 'new-york':
                cityData = 'new-york.json'
                cityCenter = [-73.971249, 40.783060]
                locationCenter = [-73.969971, 40.753519]
                scale = 60000
                address = 'One Dag Hammarskjold Plaza'
                cityState = 'New York, NY 10017'
                email = 'hellonyc@coxreps.com'
                phone = '212-759-8787 / 212-756-3600 '
                break;
            case 'philadelphia':
                cityData = 'philadelphia.json'
                cityCenter = [-75.165222, 39.952584]
                locationCenter = [-75.41117, 40.083738]
                scale = 35000
                address = '1255 Drummer’s Lane'
                cityState = 'Wayne, PA 19087'
                email = 'hellophiladelphia@coxreps.com'
                phone = '610-293-4100'
                break;
            case 'seattle':
                cityData = 'seattle.json'
                cityCenter = [-122.332071, 47.606209]
                locationCenter = [-122.350537, 47.617553]
                scale = 35000
                address = '2807 Third Avenue'
                cityState = 'Seattle, WA 98121'
                email = 'helloseattle@coxreps.com'
                phone = '206-623-3939'
                break;
            default:  

        }

        city = city.replace('-', ' ')
        $('.city_name').html(city)
        $('.address').html(address)
        $('.cityState').html(cityState)
        $('.email a').html(email).attr('href', 'mailto:' + email)
        $('.phone').html(phone)

        vis_group = vis.append('g')
            .attr({
                'class': 'city'
            })

        d3.json('data/' + cityData, function(error, city) {
            var projection = d3.geo.mercator()
                .center(cityCenter)
                .scale(scale)
                .translate([(width) / 2, (height)/2]);

            var path = d3.geo.path()
                .projection(projection);

            vis_group.selectAll('path')
                .data(city.features)
                    .enter().append('path')
                .attr('class', 'area')
                // .attr('class', function(d){
                //  return d.properties.name;
                // })
                .attr('d', path);

            markerGroup = vis_group.append('g')

            var marker = markerGroup.append('circle')
                .attr({
                    'class': 'marker',
                    'cx': function(d){
                        // if(lng !== 0 && lat !== 0){
                            return projection(locationCenter)[0]
                        // }
                    },
                    'cy': function(d){
                        // if(lng !== 0 && lat !== 0){
                            return projection(locationCenter)[0]
                        // }
                    },
                    'r': 5,
                    // 'fill': function(d){
                    //     return 'red'
                    // },
                    // 'stroke-width': 1,
                    // 'stroke': function(d){
                    //     return 'white'
                    // }
                })

            var center = markerGroup.append('circle')
                .attr({
                    'class': 'city-center',
                    'cx': function(d){
                        // if(lng !== 0 && lat !== 0){
                            return projection(cityCenter)[0]
                        // }
                    },
                    'cy': function(d){
                        // if(lng !== 0 && lat !== 0){
                            return projection(cityCenter)[0]
                        // }
                    },
                    'r': 5,
                    // 'fill': function(d){
                    //     return 'blue'
                    // },
                    // 'stroke-width': 1,
                    // 'stroke': function(d){
                    //     return 'white'
                    // }
                })

        })
    }
}

$(window).on('resize', function() {
    var targetWidth = container_parent.width()
    vis.attr({
        'width': targetWidth,
        'height': Math.round(targetWidth / aspect)
    })
})