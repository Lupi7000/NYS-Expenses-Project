

  var width, height; // Declare width and height variables
// Function to set width and height based on breakpoints
function setDimensions() {
  var mapElement = document.getElementById('map');
  var screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;


  if (screenWidth < 600) { // Mobile
    width = mapElement.clientWidth;
   // height = screenHeight * 0.5;
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

var mapElement = document.getElementById('map');

var svg = d3.select(mapElement)
  .append('svg')
  .attr("viewBox", "0 0 " + width + " " + height)
  .attr("preserveAspectRatio", "xMinYMin");

var projection = d3.geoMercator().scale(1);
var path = d3.geoPath().projection(projection);

var countiesData; // Variable to store counties data

var urls = {
  ny: "/DataSets/NY-MapPoints.json",
  stateAssembly: "/DataSets/NY-State-Assembly.csv",
  stateSenate: "/DataSets/NY-State-Senate.csv",
  fedCongress: "/DataSets/NY-Congress.csv"
};

// GATHERING DATA FROM THE URLS and CREATING VARIABLES FOR THE DATA

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
    console.log(fedCongress)
window.scrollTo(0, 0);

/* FEDERAL CONGRESS VARIABLES || FEDERAL CONGRESS VARIABLES || FEDERAL CONGRESS VARIABLES */


    //CONGRESS NAME
    var congressRep = {};
    fedCongress.forEach(d => {
      if (congressRep[d.county_name]) {
          // If the county already exists in congressRep, push the representative to its array
          congressRep[d.county_name].push(d.rep);
      } else {
          // If the county doesn't exist in congressRep yet, create a new array and add the representative
          congressRep[d.county_name] = [d.rep];
      }
     });
  console.log(congressRep);
     
    //CONGRESS PARTY
    var congressParty = {};
    fedCongress.forEach(d => {
        if (congressParty[d.county_name]) {
            congressParty[d.county_name].push(d.party);
        } else {
            congressParty[d.county_name] = [d.party];
        }
    });
    console.log(congressParty);

    //CONGRESS DISTRICT
    var congressDistrict = {};
    fedCongress.forEach(d => {
        if (congressDistrict[d.county_name]) {
            congressDistrict[d.county_name].push(d.dis);
        } else {
            congressDistrict[d.county_name] = [d.dis];
        }
    });
    console.log(congressDistrict);

    // CONGRESS PHONE NUMBERS
    var congressPhone = {};
    fedCongress.forEach(d => {
        if (congressPhone[d.county_name]) {
            congressPhone[d.county_name].push(d.phone);
        } else {
            congressPhone[d.county_name] = [d.phone];
        }
    });
    console.log(congressPhone);

    //CONGRESS TERM START
    var congressStart = {};
    fedCongress.forEach(d => {
        if (congressStart[d.county_name]) {
            congressStart[d.county_name].push(d.start);
        } else {
            congressStart[d.county_name] = [d.start];
        }
    });
    console.log(congressStart);

    //CONGRESS NEXT VOTE
    var congressNextVote = {};
    fedCongress.forEach(d => {
        if (congressNextVote[d.county_name]) {
            congressNextVote[d.county_name].push(d.end);
        } else {
            congressNextVote[d.county_name] = [d.end];
        }
    });
    console.log(congressNextVote);

        // Process expenses
    var expenses = {};
    expensesData.forEach(d => {
        expenses[d.county_name] = {
            salary: parseInt(d.salary) || 0,
            staff: parseInt(d.staff) || 0,
            operations: parseInt(d.ops) || 0,
            travel: parseInt(d.travel) || 0,
            total: parseInt(d.total_expenses) || 0
        };
    });

    console.log("Loaded Expenses Data:", expenses);

  console.log("hi");

/* STATE SENATE VARIABLES || STATE SENATE VARIABLES || STATE SENATE VARIABLES */

    //SENATOR NAME
    var senateRep = {};
    stateSenate.forEach(d => {
      if (senateRep[d.County]) {
          // If the county already exists in senateRep, push the representative to its array
          senateRep[d.County].push(d.Senator);
      } else {
          // If the county doesn't exist in senateRep yet, create a new array and add the representative
          senateRep[d.County] = [d.Senator];
      }
     });
  console.log(senateRep);
     
    //SENATOR PARTY
    var senateParty = {};
    stateSenate.forEach(d => {
        if (senateParty[d.County]) {
            senateParty[d.County].push(d.Party);
        } else {
            senateParty[d.County] = [d.Party];
        }
    });
    console.log(senateParty);

    //SENATOR DISTRICT
    var senateDistrict = {};
    stateSenate.forEach(d => {
        if (senateDistrict[d.County]) {
            senateDistrict[d.County].push(d.District);
        } else {
            senateDistrict[d.County] = [d.District];
        }
    });
    console.log(senateDistrict);

    // SENATOR PHONE NUMBERS
    var senatePhone = {};
    stateSenate.forEach(d => {
        if (senatePhone[d.County]) {
            senatePhone[d.County].push(d.Phone);
        } else {
            senatePhone[d.County] = [d.Phone];
        }
    });
    console.log(senatePhone);

    //SENATOR TERM START
    var senateStart = {};
    stateSenate.forEach(d => {
        if (senateStart[d.County]) {
            senateStart[d.County].push(d.TermStart);
        } else {
            senateStart[d.County] = [d.TermStart];
        }
    });
    console.log(senateStart);

    //SENATOR EMAIL
    var senateEmail = {};
    stateSenate.forEach(d => {
        if (senateEmail[d.County]) {
            senateEmail[d.County].push(d.Email);
        } else {
            senateEmail[d.County] = [d.Email];
        }
    });
    console.log(senateEmail);


/* STATE ASSEMBLY VARIABLES || STATE ASSEMBLY VARIABLES || STATE ASSEMBLY VARIABLES */

//ASSEMBLY REP NAME
    var assemblyRep = {};
    stateAssembly.forEach(d => {
    // Check if the county exists in the assemblyRep object
    if (assemblyRep[d.COUNTY]) {
        // Check if the representative already exists for this county
        if (!assemblyRep[d.COUNTY].includes(d.rep)) {
            // If the representative doesn't exist, add it
            assemblyRep[d.COUNTY].push(d.rep);
        }
    } else {
        // If the county doesn't exist yet, create a new array and add the representative
        assemblyRep[d.COUNTY] = [d.rep];
    }
});

//ASSEMBLY REP PARTY
var assemblyParty = {};
stateAssembly.forEach(d => {
    // Check if the representative already exists in assemblyParty
    if (!assemblyParty[d.rep]) {
        // If the representative doesn't exist, add it along with their party
        assemblyParty[d.rep] = d.party;
    }
});
console.log(assemblyParty);


//ASSEMBLY REP DISTRICT
var assemblyDistrict = {};
stateAssembly.forEach(d => {

    if (!assemblyDistrict[d.rep]) {
        assemblyDistrict[d.rep] = d.district;
    }
});
console.log(assemblyDistrict);

//ASSEMBLY REP PHONE NUMBERS
var assemblyPhone = {};
stateAssembly.forEach(d => {

    if (!assemblyPhone[d.rep]) {
        assemblyPhone[d.rep] = d.phone;
    }
});
console.log(assemblyPhone);

//ASSEMBLY REP TERM START
var assemblyStart = {};
stateAssembly.forEach(d => {

    if (!assemblyStart[d.rep]) {
        assemblyStart[d.rep] = d.start;
    }
});
console.log(assemblyStart);

//ASSEMBLY REP EMAIL
var assemblyEmail = {};
stateAssembly.forEach(d => {

    if (!assemblyEmail[d.rep]) {
        assemblyEmail[d.rep] = d.email;
    }
});
console.log(assemblyEmail);

drawMap(
  congressRep, 
  congressParty, 
  congressDistrict, 
  congressPhone, 
  congressStart, 
  congressNextVote,
  senateRep,
  senateParty,
  senateDistrict,
  senatePhone,
  senateStart,
  senateEmail,
  assemblyRep,
  assemblyParty,
  assemblyDistrict,
  assemblyPhone,
  assemblyStart,
  assemblyEmail,
  expenses
  );


  } catch (error) {
    console.log('Error loading data:', error);
  }
}


//DRAWING THE MAP, ALL D3 THAT HITS THE DOM WILL BE CREATED HERE

function drawMap(
  congressRep, 
  congressParty, 
  congressDistrict, 
  congressPhone, 
  congressStart, 
  congressNextVote,
  senateRep,
  senateParty,
  senateDistrict,
  senatePhone,
  senateStart,
  senateEmail,
  assemblyRep,
  assemblyParty,
  assemblyDistrict,
  assemblyPhone,
  assemblyStart,
  assemblyEmail,
  expenses
  ) {
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

// TOOL TIP HOVER FUNCTIONALITY

    .on('mouseover', function(d) {
   
    tip.style("opacity", 1)
      .html(d.target.__data__.properties.NAME);
 
    d3.select(this).on("mouseout", function(d) {
if (state === 0) {
tip.style("opacity", 0);
} else if (state === 1) {
tip.style("opacity", 1);
} else {
console.log("Uh Oh!")
}
});
    })
.on("click", function(d) {
    var bbox = this.getBBox(); 
    var bboxX = bbox.x;
    var bboxY = bbox.y;

    if (state === 0) {
        state = 1;
        k = 3;
        x = bboxX;
        y = bboxY;
        centered = d;

        // Manipulating classes and adding/removing elements from the DOM
       // d3.select(this)
          //  .classed("counties", false)
          //  .classed("clickedCounty", true);
            //.style("transform", "scale(" + k + ")")
            //.style("transform", "translate( " + (-x + (width/2.2)) + "px" + " , " + (-y + 200) + "px" +  " )")
            //.attr("transform", "translate(" + (width / 3.5) + "," + height / 4.5 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");

        d3.selectAll(".nys-wrapper-on")
          .classed("nys-wrapper-on", false)
          .classed("nys-wrapper-off", true);

        d3.selectAll(".county-clicked-mode-off")
          .classed("county-clicked-mode-off", false)
          .classed("county-clicked-mode-on", true);

  /*     d3.selectAll(".counties")
            .classed("counties", false)
            .classed("hiddenCounty", true);       */

        d3.selectAll(".grid")
            .classed("grid", false)
            .classed("grid-county-mode", true);    

        d3.selectAll(".tooltip")
            .classed("tooltip", false)
            .classed("hiddenTooltip", true);

        d3.selectAll(".hiddenButton")
            .classed("hiddenButton", false)
            .classed("return", true);

// Get the county name from the clicked map element's data
 var clickedCountyName = d.target.__data__.properties.NAME;

    var congressData = [];
    if (congressRep[clickedCountyName]) {
        congressRep[clickedCountyName].forEach((rep, index) => {
            congressData.push({
                name: rep,
                party: congressParty[clickedCountyName]?.[index] || "Unknown",
                district: `District ${congressDistrict[clickedCountyName]?.[index] || "N/A"}`,
                phone: congressPhone[clickedCountyName]?.[index] || "N/A",
                since: congressStart[clickedCountyName]?.[index] || "Unknown",
                nextVote: congressNextVote[clickedCountyName]?.[index] || "N/A",
                img: "https://via.placeholder.com/120", // Placeholder image
                expenses: {
                    salary: parseInt(countySalary[clickedCountyName]?.[index]) || 0,
                    staff: parseInt(staffSalaries[clickedCountyName]?.[index]) || 0,
                    operations: parseInt(operationsExpenses[clickedCountyName]?.[index]) || 0,
                    travel: parseInt(travelExpenses[clickedCountyName]?.[index]) || 0,
                    total: parseInt(totalExpenses[clickedCountyName]?.[index]) || 0
                }
            });
        });
    }


    document.dispatchEvent(new CustomEvent("countySelected", {
        detail: { countyName: clickedCountyName, congressData }
    }));

    console.log(`Dispatched event for ${countyName}:`, congressData);

/* CONGRESS INFORMATION INPUT || CONGRESS INFORMATION INPUT || CONGRESS INFORMATION INPUT*/

// Append a container div for each congressional representative

console.log(window)
if (window.renderCongressProfiles) {
    console.log("🟢 Calling renderCongressProfiles for:", clickedCountyName);
    window.renderCongressProfiles(clickedCountyName);
} else {
    console.warn("⚠️ renderCongressProfiles() not found. Ensure profile-cards-congress.js is loaded.");
}


/* SENATE INFORMATION INPUT || SENATE INFORMATION INPUT || SENATE INFORMATION INPUT */

// Append a container div for each congressional representative
senateRep[clickedCountyName].forEach(function(name, index) {
    var containerDiv = d3.selectAll(".statesenatereps")
        .append("div")
        .classed("representative-container", true); // Add a class for styling purposes

    // Append the representative's name as a sub-heading within the container div
    containerDiv.append("div")
        .classed("representative-name", true)
        .text(name); // Use text() instead of html() to avoid HTML injection
        console.log(name)
    // Append other properties within the same container div
    containerDiv.append("div")
        .classed("representative-party", true)
        .text(senateParty[clickedCountyName][index])
        .style("color", function(){return senateParty[clickedCountyName][index] === "Democrat" ? "#6495ED" : "#AA4A44";});

    containerDiv.append("div")
        .classed("representative-district", true)
        .text("district " + senateDistrict[clickedCountyName][index]);

    containerDiv.append("div")
        .classed("representative-start", true)
        .text("In office since " + senateStart[clickedCountyName][index]);

    containerDiv.append("div")
        .classed("representative-phone", true)
        .text(senatePhone[clickedCountyName][index]);

    containerDiv.append("div")
        .classed("representative-email", true)
        .html(`<a href="mailto:${senateEmail[clickedCountyName][index]}">${senateEmail[clickedCountyName][index]}</a>`);

    d3.selectAll(".statesenatereps").append("div").classed("salary", true).html("SALARY");
    d3.selectAll(".statesenatereps").append("div").classed("staff", true).html("STAFF");
    d3.selectAll(".statesenatereps").append("div").classed("operations", true).html("OPS");
    d3.selectAll(".statesenatereps").append("div").classed("travel", true).html("TRAVEL");
    d3.selectAll(".statesenatereps").append("div").classed("total", true).html("TOTAL!");


/*    containerDiv.append("div")
        .classed("representative-next-vote", true)
        .html("next vote: " + congressNextVote[clickedCountyName][index]);
*/
  
});

/* STATE ASSEMBLY INFORMATION INPUT || STATE ASSEMBLY INFORMATION INPUT || STATE ASSEMBLY INFORMATION INPUT */

// Append a container div for each congressional representative
assemblyRep[clickedCountyName].forEach(function(name, index) {

    console.log("POOP")
    console.log(name)
    console.log(index)


    var containerDiv = d3.selectAll(".assemblyreps")
        .append("div")
        .classed("representative-container", true); // Add a class for styling purposes

    // Append the representative's name as a sub-heading within the container div
    containerDiv.append("div")
        .classed("representative-name", true)
        .text(name); // Use text() instead of html() to avoid HTML injection
        console.log("Assembly Rep Name: " + name)

    containerDiv.append("div")
        .classed("representative-party", true)
        .text(assemblyParty[name])
        .style("color", function(){return assemblyParty[name] === "Democrat" ? "#6495ED" : "#AA4A44";});
        console.log("Assembly Rep Party: " + assemblyParty[name])
    containerDiv.append("div")
        .classed("representative-district", true)
        .text("district " + assemblyDistrict[name]);
        console.log("Assembly District: " + assemblyDistrict[name])
    containerDiv.append("div")
        .classed("representative-start", true)
        .text("In office since " + assemblyStart[name]);
        console.log("Assembly Rep Term Start: " + assemblyStart[name])
    containerDiv.append("div")
        .classed("representative-phone", true)
        .text(assemblyPhone[name]);
        console.log("Assembly Rep Phone: " + assemblyPhone[name])
    containerDiv.append("div")
        .classed("representative-email", true)
        .html(`<a href="mailto:${assemblyEmail[name]}">${assemblyEmail[name]}</a>`);
        console.log("Assembly Rep Email: " + assemblyEmail[name])
        console.log("----------------------")
    d3.selectAll(".assemblyreps").append("div").classed("salary", true).html("SALARY");
    d3.selectAll(".assemblyreps").append("div").classed("staff", true).html("STAFF");
    d3.selectAll(".assemblyreps").append("div").classed("operations", true).html("OPS");
    d3.selectAll(".assemblyreps").append("div").classed("travel", true).html("TRAVEL");
    d3.selectAll(".assemblyreps").append("div").classed("total", true).html("TOTAL!");


/*    containerDiv.append("div")
        .classed("representative-next-vote", true)
        .html("next vote: " + congressNextVote[clickedCountyName][index]);
*/
  
});



    } else {
        console.log("UH OH!");
    }
});



// RETURN BUTTON || RETURN BUTTON || RETURN BUTTON || RETURN BUTTON || RETURN BUTTON || RETURN BUTTON
  returnButton.on("click", function(d) {
     
     
if (state === 1) {
state = 0;
d3.select(".return")
d3.selectAll(".county-clicked-mode-on").classed("county-clicked-mode-on", false).classed("county-clicked-mode-off", true)
d3.selectAll(".nys-wrapper-off").classed("nys-wrapper-off", false).classed("nys-wrapper-on", true);
d3.selectAll(".grid-county-mode").classed("grid-county-mode", false).classed("grid", true);
//d3.selectAll(".clickedCounty").classed("clickedCounty", false).classed("counties", true);

//d3.select("#hiddenmap")
  //.attr("id", "#map");

d3.selectAll(".hiddenTooltip").classed("hiddenTooltip", false).classed("tooltip", true);
d3.selectAll(".return").classed("return", false).classed("hiddenButton", true);

d3.selectAll(".representative-container").remove()
d3.selectAll(".salary").remove()
d3.selectAll(".staff").remove()
d3.selectAll(".operations").remove()
d3.selectAll(".travel").remove()
d3.selectAll(".total").remove()
//d3.select(".congressreps").style("visibility", "hidden");

window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


} else {}
});


}






function calculateScaleCenter(counties) {
  var bbox_path = path.bounds(counties),
    scale = 0.95 / Math.max(
      (bbox_path[1][0] - bbox_path[0][0]) / width,
      (bbox_path[1][1] - bbox_path[0][1]) / height
    );
  var bbox_feature = d3.geoBounds(counties),
    center = [
      (bbox_feature[1][0] + bbox_feature[0][0]) / 2,
      (bbox_feature[1][1] + bbox_feature[0][1]) / 2
    ];
  return {
    'scale': scale,
    'center': center
  };
}

window.addEventListener('load', function() {
  loadData();

});

