document.addEventListener("DOMContentLoaded", function(){
        var btn = document.getElementsByTagName("button")
        var googleKey = 'AIzaSyCb9PEt7AZSV2-Ggs2fHCB_OdflGaARYrI';
        var geocoder = new google.maps.Geocoder();

        btn[0].addEventListener('click',function(){
            getAddressCords();
        })

        var mapfit = {lat: 40.744182, lng: -73.993205};
        var map = new google.maps.Map(document.getElementById('google'), {
          zoom: 20,
          center: mapfit
        });
        var marker = new google.maps.Marker({
          position: mapfit,
          map: map
        });

        function getAddressCords(){
            var inputVal = document.getElementsByTagName("input")[0].value;
            geocoder.geocode({'address': inputVal}, function(results,status){
                if(status === 'OK'){
                    console.log(results)
                    map.setCenter(results[0].geometry.location)
                    marker.setPosition(results[0].geometry.location);
                }else{
                    alert('Invalid Address Parameters')
                }

            })
        }
})

