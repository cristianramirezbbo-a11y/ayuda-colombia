"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { CATEGORIA_INFO, type Reporte } from "@/lib/reportes-types";

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export default function ReporteMap({ reportes }: { reportes: Reporte[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

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
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: [-74.0, 4.5],
      zoom: 5,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const m of markersRef.current) m.remove();
    markersRef.current = [];

    for (const r of reportes) {
      if (r.lat == null || r.lon == null) continue;
      const info = CATEGORIA_INFO[r.category];

      const el = document.createElement("div");
      el.style.width = "16px";
      el.style.height = "16px";
      el.style.borderRadius = "50%";
      el.style.background = info.color;
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.4)";

      const popup = new maplibregl.Popup({ offset: 20 }).setHTML(
        `<strong>${info.label}</strong><br/>${r.title}` +
          (r.locationLabel ? `<br/>${r.locationLabel}` : ""),
      );

      markersRef.current.push(
        new maplibregl.Marker({ element: el })
          .setLngLat([r.lon, r.lat])
          .setPopup(popup)
          .addTo(map),
      );
    }
  }, [reportes]);

  return (
    <div
      ref={containerRef}
      className="h-[420px] w-full rounded-xl border border-slate-200 overflow-hidden"
    />
  );
}
