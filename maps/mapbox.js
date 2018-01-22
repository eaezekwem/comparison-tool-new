
 var kk;
 var firsTime = true;
 mapboxgl.accessToken = 'pk.eyJ1IjoiZWFlemVrd2VtIiwiYSI6ImNqY2F5d3NuZzBrNmwyd21vZzFpenFxdjYifQ.HhroJvXwf3fLRMtrHBG_cQ';
 var map = new mapboxgl.Map({
  container: 'mapbox',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [-73.975182, 40.76379],
  zoom: 17
}); 

document.addEventListener("DOMContentLoaded",function(){
  
    btn = document.getElementById('submit');
    btn.addEventListener('click',function(){
      firsTime = false;
      setPoint();
    })
    
    function setPoint(){
      var address = document.getElementsByTagName("input")[0].value;
      var mapboxGeocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoiZWFlemVrd2VtIiwiYSI6ImNqY2F5d3NuZzBrNmwyd21vZzFpenFxdjYifQ.HhroJvXwf3fLRMtrHBG_cQ`
      $.ajax({
        method: 'GET',
        url: mapboxGeocodeUrl
      }).done(function(data){
        let coorArr = [data.features[0].geometry.coordinates[0],data.features[0].geometry.coordinates[1]];

        if(!firsTime){
          map.getSource('single-point').setData({type:"Point", coordinates: coorArr})
          map.flyTo({center: coorArr})
        }
        //console.log(data);
        if(firsTime){
          change(coorArr)
        }
     })

    }
    
    setPoint()
    
})
    
    
    
    function change(thn,map){
      kk = thn
      setMarker(map);
    }
  

    

      function setMarker(){
        
        var geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken
        });
      
    

      

        
        console.log(kk);

        map.on('load', function() {
        map.addControl(geocoder);
        map.addSource('single-point', {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": []
            }
        });
      
        map.addLayer({
            "id": "point",
            "source": "single-point",
            "type": "circle",
            "paint": {
                "circle-radius": 5,
                "circle-color": "#007cbf"
            }
        });

        console.log("called");
        map.getSource('single-point').setData({type:"Point", coordinates: kk})

          geocoder.on('result', function(ev) {
            map.getSource('single-point').setData(ev.result.geometry);
            //console.log(ev.result.geometry)
            //console.log(map.getSource('single-point'))
         });
      }); 

        // var geojson = {
        //     type: 'FeatureCollection',
        //     features: [{
        //       type: 'Feature',
        //       geometry: {
        //         type: 'Point',
        //         coordinates: [kk[1],kk[0]]
        //       },
        //       properties: {
        //         title: 'Mapbox',
        //         description: 'Washington, D.C.'
        //       }
        //     }]
        //   };

        // geojson.features.forEach(function(marker) {
              
        //       var el = document.createElement('div');
        //       el.className = 'marker';
        //       new mapboxgl.Marker(el)
        //       .setLngLat(marker.geometry.coordinates)
        //       .addTo(map);
        //     });
      }
      

   
