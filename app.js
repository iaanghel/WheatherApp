window.addEventListener('load', ()=>{
    

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position =>{
           
           
            
           apiRequest(position.coords.latitude, position.coords.longitude)
        });
        
    }else {
        locationTimezone.innerHTML = 'Enable your location.';
        
    }
    
    
    
});
function GetLocation() {
    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById("mapsearch").value;
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            let latitude = results[0].geometry.location.lat();
            let longitude = results[0].geometry.location.lng();
            apiRequest(latitude, longitude)
            
        } else {
            alert("Request failed.")
        }
    });
};

function apiRequest(lat, long){
    const proxy ='https://cors-anywhere.herokuapp.com/';
    const api = `${proxy}https://api.darksky.net/forecast/0628ab1b47884dc3131562a760d1062f/${lat},${long}`;
    initializeMap(lat, long);
    fetch(api)
           .then(data=>{
               return data.json()
   
           })
           .then(data =>{
               console.log(data);
               temperatureSpan.textContent = '°F';
               const {temperature, icon, summary}= data.currently;
               temperatureDecription.textContent = summary;
               temperatureDegree.textContent= temperature;
               locationTimezone.textContent = data.timezone;
               dailySection.textContent = data.daily.summary;
               hourlySection.textContent = data.hourly.summary;
               setIcon(icon, document.querySelector('.icon'));
              
           })
    


}
function setIcon(icon, iconID){
    const skycons = new Skycons ({color: 'white'});
    const currentIcon= icon.split('-').join('_').toUpperCase();
    console.log(currentIcon);
    skycons.play();
    return skycons.set(iconID,Skycons[currentIcon]);

}

function changeDegrees(str){
    let c;
    let a;
    let b ;
    if(temperatureSpan.textContent==='°F'){
        a = str.split("F")[0].split(' ');
        b  = a[a.length-1].split("°")[0];

        c =Math.floor(((Number(b)-32)*5/9)*100)/100;
        dailySection.textContent = dailySection.textContent.replace(b+"°F", c+"°C");
        temperatureSpan.textContent='°C';
        temperatureDegree.textContent=Math.floor(((Number(temperatureDegree.textContent)-32)*5/9)*100)/100;

    }else {
        a = str.split("C")[0].split(' ');
        b  = a[a.length-1].split("°")[0];
        c = Math.floor((Number(b)*1.8 + 32)*100)/100;
        dailySection.textContent = dailySection.textContent.replace(b+"°C", c+"°F");
        temperatureSpan.textContent = '°F';
        temperatureDegree.textContent=Math.floor((Number(temperatureDegree.textContent)*1.8 + 32)*100)/100;
      }
    

}
function initializeMap(a,b) {
    
    a = Math.floor(a*10000)/10000;
    b = Math.floor(b*10000)/10000;
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: Number(a), lng: Number(b)},
        zoom: 10
    });
}
var map;
var long;
var lat;
var temperatureDecription = document.querySelector('.temperature-description');
var temperatureDegree = document.querySelector('.degree');
var locationTimezone = document.querySelector('.location-timezone');
var temperatureSpan = document.querySelector('.degree-section span');
var temperatureSection = document.querySelector('.degree-section');
var dailySection = document.querySelector('.daily-description');
var hourlySection = document.querySelector('.hourly-description');