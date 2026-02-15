"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Mock extended data since API only returns basic user for now
    const extendedData = {
        department: "Computer Science",
        joinedDate: "August 2021",
        emergencyContact: "+91 91234 56789",
        totalRides: 47,
        totalSaved: 1240,
        carbonSaved: "12.4 kg",
    };

    const rideHistory = [
        { id: "RIDE-42", dest: "Railway Station", date: "2026-02-14", fare: "₹30", status: "COMPLETED", riders: 4 },
        { id: "RIDE-38", dest: "City Stand", date: "2026-02-12", fare: "₹25", status: "COMPLETED", riders: 4 },
        { id: "RIDE-35", dest: "Bus Stand", date: "2026-02-10", fare: "₹27", status: "COMPLETED", riders: 3 },
        { id: "RIDE-30", dest: "Model Town", date: "2026-02-08", fare: "₹30", status: "COMPLETED", riders: 3 },
    ];

    useEffect(() => {
        async function fetchProfile() {
            try {
                const userData = await api.auth.me();
                setUser({ ...(userData as any), ...extendedData });
            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    if (loading) return <div className="p-8 text-center text-text-muted">Loading profile...</div>;
    if (!user) return <div className="p-8 text-center text-danger">Failed to load profile. Please login again.</div>;

    return (
        <div className="md:ml-64 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-text mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
                    Profile
                </h1>

                {/* Profile Card */}
                <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                            {user.name.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-text">{user.name}</h2>
                            <p className="text-sm text-text-muted">{user.email}</p>
                            <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{user.role} · {user.department}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: "Phone", value: user.phone || "Not Verified" },
                            { label: "Emergency Contact", value: user.emergencyContact },
                            { label: "Member Since", value: user.joinedDate },
                            { label: "Total Rides", value: String(user.totalRides) },
                        ].map((item) => (
                            <div key={item.label} className="bg-background rounded-xl p-4">
                                <p className="text-xs text-text-muted font-medium">{item.label}</p>
                                <p className="text-sm font-semibold text-text mt-1">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Impact Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-surface border border-border rounded-2xl p-5 text-center">
                        <p className="text-2xl font-bold text-primary" style={{ fontFamily: "'Cinzel', serif" }}>{user.totalRides}</p>
                        <p className="text-xs text-text-muted mt-1">Total Rides</p>
                    </div>
                    <div className="bg-surface border border-border rounded-2xl p-5 text-center">
                        <p className="text-2xl font-bold text-success" style={{ fontFamily: "'Cinzel', serif" }}>₹{user.totalSaved}</p>
                        <p className="text-xs text-text-muted mt-1">Money Saved</p>
                    </div>
                    <div className="bg-surface border border-border rounded-2xl p-5 text-center">
                        <p className="text-2xl font-bold text-primary" style={{ fontFamily: "'Cinzel', serif" }}>{user.carbonSaved}</p>
                        <p className="text-xs text-text-muted mt-1">CO₂ Saved</p>
                    </div>
                </div>

                {/* Ride History */}
                <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-border">
                        <h2 className="font-bold text-text">Ride History</h2>
                    </div>
                    <div className="divide-y divide-border">
                        {rideHistory.map((ride) => (
                            <div key={ride.id} className="p-4 flex items-center justify-between hover:bg-background-alt transition-colors duration-200">
                                <div>
                                    <p className="font-semibold text-text text-sm">{ride.dest}</p>
                                    <p className="text-xs text-text-muted mt-0.5">{ride.id} · {ride.date} · {ride.riders} riders</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-primary text-sm">{ride.fare}</p>
                                    <span className="text-xs text-success font-medium">{ride.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
