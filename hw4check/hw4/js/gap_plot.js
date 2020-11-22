/** Data structure for the data associated with an individual country. */
class PlotData {
    /**
     *
     * @param country country name from the x data object
     * @param xVal value from the data object chosen for x at the active year
     * @param yVal value from the data object chosen for y at the active year
     * @param id country id
     * @param region country region
     * @param circleSize value for r from data object chosen for circleSizeIndicator
     */
    constructor(country, xVal, yVal, id, region, circleSize) {
        this.country = country;
        this.xVal = xVal;
        this.yVal = yVal;
        this.id = id;
        this.region = region;
        this.circleSize = circleSize;
    }
}

/** Class representing the scatter plot view. */
class GapPlot {

    /**
     * Creates an new GapPlot Object
     *
     * For part 2 of the homework, you only need to worry about the first parameter.
     * You will be updating the plot with the data in updatePlot,
     * but first you need to draw the plot structure that you will be updating.
     *
     * Set the data as a variable that will be accessible to you in updatePlot()
     * Call the drawplot() function after you set it up to draw the plot structure on GapPlot load
     *
     * We have provided the dimensions for you!
     *
     * @param updateCountry a callback function used to notify other parts of the program when the selected
     * country was updated (clicked)
     * @param updateYear a callback function used to notify other parts of the program when a year was updated
     * @param activeYear the year for which the data should be drawn initially
     */
    constructor(data, updateCountry, updateYear, activeYear) {

        // ******* TODO: PART 2 *******

        this.margin = {top: 20, right: 20, bottom: 60, left: 80};
        this.width = 810 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.activeYear = activeYear;

        this.data = data;

        //TODO - your code goes here -
        this.updateCountry = updateCountry;
        this.updateYear = updateYear;

        this.drawPlot();

    }

    /**
     * Sets up the plot, axes, and slider,
     */

    drawPlot() {
        // ******* TODO: PART 2 *******
        /**
         You will be setting up the plot for the scatterplot.
         Here you will create axes for the x and y data that you will be selecting and calling in updatePlot
         (hint): class them.

         Main things you should set up here:
         1). Create the x and y axes
         2). Create the activeYear background text


         The dropdown menus have been created for you!

         */

        d3.select('#scatter-plot')
            .append('div').attr('id', 'chart-view');

        d3.select('#scatter-plot')
            .append('div').attr('id', 'activeYear-bar');

        d3.select('#chart-view')
            .append('div')
            .attr("class", "tooltip")
            .style("opacity", 0);

        d3.select('#chart-view')
            .append('svg').classed('plot-svg', true)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        let svgGroup = d3.select('#chart-view').select('.plot-svg').append('g').classed('wrapper-group', true);

        //TODO - your code goes here


        this.svgGroup = d3.select('#chart-view')
                            .select('.plot-svg')
                            .append('g')
                            .classed('wrapper-group', true);
        this.activeYearBackground = this.svgGroup.append("text")
                                            .attr("x", this.margin.left + 50)
                                            .attr("y", this.margin.top + 50)
                                            .html(this.activeYear)
                                            .classed("activeYear-background", true);

        this.svgGroup
            .append('g')
            .attr('id', 'xAxisId');
        this.svgGroup
            .append('g')
            .attr('id', 'yAxisId');


        /* Below is the setup for the dropdown menu- no need to change this */

        let dropdownWrap = d3.select('#chart-view').append('div').classed('dropdown-wrapper', true);

        let cWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        cWrap.append('div').classed('c-label', true)
            .append('text')
            .text('Circle Size');

        cWrap.append('div').attr('id', 'dropdown_c').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let xWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        xWrap.append('div').classed('x-label', true)
            .append('text')
            .text('X Axis Data');

        xWrap.append('div').attr('id', 'dropdown_x').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let yWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        yWrap.append('div').classed('y-label', true)
            .append('text')
            .text('Y Axis Data');

        yWrap.append('div').attr('id', 'dropdown_y').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        d3.select('#chart-view')
            .append('div')
            .classed('circle-legend', true)
            .append('svg')
            .append('g')
            .attr('transform', 'translate(10, 0)');

        this.dataRange = {  'child-mortality': {'min': 0, 'max': 0},
                            'gdp': {'min': 0, 'max': 0},
                            'life-expectancy': {'min': 0, 'max': 0},
                            'population': {'min': Infinity, 'max': -Infinity},
                            'fertility-rate': {'min': 0, 'max': 0}}

        for (let i = 0; i < Object.keys(this.data).length; i++) {

            let dataKey = Object.keys(this.data)[i];
            let keyDataArray = this.data[dataKey];
            let minYear = 1800;
            let maxYear = 2020;

            for (let countryData of keyDataArray) {

                for (let i = minYear; i <= maxYear; i++) {

                    let currMin = this.dataRange[dataKey].min;

                    let currVal = null;

                    if(countryData[i]) {
                        currVal = countryData[i]
                    }
                    else {
                        currVal = Infinity
                    }

                    if (currMin > currVal) {
                        this.dataRange[dataKey].min = currVal;
                    }

                    let currMax = this.dataRange[dataKey].max;

                    if(countryData[i]) {
                        currVal = countryData[i]
                    }
                    else {
                        currVal = -Infinity
                    }

                    if (currMax < currVal) {

                        this.dataRange[dataKey].max = currVal;
                    }
                }
            }
        }

        this.drawDropDown("fertility-rate", "gdp", "population");


        this.updatePlot(2000, "fertility-rate", "gdp", "population")



        this.drawYearBar();
    }

    /**
     * Renders the plot for the parameters specified
     *
     * @param activeYear the year for which to render
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     * @param circleSizeIndicator identifies the values to use for the circle size
     */
    updatePlot(activeYear, xIndicator, yIndicator, circleSizeIndicator) {

        // ******* TODO: PART 2 *******
        /*
        You will be updating the scatterplot from the data. hint: use the #chart-view div

        *** Structuring your PlotData objects ***
        You need to start by mapping the data specified by the parameters to the PlotData Object
        Your PlotData object is specified at the top of the file
        You will need get the data specified by the x, y and circle size parameters from the data passed
        to the GapPlot constructor

        *** Setting the scales for your x, y, and circle data ***
        For x and y data, you should get the overall max of the whole data set for that data category,
        not just for the activeYear.

        ***draw circles***
        draw the circles with a scaled area from the circle data, with cx from your x data and cy from y data
        You need to size the circles from your circleSize data, we have provided a function for you to do this
        called circleSizer. Use this when you assign the 'r' attribute.

        ***Tooltip for the bubbles***
        You need to assign a tooltip to appear on mouse-over of a country bubble to show the name of the country.
        We have provided the mouse-over for you, but you have to set it up
        Hint: you will need to call the tooltipRender function for this.

        *** call the drawLegend() and drawDropDown()
        These will draw the legend and the drop down menus in your data
        Pay attention to the parameters needed in each of the functions
        
        */

        /**
         *  Function to determine the circle radius by circle size
         *  This is the function to size your circles, you don't need to do anything to this
         *  but you will call it and pass the circle data as the parameter.
         *
         * @param d the data value to encode
         * @returns {number} the radius
         */
        let minSize = this.dataRange[circleSizeIndicator].min;
        let maxSize = this.dataRange[circleSizeIndicator].max;
        let circleSizer = function (d) {
            let cScale = d3.scaleSqrt().range([3, 20]).domain([minSize, maxSize]);
            return d.circleSize ? cScale(d.circleSize) : 3;
        };

        //TODO - your code goes here -

        let countryIDs = this.data['life-expectancy'].map(d => d.geo);
        let points = [];

        for (let circleID of countryIDs) {

            let cVal = this.data[circleSizeIndicator].find(d => d.geo === circleID);
            if(cVal) {
                cVal = cVal[activeYear]
            } else {
                cVal = undefined;
            }

            let xVal = this.data[xIndicator].find(d => d.geo === circleID);
            if(xVal) {
                xVal = xVal[activeYear]
            } else {
                xVal = undefined;
            }

            let yVal = this.data[yIndicator].find(d => d.geo === circleID);
            if(yVal) {
                yVal = yVal[activeYear]
            } else {
                yVal = undefined;
            }

            let region = this.data['population'].find(d => d.geo === circleID);
            if(region) {
                region = region.region;
            } else {
                region = 'unknown';
            }

            let country = this.data['gdp'].find(d => d.geo === circleID).country;


            points.push(new PlotData(country, xVal, yVal, circleID, region, cVal));
        }



            let scaleX = d3.scaleLinear().domain([this.dataRange[xIndicator].min, this.dataRange[xIndicator].max]).range([0, this.width]).nice();
            let x_Axis = d3.axisBottom().scale(scaleX);
            let tempStore = this.margin.left + "," + this.height;


            let barX = this.svgGroup.select("#xAxisId");
            barX.exit().remove();

            let x_Value = this.svgGroup.enter().append('g');
            barX = barX.merge(x_Value);
            barX.call(x_Axis).classed("axis", true).attr("transform", "translate(" + tempStore + ")");
            barX.selectAll(".tick").classed("axis-label", true);

            let scaleY = d3.scaleLinear().domain([this.dataRange[yIndicator].min, this.dataRange[yIndicator].max]).range([this.height - this.margin.top, 0]).nice();
            let y_Axis = d3.axisLeft().scale(scaleY);
            tempStore = this.margin.left + "," + this.margin.top;


            let barY = this.svgGroup.select("#yAxisId");
            barY.exit().remove();
            let y_Value = this.svgGroup.enter().append('g');
            barY = barY.merge(y_Value);
            barY.call(y_Axis).classed("axis", true).attr("transform", "translate(" + tempStore + ")");
            barY.selectAll(".tick").classed("axis-label", true);


            this.svgGroup.append('text').attr('id', 'xText');
            this.svgGroup.append('text').attr('id', 'yText');
            let labelX = d3.select('#dropdown_x').select('.dropdown-content').select('select').node();
            let labelY = d3.select('#dropdown_y').select('.dropdown-content').select('select').node();



            let xValue = labelX[labelX.selectedIndex];
            xValue = xValue.text;
            let yValue = labelY[labelY.selectedIndex];
            yValue = yValue.text;



            let xBarLabel = this.svgGroup.select("#xText");
            xBarLabel.exit().remove();

            let changeX = (0.7 * this.width) + "," + (this.margin.top + this.height + 30);
            let xEnter = xBarLabel.enter().append('text');
            xBarLabel = xBarLabel.merge(xEnter);
            xBarLabel.datum(xValue).text(d => d.toUpperCase()).attr("transform", "translate(" + changeX + ")").classed('x-label', true)

            let yBarLabel = this.svgGroup.select("#yText");
            let yEnter = yBarLabel.enter().append('text');
            yBarLabel = yBarLabel.merge(yEnter);
            yBarLabel.datum(yValue).text(d => d.toUpperCase()).attr("transform", "translate(12, 250) rotate(-90)").classed('y-label', true).style("text-anchor", "middle");


            let connectToWorldMap = this.svgGroup.selectAll('circle').data(points);
            connectToWorldMap.exit().remove();
            let enterConnectToWorldMap = connectToWorldMap.enter().append('circle');
            connectToWorldMap = enterConnectToWorldMap.merge(connectToWorldMap);



            let newConnectToWorldMap = connectToWorldMap.attr('class', d => 'circle ' + d.region)
                                                        .attr('cx', d => (this.margin.left + scaleX(d.xVal ? d.xVal : 0))).attr('cy', d => (this.margin.top + scaleY(d.yVal ? d.yVal : 0)))
                                                        .attr('r', circleSizer)
                                                        .attr("id", d => (d.id.toUpperCase()))
                                                        .append('title')
                                                        .html(this.tooltipRender);



            this.drawDropDown(xIndicator, yIndicator, circleSizeIndicator);


            this.drawLegend(minSize, maxSize);

    }

        /**
         * Setting up the drop-downs
         * @param xIndicator identifies the values to use for the x axis
         * @param yIndicator identifies the values to use for the y axis
         * @param circleSizeIndicator identifies the values to use for the circle size
         */
        drawDropDown(xIndicator, yIndicator, circleSizeIndicator) {

            let that = this;
            let dropDownWrapper = d3.select('.dropdown-wrapper');
            let dropData = [];

            for (let key in this.data) {
                dropData.push({
                    indicator: key,
                    indicator_name: this.data[key][0].indicator_name
                });
            }

            /* CIRCLE DROPDOWN */
            let dropC = dropDownWrapper.select('#dropdown_c').select('.dropdown-content').select('select');

            let optionsC = dropC.selectAll('option')
                .data(dropData);


            optionsC.exit().remove();

            let optionsCEnter = optionsC.enter()
                .append('option')
                .attr('value', (d, i) => d.indicator);

            optionsCEnter.append('text')
                .text((d, i) => d.indicator_name);

            optionsC = optionsCEnter.merge(optionsC);

            let selectedC = optionsC.filter(d => d.indicator === circleSizeIndicator)
                .attr('selected', true);

            dropC.on('change', function (d, i) {
                let cValue = this.options[this.selectedIndex].value;
                let xValue = dropX.node().value;
                let yValue = dropY.node().value;
                that.updatePlot(that.activeYear, xValue, yValue, cValue);
            });

            /* X DROPDOWN */
            let dropX = dropDownWrapper.select('#dropdown_x').select('.dropdown-content').select('select');

            let optionsX = dropX.selectAll('option')
                .data(dropData);

            optionsX.exit().remove();

            let optionsXEnter = optionsX.enter()
                .append('option')
                .attr('value', (d, i) => d.indicator);

            optionsXEnter.append('text')
                .text((d, i) => d.indicator_name);

            optionsX = optionsXEnter.merge(optionsX);

            let selectedX = optionsX.filter(d => d.indicator === xIndicator)
                .attr('selected', true);

            dropX.on('change', function (d, i) {
                let xValue = this.options[this.selectedIndex].value;
                let yValue = dropY.node().value;
                let cValue = dropC.node().value;
                that.updatePlot(that.activeYear, xValue, yValue, cValue);
            });

            /* Y DROPDOWN */
            let dropY = dropDownWrapper.select('#dropdown_y').select('.dropdown-content').select('select');

            let optionsY = dropY.selectAll('option')
                .data(dropData);

            optionsY.exit().remove();

            let optionsYEnter = optionsY.enter()
                .append('option')
                .attr('value', (d, i) => d.indicator);

            optionsY = optionsYEnter.merge(optionsY);

            optionsYEnter.append('text')
                .text((d, i) => d.indicator_name);

            let selectedY = optionsY.filter(d => d.indicator === yIndicator)
                .attr('selected', true);

            dropY.on('change', function (d, i) {
                let yValue = this.options[this.selectedIndex].value;
                let xValue = dropX.node().value;
                let cValue = dropC.node().value;
                that.updatePlot(that.activeYear, xValue, yValue, cValue);
            });

        }

        /**
         * Draws the year bar and hooks up the events of a year change
         */
        drawYearBar() {

            // ******* TODO: PART 2 *******
            //The drop-down boxes are set up for you, but you have to set the slider to updatePlot() on activeYear change

            // Create the x scale for the activeYear;
            // hint: the domain should be max and min of the years (1800 - 2020); it's OK to set it as numbers
            // the plot needs to update on move of the slider

            /* ******* TODO: PART 3 *******
            You will need to call the updateYear() function passed from script.js in your activeYear slider
            */
            let that = this;

            //Slider to change the activeYear of the data
            let yearScale = d3.scaleLinear().domain([1800, 2020]).range([30, 730]);

            let yearSlider = d3.select('#activeYear-bar')
                .append('div').classed('slider-wrap', true)
                .append('input').classed('slider', true)
                .attr('type', 'range')
                .attr('min', 1800)
                .attr('max', 2020)
                .attr('value', this.activeYear);

            let sliderLabel = d3.select('.slider-wrap')
                .append('div').classed('slider-label', true)
                .append('svg');

            let sliderText = sliderLabel.append('text').text(this.activeYear);

            sliderText.attr('x', yearScale(this.activeYear));
            sliderText.attr('y', 25);

            yearSlider.on('input', function () {
                //TODO - your code goes here -

                let currentYear = yearSlider.node().value;
                sliderText.text(currentYear);
                that.activeYearBackground.html(currentYear);

                let circleSizeIndicator = d3.select('#dropdown_c').select('.dropdown-content').select('select').node().value;
                let xIndicator = d3.select('#dropdown_x').select('.dropdown-content').select('select').node().value;
                let yIndicator = d3.select('#dropdown_y').select('.dropdown-content').select('select').node().value;


                that.updatePlot(currentYear, xIndicator, yIndicator, circleSizeIndicator);


                that.updateYear(currentYear);
                that.updateCountry();
            });

        }

        /**
         * Draws the legend for the circle sizes
         *
         * @param min minimum value for the sizeData
         * @param max maximum value for the sizeData
         */
        drawLegend(min, max) {
            // ******* TODO: PART 2*******
            //This has been done for you but you need to call it in updatePlot().
            //Draws the circle legend to show size based on health data
            let scale = d3.scaleSqrt().range([3, 20]).domain([min, max]);

            let circleData = [min, max];

            let svg = d3.select('.circle-legend').select('svg').select('g');

            let circleGroup = svg.selectAll('g').data(circleData);
            circleGroup.exit().remove();

            let circleEnter = circleGroup.enter().append('g');
            circleEnter.append('circle').classed('neutral', true);
            circleEnter.append('text').classed('circle-size-text', true);

            circleGroup = circleEnter.merge(circleGroup);

            circleGroup.attr('transform', (d, i) => 'translate(' + ((i * (5 * scale(d))) + 20) + ', 25)');

            circleGroup.select('circle').attr('r', (d) => scale(d));
            circleGroup.select('circle').attr('cx', '0');
            circleGroup.select('circle').attr('cy', '0');
            let numText = circleGroup.select('text').text(d => new Intl.NumberFormat().format(d));

            numText.attr('transform', (d) => 'translate(' + ((scale(d)) + 10) + ', 0)');
        }

        /**
         * Reacts to a highlight/click event for a country; draws that country darker
         * and fades countries on other continents out
         * @param activeCountry
         */
        updateHighlightClick(activeCountry) {
            /* ******* TODO: PART 3*******
            //You need to assign selected class to the target country and corresponding region
            // Hint: If you followed our suggestion of using classes to style
            // the colors and markers for countries/regions, you can use
            // d3 selection and .classed to set these classes on here.
            // You will not be calling this directly in the gapPlot class,
            // you will need to call it from the updateHighlight function in script.js
            */
            //TODO - your code goes here -

            this.clearHighlight();

            let plotDataCircles = d3.select(".plot-svg").selectAll("circle");

            let currentCountry = plotDataCircles.filter(d => (d.id.toUpperCase() === activeCountry.toUpperCase()));

            let currentRegion = currentCountry.datum().region;


            plotDataCircles.filter(d => (d.region != currentRegion)).classed("hidden", true);
            plotDataCircles.filter(d => (d.region === currentRegion)).classed("selected-region", true);

            currentCountry.classed("selected-country", true);
        }

        /**
         * Clears any highlights
         */
        clearHighlight() {
            // ******* TODO: PART 3*******
            // Clear the map of any colors/markers; You can do this with inline styling or by
            // defining a class style in styles.css

            // Hint: If you followed our suggestion of using classes to style
            // the colors and markers for hosts/teams/winners, you can use
            // d3 selection and .classed to set these classes off here.
            //TODO - your code goes here -

            d3.select(".plot-svg").selectAll("circle").classed("selected-region", false).classed("hidden", false).classed("selected-country", false);

        }

        /**
         * Returns html that can be used to render the tooltip.
         * @param data
         * @returns {string}
         */
        tooltipRender(data) {
            let text = "<h2>" + data['country'] + "</h2>";
            return text;
        }


}
