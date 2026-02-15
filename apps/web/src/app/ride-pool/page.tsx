"use client";

import { useState } from "react";

const availableRides = [
    { id: 1, host: "Aman S.", dest: "Jalandhar City Station", time: "Today 4:30 PM", riders: 2, max: 4, fare: 100, perPerson: 25, gender: "ANY" },
    { id: 2, host: "Priya K.", dest: "Railway Station", time: "Today 5:00 PM", riders: 1, max: 3, fare: 120, perPerson: 40, gender: "FEMALE_ONLY" },
    { id: 3, host: "Rohit M.", dest: "Bus Stand", time: "Today 5:30 PM", riders: 3, max: 4, fare: 80, perPerson: 20, gender: "ANY" },
    { id: 4, host: "Sneha R.", dest: "Model Town", time: "Today 6:00 PM", riders: 1, max: 3, fare: 90, perPerson: 30, gender: "ANY" },
];

const fareChart = [
    { from: "Campus", to: "City Stand", fare: "₹100" },
    { from: "Campus", to: "Railway Station", fare: "₹120" },
    { from: "Campus", to: "Bus Stand", fare: "₹80" },
    { from: "Campus", to: "Model Town", fare: "₹90" },
];

export default function RidePoolPage() {
    const [showCreate, setShowCreate] = useState(false);
    const [filter, setFilter] = useState("ALL");

    const filtered = filter === "ALL" ? availableRides : availableRides.filter(r => r.gender === filter);

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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text mb-1">Destination</label>
                                <select className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                                    <option>Jalandhar City Station</option>
                                    <option>Railway Station</option>
                                    <option>Bus Stand</option>
                                    <option>Model Town</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text mb-1">Departure Time</label>
                                <input type="time" className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text mb-1">Max Passengers</label>
                                <select className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                                    <option>2</option>
                                    <option>3</option>
                                    <option selected>4</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text mb-1">Gender Preference</label>
                                <select className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                                    <option value="ANY">Everyone Welcome</option>
                                    <option value="FEMALE_ONLY">Female Only</option>
                                </select>
                            </div>
                        </div>
                        <button className="mt-4 bg-primary hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition-opacity duration-200 cursor-pointer">
                            Post Ride Request
                        </button>
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
                    {filtered.map((ride) => (
                        <div key={ride.id} className="bg-surface border border-border rounded-2xl p-5 hover:border-primary-light transition-colors duration-300 cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-bold text-text">{ride.dest}</h3>
                                    <p className="text-xs text-text-muted mt-0.5">{ride.time}</p>
                                </div>
                                {ride.gender === "FEMALE_ONLY" && (
                                    <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-medium">Female Only</span>
                                )}
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="text-sm text-text-muted">by {ride.host}</span>
                                </div>
                                <span className="text-sm font-semibold text-primary">{ride.riders}/{ride.max} joined</span>
                            </div>
                            <div className="bg-background-alt rounded-xl p-3 flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs text-text-muted">Total Fare</p>
                                    <p className="font-bold text-text">₹{ride.fare}</p>
                                </div>
                                <div className="w-px h-8 bg-border" />
                                <div className="text-right">
                                    <p className="text-xs text-text-muted">You Pay</p>
                                    <p className="font-bold text-primary">₹{ride.perPerson}</p>
                                </div>
                            </div>
                            <button className="w-full bg-cta hover:bg-cta-hover text-white py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer">
                                Join Ride
                            </button>
                        </div>
                    ))}
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
                            {fareChart.map((row, i) => (
                                <tr key={i} className="hover:bg-background-alt transition-colors duration-200">
                                    <td className="p-4 text-sm text-text">{row.from}</td>
                                    <td className="p-4 text-sm text-text font-medium">{row.to}</td>
                                    <td className="p-4 text-sm text-primary font-bold text-right">{row.fare}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
