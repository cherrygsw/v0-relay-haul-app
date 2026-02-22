"use client"

import { useRef, useState, useCallback } from "react"
import Map, { Source, Layer, Marker, Popup } from "react-map-gl"
import type { MapRef } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import type { Leg, Driver } from "@/lib/mock-data"
import { CITY_COORDS } from "@/lib/mock-data"

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

interface DriverMapProps {
  legs: Leg[]
  driver: Driver
  onSelectLeg?: (legId: string) => void
}

export function DriverMap({ legs, driver, onSelectLeg }: DriverMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [selectedLeg, setSelectedLeg] = useState<Leg | null>(null)
  const [popupCoord, setPopupCoord] = useState<{ lat: number; lng: number } | null>(null)

  // Resolve leg coordinates
  const legCoords = legs.map((leg) => {
    const originKey = `${leg.origin}, ${leg.originState}`
    const destKey = `${leg.destination}, ${leg.destinationState}`
    return {
      leg,
      origin: CITY_COORDS[originKey] || CITY_COORDS[leg.origin] || { lat: 40, lng: -100 },
      destination: CITY_COORDS[destKey] || CITY_COORDS[leg.destination] || { lat: 40, lng: -100 },
    }
  })

  // GeoJSON for all available leg routes
  const legsGeoJSON: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: legCoords.map((lc) => ({
      type: "Feature",
      properties: {
        id: lc.leg.id,
        ratePerMile: lc.leg.ratePerMile,
        isHighPay: lc.leg.ratePerMile >= 1.9,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [lc.origin.lng, lc.origin.lat],
          [lc.destination.lng, lc.destination.lat],
        ],
      },
    })),
  }

  // Fit bounds on load
  const onMapLoad = useCallback(() => {
    if (!mapRef.current || legCoords.length === 0) return
    const allCoords = [
      { lat: driver.currentLat, lng: driver.currentLng },
      ...legCoords.flatMap((lc) => [lc.origin, lc.destination]),
    ]
    const lngs = allCoords.map((c) => c.lng)
    const lats = allCoords.map((c) => c.lat)
    mapRef.current.fitBounds(
      [
        [Math.min(...lngs) - 0.5, Math.min(...lats) - 0.5],
        [Math.max(...lngs) + 0.5, Math.max(...lats) + 0.5],
      ],
      { padding: 50, duration: 1000 }
    )
  }, [legCoords, driver])

  const handleLegClick = (leg: Leg, coord: { lat: number; lng: number }) => {
    setSelectedLeg(leg)
    setPopupCoord(coord)
    onSelectLeg?.(leg.id)
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border" style={{ height: "320px" }}>
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: driver.currentLng,
          latitude: driver.currentLat,
          zoom: 5,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        onLoad={onMapLoad}
        attributionControl={false}
        interactive
      >
        {/* Leg route lines */}
        <Source id="driver-legs" type="geojson" data={legsGeoJSON}>
          {/* Glow */}
          <Layer
            id="legs-glow"
            type="line"
            paint={{
              "line-color": [
                "case",
                ["get", "isHighPay"],
                "oklch(0.65 0.14 45)",
                "oklch(0.5 0.01 260)",
              ],
              "line-width": 6,
              "line-opacity": 0.1,
              "line-blur": 4,
            }}
          />
          {/* Main */}
          <Layer
            id="legs-line"
            type="line"
            paint={{
              "line-color": [
                "case",
                ["get", "isHighPay"],
                "oklch(0.65 0.14 45)",
                "oklch(0.5 0.01 260)",
              ],
              "line-width": 2,
              "line-opacity": 0.6,
              "line-dasharray": [4, 3],
            }}
          />
        </Source>

        {/* Driver current position - pulsing marker */}
        <Marker
          longitude={driver.currentLng}
          latitude={driver.currentLat}
          anchor="center"
        >
          <div className="relative">
            {/* Pulse ring */}
            <div
              className="absolute rounded-full animate-ping"
              style={{
                width: 32,
                height: 32,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "oklch(0.65 0.14 45)",
                opacity: 0.25,
              }}
            />
            {/* Outer ring */}
            <div
              className="rounded-full border-2 flex items-center justify-center"
              style={{
                width: 24,
                height: 24,
                borderColor: "oklch(0.65 0.14 45)",
                backgroundColor: "oklch(0.16 0.008 260)",
              }}
            >
              {/* Inner dot */}
              <div
                className="rounded-full"
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: "oklch(0.65 0.14 45)",
                }}
              />
            </div>
            {/* Label */}
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] font-bold px-2 py-0.5 rounded bg-card/90 border border-border pointer-events-none"
              style={{
                color: "oklch(0.65 0.14 45)",
                backdropFilter: "blur(4px)",
              }}
            >
              You
            </div>
          </div>
        </Marker>

        {/* Pickup markers for each leg */}
        {legCoords.map((lc, i) => {
          const isHighPay = lc.leg.ratePerMile >= 1.9
          const color = isHighPay ? "oklch(0.65 0.14 45)" : "oklch(0.55 0.01 260)"
          return (
            <Marker
              key={`pickup-${lc.leg.id}`}
              longitude={lc.origin.lng}
              latitude={lc.origin.lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                const midLat = (lc.origin.lat + lc.destination.lat) / 2
                const midLng = (lc.origin.lng + lc.destination.lng) / 2
                handleLegClick(lc.leg, { lat: midLat, lng: midLng })
              }}
            >
              <div className="relative cursor-pointer group">
                <div
                  className="rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-125"
                  style={{
                    width: 14,
                    height: 14,
                    borderColor: color,
                    backgroundColor: `color-mix(in oklch, ${color} 25%, transparent)`,
                  }}
                >
                  <div
                    className="rounded-full"
                    style={{ width: 6, height: 6, backgroundColor: color }}
                  />
                </div>
              </div>
            </Marker>
          )
        })}

        {/* Destination markers */}
        {legCoords.map((lc) => {
          const isHighPay = lc.leg.ratePerMile >= 1.9
          const color = isHighPay ? "oklch(0.65 0.14 45)" : "oklch(0.55 0.01 260)"
          return (
            <Marker
              key={`dest-${lc.leg.id}`}
              longitude={lc.destination.lng}
              latitude={lc.destination.lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                const midLat = (lc.origin.lat + lc.destination.lat) / 2
                const midLng = (lc.origin.lng + lc.destination.lng) / 2
                handleLegClick(lc.leg, { lat: midLat, lng: midLng })
              }}
            >
              <div className="relative cursor-pointer group">
                <div
                  className="rounded-sm flex items-center justify-center transition-transform group-hover:scale-125"
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: color,
                    opacity: 0.5,
                    transform: "rotate(45deg)",
                  }}
                />
              </div>
            </Marker>
          )
        })}

        {/* Popup */}
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
            className="driver-map-popup"
          >
            <div className="p-2 min-w-[200px]">
              <p className="text-sm font-semibold text-foreground">
                {selectedLeg.origin} &rarr; {selectedLeg.destination}
              </p>
              <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                <span>{selectedLeg.miles} mi</span>
                {selectedLeg.deadheadMiles > 0 && (
                  <span className="text-warning">+{selectedLeg.deadheadMiles} DH</span>
                )}
              </div>
              <div className="mt-1.5 flex items-center gap-3">
                <span className="text-sm font-bold text-foreground">
                  ${(selectedLeg.rateCents / 100).toLocaleString()}
                </span>
                <span className="text-xs font-mono text-primary">
                  ${selectedLeg.ratePerMile.toFixed(2)}/mi
                </span>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">{selectedLeg.commodity}</p>
              <p className="text-[10px] text-muted-foreground">{selectedLeg.estimatedPickup}</p>
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend */}
      <div
        className="absolute bottom-3 left-3 flex items-center gap-3 rounded-lg bg-card/90 border border-border px-3 py-2 text-[10px] font-semibold"
        style={{ backdropFilter: "blur(8px)" }}
      >
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "oklch(0.65 0.14 45)" }} />
          <span className="text-muted-foreground">$1.90+/mi</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "oklch(0.55 0.01 260)" }} />
          <span className="text-muted-foreground">Standard</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: "oklch(0.65 0.14 45)" }} />
          <span className="text-muted-foreground">You</span>
        </div>
      </div>
    </div>
  )
}
