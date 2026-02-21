// ---- Types ----

export type LegStatus = "OPEN" | "ASSIGNED" | "IN_TRANSIT" | "COMPLETED" | "SEARCHING"

export interface Driver {
  id: string
  name: string
  email: string
  currentLat: number
  currentLng: number
  hosRemainingHours: number
  homeLat: number
  homeLng: number
  homeCity: string
  currentCity: string
  rating: number
  trailerType: string
}

export interface Leg {
  id: string
  loadId: string
  sequence: number
  origin: string
  destination: string
  miles: number
  handoffPoint: string
  rateCents: number
  status: LegStatus
  driverId: string | null
  driverName: string | null
  estimatedPickup: string
  estimatedDelivery: string
}

export interface Load {
  id: string
  origin: string
  destination: string
  miles: number
  status: string
  createdAt: string
  legs: Leg[]
}

export interface BrokerContact {
  id: string
  name: string
  company: string
  email: string
  lastLoad: string
  lastWorkedDate: string
}

export interface NearbyLoad {
  id: string
  origin: string
  destination: string
  miles: number
  rateCents: number
  pickupTime: string
  direction: string
}

// ---- Mock Data ----

export const DEMO_DRIVERS: Driver[] = [
  {
    id: "d1",
    name: "Marcus Thompson",
    email: "marcus.t@email.com",
    currentLat: 41.88,
    currentLng: -87.63,
    hosRemainingHours: 9.5,
    homeLat: 39.74,
    homeLng: -104.99,
    homeCity: "Denver, CO",
    currentCity: "Chicago, IL",
    rating: 4.8,
    trailerType: "Dry Van",
  },
  {
    id: "d2",
    name: "Sandra Nguyen",
    email: "sandra.n@email.com",
    currentLat: 41.66,
    currentLng: -91.53,
    hosRemainingHours: 7.0,
    homeLat: 41.26,
    homeLng: -95.94,
    homeCity: "Omaha, NE",
    currentCity: "Iowa City, IA",
    rating: 4.9,
    trailerType: "Reefer",
  },
  {
    id: "d3",
    name: "Carlos Ramirez",
    email: "carlos.r@email.com",
    currentLat: 41.12,
    currentLng: -100.76,
    hosRemainingHours: 10.0,
    homeLat: 40.76,
    homeLng: -111.89,
    homeCity: "Salt Lake City, UT",
    currentCity: "North Platte, NE",
    rating: 4.6,
    trailerType: "Flatbed",
  },
  {
    id: "d4",
    name: "Tanya Brooks",
    email: "tanya.b@email.com",
    currentLat: 34.89,
    currentLng: -117.02,
    hosRemainingHours: 5.5,
    homeLat: 33.94,
    homeLng: -118.41,
    homeCity: "Los Angeles, CA",
    currentCity: "Barstow, CA",
    rating: 4.7,
    trailerType: "Dry Van",
  },
]

export const DEMO_LOAD: Load = {
  id: "L-4821",
  origin: "Chicago, IL",
  destination: "Los Angeles, CA",
  miles: 2015,
  status: "IN_PROGRESS",
  createdAt: "2026-02-21T08:00:00Z",
  legs: [
    {
      id: "leg-1",
      loadId: "L-4821",
      sequence: 1,
      origin: "Chicago, IL",
      destination: "Iowa City, IA",
      miles: 218,
      handoffPoint: "Pilot - Joliet IL",
      rateCents: 65400,
      status: "IN_TRANSIT",
      driverId: "d1",
      driverName: "Marcus Thompson",
      estimatedPickup: "8:00 AM",
      estimatedDelivery: "12:30 PM",
    },
    {
      id: "leg-2",
      loadId: "L-4821",
      sequence: 2,
      origin: "Iowa City, IA",
      destination: "North Platte, NE",
      miles: 540,
      handoffPoint: "Flying J - Iowa City IA",
      rateCents: 162000,
      status: "ASSIGNED",
      driverId: "d2",
      driverName: "Sandra Nguyen",
      estimatedPickup: "1:00 PM",
      estimatedDelivery: "9:00 PM",
    },
    {
      id: "leg-3",
      loadId: "L-4821",
      sequence: 3,
      origin: "North Platte, NE",
      destination: "Barstow, CA",
      miles: 892,
      handoffPoint: "Love's - North Platte NE",
      rateCents: 267600,
      status: "SEARCHING",
      driverId: null,
      driverName: null,
      estimatedPickup: "6:00 AM +1",
      estimatedDelivery: "6:00 PM +1",
    },
    {
      id: "leg-4",
      loadId: "L-4821",
      sequence: 4,
      origin: "Barstow, CA",
      destination: "Los Angeles, CA",
      miles: 137,
      handoffPoint: "Flying J - Barstow CA",
      rateCents: 41100,
      status: "OPEN",
      driverId: null,
      driverName: null,
      estimatedPickup: "7:00 PM +1",
      estimatedDelivery: "10:00 PM +1",
    },
  ],
}

export const AVAILABLE_LEGS: Leg[] = [
  {
    id: "leg-open-1",
    loadId: "L-4821",
    sequence: 3,
    origin: "North Platte, NE",
    destination: "Barstow, CA",
    miles: 892,
    handoffPoint: "Love's - North Platte NE",
    rateCents: 267600,
    status: "OPEN",
    driverId: null,
    driverName: null,
    estimatedPickup: "6:00 AM Tomorrow",
    estimatedDelivery: "6:00 PM Tomorrow",
  },
  {
    id: "leg-open-2",
    loadId: "L-5102",
    sequence: 1,
    origin: "Denver, CO",
    destination: "Kansas City, MO",
    miles: 605,
    handoffPoint: "Pilot - Hays KS",
    rateCents: 181500,
    status: "OPEN",
    driverId: null,
    driverName: null,
    estimatedPickup: "7:00 AM Tomorrow",
    estimatedDelivery: "5:00 PM Tomorrow",
  },
  {
    id: "leg-open-3",
    loadId: "L-5210",
    sequence: 2,
    origin: "Omaha, NE",
    destination: "Des Moines, IA",
    miles: 150,
    handoffPoint: "Love's - Council Bluffs IA",
    rateCents: 45000,
    status: "OPEN",
    driverId: null,
    driverName: null,
    estimatedPickup: "10:00 AM Today",
    estimatedDelivery: "1:00 PM Today",
  },
  {
    id: "leg-open-4",
    loadId: "L-5301",
    sequence: 1,
    origin: "Salt Lake City, UT",
    destination: "Boise, ID",
    miles: 340,
    handoffPoint: "Flying J - Twin Falls ID",
    rateCents: 102000,
    status: "OPEN",
    driverId: null,
    driverName: null,
    estimatedPickup: "6:00 AM Tomorrow",
    estimatedDelivery: "12:00 PM Tomorrow",
  },
]

export const DEMO_CONTACTS: BrokerContact[] = [
  {
    id: "c1",
    name: "Bob Martinez",
    company: "Swift Brokerage",
    email: "bob@swiftbrokerage.com",
    lastLoad: "3 reefer loads to Dallas",
    lastWorkedDate: "November 2025",
  },
  {
    id: "c2",
    name: "Linda Chen",
    company: "MidWest Freight",
    email: "linda@midwestfreight.com",
    lastLoad: "Flatbed Chicago to KC",
    lastWorkedDate: "September 2025",
  },
  {
    id: "c3",
    name: "David Park",
    company: "Pacific Logistics",
    email: "dpark@pacificlog.com",
    lastLoad: "Dry van LA to Phoenix",
    lastWorkedDate: "January 2026",
  },
]

export const NEARBY_LOADS: NearbyLoad[] = [
  {
    id: "nl-1",
    origin: "Iowa City, IA",
    destination: "Omaha, NE",
    miles: 265,
    rateCents: 79500,
    pickupTime: "Tomorrow 7:00 AM",
    direction: "West (toward Denver)",
  },
  {
    id: "nl-2",
    origin: "Des Moines, IA",
    destination: "Minneapolis, MN",
    miles: 244,
    rateCents: 73200,
    pickupTime: "Tomorrow 8:00 AM",
    direction: "North",
  },
  {
    id: "nl-3",
    origin: "Iowa City, IA",
    destination: "St. Louis, MO",
    miles: 270,
    rateCents: 94500,
    pickupTime: "Today 3:00 PM",
    direction: "South",
  },
]

export const TRUCK_STOP_COORDS: { name: string; lat: number; lng: number }[] = [
  { name: "Chicago, IL", lat: 41.88, lng: -87.63 },
  { name: "Joliet, IL", lat: 41.52, lng: -88.08 },
  { name: "Iowa City, IA", lat: 41.66, lng: -91.53 },
  { name: "North Platte, NE", lat: 41.12, lng: -100.76 },
  { name: "Barstow, CA", lat: 34.89, lng: -117.02 },
  { name: "Los Angeles, CA", lat: 34.05, lng: -118.24 },
]
