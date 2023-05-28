import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const [startLatLng, setStartLatLng] = useState(null);
  const [distance, setDistance] = useState({ x: 0, y: 0 });

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
      const latlng = marker.getLatLng();

      switch (e.key) {
        case 'w':
          marker.setLatLng([latlng.lat + moveAmount, latlng.lng]);
          break;
        case 's':
          marker.setLatLng([latlng.lat - moveAmount, latlng.lng]);
          break;
        case 'a':
          marker.setLatLng([latlng.lat, latlng.lng - moveAmount]);
          break;
        case 'd':
          marker.setLatLng([latlng.lat, latlng.lng + moveAmount]);
          break;
        default:
          return;
      }

      const updatedLatLng = marker.getLatLng();

      if (startLatLng) {
        const xDiff = updatedLatLng.lng - startLatLng.lng;
        const yDiff = updatedLatLng.lat - startLatLng.lat;
        setDistance({ x: xDiff, y: yDiff });

        const latLngs = [...polyline.getLatLngs()];
        latLngs.push(updatedLatLng);
        polyline.setLatLngs(latLngs);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      map.remove(); // Remove the map instance
    };
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <div
        id="map"
        ref={mapRef}
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 0 }}
      />
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
        Position Difference: X: {distance.x.toFixed(6)}, Y: {distance.y.toFixed(6)}
      </div>
    </div>
  );
};

export default Map;
