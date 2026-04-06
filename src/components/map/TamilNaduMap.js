"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { partyColors } from "@/data/elections";
import { normalize } from "@/utils/mapUtils";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMap } from "react-leaflet";

function FitBounds({ geoData }) {
  const map = useMap();

  useEffect(() => {
    if (!geoData) return;

    const layer = L.geoJSON(geoData);
    map.fitBounds(layer.getBounds(), {
      padding: [20, 20]
    });
  }, [geoData, map]);

  return null;
}

function FitToTamilNadu({ geoData }) {
  const map = useMap();

  useEffect(() => {
    if (!geoData) return;

    const layer = L.geoJSON(geoData);
    const bounds = layer.getBounds();

    setTimeout(() => {
      map.invalidateSize();

      const zoom = map.getBoundsZoom(bounds);

      map.setView(bounds.getCenter(), zoom + 0.5);
    }, 100);
  }, [geoData, map]);

  return null;
}

// ✅ Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

export default function TamilNaduMap({
  selectedDistrict,
  onSelect,
  districtPartyMap,
  lang,
  districtDisplayLookup,
  partyDisplayLookup
}) {
  const [geoData, setGeoData] = useState(null);
  const geoJsonRef = useRef(null);
  
  const getStyle = useCallback(
	  (feature) => {
		const rawName = feature?.properties?.NAME_2 || "Unknown";
		const key = normalize(rawName, lang);

		const party = districtPartyMap?.[key];
		const color = partyColors?.[party] || "#E5E7EB";

		const isSelected = normalize(selectedDistrict, lang) === key;
		
		return {
		  fillColor: color,
		  weight: isSelected ? 3 : 1,
		  color: isSelected ? "#000" : "#fff",
		  fillOpacity: isSelected ? 1 : 0.8
		};
	  },
	  [selectedDistrict, districtPartyMap]
	);
	
	const getTooltipContent = useCallback(
	  (rawName) => {
		const key = normalize(rawName, lang);
		const partyKey = districtPartyMap?.[key];
		const party = partyDisplayLookup?.[partyKey] || partyKey || "N/A";
		const district = districtDisplayLookup?.[key] || rawName;

		return `
		  <div class="map-tooltip">
			<div class="tooltip-title">
			  ${district}
			</div>
			<div class="tooltip-party">
			  ${party}
			</div>
		  </div>
		`;
	  },
	  [districtPartyMap]
	);

	// ✅ Fetch GeoJSON manually (more reliable)
	useEffect(() => {
		fetch("/tamilnadu_districts.json")
		  .then((res) => res.json())
		  .then((data) => setGeoData(data));
	}, []);
	
	useEffect(() => {
		if (!geoJsonRef.current) return;
		geoJsonRef.current.setStyle(getStyle);
	}, [selectedDistrict, districtPartyMap, lang, getStyle]);
	
	useEffect(() => {
	  if (!geoJsonRef.current) return;

	  geoJsonRef.current.eachLayer((layer) => {
		const feature = layer.feature;
		const rawName = feature?.properties?.NAME_2 || "Unknown";
		
		layer.unbindTooltip(); // 🔥 important
		layer.bindTooltip(getTooltipContent(rawName), {
		  sticky: true,
		  direction: "auto",
		  offset: [0, -10],
		  opacity: 1
		});
	  });
	}, [lang, districtDisplayLookup, partyDisplayLookup]);
	
  // 🎯 Interaction + styling
  const onEachDistrict = (feature, layer) => {
	const rawName = feature?.properties?.NAME_2 || "Unknown";
	const key = normalize(rawName, lang);
    const isSelected = normalize(selectedDistrict) === key;
	
	const party = districtPartyMap?.[key];
	const color = partyColors?.[party] || "#E5E7EB";
	
    // 🖱 Click
    layer.on({
      click: () => { onSelect(normalize(rawName, lang)); }
    });
	
	layer.bindTooltip(getTooltipContent(rawName), {
	  sticky: true,
	  direction: "auto",
	  offset: [0, -10],
	  opacity: 1
	});
	
	// ✨ Hover
    layer.on({
	  mouseover: () => {
		layer.setStyle({
		  weight: 3,
		  fillOpacity: 1
		});
	  },
	  mouseout: () => {
		geoJsonRef.current?.resetStyle(layer);
	  }
	});
  };

  if (!geoData) {
    return <div>Loading map...</div>;
  }

  return (
    <MapContainer      
      style={{ height: "500px", width: "100%", background: "#f3f4f6" }}>
	  
	  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" opacity={0.3}/>
	  
	  <FitToTamilNadu geoData={geoData} />
	  		
      <GeoJSON
	    key={lang}
        data={geoData}
		ref={geoJsonRef}
		style={getStyle}
        onEachFeature={onEachDistrict}
      />
    </MapContainer>
  );
}