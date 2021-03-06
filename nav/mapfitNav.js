var map;
var randomRoutes = {
    1 : {
        source: "315 7th ave, New York, NY",
        des:"476 5th ave, New York, NY"
    },

    2 : {
        source: "660 Madison Ave, New York, NY",
        des:"9 w 57th st, New York, NY"
    },

    3: {
        source: "202 waverly pl, New York, NY",
        des:"476 5th ave, New York, NY"
    }
}

var mapfitCheckBox = document.getElementById('mfcb')
var googleCheckBox = document.getElementById('gcb')
var mapboxCheckBox = document.getElementById('mpcb')
var hereCheckBox = document.getElementById('hcb');

document.addEventListener("DOMContentLoaded",function(){

    
    L.mapfit.drawmap('mapfit', 'day', 'cardsOff', 'zoomPanOn', 'extNavOff', '591dccc4e499ca0001a4c6a41a2ed1be54804856508265221862231b');   

    var btn = document.getElementById('goBtn'); 
    var wlkBtn = document.getElementById('walking-btn');
    var driveBtn = document.getElementById('driving-btn');  
    var rando = document.getElementById('rando');
    var backBtn = document.getElementsByClassName('back-btn')[0];
    var startBx = document.getElementsByTagName('input')[0]
    var endBx = document.getElementsByTagName('input')[1]

    startBx.addEventListener('keyup',function(){
        if(this.value == ""){
            btn.disabled = true;
            btn.classList.add("inactive")
        }else if(this.value !== "" && endBx.value !== ""){
            btn.disabled = false
            btn.classList.remove("inactive")
        }
    })

    endBx.addEventListener('keyup',function(){
        if(this.value == ""){
            btn.disabled = true;
            btn.classList.add("inactive")
        }else if(this.value !=="" && startBx.value !== ""){
            btn.disabled = false
            btn.classList.remove("inactive")
        }
    })

    mapfitCheckBox.addEventListener('change',function(){
        if(this.checked){
            document.getElementsByClassName('mapfit')[0].style.visibility = "visible"
            document.getElementsByClassName('mapfit-route')[0].classList.remove('route-inactive')
        }else if(!this.checked){
            document.getElementsByClassName('mapfit')[0].style.visibility = "hidden" 
            document.getElementsByClassName('mapfit-route')[0].classList.add('route-inactive')

        }
    })

    googleCheckBox.addEventListener('change',function(){
        if(this.checked){
            document.getElementsByClassName('google')[0].style.visibility = "visible"
            document.getElementsByClassName('google-route')[0].classList.remove('route-inactive')
        }else if(!this.checked){
            document.getElementsByClassName('google')[0].style.visibility = "hidden" 
            document.getElementsByClassName('google-route')[0].classList.add('route-inactive')
        }
    })

    mapboxCheckBox.addEventListener('change',function(){
        if(this.checked){
            document.getElementsByClassName('mapbox')[0].style.visibility = "visible"
            document.getElementsByClassName('mapbox-route')[0].classList.remove('route-inactive')
        }else if(!this.checked){
            document.getElementsByClassName('mapbox')[0].style.visibility = "hidden" 
            document.getElementsByClassName('mapbox-route')[0].classList.add('route-inactive')
        }
    })

    hereCheckBox.addEventListener('change',function(){
        if(this.checked){
            document.getElementsByClassName('here')[0].style.visibility = "visible"
            document.getElementsByClassName('here-route')[0].classList.remove('route-inactive')
        }else if(!this.checked){
            document.getElementsByClassName('here')[0].style.visibility = "hidden" 
            document.getElementsByClassName('here-route')[0].classList.add('route-inactive')
        }
    })

    backBtn.addEventListener('click',function(){
        document.getElementsByClassName('nav-form')[0].style.display = "block";
        document.getElementsByClassName('route-nav')[0].style.display = "none";
    })

    rando.addEventListener('click',function(){

        let num = Math.floor(Math.random() * 3) + 1 
        let route = randomRoutes[num];
        document.getElementsByTagName("input")[0].value = route.source;
        document.getElementsByTagName("input")[1].value = route.des;
        btn.disabled = false
        btn.classList.remove("inactive")

        firstTime = false;
    })
    
    
    btn.addEventListener('click',function(){
        if(startBx.value == "" || endBx.value == ""){
            this.disabled = true;
            this.classList.add("inactive");
            return;
        }
        if(!firstTime){
            
            L.mapfit.deleteMarkers(pointsToDelete, 'mapfit')
            delRoutes();
            pointsToDelete = [];
            getStartCoords().then(getCoords);
            
        }else{
            getCoords();
        }
        firstTime = false;
        document.getElementsByClassName('nav-form')[0].style.display = "none";
        document.getElementsByClassName('route-nav')[0].style.display = "block";
    })

    wlkBtn.addEventListener('click',function(){
        method = "walking"
        mapmethod= "all-pedestrian"
        googleMethod = "WALKING"
        hereMethod = "pedestrian"
        wlkBtn.classList.add("active");
        driveBtn.classList.remove("active");
    })

    driveBtn.addEventListener('click',function(){
        method = "driving"
        mapmethod = "driving"
        googleMethod = "DRIVING"
        hereMethod = "car"
        wlkBtn.classList.remove("active");
        driveBtn.classList.add("active");
    })

    getStartCoords();
})


    var hereID = 'dKN6K4miY51wl2mzcRST'
    var hereCode = 'rudeZwqchlqfNIcqGGfN1w'
    var platform = new H.service.Platform({'app_id': hereID, 'app_code': hereCode });
    var googleGeoCoder = new google.maps.Geocoder();
    var googleDirectionsService = new google.maps.DirectionsService;
    var walking;
    var cycling;
    var driving;
    var google;
    var mapbox;
    var here;
    var mapboxCoordinates = []
    var pointsToDelete = [];
    var mapfitTotalCoords = [];
    var firstTime = true;
    var apiurl = "https://api.mapfit.com/v1";
    var method = "walking";
    var mapMethod = "all-pedestrian"
    var googleMethod = "WALKING"
    var hereMethod = "pedestrian"
    var mapfitAPIKey = '591dccc4e499ca0001a4c6a41a2ed1be54804856508265221862231b'
    var url = apiurl + "/geocode?api_key=" + mapfitAPIKey; 
    var hereGeocoder = platform.getGeocodingService();
    var hereRouter = platform.getRoutingService();
    var hereCoords = [];
    var polygons = [];
    
    
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
        hereCoords = []
        map.eachLayer(function (layer) {

            if (layer.options.className){
                map.removeLayer(layer);
            }
           
        });
    }

    function setHere(result){
        
            var locations = result.Response.View[0].Result;
            for (i = 0;  i < locations.length; i++) {
                position = {
                  lat: locations[i].Location.DisplayPosition.Latitude,
                  lng: locations[i].Location.DisplayPosition.Longitude
                };
    
                posA = [locations[i].Location.DisplayPosition.Latitude, locations[i].Location.DisplayPosition.Longitude]
                hereCoords.push(posA);
                if(i == 0){
                    setupPoints({company:"here"},posA.join(","))
                }
                
            }    
            
    }

    function setHere2(result){
        
        var locations = result.Response.View[0].Result;
        for (i = 0;  i < locations.length; i++) {
            position = {
              lat: locations[i].Location.DisplayPosition.Latitude,
              lng: locations[i].Location.DisplayPosition.Longitude
            };

            posA = [locations[i].Location.DisplayPosition.Latitude, locations[i].Location.DisplayPosition.Longitude]
            hereCoords.push(posA);
            if(i == 0){
                setupPoints({company:"here"},posA.join(","))
            }
        }
        finalHereCoords()  
}

    function setHereFinal(result){
        var locations = result.Response.View[0].Result;
        for (i = 0;  i < locations.length; i++) {
            position = {
              lat: locations[i].Location.DisplayPosition.Latitude,
              lng: locations[i].Location.DisplayPosition.Longitude
            };

            posA = [locations[i].Location.DisplayPosition.Latitude, locations[i].Location.DisplayPosition.Longitude]
            hereCoords.push(posA);
            if(i == 0){
                setupPoints({company:"here"},posA.join(","))
            }

        }

        //console.log("final Here coordinates", hereCoords)
        getFinalHere();
    

    }

    function setRoute(result){
        var route;
        var summary = result.response.route[0].leg[0].maneuver
        var length = 0
        var time  = 0

        summary.forEach(function(element){
            length += element.length
            time += element.travelTime
        })




        //console.log(result);
        if(result.response.route) {
            // Pick the first route from the response:
            let loc = [];
            route = result.response.route[0];
            // Pick the route's shape:
            routeShape = route.shape;

            routeShape.forEach(function(element){
                loc.push(element.split(","))
            })

            drawRoute(loc,0,"here");
             document.getElementById('here-route-info').innerHTML = milesConversion(length,"here") + ", " + secondsToHms(time) + " " + method;
             hereCheckBox.checked = true;
             document.getElementsByClassName('here-route')[0].classList.remove('route-inactive')
        } 

        
        //console.log("bing here" , result);
    }

    
    
    var getStartCoords = function(){
    
        var inputVal = document.getElementsByTagName("input")[0].value; 
        var geocodingParams = {searchText: inputVal};
        if(firstTime){
            hereGeocoder.geocode(geocodingParams, setHere, function(e){})
        }else{
            hereGeocoder.geocode(geocodingParams, setHere2, function(e){})
        }

       
          
          
    return new Promise(function(resolve,reject){
            googleGeoCoder.geocode({'address': inputVal}, function(results,status){
                if(status === 'OK'){
                    let str = [results[0].geometry.location.lat(),results[0].geometry.location.lng()].join(",");
                    setupPoints({company:"google"},str)
                }else{
                    alert('Invalid Address Parameters')
                }
            })
            getStartMapCoords().then(postJSON([{address:inputVal}])).then(function(){resolve()})
        })  
        
    } 


    var getStartMapCoords = function(){
                var address = document.getElementsByTagName("input")[0].value;
                var mapboxGeocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoiZWFlemVrd2VtIiwiYSI6ImNqY2F5d3NuZzBrNmwyd21vZzFpenFxdjYifQ.HhroJvXwf3fLRMtrHBG_cQ`
        
        return new Promise(function(resolve,reject){
                $.ajax({
                    method: 'GET',
                    url: mapboxGeocodeUrl
                }).done(function(data){
                    let tmCords = [data.features[0].geometry.coordinates[1],data.features[0].geometry.coordinates[0]]
                    mapboxCoordinates.push(tmCords);
                    //console.log("first coordinates", tmCords);
                    setupPoints({company:"mapbox"}, tmCords.join(","));
                    resolve();
                })
            })
        
        }
    
   
        
    var finalHereCoords = function(){
        var inputVal = document.getElementsByTagName("input")[1].value;
        var geocodingParams = {searchText: inputVal}
        hereGeocoder.geocode(geocodingParams, setHereFinal, function(e){})
    }
    
    var getCoords =  function(){

        var inputVal = document.getElementsByTagName("input")[1].value;
        postJSON([{address: document.getElementsByTagName("input")[1].value}],true);
        var geocodingParams = {searchText: inputVal}
        
        if (firstTime){
            hereGeocoder.geocode(geocodingParams, setHereFinal, function(e){})
        }
        
       
        
        googleGeoCoder.geocode({'address': inputVal}, function(results,status){
            if(status === 'OK'){
                let locStr = [results[0].geometry.location.lat(),results[0].geometry.location.lng()].join(",");
                let loc = [results[0].geometry.location.lat(),results[0].geometry.location.lng()]
                setupPoints({company:"google"},locStr)
                getMapCoords();
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
                var duration = response.routes[0].legs[0].duration.text
                var distance = response.routes[0].legs[0].distance.text
                drawRoute(polys,0,"google")
                document.getElementById('google-route-info').innerHTML = distance + ", " + duration + " " + method;
                googleCheckBox.checked = true;
                document.getElementsByClassName('google-route')[0].classList.remove('route-inactive')
            }else{
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    var getFinalHere = function (){
        var inputVal = document.getElementsByTagName("input")[1].value;
        var routingParameters = {
            // The routing mode:
            'mode': `fastest;${hereMethod}`,
            // The start point of the route:
            'waypoint0': `geo!${hereCoords[0][0]},${hereCoords[0][1]}`,
            // The end point of the route:
            'waypoint1':  `geo!${hereCoords[1][0]},${hereCoords[1][1]}`,
            // To retrieve the shape of the route we choose the route
            // representation mode 'display'
            'representation': 'display'
        };
        //console.log(routingParameters)
        hereRouter.calculateRoute(routingParameters, setRoute,function(error) {alert(error.message);});
        

    }
    

    

    var getMapCoords = function(){
        var address = document.getElementsByTagName("input")[1].value;
        var mapboxGeocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoiZWFlemVrd2VtIiwiYSI6ImNqY2F5d3NuZzBrNmwyd21vZzFpenFxdjYifQ.HhroJvXwf3fLRMtrHBG_cQ`

        $.ajax({
            method: 'GET',
            url: mapboxGeocodeUrl
        }).done(function(data){
            let loc = [data.features[0].geometry.coordinates[1],data.features[0].geometry.coordinates[0]]
            let locStr = loc.join(",");
            setupPoints({company: "mapbox" }, locStr,true)
            mapboxCoordinates.push(loc)
            //console.log("last coordinates", loc)
           // console.log("this mapbox final location array", mapboxCoordinates)
            getMapBoxRoute();
            mapboxCoordinates = []
            
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
            var summary = data.routes[0]
            var newRoute = [];
            route.coordinates.forEach((el) =>{ newRoute.push( [ el[1],el[0] ] ) })
           // console.log("new route: ", newRoute)
            drawRoute(newRoute,0,"mapbox")

            document.getElementById('mapbox-route-info').innerHTML = milesConversion(summary.distance,"mapbox") + ", " + secondsToHms(summary.duration) + " " + method;
            mapboxCheckBox.checked = true;
            document.getElementsByClassName('mapbox-route')[0].classList.remove('route-inactive')
          })
    }


    var setupPoints = function(options,str,routing = false){

        

        var myPoint = [];

        switch(options.company){
            case "mapfit":
                myPoint = [{
                        "id": "mapfit",
                        "location" : str,
                            "cardData": {
                            "title": "Mapfit",
                            "subTitle1": "119 W 24th St",
                            "subTitle2": "Mappers"
                            },
                            "markerUrl": "./Mapfit_Mark.png"
                        } ]
                pointsToDelete.push(myPoint[0])
                L.mapfit.addMarkers(myPoint, 'mapfit','day')
                break;
            case "google":
                myPoint = [{
                    
                            "id": "google",
                            "location" : str,
                            "cardData": {
                                "title": "Google",
                                "subTitle1": "119 W 24th St",
                                "subTitle2": "Googl"
                            },
                            "markerUrl": "education"
                        }]
                pointsToDelete.push(myPoint[0])
                L.mapfit.addMarkers(myPoint, 'mapfit','day')
            break;
            case "mapbox":
                myPoint = [{
                        "id": "mapbox",
                        "location" : str,
                            "cardData": {
                            "title": "Mapfit",
                            "subTitle1": "119 W 24th St",
                            "subTitle2": "Mappers"
                            },
                            "markerUrl": "finance"
                        }]
                pointsToDelete.push(myPoint[0])
                L.mapfit.addMarkers(myPoint, 'mapfit','day')    
            break;
            case "here":
            myPoint = [{
                    "id": "here",
                    "location" : str,
                        "cardData": {
                        "title": "Mapfit",
                        "subTitle1": "119 W 24th St",
                        "subTitle2": "Mappers"
                        },
                        "markerUrl": "pharmacy"
                    }]
            pointsToDelete.push(myPoint[0])
            L.mapfit.addMarkers(myPoint, 'mapfit','day')    
            break;
            default:
                    console.log("cant resolve",options.company);
                    ()=>{};

        }
    
                    
                   
                    
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
    
        document.getElementById('mapfit-route-info').innerHTML = milesConversion(summary.length) + " " + secondsToHms(summary.time) + " " + method;
        
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
                color: '#4353ff',
                weight: 5,
                className: "mapfit",

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
                color: '#e24f48',
                weight: 5,
                className: "google"

            })
            map.addLayer(google);
        } else if(type == "mapbox") {
            mapbox = L.polyline(locationArray,{
                color: '#f29920',
                weight: 5,
                className: "mapbox"
            })

            map.addLayer(mapbox)
        } else if (type == "here"){
            here = L.polyline(locationArray,{
                color: '#f366ae',
                weight: 5,
                className: "here"
            })

            map.addLayer(here)

        } else {
            driving = L.polyline(locationArray, {
                color: '#4353ff',
                weight: 5,
                className: "mapfit"
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
    

    function postJSON(dataArray,routing=false) {
        let xhttp = new XMLHttpRequest();
    
        return new Promise(function(resolve,reject){
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {

                console.log('postResponse=', xhttp.responseText)
                var response = JSON.parse(xhttp.responseText);
                // console.log(response[0].entrances)
                //console.log(response)
                let coords
                if(response[0].entrances){
                    coords = [response[0].entrances[0].lat,response[0].entrances[0].lon]
                    mapfitTotalCoords.push(coords)
                    
                }else{
                    coords = [response[0].location.lat,response[0].location.lon]
                    mapfitTotalCoords.push(coords);
                    
                }
                if(!routing){
                    setupPoints({company:"mapfit"},coords.join(","))
                    
                }
                //console.log(mapfitTotalCoords);
                if(routing){
                    getDirections(0,0,true)                
                }
                mapfitCheckBox.checked = true;
                document.getElementsByClassName('mapfit-route')[0].classList.remove('route-inactive')
                resolve
    
                } else if (xhttp.readyState == 4 && xhttp.status == 500) {
                //console.log("ERROR:", xhttp.status);
                }
            };
        
            xhttp.open('POST', this.url, true);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.setRequestHeader("Accept", "application/json");
            xhttp.send(JSON.stringify(dataArray));

        })
        
    }

    function getDirections(lat , lon , mapfit=false){
        var bodyObj; 

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
                let del = pointsToDelete.find(function(element){ if(element.id == "mapfit"){ return element;}})
                let delIdx = pointsToDelete.indexOf(del);
                let delPoints = pointsToDelete.splice(delIdx,1);
                let point = mapfitPoint(str2);
                setupPoints({company:"mapfit"},str)
                addFinalMarkers(point,delPoints)
                //console.log("delPoints", delPoints);
                
                }
                readDirections(response, bodyObj)
            } else if (xhttp.readyState == 4 && xhttp.status == 500) {
            }
        };

       
   }

    function addFinalMarkers(str,str2){
        //console.log("things being deleted", str2)
        L.mapfit.addMarkers(str,'mapfit','day')
        L.mapfit.deleteMarkers(str2, 'mapfit')
        //console.log(pointsToDelete);
    }

    const milesConversion = function (miles,type="mapfit"){
        if(type == "mapfit"){
            miles = Number(miles);
            let floor = Math.floor(miles);
            let feet = miles - floor;
            let mileString;
        
            mileString = miles.toFixed(1) + " mi";
        
            return mileString;
        }else if(type == "mapbox"){
            miles = Number(miles) / 1000;
            let floor = Math.floor(miles);
            let feet = miles - floor;
            let mileString;
        
            mileString = miles.toFixed(1) + " mi";
            return mileString;
        }else if(type == "here"){
            miles = Number(miles) / 1000;
            let floor = Math.floor(miles);
            let feet = miles - floor;
            let mileString;
        
            mileString = miles.toFixed(1) + " mi";
            return mileString;
        }
        
    }

    const secondsToHms = function (d) {
        d = Number(d);
        let h = Math.floor(d / 3600);
        let m = Math.floor(d % 3600 / 60);
        let s = Math.floor(d % 3600 % 60);
    
        if(s >= 45){
            m++;
        }else if(s > 20 && s < 45){
            m = m + 0.5;
        }
    
        let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hr, ") : "";
        let mDisplay = m > 0 ? m + (m == 1 ? " minute" : " min") : "";
    
        return hDisplay + mDisplay;
    }

    function drawBuildingPolygon(building, id) {

        if (building.type) {
            var polyJSON = {
                "type": "Feature",
                "geometry": building
            };
    
            var polygon = {
                "type": "FeatureCollection",
                "features": [polyJSON]
            }
    
            var thisBuilding = L.geoJson(polygon).addTo(map);
            thisBuilding.setStyle({
                fillColor: '#c6d8e5',
                color: '#ffffff',
                "fillOpacity": 1.0,
                "weight": 2.5
            });
    
            if (theme == "night")
                thisBuilding.setStyle({
                    fillColor: '#BED7E7',
                    color: '#BED7E7',
                    "fillOpacity": .25,
                    "weight": 2.5
                });
    
            polygons.push({ "id": id, "polygon": thisBuilding });
        }
    }

    
   

                                  
                    
