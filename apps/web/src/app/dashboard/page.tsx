"use client";

import Link from "next/link";

const quickActions = [
    { href: "/bus-tracking", label: "Track Bus", color: "bg-primary", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
    { href: "/ride-pool", label: "Find Ride", color: "bg-cta", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { href: "/complaints", label: "Report Issue", color: "bg-warning", icon: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const activeBuses = [
    { id: "BUS-01", route: "Campus → City Stand", eta: "5 min", load: "LOW", color: "text-success" },
    { id: "BUS-02", route: "Campus → Railway Station", eta: "12 min", load: "MEDIUM", color: "text-warning" },
    { id: "BUS-03", route: "Campus → Bus Stand", eta: "20 min", load: "HIGH", color: "text-danger" },
];

const recentRides = [
    { dest: "Jalandhar City Station", time: "Today 4:30 PM", riders: 3, fare: "₹25/person", status: "OPEN" },
    { dest: "Railway Station", time: "Today 5:00 PM", riders: 2, fare: "₹30/person", status: "OPEN" },
];

export default function DashboardPage() {
    return (
        <div className="md:ml-64 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-text" style={{ fontFamily: "'Cinzel', serif" }}>
                        Good Morning, Student
                    </h1>
                    <p className="text-text-muted mt-1">Here&apos;s your campus transport overview</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {quickActions.map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            className={`${action.color} text-white rounded-2xl p-5 flex flex-col items-center gap-3 hover:opacity-90 transition-opacity duration-200 cursor-pointer`}
                        >
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                            </svg>
                            <span className="text-sm font-semibold">{action.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Map Placeholder */}
                <div className="bg-surface border border-border rounded-2xl overflow-hidden mb-8">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <h2 className="font-bold text-text">Live Campus Map</h2>
                        <span className="flex items-center gap-1.5 text-xs text-success font-medium">
                            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                            3 buses active
                        </span>
                    </div>
                    <div className="h-64 md:h-80 bg-background-alt flex items-center justify-center text-text-muted">
                        <div className="text-center">
                            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <p className="text-sm">Interactive Map</p>
                            <p className="text-xs mt-1 opacity-60">Connect Mapbox API to enable live tracking</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Active Buses */}
                    <div className="bg-surface border border-border rounded-2xl">
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <h2 className="font-bold text-text">Active Buses</h2>
                            <Link href="/bus-tracking" className="text-xs text-cta font-medium hover:underline cursor-pointer">View All</Link>
                        </div>
                        <div className="divide-y divide-border">
                            {activeBuses.map((bus) => (
                                <div key={bus.id} className="p-4 flex items-center justify-between hover:bg-background-alt transition-colors duration-200 cursor-pointer">
                                    <div>
                                        <p className="font-semibold text-text text-sm">{bus.id}</p>
                                        <p className="text-xs text-text-muted mt-0.5">{bus.route}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-primary text-sm">ETA {bus.eta}</p>
                                        <p className={`text-xs font-medium mt-0.5 ${bus.color}`}>{bus.load}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Open Ride Pools */}
                    <div className="bg-surface border border-border rounded-2xl">
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <h2 className="font-bold text-text">Open Ride Pools</h2>
                            <Link href="/ride-pool" className="text-xs text-cta font-medium hover:underline cursor-pointer">View All</Link>
                        </div>
                        <div className="divide-y divide-border">
                            {recentRides.map((ride, i) => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-background-alt transition-colors duration-200 cursor-pointer">
                                    <div>
                                        <p className="font-semibold text-text text-sm">{ride.dest}</p>
                                        <p className="text-xs text-text-muted mt-0.5">{ride.time} · {ride.riders}/4 riders</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-primary text-sm">{ride.fare}</p>
                                        <span className="inline-block mt-1 text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">{ride.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SOS Button */}
                <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-30">
                    <button className="bg-danger text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
