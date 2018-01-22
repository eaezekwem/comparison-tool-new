
const apiurl = "https://api.mapfit.com/v1"
const apiKey = '591dccc4e499ca0001a4c6a41a2ed1be54804856508265221862231b';
const url = apiurl + "/geocode?api_key=" + apiKey;

export class MapfitGeocoder{

    constructor(){
        this.url = url
    }


    postJSON(dataArray) {
        let xhttp = new XMLHttpRequest();
    
        xhttp.onreadystatechange = function () {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log('postResponse=', xhttp.responseText)
          } else if (xhttp.readyState == 4 && xhttp.status == 500) {
            console.log("ERROR:", xhttp.status);
          }
        };
    
        xhttp.open('POST', this.url, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.send(JSON.stringify(dataArray));
    
    }




}