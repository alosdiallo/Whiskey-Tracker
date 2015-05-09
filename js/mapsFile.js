/**********************************************************************************************
Geo Location code
**********************************************************************************************/
function geoLocation(){
/* 	var apiKey = "key=AIzaSyDzHEOhffOBo6QAfVBDGh2CFrzE3GUHPtc";
	var sensorInfo = "&sensor=false&";
	var QueryLocation = "JimBeam+Kentuckey";
	var oauthToken = gapi.auth.getToken();
	var myRequest = new XMLHttpRequest(); */
	
//	myRequest.open("GET","https://maps.googleapis.com/maps/api/place/textsearch/json?query=JimBeam+Kentuckey&sensor=false&key=AIzaSyDzHEOhffOBo6QAfVBDGh2CFrzE3GUHPtc" +
//  '?access_token=' + encodeURIComponent(oauthToken.access_token));
	//myRequest.responseType = "json";
	//myRequest.setRequestHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8000');
	//myRequest.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	//myRequest.setRequestHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	//myRequest.setRequestHeader('Access-Control-Allow-Credentials', true);	
   var geocoder = new google.maps.Geocoder();
   var address = 'Boston, MA';

   if (geocoder) {
      geocoder.geocode({ 'address': address }, function (results, status) {
         if (status == google.maps.GeocoderStatus.OK) {
			console.log(results[0].geometry.location.lat());
			console.log(results[0].geometry.location.lng());
         }
         else {
            console.log("Geocoding failed: " + status);
         }
      });
   }  

}
