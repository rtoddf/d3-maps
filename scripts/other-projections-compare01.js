// https://bl.ocks.org/syntagmatic/ba569633d51ebec6ec6e
// https://bl.ocks.org/alexmacy/6700d44240d2b6d3ec9767a5a5854e42
// https://bl.ocks.org/mbostock/3711652
// https://github.com/d3/d3-geo-projection

var container_parent = $('.display'),
	chart_container = $('#map'),
	margins = {top: 30, right: 20, bottom: 20, left: 250},
	map_width = container_parent.width() - margins.left - margins.right,
	map_height = (map_width * .8) - margins.top - margins.bottom,
	scale=120
	// vis, vis_group, aspect,
	// scale = width/6

var projection = d3.geo.aitoff()
	.translate( [map_width / 2, map_height / 2] ).scale(120);

var path = d3.geo.path()
	.projection(projection);

var graticule = d3.geo.graticule();

var map_svg = d3.select('#map').append('svg')
	.attr({
		'width': map_width + margins.left + margins.right,
		'height': map_height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (map_width + margins.left + margins.right) + ' ' + (map_height + margins.top + margins.bottom)
	})

map_svg.append('path')
	.datum(graticule)
		.attr({
			'class': 'graticule',
			'd': path,
			'transform': 'translate(100,' + margins.top + ')'
		});

d3.json('data/world-110m.json', function(error,world) {
	if (error) throw error;

	map_svg.insert('path', '.graticule')
		.datum(topojson.feature(world, world.objects.land))
			.attr({
				'class': 'land',
				'd': path,
				'transform': 'translate(100,' + margins.top + ')'
			});
});

/* Parallel Coordinates */
// var width = chart_container_parent.width() - margins.left - margins.right,
// 	height = (map_width * 0.4) - margins.top - margins.bottom;

var projections = {
	'Aitoff': d3.geo.aitoff().scale(scale),
	'Boggs Eumorphic': d3.geo.boggs().scale(scale),
	'Craster Parabolic (Putnins P4)': d3.geo.craster().scale(scale),
	'Cylindrical Equal-Area': d3.geo.cylindricalEqualArea().scale(scale),
	'Eckert I': d3.geo.eckert1().scale(scale),
	'Eckert III': d3.geo.eckert3().scale(scale),
	'Eckert IV': d3.geo.eckert4().scale(scale),
	'Eckert V': d3.geo.eckert5().scale(scale),
	'Equidistant Cylindrical (Plate Carrée)': d3.geo.equirectangular().scale(scale),
	'Fahey': d3.geo.fahey().scale(scale),
	'Foucaut Sinusoidal': d3.geo.foucaut().scale(scale),
	'Gall (Gall Stereographic)': d3.geo.cylindricalStereographic().scale(scale),
	'Ginzburg VIII (TsNIIGAiK 1944)': d3.geo.ginzburg8().scale(scale),
	'Kavraisky VII': d3.geo.kavrayskiy7().scale(scale),
	'Larrivée': d3.geo.larrivee().scale(scale),
	'McBryde-Thomas Flat-Pole Sine (No. 2)': d3.geo.mtFlatPolarSinusoidal().scale(scale),
	// 'Mercator': d3.geo.mercator().scale(50),
	'Miller Cylindrical I': d3.geo.miller().scale(scale),
	'Mollweide': d3.geo.mollweide().scale(scale),
	'Natural Earth': d3.geo.naturalEarth().scale(scale),
	'Nell-Hammer': d3.geo.nellHammer().scale(scale),
	'Quartic Authalic': d3.geo.hammer().coefficient(Infinity).scale(scale),
	'Robinson': d3.geo.robinson().scale(scale),
	'Sinusoidal': d3.geo.sinusoidal().scale(scale),
	'van der Grinten (I)': d3.geo.vanDerGrinten().scale(scale),
	'Wagner VI': d3.geo.wagner6().scale(scale),
	'Wagner VII': d3.geo.wagner7().scale(scale),
	'Winkel Tripel': d3.geo.winkel3().scale(scale)
};

var chart_container_parent = $('.chart-display'),
	chart_cont = $('#map'),
	width = 250,
	height = (Object.keys(projections).length * 20) - margins.top - margins.bottom

var dimensions = [
	{
		name: 'name',
		scale: d3.scale.ordinal().rangePoints( [0, height] ),
		type: String
	}
	// ,
	// {
	// 	name: 'Acc. 40º 150%',
	// 	scale: d3.scale.linear().range( [0, height] ),
	// 	type: Number
	// },
	// {
	// 	name: 'Scale',
	// 	scale: d3.scale.linear().range( [height, 0] ),
	// 	type: Number
	// },
	// {
	// 	name: 'Areal',
	// 	scale: d3.scale.sqrt().range( [height, 0] ),
	// 	type: Number
	// },
	// {
	// 	name: 'Angular',
	// 	scale: d3.scale.linear().range( [height, 0] ),
	// 	type: Number
	// }
];

var x = d3.scale.ordinal()
	.domain(dimensions.map(function(d) {
		return d.name;
	}))
	.rangePoints([0, width]);

var line = d3.svg.line()
	.defined(function(d) {
		return !isNaN(d[1]);
	});

var yAxis = d3.svg.axis()
	.orient('left');

var svg = d3.select('#chart')
	.append('svg')
		.attr({
			'width': width,
			'height': height + margins.top + margins.bottom
		})
		.append('g')
		.attr({
			'transform': 'translate(100,' + margins.top + ')'
		});

var dimension = svg.selectAll('.dimension')
	.data(dimensions)
		.enter().append('g')
	.attr({
		'class': 'dimension',
		'transform': function(d) {
			return 'translate(' + x(d.name) + ')';
		}
	})

d3.tsv('data/projections.tsv', function(data) {
	data = data.filter(function(d) {
		return d.name in projections
	});
	dimensions.forEach(function(dimension) {
		dimension.scale.domain(dimension.type === Number
			? d3.extent(data, function(d) {
				return +d[dimension.name];
			})
			: data.map(function(d) {
				return d[dimension.name];
			})
			.sort());
	});

svg.append('g')
	.attr({
		'class': 'background'
	})
	.selectAll('path')
		.data(data)
	.enter().append('path')
	  .attr({
	  	'd': draw
	  });

dimension.append('g')
	.attr({
		'class': 'axis'
	})
	.each(function(d) {
		d3.select(this).call(yAxis.scale(d.scale));
	})

var lazyMouseover = debounce(mouseover, 100);

// Rebind the axis data to simplify mouseover.
svg.select('.axis').selectAll('text:not(.title)')
	.attr({
		'class': 'label'
	})
	.data(data, function(d) {
		return d.name || d;
	});

var projection_line = svg.selectAll('.axis text.label, .background path, .foreground path')
	.on('mousedown', lazyMouseover)

	mouseover(data.filter(function(d) {
		return d.name == 'Aitoff'
	})[0]);

	function mouseover(d) {
		if (!(d.name in projections)) return;
		if (d.name == projection.name) return;
		svg.classed('active', true);
		projection_line.classed('inactive', function(p) {
			return p !== d;
		});

		projection_line.filter(function(p) {
			return p === d;
		}).each(moveToFront);
		
		// update map
		var last_projection = projection;
		projection = projections[d.name]
			.translate( [map_width / 2 - .5, map_height / 2 - .5] );

		path = d3.geo.path()
			.projection(projection);

		map_svg.selectAll('path')
			.transition()
			.duration(450)
			.attr({
				'd': path
			})
			.attrTween('d', projectionTween(last_projection, projection));
	}

	function moveToFront() {
		this.parentNode.appendChild(this);
	}
});

function draw(d) {
	return line(dimensions.map(function(dimension) {
		return [x(dimension.name), dimension.scale(d[dimension.name])];
	}));
}

d3.select(self.frameElement)
	.style('height', (map_height + height + margins.top + margins.bottom) + 'px');

function projectionTween(projection0, projection1) {
	return function(d) {
		var t = 0;

		var projection = d3.geo.projection(project)
			.scale(1)
			.translate( [map_width / 2, map_height / 2] );

		var path = d3.geo.path()
			.projection(projection);

		function project(λ, φ) {
			λ *= 180 / Math.PI, φ *= 180 / Math.PI;
			var p0 = projection0([λ, φ]), p1 = projection1([λ, φ]);
			return [(1 - t) * p0[0] + t * p1[0], (1 - t) * -p0[1] + t * -p1[1]];
		}

		return function(_) {
			t = _;
			return path(d);
		};
	};
}

// From underscore.js
function debounce(func, wait, immediate) {
	var timeout, args, context, timestamp, result;

	var later = function() {
		var last = new Date().getTime() - timestamp;

		if (last < wait && last >= 0) {
			timeout = setTimeout(later, wait - last);
		} else {
			timeout = null;
			if (!immediate) {
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			}
		}
	};

	return function() {
		context = this;
		args = arguments;
		timestamp = new Date().getTime();

		var callNow = immediate && !timeout;

		if (!timeout) timeout = setTimeout(later, wait);

		if (callNow) {
			result = func.apply(context, args);
			context = args = null;
		}

		return result;
	};
};