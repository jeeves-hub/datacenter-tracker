"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Project } from "@/lib/types";
import { STAGE_MAP } from "@/lib/types";
import { formatGW } from "@/lib/stats";
import { getCoords } from "@/lib/coords";

type Props = {
  projects: Project[];
};

type MapPoint = {
  project: Project;
  coords: [number, number];
};

export function MapView({ projects }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);

  const points: MapPoint[] = useMemo(() => {
    return projects
      .map((p) => {
        const coords = getCoords(p.location.city, p.location.state);
        return coords ? { project: p, coords } : null;
      })
      .filter((x): x is MapPoint => x !== null);
  }, [projects]);

  const unmapped = projects.length - points.length;

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm-tiles",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center: [-98.5, 39.8],
      zoom: 3.5,
    });

    mapRef.current = map;

    map.on("load", () => {
      markersRef.current = points.map(({ project, coords }) => {
        const stage = STAGE_MAP[project.stage];
        const el = document.createElement("div");
        el.style.cssText = `
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${stage.color};
          border: 2px solid rgba(10, 14, 23, 0.8);
          box-shadow: 0 0 0 1px ${stage.color}40, 0 1px 3px rgba(0,0,0,0.4);
          cursor: pointer;
          transition: transform 0.15s ease;
        `;
        el.onmouseenter = () => (el.style.transform = "scale(1.6)");
        el.onmouseleave = () => (el.style.transform = "scale(1)");

        const marker = new maplibregl.Marker(el)
          .setLngLat([coords[1], coords[0]])
          .addTo(map);

        marker.getElement().addEventListener("click", () => {
          setSelected(project);
        });

        return marker;
      });
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [points]);

  return (
    <div className="relative">
      <div
        ref={mapContainer}
        className="w-full rounded-lg border border-gray-800"
        style={{ height: "600px", background: "#0a0e17" }}
      />
      {unmapped > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          {unmapped} projects without coordinates not shown on map
        </div>
      )}
      {selected && (
        <MapPopup project={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function MapPopup({ project: p, onClose }: { project: Project; onClose: () => void }) {
  const stage = STAGE_MAP[p.stage];
  return (
    <div className="mt-4 rounded-lg border border-gray-800 bg-gray-900/80 p-4 backdrop-blur">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-semibold text-gray-100">{p.name}</h3>
          <p className="text-xs text-gray-500">
            {p.location.city}, {p.location.state}
          </p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xl leading-none">×</button>
      </div>
      <span
        className="inline-block rounded-full px-2 py-0.5 text-xs font-medium mb-3"
        style={{
          background: `${stage.color}1a`,
          color: stage.color,
          border: `1px solid ${stage.color}40`,
        }}
      >
        {stage.label}
      </span>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Capacity</span>
          <span className="text-gray-200">{formatGW(p.capacityMW)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Developer</span>
          <span className="text-gray-200 text-right">{p.developer}</span>
        </div>
        {p.offtaker && (
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Offtaker</span>
            <span className="text-gray-200 text-right">{p.offtaker}</span>
          </div>
        )}
        {p.investment && (
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Investment</span>
            <span className="text-gray-200 text-right">{p.investment}</span>
          </div>
        )}
      </div>
      {p.notes && (
        <p className="mt-3 text-xs text-gray-500 leading-relaxed">{p.notes}</p>
      )}
    </div>
  );
}