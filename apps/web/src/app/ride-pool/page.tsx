"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function RidePoolPage() {
    const [showCreate, setShowCreate] = useState(false);
    const [filter, setFilter] = useState("ALL");
    const [rides, setRides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [fareChart, setFareChart] = useState<any[]>([]);

    // Form State
    const [dest, setDest] = useState("");
    const [time, setTime] = useState("");
    const [maxPassengers, setMaxPassengers] = useState(4);
    const [gender, setGender] = useState("ANY");

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [ridesData, faresData] = await Promise.all([
                api.rides.list() as Promise<any[]>,
                api.rides.getFares() as Promise<any[]>
            ]);
            setRides(ridesData);
            setFareChart(faresData);
        } catch (err) {
            console.error("Failed to load ride data:", err);
        } finally {
            setLoading(false);
        }
    }

    const handleCreateRide = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dest || !time) {
            alert("Please select a destination and departure time.");
            return;
        }

        try {
            await api.rides.create({
                dest,
                departureTime: new Date().toISOString().split('T')[0] + 'T' + time + ':00',
                maxPassengers: Number(maxPassengers),
                gender
            });
            setShowCreate(false);
            fetchData();
            alert("Ride request created successfully!");
        } catch (err) {
            alert("Failed to create ride");
        }
    };

    const handleJoinRide = async (id: string) => {
        try {
            await api.rides.join(id);
            fetchData();
            alert("Successfully joined the ride!");
        } catch (err: any) {
            alert(err.message || "Failed to join ride");
        }
    };

    const filtered = filter === "ALL" ? rides : rides.filter(r => r.gender === filter);

    return (
        <div className="md:ml-64 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-text" style={{ fontFamily: "'Cinzel', serif" }}>
                            Ride Pool
                        </h1>
                        <p className="text-text-muted mt-1">Share autos, split fares, travel together</p>
                    </div>
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="bg-cta hover:bg-cta-hover text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Create Ride
                    </button>
                </div>

                {/* Create Ride Form */}
                {showCreate && (
                    <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
                        <h3 className="font-bold text-text mb-4">Create a Ride Request</h3>
                        <form onSubmit={handleCreateRide}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Destination</label>
                                    <select
                                        value={dest}
                                        onChange={(e) => setDest(e.target.value)}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                    >
                                        <option value="">Select Destination</option>
                                        {fareChart.map(f => (
                                            <option key={f.to} value={f.to}>{f.to} (₹{f.fare})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Departure Time</label>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Max Passengers</label>
                                    <select
                                        value={maxPassengers}
                                        onChange={(e) => setMaxPassengers(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                    >
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Gender Preference</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                    >
                                        <option value="ANY">Everyone Welcome</option>
                                        <option value="FEMALE_ONLY">Female Only</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="mt-4 bg-primary hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition-opacity duration-200 cursor-pointer"
                            >
                                Post Ride Request
                            </button>
                        </form>
                    </div>
                )}

                {/* Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {["ALL", "ANY", "FEMALE_ONLY"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap ${filter === f ? "bg-primary text-white" : "bg-surface border border-border text-text-muted hover:bg-background-alt"
                                }`}
                        >
                            {f === "ALL" ? "All Rides" : f === "ANY" ? "Mixed Group" : "Female Only"}
                        </button>
                    ))}
                </div>

                {/* Available Rides */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {loading ? (
                        <p className="col-span-2 text-center text-text-muted">Loading rides...</p>
                    ) : filtered.length === 0 ? (
                        <p className="col-span-2 text-center text-text-muted">No ride requests available. Create one!</p>
                    ) : (
                        filtered.map((ride) => (
                            <div key={ride.id} className="bg-surface border border-border rounded-2xl p-5 hover:border-primary-light transition-colors duration-300 cursor-pointer">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-text">{ride.dest}</h3>
                                        <p className="text-xs text-text-muted mt-0.5">
                                            {new Date(ride.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    {ride.gender_pref === "FEMALE_ONLY" && (
                                        <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-medium">Female Only</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="text-sm text-text-muted">by {ride.hostName || "Student"}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-primary">{ride.riders_count}/{ride.max_passengers} joined</span>
                                </div>
                                <div className="bg-background-alt rounded-xl p-3 flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-xs text-text-muted">Total Fare</p>
                                        <p className="font-bold text-text">₹{ride.fare}</p>
                                    </div>
                                    <div className="w-px h-8 bg-border" />
                                    <div className="text-right">
                                        <p className="text-xs text-text-muted">You Pay</p>
                                        <p className="font-bold text-primary">₹{ride.perPerson || Math.ceil(ride.fare / Math.max(ride.riders_count, 1))}</p>
                                    </div>
                                </div>
                                {ride.status === "FULL" ? (
                                    <button disabled className="w-full bg-surface border border-border text-text-muted py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed">
                                        Ride Full
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleJoinRide(ride.id)}
                                        className="w-full bg-cta hover:bg-cta-hover text-white py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer"
                                    >
                                        Join Ride
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Fixed Fare Chart */}
                <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-border">
                        <h2 className="font-bold text-text">Fixed Fare Chart</h2>
                        <p className="text-xs text-text-muted mt-0.5">Admin-approved maximum fares (per auto)</p>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border text-xs text-text-muted uppercase tracking-wider">
                                <th className="text-left p-4 font-medium">From</th>
                                <th className="text-left p-4 font-medium">To</th>
                                <th className="text-right p-4 font-medium">Max Fare</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {fareChart.map((row: any, i: number) => (
                                <tr key={i} className="hover:bg-background-alt transition-colors duration-200">
                                    <td className="p-4 text-sm text-text">{row.from}</td>
                                    <td className="p-4 text-sm text-text font-medium">{row.to}</td>
                                    <td className="p-4 text-sm text-primary font-bold text-right">₹{row.fare}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
