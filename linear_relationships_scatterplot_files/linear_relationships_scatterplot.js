$(document).ready(function(){


  function sign(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
  //creates the data points distributed somewhat-evenly throughout the graph

var data = [];

var coefficient = function(points) {
  sumX = 0.0;
  sumY = 0.0;
  sumSqX = 0.0;
  sumSqY = 0.0;
  sumXY = 0.0;
  n = points.length;
  if (data.length <= 0) return 0;
  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    sumX += point[0];
    sumY += point[1];
    sumSqX += Math.pow(point[0], 2);
    sumSqY += Math.pow(point[1], 2);
    sumXY += point[0] * point[1];

  }

    num = sumXY * n - sumX * sumY;
    denom = Math.pow(sumSqX * n - Math.pow(sumX,2), 0.5) * Math.pow(n * sumSqY - Math.pow(sumY, 2), 0.5);
    if (denom == 1) return 1;
    r = num/denom;
    return r;
}

  var margin = {top: 20, right: 15, bottom: 60, left: 60}
    , width = 500 - margin.left - margin.right
    , height = 500 - margin.top - margin.bottom;

  var x = d3.scale.linear()
            .domain([0, 100])
            .range([ 0, width ]);

  var y = d3.scale.linear()
          .domain([0, 100])
          .range([ height, 0 ]);

  var chart = d3.select('#content')
    .append('svg:svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .attr('class', 'chart')
    .attr('id', 'chart')

  var main = chart.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'main')
    .attr('id', 'main')

  // draw the x axis
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

  main.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'main axis date')
    .call(xAxis);

  // draw the y axis
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

  main.append('g')
    .attr('transform', 'translate(0,0)')
    .attr('class', 'main axis date')
    .call(yAxis);

  var g = main.append("svg:g")
                .attr('id', 'graph-body');

  var addCircle = function(point) {
    data.push(point);
    g.selectAll("scatter-dots")
      .data(data)
      .enter().append("svg:circle")
          .attr("cx", function (d,i) { return x(d[0]); } )
          .attr("cy", function (d) { return y(d[1]); } )
          .attr("r", 4);
  }


  //moves the datapoints towards the line y=x or y=-x when the slider moves.
  $('body').click(function(e){
    var x = (e.pageX - ($('#chart').position().left + margin.left))/width * 100;
    var y = ($('#chart').position().top + height + margin.top - e.pageY)/height * 100;
    if (x < 0 || x > 100 || y < 0 || y > 100) return;
    addCircle([x, y]);
    $('#r-result').text(coefficient(data));
  });

  $('#clear').click(function(){
    data = [];
    g.selectAll("*").remove();
  });
// content.click(function(e){
//   var x = chart.position().left - e.pageX;
//   var y = chart.position().bottom - e.pageY;
//   var marker;
//   if(numbersign >= 0){
//     circles.attr("cy", function (d) { return y(d[1]-numbersign*( (d[1]-d[0])*document.getElementById("slider").value)); } );
//     d3.select("#r").style("color","black");
//   }
//   else{
//     circles.attr("cy", function (d) { return y(d[1]+numbersign*( (100-d[0]-d[1])*document.getElementById("slider").value)); } );
//     d3.select("#r").style("color","red");
//   }
//   d3.select("#r").text("r = " + document.getElementById("slider").value);

// })

//reverses the sign when them button is clicked
var button = d3.select("#button");
button.on("click",function(){
  document.getElementById("slider").value = -document.getElementById("slider").value;
  var numbersign =  sign(document.getElementById("slider").value);
  var marker;
  if(numbersign >= 0){
    circles.attr("cy", function (d) { return y(d[1]-numbersign*( (d[1]-d[0])*document.getElementById("slider").value)); } );
    d3.select("#r").style("color","black");
  }
  else{
    circles.attr("cy", function (d) { return y(d[1]+numbersign*( (100-d[0]-d[1])*document.getElementById("slider").value)); } );
    d3.select("#r").style("color","red");
  }
  d3.select("#r").text("r = " + document.getElementById("slider").value);


})





        })
