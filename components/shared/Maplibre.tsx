"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import type { MapLayerMouseEvent, MapLibreEvent } from "maplibre-gl";
import { ReactNode, useMemo } from "react";
import { Map, Marker } from "react-map-gl/maplibre";
import mapStyle from "@/lib/style";
import { cn } from "@/lib/utils";

interface MaplibreProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  longitude?: number;
  latitude?: number;
  zoom?: number;
  pitch?: number;
  children?: ReactNode;
}
export default function Maplibre({
  className,
  width = "100%",
  height = "100%",
  longitude = 127.07973932868816,
  latitude = 37.511393758396466,
  zoom = 18,
  pitch = 65,
  children,
}: MaplibreProps) {
  const onLoad = (e: MapLibreEvent) => {
    const map = e.target;

    map.on("click", "building-3d", handleClickLayer);
  };
  const handleClickLayer = (e: MapLayerMouseEvent) => {
    console.info(e.features);
  };
  const style = useMemo(() => {
    const style = {};
    if (typeof width === "number") Object.assign(style, { width: width + "px" });
    else if (typeof width === "string") Object.assign(style, { width });

    if (typeof height === "number") Object.assign(style, { height: height + "px" });
    else if (typeof height === "string") Object.assign(style, { height });

    return style;
  }, [width, height]);

  return (
    <div className={cn(className)} style={style}>
      <Map
        initialViewState={{
          longitude,
          latitude,
          zoom,
          pitch,
        }}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
        onLoad={onLoad}
        attributionControl={false}
      >
        {children}
      </Map>
    </div>
  );
}
