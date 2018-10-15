function createFirstViz() {

	var county = document.getElementById("county").value; 

	var margin = {top: 20, right: 20, bottom: 30, left: 50},
	    width = 760 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var parseTime = d3.timeParse("%Y");

	var x = d3.scaleTime().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

	var valueline = d3.line()
	    .x(function(d) { return x(d.year); })
	    .y(function(d) { return y(d.deaths); });

    var svg = d3.select("body").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .attr("class", "firstViz")
	  .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")")
	    .attr("align", "center");

	d3.csv("../data/counties_cols.csv", function(error, data) {
	  if (error) throw error;

	  data.forEach(function(d) {
	      d.metric = parseTime(d.metric);
	      d.metric = +d.metric;
	  });

	  x.domain(d3.extent(data, function(d) { return d.metric.year; }));
	  y.domain([0, d3.max(data, function(d) { return d.metric.deaths; })]);

	  svg.append("path")
	      .data([data])
	      .attr("class", "line")
	      .attr("d", valueline);

	  svg.append("g")
	      .attr("transform", "translate(0," + height + ")")
	      .call(d3.axisBottom(x));

	  svg.append("g")
	      .call(d3.axisLeft(y));

	});

}

// https://stackoverflow.com/questions/10550410/javascript-get-the-text-value-of-a-column-from-a-particular-row-of-an-html-table


function updateSecondViz() {

	var barHeight = document.getElementById("secondViz").clientHeight;
	var barWidth = document.getElementById("secondViz").clientWidth;

	var deaths = document.getElementById("secondViz").value;

	    d3.csv("../data/counties_cols.csv", function(barError, barData) {
	       if (barError) throw barError;

	      barData.forEach(function(d) {
	        d[unemployment] = +d[unemployment];
	      });

	      var svgBar = d3.select("#secondViz");

	      var dataLength = barData.length;
		  var columnHeight = barHeight / dataLength;
		  var secondBarThickness = columnHeight * .85;

	      var xExtent2 = d3.extent(barData, d => d[unemployment]);

	      var xScale2 = d3.scaleLinear()
				.range([0, barWidth / 1.3])
				.domain([0, xExtent2[1]]);

		  xScale2.domain([0, d3.max(barData, function(d) { return d[unemployment]; })]).nice();

	      svgBar.selectAll(".bars")
	          .transition()
	          .duration(3000)
	          	.attr("height", function(d,i) {return d[unemployment] * 15});

    });

}

function createSecondViz() {

	var barHeight = document.getElementById("secondViz").clientHeight;
	var barWidth = document.getElementById("secondViz").clientWidth;

	var unemployment = document.getElementById("county").value;

	var formatPercent = d3.format(",.0%");

	var svgBar = d3.select("#secondViz").append("svg")
		.attr("width", "100%")
		.attr("height", "100%");

	var barToolTip = d3.select("body").append("div").attr("class", "barToolTip");

	d3.csv("../data/counties_cols.csv", function(barError, barData) {

		if (barError) throw barError;

		barData.forEach(function(d) {
			d[unemployment] = +d[unemployment];
			});

		var dataLength = barData.length;
		var columnWidth = barWidth / dataLength;

		var xExtent2 = d3.extent(barData, d => d[unemployment]);

		var xScale2 = d3.scaleLinear()
			.range([0, barWidth])
			.domain([0, xExtent2[1]]);

		xScale2.domain([0, d3.max(barData, function(d) { return d[unemployment]; })]).nice();

		var secondLabels = svgBar.selectAll("text")
      		.data(barData)
      		.enter();

	    var appendSecondBar = svgBar.selectAll(".bars")
				    .data(barData)
				    .enter().append("rect")
				    .attr("class", "bars")
				    .attr("x", function(d,i) {return i * 35})
				    .attr("y", function(d,i) {return 150 - xScale2(d[unemployment])})
				    .style("fill", "B21DAC")
				    .on("mousemove", function(d){
			              barToolTip
			                .style("left", d3.event.pageX - 50 + "px")
			                .style("top", d3.event.pageY - 70 + "px")
			                .style("display", "inline-block")
			                .html((d[unemployment]));
			          })
			          .on("mouseout", function(d){ barToolTip.style("display", "none");})
			         .attr("width", columnWidth * 0.35)
			         .attr("height", function(d,i) {return d[unemployment]})
				   	.style("cursor", "pointer");

	updateSecondViz();

	})

}

// Just not working because of unemployment being a variable! ([unemployment]!) This needs to be built so that when 
// the county is selected, each graphic updated with the x axis being the year. The first visual represents deaths.
// The second visual is the unemployment rate. The third visual is education, etc. 

// Do not know how to get the number of deaths of a specifc county in a specific year; do not know how to 
// slice as is done in Python.