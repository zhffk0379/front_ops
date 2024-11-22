import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const MapComponent = ({ location }) => {
  // 상태 정의
  const [currentLocation, setCurrentLocation] = useState(null); // 현재 위치
  const [directions, setDirections] = useState(null); // 경로 정보
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [routeDetails, setRouteDetails] = useState({ distance: "", duration: "" }); // 거리 및 시간
  const [infoWindowPosition, setInfoWindowPosition] = useState(null); // 정보창 위치
  const [infoWindowVisible, setInfoWindowVisible] = useState(false); // 정보창 표시 여부
  const [destination, setDestination] = useState(null); // 목적지

  // Google Maps API 및 Geocoding 라이브러리 로드
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"], // Geocoding을 위해 places 라이브러리 추가
  });

  // 사용자의 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(userLocation); // 현재 위치 설정
        },
        (error) => console.error("위치 오류:", error)
      );
    }
  }, []);

  // Geocoding을 통해 주소로부터 좌표 가져오기
  const getGeocode = (address) => {
    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          setDestination({ lat: location.lat(), lng: location.lng() }); // 목적지 좌표 설정
        } else {
          alert("건물 이름을 찾을 수 없습니다.");
        }
      });
    }
  };

  // Directions API를 사용하여 경로 찾기
  const getDirections = (origin, destination) => {
    setLoading(true); // 경로 요청 시 로딩 상태 활성화

    if (window.google && window.google.maps) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.TRANSIT, // 대중교통 경로
        },
        (result, status) => {
          setLoading(false); // 경로 요청 후 로딩 종료
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result); // 경로 결과 설정
          } else {
            console.error("경로 찾기 실패:", status);
            alert("경로를 찾을 수 없습니다.");
          }
        }
      );
    } else {
      console.error("Google Maps API가 로드되지 않았습니다.");
    }
  };

  // 위치 및 목적지가 변경될 때마다 경로 요청
  useEffect(() => {
    if (currentLocation && destination) {
      getDirections(currentLocation, destination); // 출발지와 목적지가 모두 설정되었을 때 경로 요청
    }
  }, [currentLocation, destination]);

  // 경로 클릭 시 거리와 시간 정보 업데이트
  const handleRouteClick = (event) => {
    if (directions?.routes[0]?.legs[0]) {
      const route = directions.routes[0].legs[0];
      setRouteDetails({
        distance: route.distance.text,
        duration: route.duration.text,
      });
      setInfoWindowPosition(event.latLng); // 클릭한 위치에 정보창 표시
      setInfoWindowVisible(true); // 정보창 표시
    }
  };

  // `location` props가 변경될 때마다 목적지 좌표 자동 설정
  useEffect(() => {
    if (isLoaded && location && destination === null) {
      getGeocode(location); // 부모 컴포넌트에서 받은 주소로 좌표 찾기
    }
  }, [isLoaded, location, destination]);

  // 로딩 중일 때의 표시
  const renderLoadingMessage = () => (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        background: "rgba(255, 255, 255, 0.7)",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      경로를 찾는 중...
    </div>
  );

  // 맵을 로드할 수 있을 때 렌더링
  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation || { lat: 37.5665, lng: 126.978 }} // 기본 위치 서울
        zoom={14}
        onClick={handleRouteClick} // 경로 클릭 시 호출되는 이벤트 핸들러
        language="ko" // 맵 UI 언어를 한국어로 설정
      >
        {/* 사용자 위치 마커 */}
        {currentLocation && <Marker position={currentLocation} label="내 위치" />}

        {/* 목적지 마커 */}
        {destination && <Marker position={destination} label="목적지" />}

        {/* 경로 렌더링 */}
        {directions && !loading && (
          <DirectionsRenderer
            directions={directions}
            options={{
              preserveViewport: true,
              suppressMarkers: true, // 기본 마커는 숨김
            }}
          />
        )}

        {/* 경로 로딩 중 */}
        {loading && renderLoadingMessage()}

        {/* 정보창 표시 */}
        {infoWindowVisible && (
          <InfoWindow
            position={infoWindowPosition}
            onCloseClick={() => setInfoWindowVisible(false)}
          >
            <div>
              <h4>경로 정보</h4>
              <p><strong>거리:</strong> {routeDetails.distance}</p>
              <p><strong>소요 시간:</strong> {routeDetails.duration}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </>
  ) : (
    <div>Loading...</div> // 맵 로딩 중
  );
};

export default MapComponent;
