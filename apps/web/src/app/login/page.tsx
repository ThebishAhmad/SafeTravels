"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"email" | "otp">("email");
    const [loading, setLoading] = useState(false);

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.endsWith("@nitj.ac.in")) {
            alert("Please use your @nitj.ac.in email address");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setStep("otp");
            setLoading(false);
        }, 1000);
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            router.push("/dashboard");
        }, 800);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 cursor-pointer mb-6">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-text" style={{ fontFamily: "'Cinzel', serif" }}>
                        Welcome Back
                    </h1>
                    <p className="text-text-muted mt-2">Sign in with your NIT Jalandhar email</p>
                </div>

                <div className="bg-surface border border-border rounded-2xl p-8">
                    {step === "email" ? (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                                    Institute Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="rollno@nitj.ac.in"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-cta hover:bg-cta-hover text-white py-3 rounded-xl font-semibold transition-colors duration-200 cursor-pointer disabled:opacity-50"
                            >
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                            <p className="text-sm text-text-muted text-center">
                                OTP sent to <span className="text-primary font-medium">{email}</span>
                            </p>
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-text mb-2">
                                    Enter OTP
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    placeholder="6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text text-center text-2xl tracking-[0.5em] placeholder:text-text-muted/50 placeholder:text-base placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-cta hover:bg-cta-hover text-white py-3 rounded-xl font-semibold transition-colors duration-200 cursor-pointer disabled:opacity-50"
                            >
                                {loading ? "Verifying..." : "Verify & Login"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep("email")}
                                className="w-full text-sm text-text-muted hover:text-primary transition-colors duration-200 cursor-pointer"
                            >
                                Use a different email
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center text-xs text-text-muted mt-6">
                    Only <span className="font-semibold">@nitj.ac.in</span> emails are accepted.
                </p>
            </div>
        </div>
    );
}
