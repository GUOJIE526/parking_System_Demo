let map;
let infoWindow;
let service;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: { lat: 22.630556, lng: 120.302778 },
  });

  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  document.getElementById("searchBtn").addEventListener("click", function () {
    console.log("Search button clicked");
    performSearch();
  });
}

function handleLocationError(browserHasGeolocation, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "定位失敗，請確認瀏覽器權限設置。"
      : "瀏覽器不支援定位功能。"
  );
  infoWindow.open(map);
  map.setCenter(pos);
}

function performSearch() {
  const keyword = document.getElementById("keyword").value;
  console.log("Performing search for keyword:", keyword);

  const request = {
    query: keyword,
    fields: ["name", "geometry"],
  };

  service.findPlaceFromQuery(request, function (results, status) {
    console.log("findPlaceFromQuery status:", status);
    if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {
      const location = results[0].geometry.location;
      console.log("Location found:", location);
      map.setCenter(location);

      const parkingRequest = {
        location: location,
        radius: "500", // 搜索半徑500公尺
        type: ["parking"],
      };
      service.nearbySearch(
        parkingRequest,
        function (parkingResults, parkingStatus) {
          console.log("nearbySearch status:", parkingStatus);
          if (parkingStatus === google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < parkingResults.length; i++) {
              createMarker(parkingResults[i]);
            }
          } else {
            console.error("附近沒有找到停車場");
          }
        }
      );
    } else {
      console.error("找不到相關地點");
    }
  });
}

function opendrawer() {
  const drawer = document.getElementById("drawer");
  drawer.classList.add("open");
}

function CloseDrawer() {
  const close = document.querySelector(".close");
  close.addEventListener("click", () => {
    document.getElementById("drawer").classList.remove("open");
  });
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(place.name || "");
    infoWindow.open(map, marker);
    opendrawer();
    CloseDrawer();
  });
}
