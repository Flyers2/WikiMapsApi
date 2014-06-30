
function wikiGoogleMapsApi() {
    "use scrict";
    var map,
            infoList,
			room='mainroom',
			lastShapeId = -1,
            markersArray = [];
    drawingManager = new google.maps.drawing.DrawingManager();
    infoWindow = new google.maps.InfoWindow();
    function initialize() {
        var mapOptions = {
            center: new google.maps.LatLng(-34.397, 150.644),
            zoom: 8
        };
        map = new google.maps.Map(document.getElementById("map-canvas"),
                mapOptions);
        drawingManager.setMap(map);
        drawingManager.drawingControl = true;

    }

    go = document.getElementById("go");
    var jesusalem = document.getElementById("jerusalem");
    google.maps.event.addDomListener(window, 'load', initialize);

    google.maps.event.addDomListener(go, 'click', function() {
        var llLakewood = new google.maps.LatLng(40.063112, -74.221622);
        map.panTo(llLakewood);
        map.setZoom(12);
    });
    google.maps.event.addDomListener(jerusalem, 'click', function() {
        //map.panTo(new google.maps.LatLng(40.063112, -74.221622));
        map.panTo(new google.maps.LatLng(31.7750143, 35.2338016));
    });


    $('#displace').resizable({
        resize: function(event, ui) {
            google.maps.event.trigger(map, 'resize');
        }
    });

    $("#geoSubmit").click(function() {
        var place = $("#geoText").val();
        getInfo(place);
    });

    function getInfo(place) {
        var url = "http://api.geonames.org/wikipediaSearchJSON?q=" + place + "&maxRows=10&username=nizukan";
        //"http://api.geonames.org/searchJSON?q=" + place + "&maxRows=10&username=nizukan";
        $.getJSON(url, function(data) {
            if (data.geonames.length !== 0) {
                $("#list").empty();
                clearMarkers();
                focusMap(data.geonames[0].lat, data.geonames[0].lng, 12);//focuses on the first item zoom level 12
            }
            $.each(data.geonames, function(j, subPlace) {
                $("#list").append("<li id ='" + j + "'>" + subPlace.title + "</li>");
                $("#" + j).css({textColor: "red", backgroundColor: "lightSteelBlue", cursor: "pointer"});
                //alert($("#"+j).attr('id'));

                $("#" + j).click(function() {
                    $('.sublist').empty();
                    if ($('#' + j).children().length !== 0) {
                        $('#' + j).children().remove();

                    }

                    else {
                        focusMap(subPlace.lat, subPlace.lng, 17);
                        $("#" + j).append("<ul class ='sublist'><li>" + subPlace.summary + "<li>");
                    }
                });
                //create icons on the map for all places with pics,create latlng obj and size obj and load it into icon
                var myPos = new google.maps.LatLng(subPlace.lat, subPlace.lng),
                        size = new google.maps.Size(54, 34),
                        icon = {url: subPlace.thumbnailImg, scaledSize: size}
                if (icon.url === undefined)
                    icon = null;
                marker = new google.maps.Marker({
                    position: myPos,
                    map: map,
                    icon: icon,
                    title: subPlace.name});
                google.maps.event.addListener(marker, 'click', function() {
                    alert("jquery clicked");
                    infoWindow.setContent("place content here");
                    infoWindow.open(map, marker);



                });
                markersArray.push(marker);

            });

        });
    }
    ;

    google.maps.event.addListener(drawingManager, 'circlecomplete', function(circle) {
        var center = circle.getCenter(),
                circleData = {
                    radius: circle.getRadius(),
                    center: {lat: center.lat(), lng: center.lng()}
                };
        $.post("saveCircles.php", {type: "circle", data: JSON.stringify(circleData), room:room },
        function(data) {
            alert("data");
        });
    });

    function focusMap(lat, lng, zoom) {
        var newPlace = new google.maps.LatLng(lat, lng);
        if (zoom) {
            var zoomlevel = zoom;
            map.setZoom(zoomlevel);
        }

        map.panTo(newPlace);

    }

    function clearMarkers() {
        for (i = 0; i < markersArray.length; i++) {
            markersArray[i].setMap(null);
        }
        markersArray.length = 0;
    }
	function getShapes() {
				$.getJSON("getCircles.php?room=" + room + "&lastId=" + lastShapeId, function(data) {
					$.each(data, function (index, shape) {
						lastShapeId = shape.ID;
					    var shapeData = (shape.data);
						shapeData = JSON.parse(shapeData);
						
						
						
						switch (shape.type) {
							case "circle":
								new google.maps.Circle({
									radius: shapeData.radius,
									center: new google.maps.LatLng(shapeData.center.lat, shapeData.center.lng),
									map: map
								});
								break;
						}
					});
				});
			}
	function startPolling() {
				setInterval(function () {
					getShapes();
				}, 5000);
			}
	$.getJSON("getRooms.php", function(data) {
				var list = $("<ul></ul>"),
					div = $("<div></div>");
					
				$.each(data, function (index, aRoom) {
					$("<li>" + aRoom.room + "</li>").appendTo(list).click(function () {
						room = aRoom.room;
						getShapes();
						startPolling();
						div.dialog("close");
					});
				});
				
				
				div.append(list);
				div.append("Enter a new room name here:");
				$('<input type="text">').appendTo(div).change(function () {
					room = $(this).val();
					startPolling();
					div.dialog("close");
				});
				
				div.dialog(
					{title: "Choose Room"}
				);
			});
}
wikiGoogleMapsApi();

