var trailUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"; //the url for the API (more is added to it later)

var keyword = "";
var type = "cafe";
var radius = 1000;
var lat = 0; // where the users latitude is stored
var lon = 0; // where the users longitude is placed
var map; // where the map is stored
var apiKey = "AIzaSyCgmfpD8nRLaU_ZWlOXh1ClSBeLhoI9Eck";

//https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyCgmfpD8nRLaU_ZWlOXh1ClSBeLhoI9Eck

//this method starts the google maps
function initMap(){
    console.log("Entered Maps");
    //if the user agrees to have their location known
    if (navigator.geolocation) {

                //get the users location (latitude and longitude)
                navigator.geolocation.getCurrentPosition(function showPosition(position){
                    var uluru = {lat: position.coords.latitude, lng: position.coords.longitude}; //users location
                    var infowindow = new google.maps.InfoWindow(); //information window for the markers on the map
                    map = new google.maps.Map(document.getElementById('map'), { // make a new make with the users location being the center and zoom it in at 7 (amount the map is zoomed in at the start)
                      zoom: 7,
                      center: uluru
                    });
                    var marker = new google.maps.Marker({ //make and place the marker for the user using their location
                      position: uluru,
                      map: map
                    });
                    google.maps.event.addListener(marker, 'mouseover', function() { // if the user hovers over a marker then the information window will open to show info about the users marker
                      infowindow.setContent('<div><strong> YOU ARE HERE </strong></div>');
                      infowindow.open(map, this);
                    });
                    google.maps.event.addListener(marker, 'mouseout', function() { // if the user stops hovering over the marker then the info window on the marker will close
                      infowindow.close(map, this);
                    });
                }, showError);
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
}


//this medthod is where the site first starts off
function initSite() {
    //if the user agrees to have thier location known
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function showPosition(position){ // find the location of the user
            lat = position.coords.latitude; // get the lat
            lon = position.coords.longitude; // get the lon
            sendApiRequest(trailUrl + "location="+lat+","+lon+"&radius="+radius+"&type="+type+"&keyword="+keyword // send a request to the Trails API and obtain the data. then read it
                +"&key="+apiKey);
        }, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

//https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyCgmfpD8nRLaU_ZWlOXh1ClSBeLhoI9Eck


function sendApiRequest(url) {
  initMap();
  var map;

function initMap() {
  // Create the map.
  var pyrmont = {lat: lat, lng: lon};
  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 9
  });

  // Create the places service.
  var service = new google.maps.places.PlacesService(map);

  // Perform a nearby search.
  service.nearbySearch(
      {location: pyrmont, radius: 10000, type: ['store']},
      function(results, status, pagination) {
        if (status !== 'OK') return;

        createMarkers(results);
      });
}

function createMarkers(places) {
  var bounds = new google.maps.LatLngBounds();
  var placesList = document.getElementById('places');

  for (var i = 0, place; place = places[i]; i++) {

    var marker = new google.maps.Marker({
      map: map,
      title: place.name,
      position: place.geometry.location
    });

    bounds.extend(place.geometry.location);
  }
  map.fitBounds(bounds);
}
}



 //if any errors happen while finding the users location then come here
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}

















var n = 4, // The number of series.
    m = 19; // The number of values per series.

var xz = d3.range(m),
    yz = d3.range(n).map(function() { return bumps(m); }),
    y01z = d3.stack().keys(d3.range(n))(d3.transpose(yz)),
    yMax = d3.max(yz, function(y) { return d3.max(y); }),
    y1Max = d3.max(y01z, function(y) { return d3.max(y, function(d) { return d[1]; }); });

var svg = d3.select("svg"),
    margin = {top: 40, right: 10, bottom: 20, left: 10},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
    .domain(xz)
    .rangeRound([0, width])
    .padding(0.08);

var y = d3.scaleLinear()
    .domain([0, y1Max])
    .range([height, 0]);

var color = d3.scaleOrdinal()
    .domain(d3.range(n))
    .range(d3.schemeCategory20c);

var series = g.selectAll(".series")
  .data(y01z)
  .enter().append("g")
    .attr("fill", function(d, i) { return color(i); });

var rect = series.selectAll("rect")
  .data(function(d) { return d; })
  .enter().append("rect")
    .attr("x", function(d, i) { return x(i); })
    .attr("y", height)
    .attr("width", x.bandwidth())
    .attr("height", 0);

rect.transition()
    .delay(function(d, i) { return i * 10; })
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); });

g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
        .tickSize(0)
        .tickPadding(6));

d3.selectAll("input")
    .on("change", changed);

var timeout = d3.timeout(function() {
  d3.select("input[value=\"grouped\"]")
      .property("checked", true)
      .dispatch("change");
}, 2000);

function changed() {
  timeout.stop();
  if (this.value === "grouped") transitionGrouped();
  else transitionStacked();
}

function transitionGrouped() {
  y.domain([0, yMax]);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d, i) { return x(i) + x.bandwidth() / n * this.parentNode.__data__.key; })
      .attr("width", x.bandwidth() / n)
    .transition()
      .attr("y", function(d) { return y(d[1] - d[0]); })
      .attr("height", function(d) { return y(0) - y(d[1] - d[0]); });
}

function transitionStacked() {
  y.domain([0, y1Max]);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
    .transition()
      .attr("x", function(d, i) { return x(i); })
      .attr("width", x.bandwidth());
}

function bumps(m) {
  var values = [], i, j, w, x, y, z;

  // Initialize with uniform random values in [0.1, 0.2).
  var current = 0.1;
  for (i = 0; i < m; ++i) {
    values[i] = 0.1 + current;
    current += current * 0.3;
  }

  // Add five random bumps.
for (j = 0; j < 5; ++j) {
  x = 1 / (0.1 + Math.random());
  y = 2 * Math.random();
  z = 10 / (0.1 + Math.random());
  for (i = 0; i < m; i++) {
    w = (i / m - y) * z;
    values[i] += x * Math.exp(-w * w);
  }
}


  // Ensure all values are positive.
  for (i = 0; i < m; ++i) {
    values[i] = Math.max(0, values[i]);
  }

  return values;
}
