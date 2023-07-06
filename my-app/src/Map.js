import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
const Map = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const [startLatLng, setStartLatLng] = useState(null);
  const [distance, setDistance] = useState({ x: 0, y: 0 });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [recordPath, setRecordPath] = useState([]);
  const [fileContent, setFileContent] = useState(null);
    const onFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                setFileContent(json);
                console.log('File content:', json);
            } catch (err) {
                console.log('Error parsing JSON:', err);
                alert('There was an error reading this file. Make sure it is a valid JSON file.');
            }
        }

        reader.readAsText(file);
    }

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

      if (fileContent && Array.isArray(fileContent)) {
          //const latLngs = fileContent.map(point => [point.lat, point.lng]);
          //console.log(latLngs)
          polylineRef.current = L.polyline(fileContent, { color: 'red' }).addTo(map);
          map.fitBounds(polylineRef.current.getBounds());
      }

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
        setRecordPath([...recordPath, updatedLatLng]);
        console.log(recordPath)
      }
    };
    const handleMapClick = (e) => {
      if (selectedMarker) {
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
  }, [selectedMarker, fileContent]);
  const handlePlaceMarkerClick = () => {
      console.log(recordPath);
      const json = JSON.stringify(recordPath, null, 2);
      const downloadFile = new Blob([json],{type:'application/json'});
      const href = URL.createObjectURL(downloadFile);
      const link = document.createElement('a');
      link.href = href;
      link.download = 'data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

  };


    return (
      <div style={{ position: 'relative', height: '100vh' }}>
        <div
            id="map"
            ref={mapRef}
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right:

                  0, zIndex: 0 }}
        />
        {/*<div*/}
        {/*    style={{*/}
        {/*      position: 'absolute',*/}
        {/*      top: '100px',*/}
        {/*      right: '300px',*/}
        {/*      zIndex: 1*/}
        {/*    }}*/}
        {/*>*/}
        {/*  <button*/}
        {/*      style={{*/}
        {/*        padding: '10px',*/}
        {/*        fontSize: '16px'*/}
        {/*      }}*/}
        {/*      onClick={handleStartButtonClick}*/}
        {/*  >*/}
        {/*    {isAddingMarker ? 'Cancel' : 'Start'}*/}
        {/*  </button>*/}
        {/*</div>*/}
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
                  top: '10px',
                  right: '200px',
                  zIndex: 1
              }}
          >
              <input type="file" onChange={onFileChange} accept=".json" />
              {/*{fileContent && <pre>{JSON.stringify(fileContent, null, 2)}</pre>}*/}
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