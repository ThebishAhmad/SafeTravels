"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type ComplaintStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "DISMISSED";

const statusStyles: Record<ComplaintStatus, string> = {
    OPEN: "bg-cta/10 text-cta",
    IN_PROGRESS: "bg-warning/10 text-warning",
    RESOLVED: "bg-success/10 text-success",
    DISMISSED: "bg-text-muted/10 text-text-muted",
};

export default function ComplaintsPage() {
    const [showForm, setShowForm] = useState(false);
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form
    const [type, setType] = useState("DRIVER");
    const [target, setTarget] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComplaints();
    }, []);

    async function fetchComplaints() {
        try {
            const data = await api.complaints.list();
            setComplaints(data);
        } catch (err) {
            console.error("Failed to load complaints:", err);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.complaints.create({ type, target, description });
            alert("Complaint submitted successfully.");
            setShowForm(false);
            setDescription("");
            setTarget("");
            fetchComplaints(); // Refresh list
        } catch (err) {
            alert("Failed to submit complaint.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="md:ml-64 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-4xl mx-auto p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-text" style={{ fontFamily: "'Cinzel', serif" }}>
                            Complaints
                        </h1>
                        <p className="text-text-muted mt-1">Report issues and track resolution</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-danger hover:opacity-90 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-opacity duration-200 cursor-pointer flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Report Issue
                    </button>
                </div>

                {/* Submit Complaint Form */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-6 mb-6">
                        <h3 className="font-bold text-text mb-4">New Complaint</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text mb-1">Complaint Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                >
                                    <option value="DRIVER">Auto Driver Issue</option>
                                    <option value="BUS">Bus Service Issue</option>
                                    <option value="RIDE">Ride Pool Issue</option>
                                    <option value="GENERAL">General Feedback</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text mb-1">Vehicle / Ride ID (optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Auto #PB-08-1234 or RIDE-42"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the issue in detail..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    required
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-danger hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition-opacity duration-200 cursor-pointer disabled:opacity-50"
                                >
                                    {submitting ? "Submitting..." : "Submit Complaint"}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="bg-background border border-border text-text-muted px-6 py-3 rounded-xl font-semibold transition-colors duration-200 cursor-pointer hover:bg-background-alt">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Complaints List */}
                <div className="space-y-4">
                    <h2 className="font-bold text-text">My Complaints</h2>
                    {loading ? (
                        <p className="text-text-muted text-sm">Loading complaints...</p>
                    ) : complaints.length === 0 ? (
                        <p className="text-text-muted text-sm">No complaints found.</p>
                    ) : (
                        complaints.map((c) => (
                            <div key={c.id} className="bg-surface border border-border rounded-2xl p-5 hover:border-primary-light transition-colors duration-300">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs bg-background-alt text-text-muted px-2 py-0.5 rounded-full font-medium">{c.type}</span>
                                            <span className="text-xs text-text-muted">{c.createdAt}</span>
                                        </div>
                                        <p className="font-semibold text-text mt-1.5">{c.target}</p>
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[c.status as ComplaintStatus] || ""}`}>
                                        {(c.status || "").replace("_", " ")}
                                    </span>
                                </div>
                                <p className="text-sm text-text-muted leading-relaxed">{c.description}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
