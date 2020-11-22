/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
  // ****** TODO: PART II ******
  let chartTemp = [];
  let chart = document.getElementById("aBarChart").children;



  for (let i = 0; i < chart.length; i++) {
      chartTemp[i] = chart[i].attributes.width.nodeValue;
  }

  chartTemp.sort(function(a, b) {
    return a - b;})

  for(let i = 0; i < chart.length; i++) {
    chart[i].attributes.width.nodeValue = chartTemp[i]
  }

}



/**
 * Render the visualizations
 * @param data
 */
function update(data) {
  /**
   * D3 loads all CSV data as strings. While Javascript is pretty smart
   * about interpreting strings as numbers when you do things like
   * multiplication, it will still treat them as strings where it makes
   * sense (e.g. adding strings will concatenate them, not add the values
   * together, or comparing strings will do string comparison, not numeric
   * comparison).
   *
   * We need to explicitly convert values to numbers so that comparisons work
   * when we call d3.max()
   **/

  for (let d of data) {
    d.cases = +d.cases; //unary operator converts string to number
    d.deaths = +d.deaths; //unary operator converts string to number
  }

  // Set up the scales
  let barChart_width = 345;
  let areaChart_width = 295;
  let maxBar_width = 240;
  let data_length = 15;

  let aScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.cases)])
    .range([0, maxBar_width]);
  let bScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.deaths)])
    .range([0, maxBar_width]);
  let iScale_line = d3
    .scaleLinear()
    .domain([0, data.length])
    .range([10, 500]);
  let iScale_area = d3
    .scaleLinear()
    .domain([0, data_length])
    .range([0, 260]);
  
  // Draw axis for Bar Charts, Line Charts and Area Charts (You don't need to change this part.)
  d3.select("#aBarChart-axis").attr("transform", "translate(0,210)").call(d3.axisBottom(d3.scaleLinear().domain([0, d3.max(data, d => d.cases)]).range([barChart_width, barChart_width-maxBar_width])).ticks(5));
  d3.select("#aAreaChart-axis").attr("transform", "translate(0,245)").call(d3.axisBottom(d3.scaleLinear().domain([0, d3.max(data, d => d.cases)]).range([areaChart_width, areaChart_width-maxBar_width])).ticks(5));
  d3.select("#bBarChart-axis").attr("transform", "translate(5,210)").call(d3.axisBottom(bScale).ticks(5));
  d3.select("#bAreaChart-axis").attr("transform", "translate(5,245)").call(d3.axisBottom(bScale).ticks(5));
  let aAxis_line = d3.axisLeft(aScale).ticks(5);
  d3.select("#aLineChart-axis").attr("transform", "translate(50,15)").call(aAxis_line);
  d3.select("#aLineChart-axis").append("text").text("New Cases").attr("transform", "translate(50, -3)")
  let bAxis_line = d3.axisRight(bScale).ticks(5);
  d3.select("#bLineChart-axis").attr("transform", "translate(550,15)").call(bAxis_line);
  d3.select("#bLineChart-axis").append("text").text("New Deaths").attr("transform", "translate(-50, -3)")

  let bAxis_scatterplot = d3.axisLeft(bScale).ticks(6);
  d3.select("#y-axis").attr("transform", "translate(0,0)").call(bAxis_scatterplot);

  let aAxis_scatterplot = d3.axisBottom(aScale).ticks(6);
  d3.select("#x-axis").attr("transform", "translate(0,240)").call(aAxis_scatterplot);


  // ****** TODO: PART III (you will also edit in PART V) ******

  // TODO: Select and update the 'a' bar chart bars
  let barChartA = d3.select("#aBarChart")
  let barChartA_select = barChartA.selectAll("rect").data(data);
  let barChartA_newSelect = barChartA_select
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", (d, i) => aScale(d.cases))
      .attr("height", 10);


  barChartA_select.exit().remove();
  barChartA_select = barChartA_newSelect.merge(barChartA_select)

  barChartA_select.transition()
      .duration(2000)
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", (d, i) => aScale(d.cases))
      .attr("height", 10)
      .style("opacity", 1)
      .attr("fill", function(d) {
        return "rgb("+ Math.round(d * 8) + ",0," + Math.round(d * 10) + ")";
      });



  // TODO: Select and update the 'b' bar chart bars

  let barChartB = d3.select("#bBarChart")
  let barChartB_select = barChartB.selectAll("rect").data(data);
  let barChartB_newSelect = barChartB_select
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d,i) => i * (data_length-1))
      .attr("width", 0)
      .attr("height", 10);

  barChartB_select.exit().remove();
  barChartB_select = barChartB_newSelect.merge(barChartB_select)

  barChartB_select
      .transition()
      .duration(2000)
      .attr("x", 0)
      .attr("y", (d,i) => i * (data_length-1))
      .attr("width", (d,i) => bScale(d.deaths))
      .attr("height", 10)
      .style("opacity", 1)
      .attr("fill", function(d) {
        return "rgb("+ Math.round(d * 8) + ",0," + Math.round(d * 10) + ")";
      });;


  // TODO: Select and update the 'a' line chart path using this line generator
  let aLineGenerator = d3
    .line()
    .x((d, i) => iScale_line(i))
    .y(d => aScale(d.cases));

  let lineChartA = d3.select("#aLineChart")
      .transition()
      .duration(2000)
      .attr("d", aLineGenerator(data))
      .attr("opacity", 1);





  // TODO: Select and update the 'b' line chart path (create your own generator)
  let bLineGenerator = d3
      .line()
      .x((d, i) => iScale_line(i))
      .y(d => bScale(d.deaths));


  let lineChartB = d3.select("#bLineChart")
      .transition()
      .duration(2000)
      .attr("d", bLineGenerator(data))
      .attr("opacity", 1)
      .attr("fill", function(d) {
        return "rgb("+ Math.round(d * 8) + ",0," + Math.round(d * 10) + ")";
      });;





  // TODO: Select and update the 'a' area chart path using this area generator
  let aAreaGenerator = d3
    .area()
    .x((d, i) => iScale_area(i))
    .y0(0)
    .y1(d => aScale(d.cases));

  let areaChartA = d3.select("#aAreaChart").transition()
      .duration(2000)
      .attr("d", aAreaGenerator(data))
      .attr("opacity", 1);


  // TODO: Select and update the 'b' area chart path (create your own generator)
  let bAreaGenerator = d3
      .area()
      .x((d, i) => iScale_area(i))
      .y0(0)
      .y1(d => bScale(d.deaths));

  let areaChartB = d3.select("#bAreaChart").transition()
      .duration(2000)
      .attr("d", bAreaGenerator(data))
      .attr("opacity", 1);




  // TODO: Select and update the scatterplot points

  let scatterplotChart = d3.select("#scatterplot");

  let scatterplotChart_select = scatterplotChart.selectAll("circle").data(data);

  let newScatterplotChart = scatterplotChart_select.enter()
      .append("circle")
      .attr("cx", d => aScale(d.cases))
      .attr("cy", d => bScale(d.deaths))
      .attr("r", 5)
      .attr("opacity", 1);


  scatterplotChart_select.exit().remove();




  scatterplotChart_select = newScatterplotChart.merge(scatterplotChart_select);

  scatterplotChart_select.transition()
      .duration(2000)
      .attr("cx", d => aScale(d.cases))
      .attr("cy", d => bScale(d.deaths))
      .attr("r", 5)
      .attr("opacity", 1)
  
  //****** TODO: PART IV ******
  let aBarChart = document.getElementById("aBarChart").children;
  let bBarChart  = document.getElementById("bBarChart").children;

  for (let i = 0; i < aBarChart.length; i++) {
    aBarChart[i].onmouseover = function() {
      this.style.fill = "black";
    };
    aBarChart[i].onmouseout = function() {
      this.style.fill = "rgb(241,151,186)";
    };
    bBarChart[i].onmouseover = function() {
      this.style.fill = "black";
    };
    bBarChart[i].onmouseout = function() {
      this.style.fill = "rgb(79,175,211)";
    };
  }

  scatterplotChart_select.on("mouseover",
      function(d, i){
        let temp = d3.select(this)
            .append("title")
            .text("Cases   : " + d.cases + "\n" + "Deaths : " + d.deaths );
      });


}

/**
 * Update the data according to document settings
 */
async function changeData() {
  //  Load the file indicated by the select menu
  let dataFile = document.getElementById("dataset").value;
  try {
    const data = await d3.csv("data/" + dataFile + ".csv");
    if (document.getElementById("random").checked) {
      // if random
      update(randomSubset(data)); // update w/ random subset of data
    } else {
      // else
      update(data); // update w/ full data
    }
  } catch (error) {
    console.log(error)
    alert("Could not load the dataset!");
  }
}

/**
 *  Slice out a random chunk of the provided in data
 *  @param data
 */
function randomSubset(data) {
  return data.filter(d => Math.random() > 0.5);
}
