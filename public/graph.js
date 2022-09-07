var static_data = [{
  grad_year: "TOTAL TRANS",
  student_count: 5
}, {
  grad_year: "SUCCESS",
  student_count: 3
}, {
  grad_year: "FAILED",
  student_count: 2
}, {
  grad_year: "SCROW Failed",
  student_count: 2
}, {
  grad_year: "Time our failed",
  student_count: 2
}
  , {
  grad_year: "Checksum failed",
  student_count: 2
}];

function createBarGraph() {

  var tip = d3.select(".chart-container")
    .append("div")
    .attr("class", "tip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

  let svg = d3.select("svg").attr("class", "background-style").attr("id", "bubble");
  let margin = { top: 20, right: 20, bottom: 42, left: 40 };
  let width = +svg.attr("width") - margin.left - margin.right;
  let height = +svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleBand().rangeRound([0, width]).padding(0.05),
    y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("", function (error, data) {
    //if (error) throw error;
    const recordData = JSON.parse($("#recordData").val());
    static_data[0].student_count = recordData.total;
    static_data[1].student_count = recordData.success;
    static_data[2].student_count = recordData.failed;
    data = static_data;

    x.domain(data.map(function (d) { return d.grad_year; }));
    y.domain([0, d3.max(data, function (d) { return d.student_count; })]);

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .append("text")
      .attr("y", 6)
      .attr("dy", "2.5em")
      .attr("dx", width / 2 - margin.left)
      .attr("text-anchor", "start")
      .text("TYPE");

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")

    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("id", function (d) { return d.grad_year })
      .attr("x", function (d) { return x(d.grad_year); })
      .attr("y", function (d) { return y(d.student_count); })
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return height - y(d.student_count) })
      .on("mouseover", function (d) { return tip.text(d.student_count).style("visibility", "visible").style("top", y(d.student_count) - 13 + 'px').style("left", x(d.grad_year) + x.bandwidth() - 12 + 'px') })
      // .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
      .on("mouseout", function () { return tip.style("visibility", "hidden"); });
  });
}


$(document).ready(function () {
  let socket = io.connect('http://localhost:8000');
  socket.on('message', function (data, json) {
    const isEmpty = Object.keys(json).length === 0;
    if (!isEmpty) {
      console.log("here")
      static_data[0].student_count = json.total;
      console.log("🚀 ~ file: graph.js ~ line 29 ~ json.total", typeof json.total)
      static_data[1].student_count = json.success;
      static_data[2].student_count = json.failed;
      console.log("🚀 ~ file: graph.js ~ line 31 ~ static_data", static_data)
      // d3.selectAll("#bubble").remove();

      // createBarGraph()
    }
  });
});


createBarGraph();
