document.addEventListener("DOMContentLoaded",function(){

    L.mapfit.drawmap('mapfit', 'day', 'cardsOn', 'zoomPanOn', 'extNavOff', '591dccc4e499ca0001a4c6a41a2ed1be54804856508265221862231b');
    var myPoints = [
        {
          "id": "testMarkerFullAdd",
          "location" : "119 W 24th St, New York, NY",
            "cardData": {
              "title": "Mapfit",
              "subTitle1": "119 W 24th St",
              "subTitle2": "Mappers"
            },
            "markerUrl": "arts"
        } 
    ]

    L.mapfit.addMarkers(myPoints, 'mapfit','day');
    
    

})
