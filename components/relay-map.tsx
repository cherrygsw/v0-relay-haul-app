"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import Map, { Source, Layer, Marker, Popup } from "react-map-gl"
import type { MapRef } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import type { Leg, LegStatus } from "@/lib/mock-data"
import { CITY_COORDS } from "@/lib/mock-data"

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

function statusColor(status: LegStatus): string {
  switch (status) {
    case "IN_TRANSIT":
    case "COMPLETED":
      return "oklch(0.65 0.2 150)"
    case "ASSIGNED":
      return "oklch(0.65 0.14 45)"
    case "SEARCHING":
      return "oklch(0.75 0.15 70)"
    default:
      return "oklch(0.55 0.01 260)"
  }
}

function statusLabel(status: LegStatus): string {
  switch (status) {
    case "IN_TRANSIT":
      return "In Transit"
    case "COMPLETED":
      return "Completed"
    case "ASSIGNED":
      return "Assigned"
    case "SEARCHING":
      return "Searching"
    default:
      return "Open"
  }
}

interface RelayMapProps {
  legs: Leg[]
}

export function RelayMap({ legs }: RelayMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [selectedLeg, setSelectedLeg] = useState<Leg | null>(null)
  const [popupCoord, setPopupCoord] = useState<{ lat: number; lng: number } | null>(null)

  // Build stop coordinates from legs
  const stops = legs.map((leg) => {
    const originKey = `${leg.origin}, ${leg.originState}`
    const destKey = `${leg.destination}, ${leg.destinationState}`
    return {
      leg,
      origin: CITY_COORDS[originKey] || CITY_COORDS[leg.origin] || { lat: 40, lng: -100 },
      destination: CITY_COORDS[destKey] || CITY_COORDS[leg.destination] || { lat: 40, lng: -100 },
    }
  })

  // Build GeoJSON for route lines, one feature per leg for individual colors
  const routeGeoJSON: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: stops.map((s, i) => ({
      type: "Feature",
      properties: {
        status: s.leg.status,
        color: statusColor(s.leg.status),
        sequence: s.leg.sequence,
        isActive: s.leg.status === "IN_TRANSIT" || s.leg.status === "ASSIGNED",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [s.origin.lng, s.origin.lat],
          [s.destination.lng, s.destination.lat],
        ],
      },
    })),
  }

  // Fit bounds on mount
  const onMapLoad = useCallback(() => {
    if (!mapRef.current || stops.length === 0) return
    const allCoords = stops.flatMap((s) => [s.origin, s.destination])
    const lngs = allCoords.map((c) => c.lng)
    const lats = allCoords.map((c) => c.lat)
    mapRef.current.fitBounds(
      [
        [Math.min(...lngs) - 1, Math.min(...lats) - 1],
        [Math.max(...lngs) + 1, Math.max(...lats) + 1],
      ],
      { padding: 50, duration: 1000 }
    )
  }, [stops])

  // Unique stop markers (origin of first leg + all destinations)
  const markerPoints = [
    { coord: stops[0]?.origin, label: legs[0]?.origin, isOrigin: true, isDestination: false, legIndex: 0 },
    ...stops.map((s, i) => ({
      coord: s.destination,
      label: s.leg.destination,
      isOrigin: false,
      isDestination: i === stops.length - 1,
      legIndex: i,
    })),
  ]

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border" style={{ height: "400px" }}>
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: -100,
          latitude: 39,
          zoom: 3.5,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        onLoad={onMapLoad}
        attributionControl={false}
        interactive
      >
        {/* Route lines */}
        <Source id="relay-route" type="geojson" data={routeGeoJSON}>
          {/* Glow layer */}
          <Layer
            id="route-glow"
            type="line"
            paint={{
              "line-color": ["get", "color"],
              "line-width": 8,
              "line-opacity": 0.15,
              "line-blur": 6,
            }}
          />
          {/* Main line */}
          <Layer
            id="route-line"
            type="line"
            paint={{
              "line-color": ["get", "color"],
              "line-width": 3,
              "line-opacity": [
                "case",
                ["get", "isActive"],
                0.9,
                0.5,
              ],
              "line-dasharray": [
                "case",
                ["get", "isActive"],
                ["literal", [1, 0]],
                ["literal", [4, 3]],
              ],
            }}
          />
        </Source>

        {/* Stop markers */}
        {markerPoints.map((point, i) => {
          const isEndpoint = point.isOrigin || point.isDestination
          const leg = legs[point.legIndex]
          const color = point.isOrigin
            ? statusColor(legs[0]?.status ?? "OPEN")
            : statusColor(leg?.status ?? "OPEN")

          return (
            <Marker
              key={`marker-${i}`}
              longitude={point.coord.lng}
              latitude={point.coord.lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                setSelectedLeg(leg)
                setPopupCoord(point.coord)
              }}
            >
              <div className="relative cursor-pointer group">
                {/* Outer pulse for active legs */}
                {(leg?.status === "IN_TRANSIT" || leg?.status === "SEARCHING") && (
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{
                      backgroundColor: color,
                      opacity: 0.3,
                      width: isEndpoint ? 24 : 18,
                      height: isEndpoint ? 24 : 18,
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}
                {/* Outer ring */}
                <div
                  className="rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-125"
                  style={{
                    width: isEndpoint ? 20 : 14,
                    height: isEndpoint ? 20 : 14,
                    borderColor: color,
                    backgroundColor: `color-mix(in oklch, ${color} 20%, transparent)`,
                  }}
                >
                  {/* Inner dot */}
                  <div
                    className="rounded-full"
                    style={{
                      width: isEndpoint ? 8 : 6,
                      height: isEndpoint ? 8 : 6,
                      backgroundColor: color,
                    }}
                  />
                </div>
                {/* Label */}
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap text-[10px] font-semibold px-1.5 py-0.5 rounded bg-card/90 border border-border text-foreground pointer-events-none"
                  style={{ backdropFilter: "blur(4px)" }}
                >
                  {point.label}
                </div>
              </div>
            </Marker>
          )
        })}

        {/* Popup on click */}
        {selectedLeg && popupCoord && (
          <Popup
            longitude={popupCoord.lng}
            latitude={popupCoord.lat}
            anchor="bottom"
            onClose={() => {
              setSelectedLeg(null)
              setPopupCoord(null)
            }}
            closeButton={true}
            closeOnClick={false}
            className="relay-map-popup"
          >
            <div className="p-2 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{
                    backgroundColor: `color-mix(in oklch, ${statusColor(selectedLeg.status)} 20%, transparent)`,
                    color: statusColor(selectedLeg.status),
                  }}
                >
                  {selectedLeg.sequence}
                </span>
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `color-mix(in oklch, ${statusColor(selectedLeg.status)} 15%, transparent)`,
                    color: statusColor(selectedLeg.status),
                  }}
                >
                  {statusLabel(selectedLeg.status)}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {selectedLeg.origin} &rarr; {selectedLeg.destination}
              </p>
              <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                <span>{selectedLeg.miles} mi</span>
                <span>${selectedLeg.ratePerMile.toFixed(2)}/mi</span>
              </div>
              {selectedLeg.driverName && (
                <p className="mt-1.5 text-xs font-medium text-primary">{selectedLeg.driverName}</p>
              )}
              <p className="mt-1 text-[10px] text-muted-foreground">{selectedLeg.commodity}</p>
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend overlay */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-lg bg-card/90 border border-border px-3 py-2 text-[10px] font-semibold" style={{ backdropFilter: "blur(8px)" }}>
        {[
          { label: "In Transit", color: "oklch(0.65 0.2 150)" },
          { label: "Assigned", color: "oklch(0.65 0.14 45)" },
          { label: "Searching", color: "oklch(0.75 0.15 70)" },
          { label: "Open", color: "oklch(0.55 0.01 260)" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
