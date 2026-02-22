"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import Map, { Source, Layer, Marker, Popup } from "react-map-gl"
import type { MapRef } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import type { Leg, Driver, ShortHaul } from "@/lib/mock-data"
import { CITY_COORDS } from "@/lib/mock-data"

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

type MapMode = "relay" | "quick-trips"

interface DriverMapProps {
  legs: Leg[]
  shortHauls: ShortHaul[]
  driver: Driver
  onSelectLeg?: (legId: string) => void
}

// Colors
const AMBER = "oklch(0.65 0.14 45)"
const MUTED = "oklch(0.55 0.01 260)"
const TEAL = "oklch(0.72 0.12 192)"
const TEAL_DIM = "oklch(0.55 0.08 192)"
const CARD_BG = "oklch(0.16 0.008 260)"

function resolveCoord(city: string, state: string) {
  return (
    CITY_COORDS[`${city}, ${state}`] ||
    CITY_COORDS[city] ||
    { lat: 41.66, lng: -91.53 }
  )
}

export function DriverMap({ legs, shortHauls, driver, onSelectLeg }: DriverMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [mode, setMode] = useState<MapMode>("relay")
  const [selectedLeg, setSelectedLeg] = useState<Leg | null>(null)
  const [selectedTrip, setSelectedTrip] = useState<ShortHaul | null>(null)
  const [popupCoord, setPopupCoord] = useState<{ lat: number; lng: number } | null>(null)

  // Relay leg coordinates
  const legCoords = legs.map((leg) => ({
    leg,
    origin: resolveCoord(leg.origin, leg.originState),
    destination: resolveCoord(leg.destination, leg.destinationState),
  }))

  // Short-haul trip coordinates
  const tripCoords = shortHauls.map((trip) => ({
    trip,
    origin: resolveCoord(trip.origin, trip.originState),
    destination: resolveCoord(trip.destination, trip.destinationState),
  }))

  // GeoJSON for relay legs
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

  // GeoJSON for short-haul trips
  const tripsGeoJSON: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: tripCoords.map((tc) => ({
      type: "Feature",
      properties: {
        id: tc.trip.id,
        pay: tc.trip.pay,
        isHighPay: tc.trip.pay >= 280,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [tc.origin.lng, tc.origin.lat],
          [tc.destination.lng, tc.destination.lat],
        ],
      },
    })),
  }

  // Fit bounds based on mode
  const fitBounds = useCallback(
    (currentMode: MapMode) => {
      if (!mapRef.current) return
      const driverCoord = { lat: driver.currentLat, lng: driver.currentLng }

      if (currentMode === "relay") {
        if (legCoords.length === 0) return
        const allCoords = [driverCoord, ...legCoords.flatMap((lc) => [lc.origin, lc.destination])]
        const lngs = allCoords.map((c) => c.lng)
        const lats = allCoords.map((c) => c.lat)
        mapRef.current.fitBounds(
          [
            [Math.min(...lngs) - 0.5, Math.min(...lats) - 0.5],
            [Math.max(...lngs) + 0.5, Math.max(...lats) + 0.5],
          ],
          { padding: 50, duration: 800 }
        )
      } else {
        if (tripCoords.length === 0) return
        const allCoords = [driverCoord, ...tripCoords.flatMap((tc) => [tc.origin, tc.destination])]
        const lngs = allCoords.map((c) => c.lng)
        const lats = allCoords.map((c) => c.lat)
        mapRef.current.fitBounds(
          [
            [Math.min(...lngs) - 0.15, Math.min(...lats) - 0.15],
            [Math.max(...lngs) + 0.15, Math.max(...lats) + 0.15],
          ],
          { padding: 50, duration: 800 }
        )
      }
    },
    [legCoords, tripCoords, driver]
  )

  const onMapLoad = useCallback(() => {
    fitBounds(mode)
  }, [fitBounds, mode])

  // Re-fit when mode changes
  useEffect(() => {
    setSelectedLeg(null)
    setSelectedTrip(null)
    setPopupCoord(null)
    fitBounds(mode)
  }, [mode, fitBounds])

  const handleLegClick = (leg: Leg, coord: { lat: number; lng: number }) => {
    setSelectedLeg(leg)
    setSelectedTrip(null)
    setPopupCoord(coord)
    onSelectLeg?.(leg.id)
  }

  const handleTripClick = (trip: ShortHaul, coord: { lat: number; lng: number }) => {
    setSelectedTrip(trip)
    setSelectedLeg(null)
    setPopupCoord(coord)
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border" style={{ height: "340px" }}>
      {/* Toggle tabs */}
      <div
        className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 rounded-lg p-1 border border-border"
        style={{ backgroundColor: "oklch(0.14 0.005 260 / 0.9)", backdropFilter: "blur(8px)" }}
      >
        <button
          onClick={() => setMode("relay")}
          className="rounded-md px-3 py-1.5 text-[11px] font-semibold transition-colors"
          style={{
            backgroundColor: mode === "relay" ? AMBER : "transparent",
            color: mode === "relay" ? "oklch(0.14 0.005 260)" : "oklch(0.65 0.02 260)",
          }}
        >
          Relay Legs
        </button>
        <button
          onClick={() => setMode("quick-trips")}
          className="rounded-md px-3 py-1.5 text-[11px] font-semibold transition-colors"
          style={{
            backgroundColor: mode === "quick-trips" ? TEAL : "transparent",
            color: mode === "quick-trips" ? "oklch(0.14 0.005 260)" : "oklch(0.65 0.02 260)",
          }}
        >
          Quick Trips
        </button>
      </div>

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
        {/* ---- RELAY LEGS MODE ---- */}
        {mode === "relay" && (
          <>
            <Source id="driver-legs" type="geojson" data={legsGeoJSON}>
              <Layer
                id="legs-glow"
                type="line"
                paint={{
                  "line-color": ["case", ["get", "isHighPay"], AMBER, MUTED],
                  "line-width": 6,
                  "line-opacity": 0.1,
                  "line-blur": 4,
                }}
              />
              <Layer
                id="legs-line"
                type="line"
                paint={{
                  "line-color": ["case", ["get", "isHighPay"], AMBER, MUTED],
                  "line-width": 2,
                  "line-opacity": 0.6,
                  "line-dasharray": [4, 3],
                }}
              />
            </Source>

            {/* Pickup markers */}
            {legCoords.map((lc) => {
              const isHighPay = lc.leg.ratePerMile >= 1.9
              const color = isHighPay ? AMBER : MUTED
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
                      <div className="rounded-full" style={{ width: 6, height: 6, backgroundColor: color }} />
                    </div>
                  </div>
                </Marker>
              )
            })}

            {/* Destination markers */}
            {legCoords.map((lc) => {
              const isHighPay = lc.leg.ratePerMile >= 1.9
              const color = isHighPay ? AMBER : MUTED
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
          </>
        )}

        {/* ---- QUICK TRIPS MODE ---- */}
        {mode === "quick-trips" && (
          <>
            <Source id="short-hauls" type="geojson" data={tripsGeoJSON}>
              <Layer
                id="trips-glow"
                type="line"
                paint={{
                  "line-color": ["case", ["get", "isHighPay"], TEAL, TEAL_DIM],
                  "line-width": 8,
                  "line-opacity": 0.08,
                  "line-blur": 6,
                }}
              />
              <Layer
                id="trips-line"
                type="line"
                paint={{
                  "line-color": ["case", ["get", "isHighPay"], TEAL, TEAL_DIM],
                  "line-width": 2.5,
                  "line-opacity": 0.7,
                }}
              />
            </Source>

            {/* Origin markers */}
            {tripCoords.map((tc) => {
              const isHigh = tc.trip.pay >= 280
              const color = isHigh ? TEAL : TEAL_DIM
              return (
                <Marker
                  key={`trip-origin-${tc.trip.id}`}
                  longitude={tc.origin.lng}
                  latitude={tc.origin.lat}
                  anchor="center"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation()
                    const midLat = (tc.origin.lat + tc.destination.lat) / 2
                    const midLng = (tc.origin.lng + tc.destination.lng) / 2
                    handleTripClick(tc.trip, { lat: midLat, lng: midLng })
                  }}
                >
                  <div className="relative cursor-pointer group">
                    <div
                      className="rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-125"
                      style={{
                        width: 16,
                        height: 16,
                        borderColor: color,
                        backgroundColor: `color-mix(in oklch, ${color} 20%, transparent)`,
                      }}
                    >
                      <div className="rounded-full" style={{ width: 7, height: 7, backgroundColor: color }} />
                    </div>
                  </div>
                </Marker>
              )
            })}

            {/* Destination markers */}
            {tripCoords.map((tc) => {
              const isHigh = tc.trip.pay >= 280
              const color = isHigh ? TEAL : TEAL_DIM
              return (
                <Marker
                  key={`trip-dest-${tc.trip.id}`}
                  longitude={tc.destination.lng}
                  latitude={tc.destination.lat}
                  anchor="center"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation()
                    const midLat = (tc.origin.lat + tc.destination.lat) / 2
                    const midLng = (tc.origin.lng + tc.destination.lng) / 2
                    handleTripClick(tc.trip, { lat: midLat, lng: midLng })
                  }}
                >
                  <div className="relative cursor-pointer group">
                    <div
                      className="rounded-sm transition-transform group-hover:scale-125"
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
          </>
        )}

        {/* Driver current position - shared across both modes */}
        <Marker longitude={driver.currentLng} latitude={driver.currentLat} anchor="center">
          <div className="relative">
            <div
              className="absolute rounded-full animate-ping"
              style={{
                width: 32,
                height: 32,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: mode === "relay" ? AMBER : TEAL,
                opacity: 0.25,
              }}
            />
            <div
              className="rounded-full border-2 flex items-center justify-center"
              style={{
                width: 24,
                height: 24,
                borderColor: mode === "relay" ? AMBER : TEAL,
                backgroundColor: CARD_BG,
              }}
            >
              <div
                className="rounded-full"
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: mode === "relay" ? AMBER : TEAL,
                }}
              />
            </div>
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] font-bold px-2 py-0.5 rounded bg-card/90 border border-border pointer-events-none"
              style={{
                color: mode === "relay" ? AMBER : TEAL,
                backdropFilter: "blur(4px)",
              }}
            >
              You
            </div>
          </div>
        </Marker>

        {/* Relay leg popup */}
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
          >
            <div className="p-3 min-w-[220px]">
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

        {/* Quick trip popup */}
        {selectedTrip && popupCoord && (
          <Popup
            longitude={popupCoord.lng}
            latitude={popupCoord.lat}
            anchor="bottom"
            onClose={() => {
              setSelectedTrip(null)
              setPopupCoord(null)
            }}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="p-3 min-w-[220px]">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `color-mix(in oklch, ${TEAL} 20%, transparent)`, color: TEAL }}
                >
                  {selectedTrip.type}
                </span>
                <span className="text-[10px] text-muted-foreground">{selectedTrip.duration}</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {selectedTrip.origin} &rarr; {selectedTrip.destination}
              </p>
              <div className="mt-1.5 flex items-center gap-3">
                <span className="text-sm font-bold text-foreground">${selectedTrip.pay}</span>
                <span className="text-xs text-muted-foreground">{selectedTrip.miles} mi</span>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">{selectedTrip.company}</p>
              <p className="text-[10px] text-muted-foreground">{selectedTrip.commodity}</p>
              <p className="text-[10px] text-muted-foreground">{selectedTrip.pickupTime}</p>
              {selectedTrip.notes && (
                <p className="mt-1 text-[9px] text-muted-foreground/70 italic">{selectedTrip.notes}</p>
              )}
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend */}
      <div
        className="absolute bottom-3 left-3 flex items-center gap-3 rounded-lg bg-card/90 border border-border px-3 py-2 text-[10px] font-semibold"
        style={{ backdropFilter: "blur(8px)" }}
      >
        {mode === "relay" ? (
          <>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: AMBER }} />
              <span className="text-muted-foreground">$1.90+/mi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: MUTED }} />
              <span className="text-muted-foreground">Standard</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: TEAL }} />
              <span className="text-muted-foreground">$280+</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: TEAL_DIM }} />
              <span className="text-muted-foreground">Standard</span>
            </div>
          </>
        )}
        <div className="flex items-center gap-1.5">
          <div
            className="h-2.5 w-2.5 rounded-full border-2"
            style={{ borderColor: mode === "relay" ? AMBER : TEAL }}
          />
          <span className="text-muted-foreground">You</span>
        </div>
      </div>

      {/* Trip count badge */}
      <div
        className="absolute top-3 right-3 z-10 rounded-lg border border-border px-2.5 py-1.5 text-[10px] font-semibold text-muted-foreground"
        style={{ backgroundColor: "oklch(0.14 0.005 260 / 0.9)", backdropFilter: "blur(8px)" }}
      >
        {mode === "relay" ? `${legs.length} legs` : `${shortHauls.length} trips`}
      </div>
    </div>
  )
}
