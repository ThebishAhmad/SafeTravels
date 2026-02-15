import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// ──────────────────────────────────
// Demo data with real GPS coordinates around NIT Jalandhar
// ──────────────────────────────────
const DEMO_ROUTES = [
    {
        id: "route-1",
        name: "Campus → Maqsudan → Bus Stand",
        frequency: "Every 15 min",
        stops: [
            { id: "s1", name: "NITJ Main Gate" },
            { id: "s2", name: "Maqsudan Chowk" },
            { id: "s3", name: "DAV College" },
            { id: "s4", name: "Bus Stand" },
        ]
    },
    {
        id: "route-2",
        name: "Campus → PAP Chowk → Railway Station",
        frequency: "Every 20 min",
        stops: [
            { id: "s5", name: "NITJ Main Gate" },
            { id: "s6", name: "PAP Chowk" },
            { id: "s7", name: "Jalandhar City" },
            { id: "s8", name: "Railway Station" },
        ]
    },
    {
        id: "route-3",
        name: "Campus → Model Town → Rama Mandi",
        frequency: "Every 25 min",
        stops: [
            { id: "s9", name: "NITJ Main Gate" },
            { id: "s10", name: "Model Town" },
            { id: "s11", name: "Rama Mandi" },
        ]
    },
];

const DEMO_BUSES = [
    { id: "BUS-101", route_id: "route-1", lat: 31.3960, lng: 75.5350, load_status: "LOW", last_seen: "2 min ago", is_active: true },
    { id: "BUS-102", route_id: "route-1", lat: 31.3920, lng: 75.5380, load_status: "MEDIUM", last_seen: "1 min ago", is_active: true },
    { id: "BUS-203", route_id: "route-2", lat: 31.3880, lng: 75.5420, load_status: "HIGH", last_seen: "Just now", is_active: true },
    { id: "BUS-204", route_id: "route-3", lat: 31.4000, lng: 75.5300, load_status: "LOW", last_seen: "3 min ago", is_active: true },
];

const DEMO_AUTOS = [
    { id: "AUTO-01", route_id: "route-1", lat: 31.3945, lng: 75.5365, load_status: "LOW", last_seen: "Just now", is_active: true, type: "auto" },
    { id: "AUTO-02", route_id: "route-1", lat: 31.3910, lng: 75.5400, load_status: "MEDIUM", last_seen: "1 min ago", is_active: true, type: "auto" },
    { id: "AUTO-03", route_id: "route-2", lat: 31.3870, lng: 75.5450, load_status: "LOW", last_seen: "2 min ago", is_active: true, type: "auto" },
    { id: "AUTO-04", route_id: "route-2", lat: 31.3855, lng: 75.5410, load_status: "HIGH", last_seen: "Just now", is_active: true, type: "auto" },
    { id: "AUTO-05", route_id: "route-3", lat: 31.4010, lng: 75.5280, load_status: "LOW", last_seen: "4 min ago", is_active: true, type: "auto" },
    { id: "AUTO-06", route_id: "route-3", lat: 31.3990, lng: 75.5320, load_status: "MEDIUM", last_seen: "Just now", is_active: true, type: "auto" },
    { id: "AUTO-07", route_id: "route-1", lat: 31.3935, lng: 75.5345, load_status: "LOW", last_seen: "3 min ago", is_active: true, type: "auto" },
    { id: "AUTO-08", route_id: "route-2", lat: 31.3895, lng: 75.5390, load_status: "MEDIUM", last_seen: "2 min ago", is_active: true, type: "auto" },
    { id: "AUTO-09", route_id: "route-1", lat: 31.3950, lng: 75.5370, load_status: "LOW", last_seen: "1 min ago", is_active: true, type: "auto" },
    { id: "AUTO-10", route_id: "route-3", lat: 31.4020, lng: 75.5260, load_status: "HIGH", last_seen: "Just now", is_active: true, type: "auto" },
];

// ──────────────────────────────────
// Routes
// ──────────────────────────────────
router.get('/routes', async (_req: Request, res: Response) => {
    try {
        const { data, error } = await supabase.from('bus_routes').select('*, route_stops(*)');
        if (!error && data && data.length > 0) return res.json(data);
    } catch (_) { }
    // Fallback to demo data
    res.json(DEMO_ROUTES);
});

router.get('/active', async (_req: Request, res: Response) => {
    try {
        const { data, error } = await supabase.from('buses').select('*').eq('is_active', true);
        if (!error && data && data.length > 0) return res.json(data);
    } catch (_) { }
    // Fallback: return demo buses + autos with coordinates
    res.json([...DEMO_BUSES, ...DEMO_AUTOS]);
});

export default router;
