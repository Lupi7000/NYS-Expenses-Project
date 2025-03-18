
// WIDTH AND HEIGHT PLACEHOLDERS

var width, height;


// BREAKPOINT WIDTHS | BREAKPOINT WIDTHS | BREAKPOINT WIDTHS


function setDimensions() {
    var mapElement = document.getElementById('map');
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;

    if (screenWidth < 600) { // Mobile
        width = mapElement.clientWidth;
        height = width * 0.8;
    } else if (screenWidth < 900) { // Tablet
        width = mapElement.clientWidth;
        height = width * 0.7;
    } else if (screenWidth < 1400) { // Desktop
        width = mapElement.clientWidth;
        height = width * 0.6;
    } else { // Large screens
        width = mapElement.clientWidth;
        height = width * 0.8;
    }
}

setDimensions();
window.addEventListener('resize', setDimensions);


//ESSENTIAL GLOBAL VARIABLES | ESSENTIAL GLOBAL VARIABLES | ESSENTIAL GLOBABL VARIABLES


var mapElement = document.getElementById('map');

var svg = d3.select(mapElement)
    .append('svg')
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMinYMin");

var projection = d3.geoMercator().scale(1);
var path = d3.geoPath().projection(projection);

var countiesData;

var urls = {
    ny: "/DataSets/NY-MapPoints.json",
    stateAssembly: "/DataSets/NY-State-Assembly.csv",
    stateSenate: "/DataSets/NY-State-Senate.csv",
    fedCongress: "/DataSets/NY-Congress.csv"
};


// LOAD ALL THE CSV DATA | LOAD ALL THE CSV DATA | LOAD ALL THE CSV DATA | LOAD ALL THE CSV DATA


async function loadData() {
    try {
        var [mapData, stateAssembly, stateSenate, fedCongress] = await Promise.all([
            d3.json(urls.ny),
            d3.csv(urls.stateAssembly),
            d3.csv(urls.stateSenate),
            d3.csv(urls.fedCongress)
        ]);

        countiesData = topojson.feature(mapData, mapData.objects.cb_2015_new_york_county_20m);
        console.log('Counties data loaded:', countiesData);

        window.scrollTo(0, 0);

        // Federal Congress Data
        var congressData = createCongressData(fedCongress);

        // State Senate Data
        var senateData = createStateSenateData(stateSenate);

        // State Assembly Data
        var assemblyData = createStateAssemblyData(stateAssembly);

        drawMap(congressData, senateData, assemblyData);

    } catch (error) {
        console.log('Error loading data:', error);
    }
}


// MAP ALL THE DATA FROM THE CSVs | MAP ALL THE DATA FROM THE CSVs | MAP ALL THE DATA FROM THE CSVs

// Create Federal Congress Data
function createCongressData(fedCongress) {
    var data = {};
    fedCongress.forEach(d => {
        if (!data[d.county_name]) {
            data[d.county_name] = {
                rep: [],
                party: [],
                district: [],
                phone: [],
                start: [],
                nextVote: [],
                salary: [],
                staff: [],
                staffAverage: [],
                ops: [],
                travel: [],
                total: [],
                fullterm: [],
                adjstaff: [],
                adjstaffaverage: [],
                adjops: [],
                adjtravel: [],
                adjtotal: [],
                term: []
            };
        }
        data[d.county_name].rep.push(d.rep);
        data[d.county_name].party.push(d.party);
        data[d.county_name].district.push(d.dis);
        data[d.county_name].phone.push(d.phone);
        data[d.county_name].start.push(d.start);
        data[d.county_name].nextVote.push(d.end);
        data[d.county_name].salary.push(parseFloat(d.salary));
        data[d.county_name].staff.push(parseFloat(d.staff));
        data[d.county_name].staffAverage.push(parseFloat(d.staffavg));
        data[d.county_name].ops.push(parseFloat(d.ops));
        data[d.county_name].travel.push(parseFloat(d.travel));
        data[d.county_name].total.push(parseFloat(d.totals));
        data[d.county_name].fullterm.push(d.FullTerm);
        data[d.county_name].adjstaff.push(parseFloat(d.AdjStaff));
        data[d.county_name].adjstaffaverage.push(parseFloat(d.AdjStaffAverage));
        data[d.county_name].adjops.push(parseFloat(d.AdjOps));
        data[d.county_name].adjtravel.push(parseFloat(d.AdjTravel));
        data[d.county_name].adjtotal.push(parseFloat(d.AdjTotal));
        data[d.county_name].term.push(parseFloat(d.term));
    });
    return data;
}

// Create State Senate Data
function createStateSenateData(stateSenate) {
    var data = {};
    stateSenate.forEach(d => {
        if (!data[d.County]) {
            data[d.County] = {
                rep: [],
                party: [],
                district: [],
                phone: [],
                start: [],
                email: []
            };
        }
        data[d.County].rep.push(d.Senator);
        data[d.County].party.push(d.Party);
        data[d.County].district.push(d.District);
        data[d.County].phone.push(d.Phone);
        data[d.County].start.push(d.TermStart);
        data[d.County].email.push(d.Email);
    });
    return data;
}

// Create State Assembly Data
function createStateAssemblyData(stateAssembly) {
    var data = {};
    stateAssembly.forEach(d => {
        if (!data[d.COUNTY]) {
            data[d.COUNTY] = {
                rep: [],
                party: {},
                district: {},
                phone: {},
                start: {},
                email: {}
            };
        }
        if (!data[d.COUNTY].rep.includes(d.rep)) {
            data[d.COUNTY].rep.push(d.rep);
            data[d.COUNTY].party[d.rep] = d.party;
            data[d.COUNTY].district[d.rep] = d.district;
            data[d.COUNTY].phone[d.rep] = d.phone;
            data[d.COUNTY].start[d.rep] = d.start;
            data[d.COUNTY].email[d.rep] = d.email;
        }
    });
    return data;
}


// TOOL TIP FUNCTION | MAKES THE COUNTY NAMES SHOW UP | TOOL TIP FUNCTION | MAKES THE COUNTY NAMES SHOW UP


function positionTooltip(tip, targetSelector, content) {
    var target = document.querySelector(targetSelector);
    var targetRect = target.getBoundingClientRect();
    
    tip.html(content)
        .style("left", (targetRect.left + window.scrollX) + "px")
        .style("top", (targetRect.bottom + window.scrollY) + "px");
}


// DRAW THE MAP WITH CLICK AND HOVER FUNCTIONS | DRAW THE MAP WITH THE CLICK AND HOVER FUNCTIONS


function drawMap(congressData, senateData, assemblyData) {
    // Remove existing map elements
    svg.selectAll('.counties').remove();

    var scaleCenter = calculateScaleCenter(countiesData);
    projection.scale(scaleCenter.scale).center(scaleCenter.center).translate([width / 2, height / 2]);
    var tip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
    var state = 0;
    var returnButton = d3.select("body").append("button").attr("class", "hiddenButton").text("Return");

    // Draw map
    svg.append('g')
        .selectAll('path')
        .data(countiesData.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('class', 'counties')
        .on('mouseover', function (d) {

            positionTooltip(tip, '.state-name', d.target.__data__.properties.NAME);
            tip.style("opacity", 1);

            d3.select(this).on("mouseout", function () {
                tip.style("opacity", state === 0 ? 0 : 1);
            });
        })
 /*           tip.style("opacity", 1).html(d.target.__data__.properties.NAME);
            d3.select(this).on("mouseout", function () {
                tip.style("opacity", state === 0 ? 0 : 1);
            });
        })
*/
        .on("click", function (d) {
            var bbox = this.getBBox();
            var bboxX = bbox.x;
            var bboxY = bbox.y;
            var countyName = d.target.__data__.properties.NAME;

            if (state === 0) {
                state = 1;
                var k = 3;
                var x = bboxX;
                var y = bboxY;
                var centered = d;

                d3.selectAll(".nys-wrapper-on").classed("nys-wrapper-on", false).classed("nys-wrapper-off", true);
                d3.selectAll(".county-clicked-mode-off").classed("county-clicked-mode-off", false).classed("county-clicked-mode-on", true);
                d3.selectAll(".grid").classed("grid", false).classed("grid-county-mode", true);
                d3.selectAll(".tooltip").classed("tooltip", false).classed("hiddenTooltip", true);
                d3.selectAll(".hiddenButton").classed("hiddenButton", false).classed("return", true);

                displayCountyData(countyName, congressData, senateData, assemblyData);
            } else {
                console.log("UH OH!");
            }
        });


// RETURN BUTTON | RETURN BUTTON | RETURN BUTTON | RETURN BUTTON | RETURN BUTTON | RETURN BUTTON


    returnButton.on("click", function () {
        if (state === 1) {
            state = 0;
            d3.selectAll(".county-clicked-mode-on").classed("county-clicked-mode-on", false).classed("county-clicked-mode-off", true);
            d3.selectAll(".nys-wrapper-off").classed("nys-wrapper-off", false).classed("nys-wrapper-on", true);
            d3.selectAll(".grid-county-mode").classed("grid-county-mode", false).classed("grid", true);
            d3.selectAll(".hiddenTooltip").classed("hiddenTooltip", false).classed("tooltip", true);
            d3.selectAll(".return").classed("return", false).classed("hiddenButton", true);
            d3.selectAll(".representative-container").remove();
            d3.selectAll(".salary").remove();
            d3.selectAll(".staff").remove();
            d3.selectAll(".staff-average").remove();
            d3.selectAll(".operations").remove();
            d3.selectAll(".travel").remove();
            d3.selectAll(".total").remove();
            d3.selectAll(".expensediv-salary").remove();
            d3.selectAll(".expensediv-staff").remove();
            d3.selectAll(".expensediv-staff-average").remove();
            d3.selectAll(".expensediv-ops").remove();
            d3.selectAll(".expensediv-travel").remove();
            d3.selectAll(".expensediv-total").remove();
            d3.selectAll(".rep-info-mobile").remove();
            d3.selectAll(".shortterm").remove();
            svg.selectAll("path").transition().duration(750).style("stroke-width", "1px").attr('transform', '');
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            console.log("Cannot return to NY state.");
        }
    });
}


// CALCULATE THE STATE CENTER | CALCULATE THE STATE CENTER | CALCULATE THE STATE CENTER |


function calculateScaleCenter(geojson) {
    var b = path.bounds(geojson);
    var s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
    var centroid = d3.geoCentroid(geojson);
    return {
        scale: s,
        center: centroid
    };
}


// BENCHMARK FORMULAS | BENCHMARK FORMULAS | BENCHMARK FORMULAS | BENCHMARK FORMULAS


// Helper function to format dollar values
var formatDollars = d3.format("$.2s");

// Function to calculate the percentage difference
function getPercentageDifference(clickedValue, benchmarkValue) {
    var difference = clickedValue - benchmarkValue;
    var percentageDifference = (difference / benchmarkValue) * 100;
    return percentageDifference.toFixed(0);
}

// Function to get formatted number with arrow and color
function getArrowAndFormattedNumber(number, difference) {
    var arrow = "";
    var color = "";

    if (difference > 0) {
        arrow = "&#9650;"; // Up arrow
        color = "red"; // Red color for positive difference
    } else if (difference < 0) {
        arrow = "&#9660;"; // Down arrow
        color = "#104E8B"; // Blue color for negative difference
    } else {
        arrow = "="; // Equal sign for zero difference
        color = "black"; // Black color for zero difference
    }

    return "<span style='color: " + color + ";'>" + arrow + " " + number + "% </span> <div class='vsaverage'>vs average</div>";
}


// DISPLAY COUNTY DATA | DISPLAY COUNTY DATA | DISPLAY COUNTY DATA | DISPLAY COUNTY DATA | DISPLAY COUNTY DATA


function displayCountyData(countyName, congressData, senateData, assemblyData) {

console.log(congressData)
console.log(congressData[countyName])

var countyClicked = congressData[countyName]


countyClicked.rep.forEach((rep, index) => {


console.log(congressData[countyName].rep[index])
console.log(congressData[countyName].party[index])
console.log(congressData[countyName].district[index])
console.log(congressData[countyName].start[index])
console.log(congressData[countyName].phone[index])

})



}


// DON'T DELETE BELOW THIS LINE!

loadData();
