
var map;

document.addEventListener("DOMContentLoaded",function(){

    
    L.mapfit.drawmap('mapfit', 'day', 'cardsOff', 'zoomPanOn', 'extNavOff', '591dccc4e499ca0001a4c6a41a2ed1be54804856508265221862231b');   

    var btn = document.getElementById('goBtn'); 
    var wlkBtn = document.getElementById('walking-btn');
    var driveBtn = document.getElementById('driving-btn');  
    
    
    btn.addEventListener('click',function(){
        if(!firstTime){
            
            L.mapfit.deleteMarkers(pointsToDelete, 'mapfit')
            delRoutes();
            pointsToDelete = [];
            getStartCoords();
            getCoords();
            
        }
        firstTime = false;
        getCoords()
    })

    wlkBtn.addEventListener('click',function(){
        method = "walking"
        mapmethod= "all-pedestrian"
        googleMethod = "WALKING"
        wlkBtn.classList.add("active");
        driveBtn.classList.remove("active");
    })

    driveBtn.addEventListener('click',function(){
        method = "driving"
        mapmethod = "driving"
        googleMethod = "DRIVING"
        wlkBtn.classList.remove("active");
        driveBtn.classList.add("active");
    })

    getStartCoords();
})


    var googleGeoCoder = new google.maps.Geocoder();
    var googleDirectionsService = new google.maps.DirectionsService;
    var walking;
    var cycling;
    var driving;
    var google;
    var mapbox;
    var mapboxCoordinates = []
    var pointsToDelete = [];
    var mapfitTotalCoords = [];
    var firstTime = true;
    var apiurl = "https://api.mapfit.com/v1";
    var method = "walking";
    var mapMethod = "all-pedestrian"
    var googleMethod = "WALKING"
    var mapfitAPIKey = '591dccc4e499ca0001a4c6a41a2ed1be54804856508265221862231b'
    var url = apiurl + "/geocode?api_key=" + mapfitAPIKey; 
    
    var mapfitPoint = function(str) {
                    return        [{
                                    "id": "mapfit",
                                    "location" : str,
                                        "cardData": {
                                        "title": "Mapfit",
                                        "subTitle1": "119 W 24th St",
                                        "subTitle2": "Mappers"
                                        },
                                        "markerUrl": "arts"
                                    }]
                    }


    function delRoutes(){
        
        mapboxCoordinates = [];
        mapfitTotalCoords = [];
        map.eachLayer(function (layer) {

            if (layer.options.className){
                map.removeLayer(layer);
            }
           
        });
    }
    var getStartMapCoords = function(str){
        
                var address = document.getElementsByTagName("input")[0].value;
                var mapboxGeocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoiZWFlemVrd2VtIiwiYSI6ImNqY2F5d3NuZzBrNmwyd21vZzFpenFxdjYifQ.HhroJvXwf3fLRMtrHBG_cQ`
        
                $.ajax({
                    method: 'GET',
                    url: mapboxGeocodeUrl
                }).done(function(data){
                    let tmCords = [data.features[0].geometry.coordinates[1],data.features[0].geometry.coordinates[0]]
                    mapboxCoordinates.push(tmCords);
                    setupPoints(str, [data.features[0].geometry.coordinates[1],data.features[0].geometry.coordinates[0]].join(","));
                })
        
            }

    
    var getStartCoords = function(){
        
        
        var inputVal = document.getElementsByTagName("input")[0].value;
        postJSON([{address: document.getElementsByTagName("input")[0].value}]);
        

        googleGeoCoder.geocode({'address': inputVal}, function(results,status){
            if(status === 'OK'){
                getStartMapCoords([results[0].geometry.location.lat(),results[0].geometry.location.lng()].join(","))
            }else{
                alert('Invalid Address Parameters')
            }

        })

        

    } 
    
    var getCoords =  function(){

        var inputVal = document.getElementsByTagName("input")[1].value;
        postJSON([{address: document.getElementsByTagName("input")[1].value}],true);
        
        
        
        googleGeoCoder.geocode({'address': inputVal}, function(results,status){
            if(status === 'OK'){
                let locStr = [results[0].geometry.location.lat(),results[0].geometry.location.lng()].join(",");
                let loc = [results[0].geometry.location.lat(),results[0].geometry.location.lng()]
                getMapCoords(locStr);
            }else{
                alert('Invalid Address Parameters')
            }

        })

        googleDirectionsService.route({
            origin: document.getElementsByTagName("input")[0].value,
            destination: document.getElementsByTagName("input")[1].value,
            travelMode: `${googleMethod}`
        }, function(response,status){
            if(status === 'OK'){
                let polys = [];
                let googlePoly = response.routes[0].overview_path
                googlePoly.forEach((el)=>{polys.push([el.lat(),el.lng()])})
                drawRoute(polys,0,"google")
            }else{
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    

    var getMapCoords = function(str){
        var address = document.getElementsByTagName("input")[1].value;
        var mapboxGeocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoiZWFlemVrd2VtIiwiYSI6ImNqY2F5d3NuZzBrNmwyd21vZzFpenFxdjYifQ.HhroJvXwf3fLRMtrHBG_cQ`

        $.ajax({
            method: 'GET',
            url: mapboxGeocodeUrl
        }).done(function(data){
            let loc = [data.features[0].geometry.coordinates[1],data.features[0].geometry.coordinates[0]]
            setupPoints(str, [data.features[0].geometry.coordinates[1],data.features[0].geometry.coordinates[0]].join(","),true)
            mapboxCoordinates.push(loc)
            getMapBoxRoute();
            
        })

        

    }

    var getMapBoxRoute = function(){
        start = mapboxCoordinates[0];
        end = mapboxCoordinates[1];
        mapboxToken = 'pk.eyJ1IjoiZWFlemVrd2VtIiwiYSI6ImNqY2F5d3NuZzBrNmwyd21vZzFpenFxdjYifQ.HhroJvXwf3fLRMtrHBG_cQ';

        var directionsRequest = `https://api.mapbox.com/directions/v5/mapbox/${method}/` + start[1] + ',' + start[0] + ';' + end[1] + ',' + end[0] + '?geometries=geojson&access_token=' + mapboxToken;

        $.ajax({
            method: 'GET',
            url: directionsRequest,
          }).done(function(data) {
            var route = data.routes[0].geometry;
            var newRoute = [];
            console.log(data);
            route.coordinates.forEach((el) =>{ newRoute.push( [ el[1],el[0] ] ) })
           // console.log("new route: ", newRoute)
            drawRoute(newRoute,0,"mapbox")
          })
    }


    var setupPoints = function(str,str2,routing = false){

        if(routing){
            mapfitCoords =  mapfitCoords= document.getElementsByTagName("input")[1].value
        }else{
            mapfitCoords =  mapfitCoords= document.getElementsByTagName("input")[0].value
        }
        googleCords = str;
        mapBoxCords = str2;
    
                
                        var myPoints = [
                            {
                            "id": "mapfit",
                            "location" : `${mapfitCoords}`,
                                "cardData": {
                                "title": "Mapfit",
                                "subTitle1": "119 W 24th St",
                                "subTitle2": "Mappers"
                                },
                                "markerUrl": "arts"
                            } ,
                            {
                                "id": "google",
                                "location" : `${googleCords}`,
                                "cardData": {
                                    "title": "Google",
                                    "subTitle1": "119 W 24th St",
                                    "subTitle2": "Googl"
                                },
                                "markerUrl": "education"
                            } ,
                            {
                                "id": "mapbox",
                                "location" : `${mapBoxCords}`,
                                "cardData": {
                                    "title": "MapBox",
                                    "subTitle1": "119 W 24th St",
                                    "subTitle2": "MapBox"
                                },
                                "markerUrl": "finance"
                            } 
                        ]

                        for (let point of myPoints){
                            pointsToDelete.push(point)
                        }
                        console.log(myPoints);
                        L.mapfit.addMarkers(myPoints, 'mapfit','day');
                    
                    }

    function readDirections(response, directionsReq) {
    
    
        var routes = response.trip;
        var duration = routes.summary.time;
        var distance = routes.summary.length;
    
        // console.log('duration: ', duration)
    
        // get location points for route
        var locationArray = [];
        var geometryArray = [];
        var steps = routes.legs[0];
    
        // format start and stop coordinates
        var startLoc = [routes.locations[0].lon, routes.locations[0].lat];
        var endLoc = [routes.locations[1].lon, routes.locations[1].lat];
    
        // add first location
        locationArray.push(startLoc);
    
        // multiple polylines
        var polylineArray = [];
    
        var thisPoly = decodePolyline(steps.shape, 6);
    
        thisPoly.unshift([startLoc[1], startLoc[0]]);
        thisPoly.push([endLoc[1], endLoc[0]]);
        drawRoute(thisPoly, 0, directionsReq.type);
    
        var summary = routes.summary;
        var maxLat = summary.max_lat + 0.005;
        var maxLon = summary.max_lon + 0.005;
        var minLat = summary.min_lat - 0.020;
        var minLon = summary.min_lon - 0.005;
    
    
        directionsAdjust = true;
        
        map.fitBounds([[endLoc[1], endLoc[0]], [startLoc[1], startLoc[0]]], { padding: [50, 40] }); 
        
        var ourRoute = polylineArray;
    }

    function drawRoute(locationArray, count, type) {
        var polylineOut = true;
        var polyStartNum = 0;
        var polyEndNum = locationArray.length;
    
        if (type == "walking") {
            walking = L.polyline(locationArray, {
                color: '#cc6633',
                weight: 5,
                className: "fake",

            });
            map.addLayer(walking)
        } else if (type == "cycling") {
            cycling = L.polyline(locationArray, {
                color: '#009eff',
                weight: 5,
                className: "fake"
            });
            map.addLayer(cycling)
        } else if(type == "google"){
            google = L.polyline(locationArray,{
                color: '#3B444B',
                weight: 5,
                className: "fake"

            })
            map.addLayer(google);
        } else if(type == "mapbox") {
            mapbox = L.polyline(locationArray,{
                color: '#228b22',
                weight: 5,
                className: "fake"
            })

            map.addLayer(mapbox)
        } else {
            driving = L.polyline(locationArray, {
                color: '#009eff',
                weight: 5,
                className: "fake"
            });
            map.addLayer(driving);
        }

    }

  

    function decodePolyline(str, precision) {
        var index = 0,
            lat = 0,
            lng = 0,
            coordinates = [],
            shift = 0,
            result = 0,
            byte = null,
            latitude_change,
            longitude_change,
            factor = Math.pow(10, precision || 5);
    
        // Coordinates have variable length when encoded, so just keep
        // track of whether we've hit the end of the string. In each
        // loop iteration, a single coordinate is decoded.
        while (index < str.length) {
    
            // Reset shift, result, and byte
            byte = null;
            shift = 0;
            result = 0;
    
            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
    
            latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
    
            shift = result = 0;
    
            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
    
            longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
    
            lat += latitude_change;
            lng += longitude_change;
    
            var theseCoords = [];
            theseCoords.push(lat / factor);
            theseCoords.push(lng / factor);
    
            coordinates.push(theseCoords);
        }
    
        return coordinates;
    };
    

    function getDirections(lat , lon , mapfit=false){
         var bodyObj; //{'source-address':{"address": document.getElementsByTagName('input')[0].value, "type": "all-pedestrian"}, 'destination-address':{"lat": lat, "lon":lon}};

        // if (mapfit) {
        //     bodyObj = {'source-address':{"address": document.getElementsByTagName('input')[0].value}, 'destination-address':{"address": document.getElementsByTagName('input')[1].value, "type": `${method}`}, type:`${method}`} 
//} 

        bodyObj = {'source-address':{ address: document.getElementsByTagName('input')[0].value, "lat":mapfitTotalCoords[0][0], "lon": mapfitTotalCoords[0][1], "type": 'all-pedestrian' }, 'destination-address':{ address: document.getElementsByTagName('input')[1].value, "lat":mapfitTotalCoords[1][0], "lon": mapfitTotalCoords[1][1], "type": 'all-pedestrian'  },"type": method }
    
        var dicString = JSON.stringify(bodyObj);
        
        
        xhttp = new XMLHttpRequest();
        xhttp.open('POST', apiurl + "/directions?api_key=" + L.Mapfit.apiKey, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.send(dicString);

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
              var response = JSON.parse(xhttp.responseText);
              if(mapfit){
                //console.log("directions",response);
                let str = [response.destinationLocation[1],response.destinationLocation[0]].join(",")
                let str2 = [response.sourceLocation[1],response.sourceLocation[0]].join(",")
                let delPoints = pointsToDelete.splice(0,1).concat(pointsToDelete.splice(2,1));
                let points = mapfitPoint(str).concat(mapfitPoint(str2));
                addFinalMarkers(points,delPoints)
                //console.log("delPoints", delPoints);
               
              }
              readDirections(response, bodyObj)
            } else if (xhttp.readyState == 4 && xhttp.status == 500) {
            }
        };

        
    }

    function postJSON(dataArray,routing=false) {
        let xhttp = new XMLHttpRequest();
    
        xhttp.onreadystatechange = function () {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
            //console.log('postResponse=', xhttp.responseText)
            var response = JSON.parse(xhttp.responseText);
            // console.log(response[0].entrances)

            mapfitTotalCoords.push([response[0].entrances[0].lat,response[0].entrances[0].lon])

            //console.log(mapfitTotalCoords);

            if(routing){
                getDirections(0,0,true)                
            }


          } else if (xhttp.readyState == 4 && xhttp.status == 500) {
            //console.log("ERROR:", xhttp.status);
          }
        };
    
        xhttp.open('POST', this.url, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.send(JSON.stringify(dataArray));
    }

    function addFinalMarkers(str,str2){
        console.log("things being deleted", str2)
        L.mapfit.deleteMarkers(str2, 'mapfit')
        L.mapfit.addMarkers(str,'mapfit','day');
        pointsToDelete.push(str);
    }

    
   

                                  
                    
