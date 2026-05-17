import React, { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Compass, LocateFixed } from "lucide-react";

const SRI_LANKA_CENTER = [7.8731, 80.7718];
const PLACE_LOOKUP_TIMEOUT_MS = 6000;
const KNOWN_PLACES = [
  { name: "Colombo", region: "Western Province", lat: 6.9271, lng: 79.8612 },
  { name: "Kandy", region: "Central Province", lat: 7.2906, lng: 80.6337 },
  { name: "Sigiriya", region: "Cultural Triangle", lat: 7.957, lng: 80.7603 },
  { name: "Galle", region: "Southern Province", lat: 6.0535, lng: 80.221 },
  { name: "Ella", region: "Uva Province", lat: 6.8667, lng: 81.0466 },
  { name: "Nuwara Eliya", region: "Central Province", lat: 6.9497, lng: 80.7891 },
  { name: "Yala", region: "Southern Province", lat: 6.3728, lng: 81.5222 },
  { name: "Mirissa", region: "Southern Province", lat: 5.9483, lng: 80.4716 },
  { name: "Trincomalee", region: "Eastern Province", lat: 8.5922, lng: 81.2152 },
  { name: "Arugam Bay", region: "Eastern Province", lat: 6.8442, lng: 81.8358 },
  { name: "Dambulla", region: "Cultural Triangle", lat: 7.8742, lng: 80.6511 },
  { name: "Pinnawala", region: "Sabaragamuwa", lat: 7.2993, lng: 80.3831 },
];

const createPinIcon = (pinColor) =>
  L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;inset:0;border-radius:9999px;background:${pinColor};opacity:.18;animation:sri-lanka-pin-pulse 1.8s ease-in-out infinite;"></div>
        <div style="position:absolute;inset:5px;border-radius:9999px;background:${pinColor};opacity:.35;"></div>
        <div style="position:relative;width:12px;height:12px;border-radius:9999px;background:${pinColor};border:2px solid white;box-shadow:0 6px 18px rgba(15,23,42,.25);"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 26],
  });

const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getFallbackPlaceName = (lat, lng) => {
  const nearest = KNOWN_PLACES.reduce(
    (best, place) => {
      const distance = haversineDistance(lat, lng, place.lat, place.lng);
      return distance < best.distance ? { ...place, distance } : best;
    },
    { name: "Sri Lanka location", region: "", distance: Number.POSITIVE_INFINITY }
  );

  return nearest.distance <= 40 ? { name: nearest.name, region: nearest.region } : { name: "Sri Lanka location", region: "" };
};

const reverseLookupPlaceInfo = async (lat, lng) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), PLACE_LOOKUP_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=12&addressdetails=1`,
      {
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error("Reverse lookup failed");
    }

    const data = await response.json();
    const address = data?.address || {};
    const rawName =
      data?.name ||
      address?.tourism ||
      address?.city ||
      address?.town ||
      address?.village ||
      address?.county ||
      address?.state_district ||
      address?.state ||
      data?.display_name;
    const rawRegion = address?.state || address?.province || address?.state_district || "";

    if (!rawName) {
      return getFallbackPlaceName(lat, lng);
    }

    return {
      name: String(rawName).split(",")[0].trim() || getFallbackPlaceName(lat, lng).name,
      region: String(rawRegion).trim() || getFallbackPlaceName(lat, lng).region,
    };
  } catch {
    return getFallbackPlaceName(lat, lng);
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export default function SriLankaMap({ onPin, pinColor = "#00b0a5", lat, lng, hoverLocName = "" }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const containerRef = useRef(null);
  const onPinRef = useRef(onPin);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  const markerIcon = useMemo(() => createPinIcon(pinColor), [pinColor]);

  useEffect(() => {
    onPinRef.current = onPin;
  }, [onPin]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return undefined;
    }

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(SRI_LANKA_CENTER, 8.2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on("click", (event) => {
      const nextLat = Number(event.latlng.lat.toFixed(6));
      const nextLng = Number(event.latlng.lng.toFixed(6));
      reverseLookupPlaceInfo(nextLat, nextLng).then((place) => {
        onPinRef.current?.({ lat: nextLat, lng: nextLng, ...place });
      });
    });

    mapRef.current = map;

    return () => {
      map.off();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      const nextLatLng = [lat, lng];
      if (!markerRef.current) {
        markerRef.current = L.marker(nextLatLng, { draggable: true, icon: markerIcon }).addTo(map);
        markerRef.current.on("dragend", () => {
          const point = markerRef.current?.getLatLng();
          if (point) {
            const nextLat = Number(point.lat.toFixed(6));
            const nextLng = Number(point.lng.toFixed(6));
            reverseLookupPlaceInfo(nextLat, nextLng).then((place) => {
              onPinRef.current?.({ lat: nextLat, lng: nextLng, ...place });
            });
          }
        });
      } else {
        markerRef.current.setIcon(markerIcon);
        markerRef.current.setLatLng(nextLatLng);
      }

      map.panTo(nextLatLng, { animate: true, duration: 0.35 });
      return;
    }

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [lat, lng, markerIcon]);

  const centerOnCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not available in this browser.");
      return;
    }

    setGeoError("");
    setGeoLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLat = Number(position.coords.latitude.toFixed(6));
        const nextLng = Number(position.coords.longitude.toFixed(6));
        mapRef.current?.setView([nextLat, nextLng], 13, { animate: true });
        reverseLookupPlaceInfo(nextLat, nextLng).then((place) => {
          onPinRef.current?.({ lat: nextLat, lng: nextLng, ...place });
        });
        setGeoLoading(false);
      },
      () => {
        setGeoError("Unable to read the current location right now.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 15000 }
    );
  };

  return (
    <div className="relative overflow-hidden rounded-xl shadow-inner border border-slate-200 bg-slate-100">
      <div ref={containerRef} className="h-56 w-full" />

      <div className="absolute left-3 top-3 z-[500] flex flex-col gap-2 pointer-events-none">
        <div className="pointer-events-auto rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm border border-slate-200 backdrop-blur inline-flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-teal-700" />
          Click or drag the marker to update coordinates
        </div>
        {hoverLocName ? (
          <div className="rounded-full bg-slate-900/85 px-3 py-1 text-[10px] font-semibold text-white shadow-sm inline-flex w-fit">
            Focused: {hoverLocName}
          </div>
        ) : null}
      </div>

      <div className="absolute right-3 top-3 z-[500] flex flex-col gap-2 items-end">
        <button
          type="button"
          onClick={centerOnCurrentLocation}
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm border border-slate-200 backdrop-blur hover:bg-white transition-colors"
        >
          <LocateFixed className="w-3.5 h-3.5 text-teal-700" />
          {geoLoading ? "Locating..." : "Use current location"}
        </button>
        {geoError ? (
          <div className="max-w-56 rounded-lg bg-rose-50 px-3 py-1.5 text-[10px] font-medium text-rose-700 border border-rose-200 shadow-sm">
            {geoError}
          </div>
        ) : null}
      </div>

      <div className="absolute inset-x-0 bottom-2 z-[500] flex justify-center pointer-events-none select-none">
        {!Number.isFinite(lat) || !Number.isFinite(lng) ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full bg-white/95 text-teal-800 shadow-sm border border-teal-100 font-medium animate-pulse">
            <Compass className="w-3.5 h-3.5" />
            Pick a point on the map to pin coordinates
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full bg-slate-900/85 text-white shadow-sm border border-white/10 font-medium">
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </span>
        )}
      </div>
    </div>
  );
}