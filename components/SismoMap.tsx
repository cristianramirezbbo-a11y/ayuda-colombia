"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Sismo } from "@/lib/sgc";

// Tiles gratuitos de OpenStreetMap (sin API key). En producción considerar
// un proveedor propio (MapTiler/Stadia) si el uso crece.
const TILE_URL =
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

function magAColor(mag: number): string {
  if (mag >= 6) return "#dc2626";
  if (mag >= 5) return "#ea580c";
  if (mag >= 4) return "#d97706";
  if (mag >= 3) return "#2563eb";
  return "#6b7280";
}

export default function SismoMap({ sismos }: { sismos: Sismo[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [TILE_URL],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center: [-74.0, 4.5], // Colombia
      zoom: 5,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Limpia marcadores anteriores
    for (const m of markersRef.current) m.remove();
    markersRef.current = [];

    for (const s of sismos) {
      const el = document.createElement("div");
      el.style.width = "14px";
      el.style.height = "14px";
      el.style.borderRadius = "50%";
      el.style.background = magAColor(s.mag);
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.4)";

      const popup = new maplibregl.Popup({ offset: 20 }).setHTML(
        `<strong>M${s.mag.toFixed(1)}</strong> · ${s.place}<br/>` +
          `Profundidad: ${s.depth.toFixed(1)} km · ${s.localTime}`,
      );

      markersRef.current.push(
        new maplibregl.Marker({ element: el })
          .setLngLat([s.lon, s.lat])
          .setPopup(popup)
          .addTo(map),
      );
    }
  }, [sismos]);

  return (
    <div
      ref={containerRef}
      className="h-[420px] w-full rounded-xl border border-slate-200 overflow-hidden"
    />
  );
}
