"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const stats = [
    { id: "active-buses", label: "Active Buses", value: "0", icon: "M8 7h8m-8 4h4m-6 4h10M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z", color: "text-primary" },
    { id: "open-rides", label: "Open Rides", value: "0", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "text-cta" },
    { id: "complaints", label: "Pending Complaints", value: "0", icon: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-warning" },
    { id: "users", label: "Registered Students", value: "1,243", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z", color: "text-success" },
];

const statusStyles: Record<string, string> = {
    OPEN: "bg-cta/10 text-cta",
    IN_PROGRESS: "bg-warning/10 text-warning",
    RESOLVED: "bg-success/10 text-success",
};

export default function AdminPage() {
    const [routes, setRoutes] = useState<any[]>([]);
    const [complaints, setComplaints] = useState<any[]>([]);
    const [dashboardStats, setStats] = useState(stats);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [routesData, complaintsData, activeBuses, rides] = await Promise.all([
                    api.buses.getRoutes(),
                    api.complaints.list(),
                    api.buses.getActive(),
                    api.rides.list()
                ]);

                setRoutes(routesData);
                setComplaints(complaintsData.slice(0, 3)); // Recent 3

                const newStats = stats.map(s => {
                    if (s.id === "active-buses") return { ...s, value: String(activeBuses.length) };
                    if (s.id === "open-rides") return { ...s, value: String(rides.length) };
                    if (s.id === "complaints") return { ...s, value: String(complaintsData.filter((c: any) => c.status !== 'RESOLVED').length) };
                    return s;
                });
                setStats(newStats);
            } catch (err) {
                console.error("Failed to load admin data", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="md:ml-64 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-text" style={{ fontFamily: "'Cinzel', serif" }}>
                            Admin Dashboard
                        </h1>
                        <p className="text-text-muted mt-1">Campus transport management overview</p>
                    </div>
                    <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">Transport Admin</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {dashboardStats.map((s) => (
                        <div key={s.label} className="bg-surface border border-border rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-background-alt rounded-xl flex items-center justify-center">
                                    <svg className={`w-5 h-5 ${s.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-text" style={{ fontFamily: "'Cinzel', serif" }}>
                                {loading ? "-" : s.value}
                            </p>
                            <p className="text-xs text-text-muted mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Route Management */}
                    <div className="bg-surface border border-border rounded-2xl">
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <h2 className="font-bold text-text">Route Management</h2>
                            <button className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg font-medium cursor-pointer hover:opacity-90 transition-opacity">Add Route</button>
                        </div>
                        <div className="divide-y divide-border">
                            {loading ? (
                                <p className="p-4 text-sm text-text-muted">Loading routes...</p>
                            ) : routes.map((route) => (
                                <div key={route.id} className="p-4 flex items-center justify-between hover:bg-background-alt transition-colors duration-200 cursor-pointer">
                                    <div>
                                        <p className="font-semibold text-text text-sm">{route.name}</p>
                                        <p className="text-xs text-text-muted mt-0.5">{route.stops?.length || 0} stops defined</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">Active</span>
                                        <button className="text-text-muted hover:text-primary transition-colors cursor-pointer">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Complaints */}
                    <div className="bg-surface border border-border rounded-2xl">
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <h2 className="font-bold text-text">Recent Complaints</h2>
                            <Link href="/complaints" className="text-xs text-cta font-medium hover:underline cursor-pointer">View All</Link>
                        </div>
                        <div className="divide-y divide-border">
                            {loading ? (
                                <p className="p-4 text-sm text-text-muted">Loading complaints...</p>
                            ) : complaints.length === 0 ? (
                                <p className="p-4 text-sm text-text-muted">No recent complaints.</p>
                            ) : (
                                complaints.map((c) => (
                                    <div key={c.id} className="p-4 flex items-center justify-between hover:bg-background-alt transition-colors duration-200 cursor-pointer">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs bg-background-alt text-text-muted px-2 py-0.5 rounded-full font-medium">{c.type}</span>
                                                <span className="text-xs text-text-muted">{c.createdAt}</span>
                                            </div>
                                            <p className="font-semibold text-text text-sm mt-1">{c.target}</p>
                                        </div>
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[c.status] || ""}`}>
                                            {(c.status || "").replace("_", " ")}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Analytics Placeholder */}
                <div className="mt-6 bg-surface border border-border rounded-2xl p-6">
                    <h2 className="font-bold text-text mb-4">Transport Analytics</h2>
                    <div className="h-48 bg-background-alt rounded-xl flex items-center justify-center text-text-muted">
                        <div className="text-center">
                            <svg className="w-10 h-10 mx-auto mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <p className="text-sm">Analytics Dashboard</p>
                            <p className="text-xs mt-1 opacity-60">Connect data source for charts</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
