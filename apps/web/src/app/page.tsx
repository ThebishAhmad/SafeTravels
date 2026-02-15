import Link from "next/link";

const features = [
  {
    title: "Live Bus Tracking",
    description: "Know exactly where your campus bus is, in real-time. Get accurate ETAs at every stop.",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    title: "Smart Ride Pooling",
    description: "Share autos with fellow students heading the same way. Split fares automatically.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    title: "Fixed Fair Fares",
    description: "Pre-defined route fares. No overcharging. Transparent cost breakdown before you book.",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Route & ETA Info",
    description: "View all bus routes, stops, and estimated arrival times. Plan your commute with confidence.",
    icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
  },
  {
    title: "SOS Emergency",
    description: "One-tap emergency button instantly alerts campus security and your emergency contacts.",
    icon: "M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01",
  },
  {
    title: "Complaints & Support",
    description: "Report issues, rate drivers, and resolve disputes through a transparent system.",
    icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
  },
];

const stats = [
  { value: "10k+", label: "Students Served" },
  { value: "50+", label: "Active Routes" },
  { value: "₹40", label: "Avg. Savings/Ride" },
  { value: "24/7", label: "Live Tracking" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-4 left-4 right-4 z-50 bg-surface/80 backdrop-blur-xl rounded-2xl border border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <span className="text-lg font-bold text-text" style={{ fontFamily: "'Cinzel', serif" }}>
            SafeTravels
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-text-muted font-medium">
          <a href="#features" className="hover:text-primary transition-colors duration-200 cursor-pointer">Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors duration-200 cursor-pointer">How It Works</a>
          <a href="#stats" className="hover:text-primary transition-colors duration-200 cursor-pointer">Impact</a>
        </div>
        <Link
          href="/login"
          className="bg-cta hover:bg-cta-hover text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-background-alt border border-border rounded-full px-4 py-1.5 text-sm text-primary font-medium mb-8">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            Live tracking active for NIT Jalandhar
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold text-text mb-6 leading-tight tracking-tight"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Campus Mobility,
            <br />
            <span className="text-primary">Reimagined.</span>
          </h1>

          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Track buses in real-time. Share auto rides at fair prices.
            Built exclusively for{" "}
            <span className="text-primary font-semibold">NIT Jalandhar</span> students.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="bg-cta hover:bg-cta-hover text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-colors duration-200 cursor-pointer flex items-center gap-2"
            >
              Open Dashboard
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/track"
              className="bg-surface border border-border text-text hover:bg-background-alt px-8 py-3.5 rounded-xl text-base font-semibold transition-colors duration-200 cursor-pointer"
            >
              Track a Bus
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface border border-border rounded-2xl p-6 text-center"
            >
              <p className="text-3xl md:text-4xl font-bold text-primary mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                {stat.value}
              </p>
              <p className="text-sm text-text-muted font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-background-alt">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              Everything You Need
            </h2>
            <p className="text-text-muted text-lg max-w-xl mx-auto">
              A complete campus transportation platform designed for safety, transparency, and savings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-surface border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary-light transition-all duration-300 cursor-pointer group"
              >
                <div className="w-12 h-12 bg-background-alt rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <svg className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text mb-2">{feature.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              How It Works
            </h2>
            <p className="text-text-muted text-lg">Three steps to smarter commuting.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Sign In", desc: "Use your @nitj.ac.in email to verify your student identity." },
              { step: "02", title: "Track or Pool", desc: "View live bus locations or create a shared auto ride request." },
              { step: "03", title: "Travel Safe", desc: "Get real-time ETAs, fare splits, and SOS protection on every trip." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-text mb-2">{item.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
            Ready to Travel Smarter?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of NIT Jalandhar students already saving time and money on every commute.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-primary hover:bg-background-alt px-8 py-3.5 rounded-xl text-base font-semibold transition-colors duration-200 cursor-pointer"
          >
            Get Started Free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-surface border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-text" style={{ fontFamily: "'Cinzel', serif" }}>SafeTravels</span>
          </div>
          <p className="text-sm text-text-muted">
            Built for NIT Jalandhar. &copy; {new Date().getFullYear()} SafeTravels.
          </p>
        </div>
      </footer>
    </div>
  );
}
