let rawDataPie = [
    { name: "TOTAL TRANS", value: 60 },
    { name: "FAILED", value: 20 },
    { name: "SUCCESS", value: 30 },
];
var text = "";

var width = 250;
var height = 250;
var thickness = 40;
var duration = 750;
var padding = 10;
var opacity = .8;
var opacityHover = 1;
var otherOpacityOnHover = .8;
var tooltipMargin = 13;

function convertDataToFormula(rawDataPie){
    let total = rawDataPie[0].value + rawDataPie[1].value + rawDataPie[2].value;
    rawDataPie[0].value = ((rawDataPie[0].value * 100)/total).toFixed(2)
    rawDataPie[1].value = ((rawDataPie[1].value * 100)/total).toFixed(2)
    rawDataPie[2].value = ((rawDataPie[2].value * 100)/total).toFixed(2)

    return rawDataPie;
}

var radius = Math.min(width - padding, height - padding) / 2;
var color = d3.scaleOrdinal(d3.schemeCategory10);
function createPieChart(type) {
    if (type === 'new' && recordData.length !== 0) {
        const recordData = JSON.parse($("#recordData").val());
        rawDataPie[0].value = recordData.total;
        rawDataPie[1].value = recordData.failed;
        rawDataPie[2].value = recordData.success;
    }

    rawDataPie = convertDataToFormula(rawDataPie)

    var svg = d3.select("#chart")
        .append('svg')
        .attr("id", "bubble")
        .attr('class', 'pie')
        .attr('width', width)
        .attr('height', height);

    var gPie = svg.append('g')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    var pie = d3.pie()
        .value(function (d) { return d.value; })
        .sort(null);

    var path = gPie.selectAll('path')
        .data(pie(rawDataPie))
        .enter()
        .append("g")
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i))
        .style('opacity', opacity)
        .style('stroke', 'white')
        // .on("mouseover", function (d) {
        //     d3.selectAll('path')
        //         .style("opacity", otherOpacityOnHover);
        //     d3.select(this)
        //         .style("opacity", opacityHover);

        //     let g = d3.select("svg")
        //         .style("cursor", "pointer")
        //         .append("g")
        //         .attr("class", "tooltip")
        //         .style("opacity", 0);

        //     g.append("text")
        //         .attr("class", "name-text")
        //         .text(`${d.data.name} (${d.data.value})`)
        //         .attr('text-anchor', 'middle');

        //     let text = g.select("text");
        //     let bbox = text.node().getBBox();
        //     let padding = 2;
        //     g.insert("rect", "text")
        //         .attr("x", bbox.x - padding)
        //         .attr("y", bbox.y - padding)
        //         .attr("width", bbox.width + (padding * 2))
        //         .attr("height", bbox.height + (padding * 2))
        //         .style("fill", "white")
        //         .style("opacity", 0.75);
        // })
        // .on("mousemove", function (d) {
        //     let mousePosition = d3.mouse(this);
        //     let x = mousePosition[0] + width / 2;
        //     let y = mousePosition[1] + height / 2 - tooltipMargin;

        //     let text = d3.select('.tooltip text');
        //     let bbox = text.node().getBBox();
        //     if (x - bbox.width / 2 < 0) {
        //         x = bbox.width / 2;
        //     }
        //     else if (width - x - bbox.width / 2 < 0) {
        //         x = width - bbox.width / 2;
        //     }

        //     if (y - bbox.height / 2 < 0) {
        //         y = bbox.height + tooltipMargin * 2;
        //     }
        //     else if (height - y - bbox.height / 2 < 0) {
        //         y = height - bbox.height / 2;
        //     }

        //     d3.select('.tooltip')
        //         .style("opacity", 1)
        //         .attr('transform', `translate(${x}, ${y})`);
        // })
        // .on("mouseout", function (d) {
        //     d3.select("svg")
        //         .style("cursor", "none")
        //         .select(".tooltip").remove();
        //     d3.selectAll('path')
        //         .style("opacity", opacity);
        // })
        // .on("touchstart", function (d) {
        //     d3.select("svg")
        //         .style("cursor", "none");
        // })
        .each(function (d, i) { this._current = i; });

    let legend = d3.select("#chart").append('div')
        .attr('class', 'legend')
        .style('margin-top', '30px');

    let keys = legend.selectAll('.key')
        .data(rawDataPie)
        .enter().append('div')
        .attr('class', 'key')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('margin-right', '20px');

    keys.append('div')
        .attr('class', 'symbol')
        .style('height', '10px')
        .style('width', '10px')
        .style('margin', '5px 5px')
        .style('background-color', (d, i) => color(i));

    keys.append('div')
        .attr('class', 'name')
        .text(d => `${d.name} (${d.value} %)`);

    keys.exit().remove();
}
createPieChart('new');
$(document).ready(function () {
    let socket = io.connect('http://mqttapp.teamjft.com/');
    socket.on('message', function (data, json) {
        const isEmpty = Object.keys(json).length === 0;
        if (!isEmpty) {
            rawDataPie[0].value = json.total;
            rawDataPie[1].value = json.failed;
            rawDataPie[2].value = json.success;
            $(".legend").remove();
            d3.selectAll("#bubble").remove();
            createPieChart('');
        }
    });
});