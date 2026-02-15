"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { api } from "@/lib/api";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

const loadColors: Record<string, string> = {
    LOW: "text-success bg-success/10",
    MEDIUM: "text-warning bg-warning/10",
    HIGH: "text-danger bg-danger/10",
};

const markerBg: Record<string, string> = {
    LOW: "#22c55e",
    MEDIUM: "#f59e0b",
    HIGH: "#ef4444",
};

// Simulate slight random movement around a center point
function jitter(val: number, range = 0.0008): number {
    return val + (Math.random() - 0.5) * range;
}

export default function BusTrackingPage() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<Record<string, mapboxgl.Marker>>({});
    const vehiclesRef = useRef<any[]>([]);

    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    const [routes, setRoutes] = useState<any[]>([]);
    const [activeBuses, setActiveBuses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch data
    useEffect(() => {
        async function fetchData() {
            try {
                const [allRoutes, vehicles] = await Promise.all([
                    api.buses.getRoutes() as Promise<any[]>,
                    api.buses.getActive() as Promise<any[]>
                ]);
                setRoutes(allRoutes);
                setActiveBuses(vehicles);
                vehiclesRef.current = vehicles;
            } catch (err) {
                console.error("Failed to fetch bus data:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Initialize Mapbox map
    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/dark-v11",
            center: [75.5360, 31.3960], // NIT Jalandhar campus
            zoom: 14,
        });

        map.addControl(new mapboxgl.NavigationControl(), "top-left");

        // Add NIT Jalandhar campus marker
        const campusEl = document.createElement("div");
        campusEl.innerHTML = `<div style="
            background: #0ea5e9;
            color: white;
            padding: 6px 10px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 700;
            box-shadow: 0 2px 10px rgba(14,165,233,0.4);
            white-space: nowrap;
        ">📍 NIT Jalandhar</div>`;
        new mapboxgl.Marker({ element: campusEl })
            .setLngLat([75.5360, 31.3960])
            .addTo(map);

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // Place markers when vehicles arrive
    const placeMarkers = useCallback(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;
        const vehicles = vehiclesRef.current;

        vehicles.forEach((v: any) => {
            const isAuto = v.type === "auto" || v.id.startsWith("AUTO");
            const color = markerBg[v.load_status] || "#3b82f6";
            const icon = isAuto ? "🛺" : "🚌";
            const label = v.id;

            if (markersRef.current[v.id]) {
                // Update existing marker position
                markersRef.current[v.id].setLngLat([v.lng, v.lat]);
            } else {
                // Create new marker
                const el = document.createElement("div");
                el.style.cursor = "pointer";
                el.innerHTML = `
                    <div style="
                        background: ${color};
                        color: white;
                        padding: 3px 8px;
                        border-radius: 8px;
                        font-size: 11px;
                        font-weight: 700;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.35);
                        white-space: nowrap;
                        display: flex;
                        align-items: center;
                        gap: 3px;
                        transition: transform 0.3s;
                    ">
                        ${icon} ${label}
                    </div>
                `;
                el.addEventListener("mouseenter", () => el.querySelector("div")!.style.transform = "scale(1.15)");
                el.addEventListener("mouseleave", () => el.querySelector("div")!.style.transform = "scale(1)");

                const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
                    <div style="font-family: system-ui, sans-serif; padding: 4px 2px;">
                        <strong style="font-size: 13px;">${icon} ${label}</strong><br/>
                        <span style="color: #888; font-size: 11px;">Last seen: ${v.last_seen}</span><br/>
                        <span style="color: ${color}; font-weight: 600; font-size: 12px;">Load: ${v.load_status}</span>
                    </div>
                `);

                const marker = new mapboxgl.Marker({ element: el })
                    .setLngLat([v.lng, v.lat])
                    .setPopup(popup)
                    .addTo(map);

                markersRef.current[v.id] = marker;
            }
        });
    }, []);

    // Animate vehicles — move them slightly every 2 seconds
    useEffect(() => {
        if (activeBuses.length === 0) return;

        // Initial placement
        placeMarkers();

        const interval = setInterval(() => {
            vehiclesRef.current = vehiclesRef.current.map(v => ({
                ...v,
                lat: jitter(v.lat),
                lng: jitter(v.lng),
            }));
            placeMarkers();
        }, 2000);

        return () => clearInterval(interval);
    }, [activeBuses, placeMarkers]);

    const getRouteBuses = (routeId: string) => {
        return activeBuses.filter((b) => b.route_id === routeId);
    };

    const busCount = activeBuses.filter(b => !b.type && !b.id.startsWith("AUTO")).length;
    const autoCount = activeBuses.filter(b => b.type === "auto" || b.id.startsWith("AUTO")).length;

    return (
        <div className="md:ml-64 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-6xl mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-text" style={{ fontFamily: "'Cinzel', serif" }}>
                        Bus Tracker
                    </h1>
                    <p className="text-text-muted mt-1">Real-time bus &amp; auto locations around campus</p>
                </div>

                {/* Live Map */}
                <div className="bg-surface border border-border rounded-2xl overflow-hidden mb-6 relative">
                    <div ref={mapContainer} className="h-72 md:h-[28rem] w-full" />
                    {/* Legend */}
                    <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm border border-border rounded-xl px-4 py-3 text-xs z-10 space-y-1.5">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                            <span className="font-medium text-text">{busCount} buses · {autoCount} autos</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-3 h-1.5 rounded bg-[#22c55e]" /> <span className="text-text-muted">Low</span>
                            <span className="w-3 h-1.5 rounded bg-[#f59e0b]" /> <span className="text-text-muted">Med</span>
                            <span className="w-3 h-1.5 rounded bg-[#ef4444]" /> <span className="text-text-muted">High</span>
                        </div>
                    </div>
                </div>

                {/* Routes List */}
                <div className="space-y-4">
                    {loading ? (
                        <p className="text-center text-text-muted">Loading routes...</p>
                    ) : routes.length === 0 ? (
                        <p className="text-center text-text-muted">No routes found.</p>
                    ) : (
                        routes.map((route) => {
                            const routeBuses = getRouteBuses(route.id);

                            return (
                                <div key={route.id} className="bg-surface border border-border rounded-2xl overflow-hidden">
                                    <button
                                        onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
                                        className="w-full p-5 flex items-center justify-between hover:bg-background-alt transition-colors duration-200 cursor-pointer"
                                    >
                                        <div className="text-left">
                                            <h3 className="font-bold text-text">{route.name}</h3>
                                            <p className="text-xs text-text-muted mt-1">{route.frequency} · {routeBuses.length} active</p>
                                        </div>
                                        <svg className={`w-4 h-4 text-text-muted transition-transform duration-200 ${selectedRoute === route.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {selectedRoute === route.id && (
                                        <div className="border-t border-border">
                                            {/* Stops Timeline */}
                                            {route.stops && route.stops.length > 0 && (
                                                <div className="p-5 border-b border-border">
                                                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Route Stops</p>
                                                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                                        {route.stops.map((stop: any, i: number) => (
                                                            <div key={stop.id} className="flex items-center gap-2 shrink-0">
                                                                <div className={`w-3 h-3 rounded-full ${i === 0 ? "bg-primary" : i === route.stops.length - 1 ? "bg-danger" : "bg-border"}`} />
                                                                <span className="text-xs text-text font-medium whitespace-nowrap">{stop.name}</span>
                                                                {i < route.stops.length - 1 && <div className="w-8 h-px bg-border" />}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Active Vehicles */}
                                            <div className="divide-y divide-border">
                                                {routeBuses.length === 0 ? (
                                                    <div className="p-4 text-sm text-text-muted text-center">No vehicles active on this route.</div>
                                                ) : (
                                                    routeBuses.map((bus: any) => {
                                                        const isAuto = bus.type === "auto" || bus.id.startsWith("AUTO");
                                                        return (
                                                            <div key={bus.id} className="p-4 flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                                                        <span className="text-lg">{isAuto ? "🛺" : "🚌"}</span>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-text text-sm">{bus.id}</p>
                                                                        <p className="text-xs text-text-muted">{bus.last_seen}</p>
                                                                    </div>
                                                                </div>
                                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${loadColors[bus.load_status]}`}>
                                                                    {bus.load_status}
                                                                </span>
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
