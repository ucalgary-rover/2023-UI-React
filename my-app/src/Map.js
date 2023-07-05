import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
const Map = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const [startLatLng, setStartLatLng] = useState(null);
  const [distance, setDistance] = useState({ x: 0, y: 0 });
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  useEffect(() => {
// Leaflet map initialization code
    const mapContainer = mapRef.current;
    if (!mapContainer) return;
    const map = L.map(mapContainer, {
      zoom: 20
    }).setView([51.4619, -112.7107], 1);
    map.setZoom(10);
    const openTopoMap = L.tileLayer(
        'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 17,
          attribution:
              'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }
    ).addTo(map);
    const marker = L.marker([51.4619, -112.7107]).addTo(map);
    markerRef.current = marker;

    setStartLatLng(marker.getLatLng());
    const polyline = L.polyline([], { color: 'green' }).addTo(map);
    polylineRef.current = polyline;
    const handleKeyDown = (e) => {
      const moveAmount = 0.00001;
      const marker = markerRef.current;
      const polyline = polylineRef.current;
      if (!marker) return;
      const latlng = marker.getLatLng();
      let updatedLatLng;
      switch (e.key) {
        case 'w':
          updatedLatLng = [latlng.lat + moveAmount, latlng.lng];
          break;
        case 's':
          updatedLatLng = [latlng.lat - moveAmount, latlng.lng];
          break;
        case 'a':
          updatedLatLng = [latlng.lat, latlng.lng - moveAmount];
          break;
        case 'd':
          updatedLatLng = [latlng.lat, latlng.lng + moveAmount];
          break;
        default:
          return;
      }
      if (updatedLatLng) {
        marker.setLatLng(updatedLatLng);
        if (startLatLng) {
          const xDiff = updatedLatLng[1] - startLatLng.lng;
          const yDiff = updatedLatLng[0] - startLatLng.lat;

          setDistance({ x: xDiff, y: yDiff });
        }
        const latLngs = [...polyline.getLatLngs()];
        latLngs.push(updatedLatLng);
        polyline.setLatLngs(latLngs);
      }
    };
    const handleMapClick = (e) => {
      if (isAddingMarker && selectedMarker) {
        const { lat, lng } = e.latlng;
        const markerIcon = L.divIcon({
          className: 'custom-marker',
          html: 'X',
          iconSize: [12, 12]
        });
        L.marker([lat, lng], { icon: markerIcon }).addTo(map);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    map.on('click', handleMapClick);
// Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      map.off('click', handleMapClick);
      map.remove(); // Remove the map instance
    };
  }, [isAddingMarker, selectedMarker]);
  const handleStartButtonClick = () => {
    setIsAddingMarker(!isAddingMarker);
    setSelectedMarker(null);
    setDistance({ x: 0, y: 0 }); // Reset distance values to 0
  };
  const handlePlaceMarkerClick = () => {
// Handle logic for the "Place Marker" button click

// You can add your code here to perform the desired functionality
  };
  return (
      <div style={{ position: 'relative', height: '100vh' }}>
        <div
            id="map"
            ref={mapRef}
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right:

                  0, zIndex: 0 }}
        />
        <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 1
            }}
        >
          <button
              style={{
                padding: '10px',
                fontSize: '16px'
              }}
              onClick={handleStartButtonClick}
          >
            {isAddingMarker ? 'Cancel' : 'Start'}
          </button>
        </div>
        <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 1
            }}
        >
          <button
              style={{
                padding: '10px',

                fontSize: '16px'
              }}
              onClick={handlePlaceMarkerClick}
          >
            Place Marker
          </button>
        </div>
        <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              background: 'white',
              padding: '5px',
              borderRadius: '5px',
              boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
              zIndex: 1
            }}
        >
          Position Difference: X: {distance.x.toFixed(6)}, Y:
          {distance.y.toFixed(6)}
        </div>
      </div>
  );
};
export default Map;