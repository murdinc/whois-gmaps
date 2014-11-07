function initialize() {

	var myLatLong;
	var map;

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
		drawMap();

	}

	function dropPin() {
		// To add the marker to the map, use the 'map' property
		var marker = new google.maps.Marker({
			position: myLatLong,
			map: map,
			title:"Hello World!"
		});

		var contentString = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
			'<div id="bodyContent">'+
			'<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
			'Heritage Site.</p>'+
			'<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
			'http://en.wikipedia.org/w/index.php?title=Uluru</a> '+
			'(last visited June 22, 2009).</p>'+
			'</div>'+
			'</div>';

		var infowindow = new google.maps.InfoWindow({
			content: contentString,
			maxWidth: 200
		});

		infowindow.open(map,marker);

		map.setCenter(myLatLong);


	}

	function setLatLong (latitude, longitude) {
		myLatLong = new google.maps.LatLng( latitude, longitude );
	}

	function drawMap() {

		var mapOptions = {
			center: myLatLong,
			zoom: 8
		};
		map = new google.maps.Map(document.getElementById('map-canvas'),
				mapOptions);

		dropPin();

	}

	// Attach a submit handler to the form
	$( "#whoisForm" ).submit(function( event ) {

		// Stop form from submitting normally
		event.preventDefault();

		// Get some values from elements on the page:
		var $form = $( this ),
	term = $form.find( "input[name='ip']" ).val(),
	url = $form.attr( "action" );

	// Send the data using post as json
	var posting = $.post( url, { ip: term }, null, 'json' );

	// Put the results in a div
	posting.done(function( data ) {
		//console.log( data.Location.Latitude );

		// To add the marker to the map, use the 'map' property
		var myLatLong = new google.maps.LatLng(data.Location.Latitude, data.Location.Longitude);

		var marker = new google.maps.Marker({
			position: myLatLong,
			map: map,
			title:"Hello World!"
		});

	});
	});

}

google.maps.event.addDomListener(window, 'load', initialize);

