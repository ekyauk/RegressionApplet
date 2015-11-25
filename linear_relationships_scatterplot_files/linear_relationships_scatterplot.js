$(document).ready(function(){

  function sign(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
  //creates the points distributed somewhat-evenly throughout the graph
  var points = [];

  var rCoefficient = function() {
    sumX = 0.0;
    sumY = 0.0;
    sumSqX = 0.0;
    sumSqY = 0.0;
    sumXY = 0.0;
    n = points.length;
    if (points.length <= 0) return 0;
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

  var drawLine = function(x1, y1, x2, y2, id, color) {
    g.append("line")
      .attr('id', id)
      .attr("x1", x(x1))
      .attr("y1", y(y1))
      .attr("x2", x(x2))
      .attr("y2", y(y2))
      .attr("stroke-width", 2)
      .attr("stroke", color)
  }

  var updateMeanValueLines = function() {
    if (points.length == 0) return;

    var meanX = 0;
    var meanY = 0;
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      meanX += point[0];
      meanY += point[1];
    }
    meanX /= points.length;
    meanY /= points.length;
    $('#mean-x').remove();
    $('#mean-y').remove();

    drawLine(meanX, 0, meanX, 100, 'mean-x', 'blue');
    drawLine(0, meanY, 100, meanY, 'mean-y', 'blue');
  }

  var regressionLine = function() {
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
    drawLine(startX, startY, endX, endY, 'least-squares', 'red');
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
  var r = 0;

  var addPoint = function(point) {
    points.push(point);
    g.selectAll("scatter-dots")
      .data(points)
      .enter().append("svg:circle")
          .attr("cx", function (d,i) { return x(d[0]); } )
          .attr("cy", function (d) { return y(d[1]); } )
          .attr("r", 4);
  }

  $('body').click(function(e){
    if ($('#addPoint').is(':checked')) {

      var px = (e.pageX - ($('#chart').position().left + margin.left))/width * 100;
      var py = ($('#chart').position().top + height + margin.top - e.pageY)/height * 100;
      if (px < 0 || px > 100 || py < 0 || py > 100) return;

      addPoint([px, py]);

      $('#num-points').text("# points = " + points.length);

      if (points.length > 1) {
        r = rCoefficient();
        $('#r-result').text("R = " + Math.round(r*100)/100);
      }

      if ($('#regression-line').is(':checked')) {
        regressionLine();
      }
      if ($('#mean-vals').is(':checked')) {
        updateMeanValueLines();
      }
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
    }
  });
  $('body').mousemove(function(e){
    if (!$('#addPoint').is(":checked") && isDrawingLine) {
      $('#drawn-line').remove();
      lineEndX = (e.pageX - ($('#chart').position().left + margin.left))/width * 100;
      lineEndY = ($('#chart').position().top + height + margin.top - e.pageY)/height * 100;
      drawLine(lineStartX, lineStartY, lineEndX, lineEndY, 'drawn-line', 'green');
    }
  });

  $('body').mouseup(function(){
    if (isDrawingLine) {
      isDrawingLine = false;
    }
  });

  $('#clear').click(function(){
    points = [];
    g.selectAll("*").remove();
    $('#r-result').text("R = 0");
    $('#num-points').text("# points = 0");
  });

  $('#regression-line').change(function() {
    if (this.checked) {
      regressionLine();
    } else {
      $('#least-squares').remove();
    }
  });

  $('#mean-vals').change(function() {
    if (this.checked) {
      updateMeanValueLines();
    } else {
      $('#mean-y').remove();
      $('#mean-x').remove();
    }
  });

})
