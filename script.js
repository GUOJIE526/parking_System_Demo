let map;
let infoWindow;
let service;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: { lat: 22.630556, lng: 120.302778 }, // 漢神巨蛋的大致位置
  });

  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  document.getElementById("searchBtn").addEventListener("click", function () {
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
  const request = {
    query: keyword,
    fields: ["name", "geometry"],
  };

  service.findPlaceFromQuery(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {
      const location = results[0].geometry.location;
      map.setCenter(location);

      // 在關鍵字位置附近搜索停車場
      const parkingRequest = {
        location: location,
        radius: "500", // 搜索半徑500米
        type: ["parking"],
      };
      service.nearbySearch(
        parkingRequest,
        function (parkingResults, parkingStatus) {
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

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(place.name || "");
    infoWindow.open(map, marker);
  });
}
