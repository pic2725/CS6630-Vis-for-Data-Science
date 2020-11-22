/** Data structure for the data associated with an individual country. */
class InfoBoxData {
    /**
     *
     * @param country name of the active country
     * @param region region of the active country
     * @param indicator_name the label name from the data category
     * @param value the number value from the active year
     */
    constructor(country, region, indicator_name, value) {
        this.country = country;
        this.region = region;
        this.indicator_name = indicator_name;
        this.value = value;
    }
}

/** Class representing the highlighting and selection interactivity. */
class InfoBox {
    /**
     * Creates a InfoBox Object
     * @param data the full data array
     */
    constructor(data) {
        this.data = data;
    }

    /**
     * Renders the country description
     * @param activeCountry the IDs for the active country
     * @param activeYear the year to render the data for
     */
    updateTextDescription(activeCountry, activeYear) {
        // ******* TODO: PART 4 *******
        // Update the text elements in the infoBox to reflect:
        // Selected country, region, population and stats associated with the country.
        /*
         * You will need to get an array of the values for each category in your data object
         * hint: you can do this by using Object.values(this.data)
         * you will then need to filter just the activeCountry data from each array
         * you will then pass the data as paramters to make an InfoBoxData object for each category
         *
         */

        this.clearHighlight();



        let current = this;
        let infoBoxDataStore = Object.keys(this.data)
            .map( function (id_){
                let dataTemp = current.data;

                let region = dataTemp['population'].find(d => (d.geo === activeCountry.toLowerCase())).region;
                let country = dataTemp[id_].find(d => (d.geo === activeCountry.toLowerCase()));

                let name = country.indicator_name;
                let value = country[activeYear];

                return new InfoBoxData(country.country, region, name, value);

            });


        let countryTitle = d3.select("#country-detail")
                                .selectAll("span#mainTitle")
                                .data([{"country" : infoBoxDataStore[0].country, "region" : infoBoxDataStore[0].region}]);

        countryTitle.exit().remove();


        let selectedTitle = countryTitle.enter()
                                        .append("div")
                                        .classed("label", true);

        countryTitle = selectedTitle.merge(countryTitle);

        countryTitle.append("i")
                    .attr("class", d => d.region)
                    .classed("fas fa-globe-asia", true);


        countryTitle.append("span")
                    .text(d => (" " + d.country))
                    .attr("id", 'mainTitle')
                    .attr("style", "color:black");

        let dataText = d3.select("#country-detail")
                            .selectAll("div#divText")
                            .data(infoBoxDataStore);

        dataText.exit().remove();

        let SelectedText = dataText.enter()
                                    .append("div")
                                    .classed("stat", true)
                                    .attr('id', 'divText');

        dataText = SelectedText.merge(dataText);


        dataText.append("text")
            .text(d => (d.indicator_name + ' : ' + d.value));
    }

    /**
     * Removes or makes invisible the info box
     */
    clearHighlight() {

        d3.select('#country-detail').html('');
    }

}