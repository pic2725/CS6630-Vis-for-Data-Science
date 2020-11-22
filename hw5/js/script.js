preGrouped = d3.json('./data/polls.json');
// extraCredit = d3.csv('./data/polls.csv');

Promise.all([d3.csv('./data/forecasts.csv'), preGrouped]).then( data =>
{
    console.log(data);
    let forecastData = data[0];
    let pollData = data[1];

    /////////////////
    // EXTRA CREDIT//
    /////////////////
    /**
     * replace preGrouped with extraCredit and uncomment the line that defines extraCredit.
     * Then use d3.rollup to group the csvfile on the fly.
     *
     * If you are not doing the extra credit, you do not need to change this file.
     */

    rolledPollData = new Map(pollData); //  convert to a Map object for consistency with d3.rollup
    let table = new Table(forecastData, rolledPollData);
    table.drawTable();
});