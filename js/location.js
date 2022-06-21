


$(() => {

  // Load the google places api dynamically
  var script = document.createElement('script');
  script.onload = function () {
    console.log("places lib added")
    // get the currnt location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getNearbyPlaces);
    } else {
      alert("Location not supported!")
    }
  };

  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCCj7HhkFjsPIqy_7gwt4z5f-jD2aJ82zo&libraries=places"
  document.head.appendChild(script);

  typesOfPlaces = ["restaurant", "cafe", "lodging", "supermarket"]
  places = {}


  function getNearbyPlaces(location) {
    lat = location.coords.latitude
    long = location.coords.longitude

    var pyrmont = new google.maps.LatLng(lat, long);

    map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });

    const mapLoop = async _ => {
      // console.log('Start')

      const promises = typesOfPlaces.map(async type => {
        const numFruit = await getPlaces(pyrmont, type)
        return numFruit
      })

      mapData = await Promise.all(promises)
      places = new Map(
        mapData.map(data => {
          return [data._type, data.listOfPlaces]
        })
      )
      // console.log(places)

      // console.log(places.get("restaurant"))

      // console.log('End')
    }

    mapLoop()
  }

  getPlaces = (pyrmont, _type) => {
    let myPromise = new Promise(function (myResolve, myReject) {
      rad = 50  // radius in m
      var request = {
        location: pyrmont,
        // radius: rad,
        rankBy: google.maps.places.RankBy.DISTANCE,
        type: [_type]
      };

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);

      function callback(results, status) {
        // console.log(_type);
        listOfPlaces = []
        resLen = results.length > 5 ? 5 : results.length
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < resLen; i++) {
            // createMarker(results[i]);
            // console.log(results[i].name)
            listOfPlaces = [...listOfPlaces, results[i].name]
          }

          // console.log(listOfPlaces)
        }

        myResolve({ _type, listOfPlaces })
      }
    });

    return myPromise
  }


  function shownearbyPlaces() {
    $("#expDes").hide()
    $("#nearbyPlaces").show()
  }

  function hidenearbyPlaces() {
    $("#expDes").show()
    $("#nearbyPlaces").hide()
  }

  // console.log("ready")
  if (!$('input[type=radio][name="expense_category"]').is(':checked')) {
    hidenearbyPlaces()
  }

  $('input[type=radio][name="expense_category"]').change(function () {
    if (this.value == "others") {
      hidenearbyPlaces()

    } else {
      shownearbyPlaces()
      val = this.value
      placesList = places.get(val)
      // console.log(placesList)
      nearbyPlacesSelectElement = $("#nearbyPlaces")
      nearbyPlacesSelectElement.empty();
      for (i = 0; i < placesList.length; i++) {
        // console.log(placesList[i])
        nearbyPlacesSelectElement.append("<option value=" + placesList[i] + ">" + placesList[i] + "</option>")
      }

      if (placesList.length == 0) {
        nearbyPlacesSelectElement.append("<option value=none>no " + val + " nearby</option>")

      }
    }

  });
});