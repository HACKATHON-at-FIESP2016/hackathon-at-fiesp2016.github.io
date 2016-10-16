var aY = 1.2; //force be float
var currentLocation = "bla" //force be String

window.onload = function () {
	
	//Accelerometer
	accelerometer();
	
	//Chart
	chartUpdater();
}

function currentPosition(){
	if (!navigator.geolocation){
		//can't acess geolocation source
		alert("Geolocation is not supported by your browser");
	}
	else{
		//have location
		function success(position) {
			var latitude  = position.coords.latitude;
			var longitude = position.coords.longitude;
			var msg = "Olá eu acabei de me acidentar no seguinte endereço: ";
			
			//Have internet connection
			if(navigator.onLine){
				var geocoder = new google.maps.Geocoder;
				var latlng = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
				
				//Coordinates to Readable coordinates
				geocoder.geocode({'location': latlng}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					//found
					if (results[1]) {
						msg += results[1].formatted_address;
						
						//Update 'label' message
						//currentLocation = msg;
						
						//create a speech messeger
						var msgSpeech = new SpeechSynthesisUtterance(msg);
						window.speechSynthesis.speak(msgSpeech);
				  
					} else {
						//can't convert to readable coordinates
						window.alert('No results found');
					}
				} else {
					//can't use geocode
					window.alert('Geocoder failed due to: ' + status);
				}
				});
				
			}
			else{
				//don't have internet, so use the lat and long
				msg += "Latitude: " + latitude + "   Longitude: " + longitude;
				alert("Estou offline");
				
				//update 'label' message
				//document.querySelector('#location').textContent = msg;
				
				//create a speech messeger
				var msgSpeech = new SpeechSynthesisUtterance(msg);
				window.speechSynthesis.speak(msgSpeech);
			}
		}
		function error() {
			//don't find location
			alert("Unable to retrieve your location");
		};

		  //alert("Locating…");

		  navigator.geolocation.getCurrentPosition(success, error);
	}
}

function accelerometer(){
	if (window.DeviceMotionEvent == undefined){
		//don't have accelerometer.
		alert ("Don't have accelerometer!");
	}
	else{
		//Accelerometer is present
		window.addEventListener("devicemotion",accelerometerUpdate, true);
	
		function accelerometerUpdate(e){
			aY = event.accelerationIncludingGravity.y*1;
			
			//if activate the maximum value from impact
			if (aY < -18){
				alert ("Valor atingiu o teto!!");
				//currentPosition();
			}
			//document.querySelector('#aY').textContent = aY;
		}
	}
}

function chartUpdater(){
	var dpsY = []; //dataPoints
	
	//new chart
	var chart = new CanvasJS.Chart("chartContainer",{
		title: {text: "Accelerometer Chart"},
		data: [{
			type: "line",
			dataPoints: dpsY
		}]
	});
	
	var xVal = 0;
	var ValY = 0;
	var updateInterval = 10;
	var dataLength = 500; // number of dataPoints visible at any point
	
	var updateChart = function (count) {
		count = count || 1;
		// count is number of times loop runs to generate random dataPoints.
		
		for (var j = 0; j < count; j++) {
			
			//get value from accelerometer and send to graph
			
			ValY = parseFloat(aY);
			dpsY.push({
				x: xVal,
				y: ValY
			});
			xVal++;
		};
		
		//is axisY don't support, fix it
		if (dpsY.length > dataLength)
		{
			dpsY.shift();				
		}
		
		//refresh
		chart.render();
		
		//if activate the maximum value from impact
		if (ValY < -18){
			alert ("Valor atingiu o teto!!");
			currentPosition();
		}

	};

	// generates first set of dataPoints
	updateChart(dataLength); 

	// update chart after specified time. 
	setInterval(function(){updateChart()}, updateInterval); 
}