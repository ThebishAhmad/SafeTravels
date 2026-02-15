"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const loadColors: Record<string, string> = {
    LOW: "text-success bg-success/10",
    MEDIUM: "text-warning bg-warning/10",
    HIGH: "text-danger bg-danger/10",
};

export default function BusTrackingPage() {
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    const [routes, setRoutes] = useState<any[]>([]);
    const [activeBuses, setActiveBuses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [allRoutes, buses] = await Promise.all([
                    api.buses.getRoutes(),
                    api.buses.getActive()
                ]);
                setRoutes(allRoutes);
                setActiveBuses(buses);
            } catch (err) {
                console.error("Failed to fetch bus data:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const getRouteBuses = (routeId: string) => {
        return activeBuses.filter((b) => b.routeId === routeId);
    };

    return (
        <div className="md:ml-64 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-6xl mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-text" style={{ fontFamily: "'Cinzel', serif" }}>
                        Bus Tracker
                    </h1>
                    <p className="text-text-muted mt-1">Real-time bus locations and arrival estimates</p>
                </div>

                {/* Map */}
                <div className="bg-surface border border-border rounded-2xl overflow-hidden mb-6">
                    <div className="h-64 md:h-96 bg-background-alt flex items-center justify-center text-text-muted relative">
                        <div className="text-center">
                            <svg className="w-16 h-16 mx-auto mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <p className="font-medium">Live Tracking Map</p>
                            <p className="text-xs mt-1 opacity-60">Mapbox integration renders here</p>
                        </div>
                        {/* Floating bus indicators */}
                        <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm border border-border rounded-xl px-3 py-2 text-xs">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                                <span className="font-medium text-text">{activeBuses.length} buses online</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Routes List */}
                <div className="space-y-4">
                    {loading ? (
                        <p className="text-center text-text-muted">Loading routes...</p>
                    ) : (
                        routes.map((route) => {
                            const routeBuses = getRouteBuses(route.id);
                            const nextBusEta = routeBuses[0]?.eta || "N/A";

                            return (
                                <div key={route.id} className="bg-surface border border-border rounded-2xl overflow-hidden">
                                    <button
                                        onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
                                        className="w-full p-5 flex items-center justify-between hover:bg-background-alt transition-colors duration-200 cursor-pointer"
                                    >
                                        <div className="text-left">
                                            <h3 className="font-bold text-text">{route.name}</h3>
                                            <p className="text-xs text-text-muted mt-1">{route.frequency} · {route.stops.length} stops</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-primary">
                                                {nextBusEta}
                                            </span>
                                            <svg className={`w-4 h-4 text-text-muted transition-transform duration-200 ${selectedRoute === route.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </button>

                                    {selectedRoute === route.id && (
                                        <div className="border-t border-border">
                                            {/* Stops Timeline */}
                                            <div className="p-5 border-b border-border">
                                                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Route Stops</p>
                                                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                                    {route.stops.map((stop: any, i: number) => (
                                                        <div key={stop.id} className="flex items-center gap-2 shrink-0">
                                                            <div className="flex flex-col items-center">
                                                                <div className={`w-3 h-3 rounded-full ${i === 0 ? "bg-primary" : i === route.stops.length - 1 ? "bg-danger" : "bg-border"}`} />
                                                            </div>
                                                            <span className="text-xs text-text font-medium whitespace-nowrap">{stop.name}</span>
                                                            {i < route.stops.length - 1 && (
                                                                <div className="w-8 h-px bg-border" />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Active Buses on this Route */}
                                            <div className="divide-y divide-border">
                                                {routeBuses.length === 0 ? (
                                                    <div className="p-4 text-sm text-text-muted text-center">No buses active on this route.</div>
                                                ) : (
                                                    routeBuses.map((bus: any) => (
                                                        <div key={bus.id} className="p-4 flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                                                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8m-8 4h4m-6 4h10M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                                                                    </svg>
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-text text-sm">{bus.id}</p>
                                                                    <p className="text-xs text-text-muted">{bus.lastSeen}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${loadColors[bus.load]}`}>
                                                                    {bus.load}
                                                                </span>
                                                                <span className="text-sm font-bold text-primary">ETA {bus.eta}</span>
                                                            </div>
                                                        </div>
                                                    ))
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
