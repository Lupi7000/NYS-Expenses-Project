var width = window.innerWidth,
    height = window.innerHeight,
    centered;
var svg = d3.select('#map').append('svg').attr('width', width).attr('height', height);
var projection = d3.geoMercator().scale(1);
var path = d3.geoPath().projection(projection);
var state = 0;
 
// START OF MAP FUNCTION

Promise.all([
  d3.json("https://gist.githubusercontent.com/Lupi7000/d770ce6f2985c3a7bac1099688e4f772/raw/d327f59834fb0f9f2201ad71c3f1711ecb5bf6de/NYTest.json"),
  d3.csv("https://gist.githubusercontent.com/Lupi7000/7e8cf50a2fbc046df1e47ab33225bdba/raw/cd230a7ef78064f02038fa45003992cb976469bc/NY-State-Assembly.csv"),
  d3.csv("https://gist.githubusercontent.com/Lupi7000/6fc23a42e814e31ca124996fbaaefcc4/raw/a5218a7718227e2bb372e8c3a215d37b62537d5b/NY-State-Senate.csv"),
  d3.csv("https://gist.githubusercontent.com/Lupi7000/3073906da834f4b22f81583ef9fd0135/raw/1ebdefe1ad2a403b198a5667688d3a13eeea4802/NY-State-Congress2.csv")
]).then(function([mapData, stateAssembly, stateSenate, fedCongress]){
 
  console.log(mapData);  
  console.log(stateAssembly);
  console.log(stateSenate);  
  console.log(fedCongress);  
       
 
 
  var counties = topojson.feature(mapData, mapData.objects.cb_2015_new_york_county_20m);
   
  console.log(counties)
   
  var scaleCenter = calculateScaleCenter(counties);
  projection.scale(scaleCenter.scale).center(scaleCenter.center).translate([width / 2, height / 2]);
  var tip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
 
// CONGRESS VARIABLES AND KEYS
   
  var cRepDisplay2 = d3.select("body").append("div").attr("class", "test").style("opacity", 0);
  var cRepDisplay3 = d3.select("body").append("div").attr("class", "test").style("opacity", 0);
  var cRepDisplay4 = d3.select("body").append("div").attr("class", "test").style("opacity", 0);
  var cRepDisplay5 = d3.select("body").append("div").attr("class", "test").style("opacity", 0);
  var cRepDisplay6 = d3.select("body").append("div").attr("class", "test").style("opacity", 0);
  var returnButton = d3.select("body").append("button").attr("class", "hiddenButton").text("Return");
  var unclickedCounty = document.getElementsByTagName("path");
  var centroid = path.centroid(counties.features);
  var x, y, k;
 
   //CONGRESS REPRESENTATIVE NAMES
   var congressRep1 = {}
   fedCongress.forEach(d => {congressRep1[d.county_name] = d.rep1});
   var congressRep2 = {}
   fedCongress.forEach(d => {congressRep2[d.county_name] = d.rep2});
   var congressRep3 = {}
   fedCongress.forEach(d => {congressRep3[d.county_name] = d.rep3});
   var congressRep4 = {}
   fedCongress.forEach(d => {congressRep4[d.county_name] = d.rep4});
   var congressRep5 = {}
   fedCongress.forEach(d => {congressRep5[d.county_name] = d.rep5});
   var congressRep6 = {}
   fedCongress.forEach(d => {congressRep6[d.county_name] = d.rep6});
   
   //CONGRESS PARTY
   var congressParty1 = {}
   fedCongress.forEach(d => {congressParty1[d.county_name] = d.party1});
   var congressParty2 = {}
   fedCongress.forEach(d => {congressParty2[d.county_name] = d.party2});
   var congressParty3 = {}
   fedCongress.forEach(d => {congressParty3[d.county_name] = d.party3});
   var congressParty4 = {}
   fedCongress.forEach(d => {congressParty4[d.county_name] = d.party4});
   var congressParty5 = {}
   fedCongress.forEach(d => {congressParty5[d.county_name] = d.party5});
   var congressParty6 = {}
   fedCongress.forEach(d => {congressParty6[d.county_name] = d.party6});

   //CONGRESS DISTRICT
   var congressDistrict1 = {}
   fedCongress.forEach(d => {congressDistrict1[d.county_name] = d.dis1});
   var congressDistrict2 = {}
   fedCongress.forEach(d => {congressDistrict2[d.county_name] = d.dis2});
   var congressDistrict3 = {}
   fedCongress.forEach(d => {congressDistrict3[d.county_name] = d.dis3});
   var congressDistrict4 = {}
   fedCongress.forEach(d => {congressDistrict4[d.county_name] = d.dis4});
   var congressDistrict5 = {}
   fedCongress.forEach(d => {congressDistrict5[d.county_name] = d.dis5});
   var congressDistrict6 = {}
   fedCongress.forEach(d => {congressDistrict6[d.county_name] = d.dis6});
     
   //CONGRESS PHONE NUMBERS
   var congressPhone1 = {}
   fedCongress.forEach(d => {congressPhone1[d.county_name] = d.phone1});
   var congressPhone2 = {}
   fedCongress.forEach(d => {congressPhone2[d.county_name] = d.phone2});
   var congressPhone3 = {}
   fedCongress.forEach(d => {congressPhone3[d.county_name] = d.phone3});
   var congressPhone4 = {}  
   fedCongress.forEach(d => {congressPhone4[d.county_name] = d.phone4});
   var congressPhone5 = {}
   fedCongress.forEach(d => {congressPhone5[d.county_name] = d.phone5});
   var congressPhone6 = {}
   fedCongress.forEach(d => {congressPhone6[d.county_name] = d.phone6});
 
     //CONGRESS TERM START
   var congressStart1 = {}
   fedCongress.forEach(d => {congressStart1[d.county_name] = d.start1});
   var congressStart2 = {}
   fedCongress.forEach(d => {congressStart2[d.county_name] = d.start2});
   var congressStart3 = {}
   fedCongress.forEach(d => {congressStart3[d.county_name] = d.start3});
   var congressStart4 = {}  
   fedCongress.forEach(d => {congressStart4[d.county_name] = d.start4});
   var congressStart5 = {}
   fedCongress.forEach(d => {congressStart5[d.county_name] = d.start5});
   var congressStart6 = {}
   fedCongress.forEach(d => {congressStart6[d.county_name] = d.start6});
 
    //CONGRESS NEXT VOTE
   var congressNextVote1 = {}
   fedCongress.forEach(d => {congressNextVote1[d.county_name] = d.end1});
   var congressNextVote2 = {}
   fedCongress.forEach(d => {congressNextVote2[d.county_name] = d.end2});
   var congressNextVote3 = {}
   fedCongress.forEach(d => {congressNextVote3[d.county_name] = d.end3});
   var congressNextVote4 = {}  
   fedCongress.forEach(d => {congressNextVote4[d.county_name] = d.end4});
   var congressNextVote5 = {}
   fedCongress.forEach(d => {congressNextVote5[d.county_name] = d.end5});
   var congressNextVote6 = {}
   fedCongress.forEach(d => {congressNextVote6[d.county_name] = d.end6});
 
// STATE HEADER & STATE INFO
   
  d3.select("body").append("div").attr("class", "state-name").html("NEW YORK STATE")
  d3.select("body").append("div").attr("class", "vote-button").html("VOTE")
  d3.select("body").append("div").attr("class", "run-for-office-button").html("RUN FOR OFFICE")
  d3.select("body").append("div").attr("class", "state-gov-div").append("div").attr("class", "governor-title").html("GOVERNOR OF NEW YORK")
    d3.selectAll(".state-gov-div").append("div").attr("class", "governor-container")
      d3.selectAll(".governor-container").append("div").attr("class", "governor-name").html("Kathy Hochul")
      d3.selectAll(".governor-container").append("div").attr("class", "governor-party").html("Democrat")
      d3.selectAll(".governor-container").append("div").attr("class", "term-title-left").html("TERM START")
      d3.selectAll(".governor-container").append("div").attr("class", "governor-term").html("August 24, 2021")
      d3.selectAll(".governor-container").append("div").attr("class", "term-title-right").html("NEXT VOTE")
      d3.selectAll(".governor-container").append("div").attr("class", "governor-next-vote").html("November 8, 2026")
      d3.selectAll(".governor-container").append("div").attr("class", "governor-term-length").html("<b>Term Length |</b> 4 years, no term limit")
      d3.selectAll(".governor-container").append("div").attr("class", "governor-salary").html("<b> SALARY |</b> $225,000")
  d3.select("body").append("div").attr("class", "state-comp-div").append("div").attr("class", "governor-title").html("COMPTROLLER OF NEW YORK")
    d3.selectAll(".state-comp-div").append("div").attr("class", "comptroller-container")
      d3.selectAll(".comptroller-container").append("div").attr("class", "governor-name").html("Thomas DiNapoli")
      d3.selectAll(".comptroller-container").append("div").attr("class", "governor-party").html("Democrat")
      d3.selectAll(".comptroller-container").append("div").attr("class", "term-title-left").html("TERM START")
      d3.selectAll(".comptroller-container").append("div").attr("class", "governor-term").html("February 7, 2007")
      d3.selectAll(".comptroller-container").append("div").attr("class", "term-title-right").html("NEXT VOTE")
      d3.selectAll(".comptroller-container").append("div").attr("class", "governor-next-vote").html("November 8, 2026")
      d3.selectAll(".comptroller-container").append("div").attr("class", "governor-term-length").html("<b>Term Length |</b> 4 years, no term limit")
      d3.selectAll(".comptroller-container").append("div").attr("class", "governor-salary").html("<b> SALARY |</b> $210,000")
  d3.select("body").append("div").attr("class", "state-atty-div").append("div").attr("class", "governor-title").html("ATTORNEY GENERAL OF NEW YORK")
    d3.selectAll(".state-atty-div").append("div").attr("class", "attorney-container")
      d3.selectAll(".attorney-container").append("div").attr("class", "governor-name").html("Letitia James")
      d3.selectAll(".attorney-container").append("div").attr("class", "governor-party").html("Democrat")
      d3.selectAll(".attorney-container").append("div").attr("class", "term-title-left").html("TERM START")
      d3.selectAll(".attorney-container").append("div").attr("class", "governor-term").html("January 1, 2019")
      d3.selectAll(".attorney-container").append("div").attr("class", "term-title-right").html("NEXT VOTE")
      d3.selectAll(".attorney-container").append("div").attr("class", "governor-next-vote").html("November 8, 2026")
      d3.selectAll(".attorney-container").append("div").attr("class", "governor-term-length").html("<b>Term Length |</b> 4 years, no term limit")
      d3.selectAll(".attorney-container").append("div").attr("class", "governor-salary").html("<b> SALARY |</b> $210,000")
// END CONGRESS VARIABLES AND KEYS
 
  svg.append('g')
    .selectAll('path')
    .data(counties.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('class', 'counties')
 
  //COLOR CHANGE AND TOOL TIP HOVER FUNCTIONALITY
 
    .on('mouseover', function(d) {
   
    tip.style("opacity", 1)
      .html(d.target.__data__.properties.NAME)
      .style("left", (10) + "px")
      .style("top", (180) + "px");
 
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
  // CLICK FUNCTIONALITY
    .on("click", function(d) {

     var bboxSetUp = d3.select(this).each(function(d) { d.bbox = this.getBBox();});
     var bbox = bboxSetUp._groups[0][0].__data__.bbox;
     var bboxX = bbox.x;
     var bboxY = bbox.y;
     var countyName = d.target.__data__.properties.NAME;
     
     
  if (state === 0) {
state = 1;
            k = 3;
            x = bboxX;
            y = bboxY;
            centered = d;
   
     
            d3.select(this).classed("counties", false)  
              .classed("clickedCounty", true)
             // .style("transform", "scale(" + k + ")")
            // .style("transform", "translate( " + (-x + (width/2.2)) + "px" + " , " + (-y + 200) + "px" +  " )")
//.attr("transform", "translate(" + (width / 3.5) + "," + height / 4.5 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            console.log(state);
d3.selectAll(".counties").classed("counties", false).classed("hiddenCounty", true);
d3.selectAll(".tooltip").classed("tooltip", false).classed("hiddenTooltip", true);
d3.selectAll(".hiddenButton").classed("hiddenButton", false).classed("return", true);
// REMOVE NYS INFO
            d3.selectAll(".state-gov-div").remove()
            d3.selectAll(".state-comp-div").remove()
            d3.selectAll(".state-atty-div").remove()
// CONGRESS HEADER
            d3.select("body").append("div").attr("class", "congress-header").html("Congressional Representative")
// CONTAINER FOR CONGRESS          
            d3.select("body").append("div").attr("class", "section-container")
//CONGRESS DATA ENTRY

            d3.selectAll(".section-container").append("div").attr("id", function(){if (congressRep1[d.target.__data__.properties.NAME].length > 0) {return "congress1"} else {return "hidden"}}).attr("class", "item-container")
              d3.selectAll("#congress1").append("div").attr("class", "district").html(congressDistrict1[d.target.__data__.properties.NAME])
              d3.selectAll("#congress1").append("div").attr("class", "term-start").html("Term Began: " + congressStart1[d.target.__data__.properties.NAME])
              d3.selectAll("#congress1").append("div").attr("class", "politician-name").html(congressRep1[d.target.__data__.properties.NAME])
              d3.selectAll("#congress1").append("div").attr("class", function(){if (congressParty1[d.target.__data__.properties.NAME] === "Democrat") {return "democrat"} else {return "republican"}}).html(congressParty1[d.target.__data__.properties.NAME])
              d3.selectAll("#congress1").append("div").attr("class", "phone").html(congressPhone1[d.target.__data__.properties.NAME])
              d3.selectAll("#congress1").append("div").attr("class", "next-vote").html("Next Vote: " + congressNextVote1[d.target.__data__.properties.NAME]);
            d3.selectAll(".section-container").append("div").attr("id", function(){if (congressRep2[d.target.__data__.properties.NAME].length > 0) {return "congress2"} else {return "hidden"}}).attr("class", "item-container")
              d3.selectAll("#congress2").append("div").attr("class", "district").html(congressDistrict2[d.target.__data__.properties.NAME])
              d3.selectAll("#congress2").append("div").attr("class", "term-start").html("Term Began: " + congressStart2[d.target.__data__.properties.NAME])
              d3.selectAll("#congress2").append("div").attr("class", "politician-name").html(congressRep2[d.target.__data__.properties.NAME])
              d3.selectAll("#congress2").append("div").attr("class", function(){if (congressParty2[d.target.__data__.properties.NAME] === "Democrat") {return "democrat"} else {return "republican"}}).html(congressParty2[d.target.__data__.properties.NAME])
              d3.selectAll("#congress2").append("div").attr("class", "phone").html(congressPhone2[d.target.__data__.properties.NAME])
              d3.selectAll("#congress2").append("div").attr("class", "next-vote").html("Next Vote: " + congressNextVote2[d.target.__data__.properties.NAME]);
            d3.selectAll(".section-container").append("div").attr("id", function(){if (congressRep3[d.target.__data__.properties.NAME].length > 0) {return "congress3"} else {return "hidden"}}).attr("class", "item-container")
              d3.selectAll("#congress3").append("div").attr("class", "district").html(congressDistrict3[d.target.__data__.properties.NAME])
              d3.selectAll("#congress3").append("div").attr("class", "term-start").html("Term Began: " + congressStart3[d.target.__data__.properties.NAME])
              d3.selectAll("#congress3").append("div").attr("class", "politician-name").html(congressRep3[d.target.__data__.properties.NAME])
              d3.selectAll("#congress3").append("div").attr("class", "party").html(congressParty3[d.target.__data__.properties.NAME])
              d3.selectAll("#congress3").append("div").attr("class", "phone").html(congressPhone3[d.target.__data__.properties.NAME])
              d3.selectAll("#congress3").append("div").attr("class", "next-vote").html("Next Vote: " + congressNextVote3[d.target.__data__.properties.NAME]);
           d3.selectAll(".section-container").append("div").attr("id", function(){if (congressRep4[d.target.__data__.properties.NAME].length > 0) {return "congress4"} else {return "hidden"}}).attr("class", "item-container")
              d3.selectAll("#congress4").append("div").attr("class", "district").html(congressDistrict4[d.target.__data__.properties.NAME])
              d3.selectAll("#congress4").append("div").attr("class", "term-start").html("Term Began: " + congressStart4[d.target.__data__.properties.NAME])
              d3.selectAll("#congress4").append("div").attr("class", "politician-name").html(congressRep4[d.target.__data__.properties.NAME])
              d3.selectAll("#congress4").append("div").attr("class", "party").html(congressParty4[d.target.__data__.properties.NAME])
              d3.selectAll("#congress4").append("div").attr("class", "phone").html(congressPhone4[d.target.__data__.properties.NAME])
              d3.selectAll("#congress4").append("div").attr("class", "next-vote").html("Next Vote: " + congressNextVote4[d.target.__data__.properties.NAME]);
            d3.selectAll(".section-container").append("div").attr("id", function(){if (congressRep5[d.target.__data__.properties.NAME].length > 0) {return "congress5"} else {return "hidden"}}).attr("class", "item-container")
              d3.selectAll("#congress5").append("div").attr("class", "district").html(congressDistrict5[d.target.__data__.properties.NAME])
              d3.selectAll("#congress5").append("div").attr("class", "term-start").html("Term Began: " + congressStart5[d.target.__data__.properties.NAME])
              d3.selectAll("#congress5").append("div").attr("class", "politician-name").html(congressRep5[d.target.__data__.properties.NAME])
              d3.selectAll("#congress5").append("div").attr("class", "party").html(congressParty5[d.target.__data__.properties.NAME])
              d3.selectAll("#congress5").append("div").attr("class", "phone").html(congressPhone5[d.target.__data__.properties.NAME])
              d3.selectAll("#congress5").append("div").attr("class", "next-vote").html("Next Vote: " + congressNextVote5[d.target.__data__.properties.NAME]);
            d3.selectAll(".section-container").append("div").attr("id", function(){if (congressRep6[d.target.__data__.properties.NAME].length > 0) {return "congress6"} else {return "hidden"}}).attr("class", "item-container")
              d3.selectAll("#congress6").append("div").attr("class", "district").html(congressDistrict6[d.target.__data__.properties.NAME])
              d3.selectAll("#congress6").append("div").attr("class", "term-start").html("Term Began: " + congressStart6[d.target.__data__.properties.NAME])
              d3.selectAll("#congress6").append("div").attr("class", "politician-name").html(congressRep6[d.target.__data__.properties.NAME])
              d3.selectAll("#congress6").append("div").attr("class", "party").html(congressParty6[d.target.__data__.properties.NAME])
              d3.selectAll("#congress6").append("div").attr("class", "phone").html(congressPhone6[d.target.__data__.properties.NAME])
              d3.selectAll("#congress6").append("div").attr("class", "next-vote").html("Next Vote: " + congressNextVote6[d.target.__data__.properties.NAME]);
     
             
       
        // END DATA
   
   
        } else {
         
console.log("UH OH!");
         
}
  });
 
  // RETURN BUTTON
  returnButton.on("click", function(d) {
     
     
if (state === 1) {
state = 0;
d3.select(".return")
d3.selectAll(".hiddenCounty").classed("hiddenCounty", false).classed("counties", true);
d3.selectAll(".clickedCounty").classed("clickedCounty", false).classed("counties", true)

d3.selectAll(".hiddenTooltip").classed("hiddenTooltip", false).classed("tooltip", true);
d3.selectAll(".return").classed("return", false).classed("hiddenButton", true);
            d3.selectAll(".section-container").remove()
            d3.selectAll(".congress-header").remove();
// ADD NYS INFO BACK IN
            d3.select("body").append("div").attr("class", "state-gov-div").append("div").attr("class", "governor-title").html("GOVERNOR OF NEW YORK")
    d3.selectAll(".state-gov-div").append("div").attr("class", "governor-container")
      d3.selectAll(".governor-container").append("div").attr("class", "governor-name").html("Kathy Hochul")
      d3.selectAll(".governor-container").append("div").attr("class", "governor-party").html("Democrat")
      d3.selectAll(".governor-container").append("div").attr("class", "term-title-left").html("TERM START")
      d3.selectAll(".governor-container").append("div").attr("class", "governor-term").html("August 24, 2021")
      d3.selectAll(".governor-container").append("div").attr("class", "term-title-right").html("NEXT VOTE")
      d3.selectAll(".governor-container").append("div").attr("class", "governor-next-vote").html("November 8, 2026")
      d3.selectAll(".governor-container").append("div").attr("class", "governor-term-length").html("<b>Term Length |</b> 4 years, no term limit")
      d3.selectAll(".governor-container").append("div").attr("class", "governor-salary").html("<b> SALARY |</b> $225,000")
  d3.select("body").append("div").attr("class", "state-comp-div").append("div").attr("class", "governor-title").html("COMPTROLLER OF NEW YORK")
    d3.selectAll(".state-comp-div").append("div").attr("class", "comptroller-container")
      d3.selectAll(".comptroller-container").append("div").attr("class", "governor-name").html("Thomas DiNapoli")
      d3.selectAll(".comptroller-container").append("div").attr("class", "governor-party").html("Democrat")
      d3.selectAll(".comptroller-container").append("div").attr("class", "term-title-left").html("TERM START")
      d3.selectAll(".comptroller-container").append("div").attr("class", "governor-term").html("February 7, 2007")
      d3.selectAll(".comptroller-container").append("div").attr("class", "term-title-right").html("NEXT VOTE")
      d3.selectAll(".comptroller-container").append("div").attr("class", "governor-next-vote").html("November 8, 2026")
      d3.selectAll(".comptroller-container").append("div").attr("class", "governor-term-length").html("<b>Term Length |</b> 4 years, no term limit")
      d3.selectAll(".comptroller-container").append("div").attr("class", "governor-salary").html("<b> SALARY |</b> $210,000")
  d3.select("body").append("div").attr("class", "state-atty-div").append("div").attr("class", "governor-title").html("ATTORNEY GENERAL OF NEW YORK")
    d3.selectAll(".state-atty-div").append("div").attr("class", "attorney-container")
      d3.selectAll(".attorney-container").append("div").attr("class", "governor-name").html("Letitia James")
      d3.selectAll(".attorney-container").append("div").attr("class", "governor-party").html("Democrat")
      d3.selectAll(".attorney-container").append("div").attr("class", "term-title-left").html("TERM START")
      d3.selectAll(".attorney-container").append("div").attr("class", "governor-term").html("January 1, 2019")
      d3.selectAll(".attorney-container").append("div").attr("class", "term-title-right").html("NEXT VOTE")
      d3.selectAll(".attorney-container").append("div").attr("class", "governor-next-vote").html("November 8, 2026")
      d3.selectAll(".attorney-container").append("div").attr("class", "governor-term-length").html("<b>Term Length |</b> 4 years, no term limit")
      d3.selectAll(".attorney-container").append("div").attr("class", "governor-salary").html("<b> SALARY |</b> $210,000")
} else {}
});
 
 
});
 

// END OF MAP FUNCTION


function calculateScaleCenter(counties) {
var bbox_path = path.bounds(counties),
scale = 0.95 / Math.max(
(bbox_path[1][0] - bbox_path[0][0]) / width, (bbox_path[1][1] - bbox_path[0][1]) / height);
var bbox_feature = d3.geoBounds(counties),
center = [
(bbox_feature[1][0] + bbox_feature[0][0]) / 2, (bbox_feature[1][1] + bbox_feature[0][1]) / 2
];
return {
'scale': scale,
'center': center
};
}
