const rawData = [
  {
    grad_year: "TOTAL TRANS",
    student_count: 60,
    "profit": "8342"
  },
  {
    grad_year: "SUCCESS",
    student_count: 20,
    "profit": "10342"
  },
  {
    grad_year: "FAILED",
    student_count: 30,
    "profit": "15423"
  } 
]

const captions = {
  student_count: {
    x: '',
    y: '',
  },
  profit: {
    x: '',
    y: '',
  }
}
const chart = {
  width: 400,
  height: 200,
}
const margin = {
  left: 120,
  right: 50,
  top: 50,
  bottom: 100,
}
const chartTotalWidth = chart.width + margin.left + margin.right
const chartTotalHeight = chart.height + margin.top + margin.bottom

const getData = (dataType) => rawData.map(d => ({
  name: d.grad_year,
  value: +d[dataType],
}))
const getCaptions = (dataType) => captions[dataType]
const t = 'myTransition';

const g = d3
  .select('#chart-area')
  .append('svg')
  .attr('width', chartTotalWidth)
  .attr('height', chartTotalHeight)
  .attr('viewBox', `0 0 ${chartTotalWidth} ${chartTotalHeight}`)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

const xLabel = g
  .append('text')
  .attr('x', chart.width / 2)
  .attr('y', chart.height + margin.bottom / 2)
  .attr('font-size', '20px')
  .attr('font-weight', 'bold')
  .attr('text-anchor', 'middle')

const yLabel = g
  .append('text')
  .attr('x', -chart.height / 2)
  .attr('y', -margin.left / 2)
  .attr('font-size', '20px')
  .attr('font-weight', 'bold')
  .attr('transform', 'rotate(-90)')
  .attr('text-anchor', 'middle')
// .text('grad_year')

const scaleX = d3
  .scaleBand()
  .range([0, chart.width])
  .paddingInner(0.3)
  .paddingOuter(0.3)

const scaleY = d3
  .scaleLinear()
  .range([chart.height, 0])

const xAxisGroup = g.append('g').attr('transform', `translate(0, ${chart.height})`)
const yAxisGroup = g.append('g')

let count = -1
function update(type) {
  const selectedDataType = 'student_count';
  const captions = getCaptions(selectedDataType)

  let data = getData(selectedDataType)
  if (type === 'new' && recordData.length !== 0) {
    const recordData = JSON.parse($("#recordData").val());
    data[0].value = recordData.total;
    data[1].value = recordData.success;
    data[2].value = recordData.failed;
  }

  const xAxisGenerator = d3.axisBottom(scaleX)
  const yAxisGenerator = d3.axisLeft(scaleY).tickFormat(d => `${d}`)

  scaleX.domain(data.map(d => d.name))
  scaleY.domain([0, d3.max(data.map(d => d.value))])

  xAxisGroup.transition(t).call(xAxisGenerator)
  yAxisGroup.transition(t).call(yAxisGenerator)

  xLabel.text(captions.x)
  yLabel.text(captions.y)

  // JOIN new data with old elements
  const rects = g
    .selectAll('rect')
    .data(data, d => d.name)

  // EXIT old elements not present in new data
  rects.exit()
    .attr('opacity', 1)
    .attr('style', 'fill: red')
    .transition(t)
    .attr('y', d => scaleY(0))
    .attr('height', 0)
    .attr('opacity', 0)
    .remove()

  rects
    // ENTER new elements present in new data
    .enter()
    .append('rect')
    .attr('x', d => scaleX(d.name))
    .attr('y', d => scaleY(0))
    .attr('width', scaleX.bandwidth)
    .attr('height', 0)
    .attr('opacity', 0)
    // merge new and existing elements
    .merge(rects)
    .transition(t)
    .attr('x', d => scaleX(d.name))
    .attr('y', d => scaleY(d.value))
    .attr('height', d => chart.height - scaleY(d.value))
    .attr('opacity', 1)
}

update('new')

$(document).ready(function () {
  let socket = io.connect('http://mqttapp.teamjft.com/');
  socket.on('message', function (data, json) {
    const isEmpty = Object.keys(json).length === 0;
    if (!isEmpty) {
      rawData[0].student_count = json.total;
      rawData[1].student_count = json.success;
      rawData[2].student_count = json.failed;
      update('updated');
    }
  });
});