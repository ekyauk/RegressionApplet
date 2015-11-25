$(document).ready(function(){

  function sign(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
  //creates the data points distributed somewhat-evenly throughout the graph
  var data = [];

  var rCoefficient = function(points) {
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

  var regressionLine = function(points, r) {
    $('#least-squares').remove();

    var meanX = 0;
    var meanY = 0;
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      meanX += point[0];
      meanY += point[1];
    }
    meanX /= points.length;
    meanY /= points.length;

    // Calculate Standard Deviation
    var sdX = 0;
    var sdY = 0;
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      sdX += Math.pow(meanX - point[0], 2);
      sdY += Math.pow(meanY - point[1], 2);
    }
    sdX = Math.pow(sdX/points.length, 0.5);
    sdY = Math.pow(sdY/points.length, 0.5);

    var m = r * (sdY/sdX); //slope
    var b = meanY - m * meanX; //y-intercept

    var startX = 0;
    var startY = b;
    var endX = 100;
    var endY = m*endX + b;

    g.append("line")
      .attr('id', 'least-squares')
      .attr("x1", x(startX))
      .attr("y1", y(startY))
      .attr("x2", x(endX))
      .attr("y2", y(endY))
      .attr("stroke-width", 2)
      .attr("stroke", "red")
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

  $('body').click(function(e){
    if ($('#addPoint').is(":checked")) {
      var px = (e.pageX - ($('#chart').position().left + margin.left))/width * 100;
      var py = ($('#chart').position().top + height + margin.top - e.pageY)/height * 100;
      console.log("Clicked at " + px + " ," + py);
      if (px < 0 || px > 100 || py < 0 || py > 100) return;
      addCircle([px, py]);
      var r = rCoefficient(data);
      $('#r-result').text("R: " + r);
      regressionLine(data, r);
    }
  });

  var lineStartX = 0;
  var lineStartY = 0;
  var isDrawingLine = false;
  $('body').mousedown(function(e){
    if (!$('#addPoint').is(":checked")&& $('#drawn-line').length == 0) {
      isDrawingLine = true;
      lineStartX = (e.pageX - ($('#chart').position().left + margin.left))/width * 100;
      lineStartY = ($('#chart').position().top + height + margin.top - e.pageY)/height * 100;
      console.log("Starting line at " + lineStartX + " ," + lineStartY);
      console.log("start drawing");
    }
  });
  $('body').mousemove(function(e){
    if (!$('#addPoint').is(":checked") && isDrawingLine) {
      $('#drawn-line').remove();
      lineEndX = (e.pageX - ($('#chart').position().left + margin.left))/width * 100;
      lineEndY = ($('#chart').position().top + height + margin.top - e.pageY)/height * 100;
      g.append("line")
        .attr('id', 'drawn-line')
        .attr("x1", x(lineStartX))
        .attr("y1", y(lineStartY))
        .attr("x2", x(lineEndX))
        .attr("y2", y(lineEndY))
        .attr("stroke-width", 2)
        .attr("stroke", "green")
    }
  });

  $('body').mouseup(function(){
    if (isDrawingLine) {
      isDrawingLine = false;
    }
  });

  $('#clear').click(function(){
    data = [];
    g.selectAll("*").remove();
  });

})
