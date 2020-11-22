/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(forecastData, pollData) {
        this.forecastData = forecastData;
        this.tableData = [...forecastData];
        // add useful attributes
        for (let forecast of this.tableData)
        {
            forecast.isForecast = true;
            forecast.isExpanded = false;
        }
        this.pollData = pollData;
        this.headerData = [
            {
                sorted: false,
                ascending: false,
                key: 'state'
            },
            {
                sorted: false,
                ascending: false,
                key: 'margin',
                alterFunc: d => Math.abs(+d)
            },
            {
                sorted: false,
                ascending: false,
                key: 'winstate_inc',
                alterFunc: d => +d
            },
        ]

        this.vizWidth = 300;
        this.vizHeight = 30;
        this.smallVizHeight = 20;

        this.scaleX = d3.scaleLinear()
            .domain([-100, 100])
            .range([0, this.vizWidth]);

        this.attachSortHandlers();
        this.drawLegend();
    }

    drawLegend() {
        ////////////
        // PART 2 //
        ////////////
        /**
         * Draw the legend for the bar chart.
         */


        let tableLegend = d3.select("#marginAxis")
            .attr("height", this.vizHeight)
            .attr("width", this.vizWidth)
            .selectAll("text")
            .data([-75, -50, -25, 25, 50, 75])
            .join("text")
            .attr("class", d => d < 0 ? "biden" : "trump")
            .text(d => `+${Math.abs(d)}`)
            .attr("x", d => this.scaleX(d)-11)
            .attr("y", this.vizHeight - 10)

    }

    drawTable() {
        this.updateHeaders();
        let rowSelection = d3.select('#predictionTableBody')
            .selectAll('tr')
            .data(this.tableData)
            .join('tr');

        rowSelection.on('click', (event, d) =>
        {
            if (d.isForecast)
            {
                this.toggleRow(d, this.tableData.indexOf(d));
            }
        });

        let forecastSelection = rowSelection.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join('td')
            .attr('class', d => d.class);


        ////////////
        // PART 1 //
        ////////////
        /**
         * with the forecastSelection you need to set the text based on the dat value as long as the type is 'text'
         */
        forecastSelection.filter(d => d.type === "text").text(d=>d.value);

        let vizSelection = forecastSelection.filter(d => d.type === 'viz');

        let svgSelect = vizSelection.selectAll('svg')
            .data(d => [d])
            .join('svg')
            .attr('width', this.vizWidth)
            .attr('height', d => d.isForecast ? this.vizHeight : this.smallVizHeight);

        let grouperSelect = svgSelect.selectAll('g')
            .data(d => [d, d, d])
            .join('g');

        this.addGridlines(grouperSelect.filter((d,i) => i === 0), [-75, -50, -25, 0, 25, 50, 75]);
        this.addRectangles(grouperSelect.filter((d,i) => i === 1));
        this.addCircles(grouperSelect.filter((d,i) => i === 2));
    }

    rowToCellDataTransform(d) {
        let stateInfo = {
            type: 'text',
            class: d.isForecast ? 'state-name' : 'poll-name',
            value: d.isForecast ? d.state : d.name
        };

        let marginInfo = {
            type: 'viz',
            value: {
                marginLow: +d.margin_lo,
                margin: +d.margin,
                marginHigh: +d.margin_hi,
            }
        };
        let winChance;
        if (d.isForecast)
        {
            const trumpWinChance = +d.winstate_inc;
            const bidenWinChance = +d.winstate_chal;

            const trumpWin = trumpWinChance > bidenWinChance;
            const winOddsValue = 100 * Math.max(trumpWinChance, bidenWinChance);
            let winOddsMessage = `${Math.floor(winOddsValue)} of 100`
            if (winOddsValue > 99.5 && winOddsValue !== 100)
            {
                winOddsMessage = '> ' + winOddsMessage
            }
            winChance = {
                type: 'text',
                class: trumpWin ? 'trump' : 'biden',
                value: winOddsMessage
            }
        }
        else
        {
            winChance = {type: 'text', class: '', value: ''}
        }

        let dataList = [stateInfo, marginInfo, winChance];
        for (let point of dataList)
        {
            point.isForecast = d.isForecast;
        }
        return dataList;
    }

    updateHeaders() {
        ////////////
        // PART 7 //
        ////////////
        /**
         * update the column headers based on the sort state
         */

        d3.select("#columnHeaders")
            .selectAll("i")
            .data(this.headerData)
            .classed('fa-sort-up', d => d.ascending)
            .classed('fa-sort-down', d => !d.ascending)
            .classed('no-display', d => !d.sorted);

        d3.select("#columnHeaders")
            .selectAll("th")
            .data(this.headerData)
            .classed("sorting", d => d.sorted)



    }

    addGridlines(containerSelect, ticks) {
        ////////////
        // PART 3 //
        ////////////
        /**
         * add gridlines to the vizualization
         */

        containerSelect.selectAll("line")
            .data(ticks)
            .join("line")
            .attr("stroke", "black")
            .attr("x1", d => this.scaleX(d))
            .attr("x2", d => this.scaleX(d))
            .attr("y1", 0)
            .attr("y2", this.vizHeight)

    }

    addRectangles(containerSelect) {
        ////////////
        // PART 4 //
        ////////////
        /**
         * add rectangles for the bar charts
         */


        containerSelect.filter(d => !d.isForecast).selectAll("rect").remove();
        containerSelect.filter(d => d.isForecast).selectAll("rect")
            .data(d => {
                return (Math.sign(d.value.marginHigh) !== Math.sign(d.value.marginLow)) ? [[d.value.marginLow, 0], [0, d.value.marginHigh]] : [[d.value.marginLow, d.value.marginHigh]];
            })
            .join("rect")
            .attr("x", d => this.scaleX(d[0]))
            .attr("y", this.vizHeight * 0.2)
            .attr("width", d => this.scaleX(d[1]) - this.scaleX(d[0]))
            .attr("height", this.vizHeight * 0.7)
            .classed("biden", d => d[0] < 0)
            .classed("trump", d => d[1] > 0)
            .classed("margin-bar", true)




    }

    addCircles(containerSelect) {
        ////////////
        // PART 5 //
        ////////////
        /**
         * add circles to the vizualizations
         */

        containerSelect.selectAll("circle")
            .data(d => [d])
            .join("circle")
            .attr("r", d => {
                if(d.isForecast) {
                    return this.vizHeight / 4;
                }
                return this.vizHeight / 8;
            } )
            .attr("cx", d => this.scaleX(d.value.margin))
            .attr("cy", d => {
                if(d.isForecast)
                    return this.vizHeight / 1.95;
                return this.smallVizHeight / 1.95;
            })
            .classed("trump", d => d.value.margin > 0)
            .classed("biden", d => d.value.margin < 0)
            .classed("margin-circle", true);

    }

    attachSortHandlers()
    {
        ////////////
        // PART 6 //
        ////////////
        /**
         * Attach click handlers to all the th elements inside the columnHeaders row.
         * The handler should sort based on that column and alternate between ascending/descending.
         */


        d3.select("#columnHeaders")
            .selectAll("th")
            .data(this.headerData)
            .on("click", (event, d) =>
            {
                let flag;
                if(d.sorted) {
                    flag = !d.ascending;
                }
                else {
                    flag = true;
                }

                this.tableData.sort((x, y) => {

                    let tempX = x[d.key];
                    let tempY = y[d.key];

                    if (d.alterFunc)
                    {
                        tempX = d.alterFunc(tempX);
                        tempY = d.alterFunc(tempY);
                    }

                    if (!flag)
                    {
                        [tempX, tempY] = [tempY, tempX]
                    }


                    if (tempX < tempY)
                    {
                        return -1
                    }

                    if (tempX > tempY)
                    {
                        return 1
                    }

                    return 0;
                })


                for (let header of this.headerData)
                    header.sorted = false;


                d.ascending = flag;


                d.sorted = true;


                this.drawTable();


            });






    }

    toggleRow(rowData, index) {
        ////////////
        // PART 8 //
        ////////////
        /**
         * Update table data with the poll data and redraw the table.
         */

        if(!rowData.isExpanded) {
            this.tableData.splice(index+1, 0, ...this.pollData.get(rowData.state));
        }
        else {
            this.tableData = this.tableData.filter(d => d.state !== rowData.state || d.isForecast)
        }

        //update
        rowData.isExpanded = !rowData.isExpanded;
        this.drawTable();



    }

    collapseAll() {
        this.tableData = this.tableData.filter(d => d.isForecast)
    }

}
