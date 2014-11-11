function initialize() {

	var myLatLong;
	var map;
	var content;
	var marker;

	if (navigator.geolocation) {
		var timeoutVal = 10 * 1000 * 1000;
		navigator.geolocation.getCurrentPosition(
				geoSuccess, 
				null,
				{ enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
				);

	}

	function geoSuccess(position) {
		setLatLong( position.coords.latitude, position.coords.longitude );
		console.log("Position: " + position);
		drawMap();

	}

	function dropPin() {
		// To add the marker to the map, use the 'map' property
		marker = new google.maps.Marker({
			position: myLatLong,
			map: map,
		});

		map.setCenter(myLatLong);
	}

	function infoWindow(data) {
		content = '<div id="whoisInfo">'+
			'<h2 id="firstHeading" class="firstHeading">'+data.IP+'</h2>'+
            '<h4 id="secondHeading" class="secondHeading">'+data.City.en+', '+data.IsoCode+'</h4>'+
			'<div id="bodyContent">'+
			'<p><b>Latitude</b>: '+data.Latitude+'</p>' +
			'<p><b>Longitude</b>: '+data.Longitude+'</p>' +
			'</div>';

		var infowindow = new google.maps.InfoWindow({
			content: content,
		});

		infowindow.open(map,marker);

	}

	function setLatLong (latitude, longitude) {
		myLatLong = new google.maps.LatLng( latitude, longitude );
	}

	function drawMap() {

		var mapOptions = {
			center: myLatLong,
			zoom: 13,
			styles: mapStyleOptions
		};
		map = new google.maps.Map(document.getElementById('map-canvas'),
				mapOptions);

		// Create the search box and link it to the UI element.
		var input = /** @type {HTMLInputElement} */(
				document.getElementById('whois-input-form'));
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

		dropPin();

	}

	// Attach a submit handler to the form
	$( "#whois-input-form" ).submit(function( event ) {

		// Stop form from submitting normally
		event.preventDefault();

		// Get some values from elements on the page:
		var $form = $( this ),
		term = $form.find( "input[name='ip']" ).val(),
		url = $form.attr( "action" );

		// Send the data using post as json
		var posting = $.post( url, { ip: term }, null, 'json' );

		// Drop a pin when we have a result
		posting.done(function( data ) {
		console.log( data );

		setLatLong(data.Latitude, data.Longitude);
		dropPin();
		infoWindow(data);

	});
	});

}

google.maps.event.addDomListener(window, 'load', initialize);

mapStyleOptions = [{"featureType":"landscape","stylers":[{"visibility":"simplified"},{"color":"#2b3f57"},{"weight":0.1}]},{"featureType":"administrative","stylers":[{"visibility":"on"},{"hue":"#ff0000"},{"weight":0.4},{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"weight":1.3},{"color":"#FFFFFF"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#f55f77"},{"weight":3}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#f55f77"},{"weight":1.1}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#f55f77"},{"weight":0.4}]},{},{"featureType":"road.highway","elementType":"labels","stylers":[{"weight":0.8},{"color":"#ffffff"},{"visibility":"on"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"color":"#ffffff"},{"weight":0.7}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"color":"#6c5b7b"}]},{"featureType":"water","stylers":[{"color":"#f3b191"}]},{"featureType":"transit.line","stylers":[{"visibility":"on"}]}]
