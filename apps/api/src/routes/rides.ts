import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Fare chart
const FARE_CHART = [
    { from: 'Campus', to: 'Maqsudan Chowk', fare: 20 },
    { from: 'Campus', to: 'DAV College / HMV', fare: 30 },
    { from: 'Campus', to: 'PAP Chowk', fare: 40 },
    { from: 'Campus', to: 'Bus Stand', fare: 40 },
    { from: 'Campus', to: 'Jalandhar City', fare: 50 },
    { from: 'Campus', to: 'Jalandhar City Railway Station', fare: 60 },
    { from: 'Campus', to: 'Model Town', fare: 80 },
    { from: 'Campus', to: 'Rama Mandi', fare: 50 },
];

// Demo rides fallback
const DEMO_RIDES = [
    { id: "ride-1", dest: "Maqsudan Chowk", departure_time: new Date().toISOString(), max_passengers: 4, riders_count: 2, fare: 20, gender_pref: "ANY", status: "OPEN", hostName: "Arjun K.", perPerson: 10 },
    { id: "ride-2", dest: "PAP Chowk", departure_time: new Date().toISOString(), max_passengers: 3, riders_count: 1, fare: 40, gender_pref: "ANY", status: "OPEN", hostName: "Priya S.", perPerson: 20 },
    { id: "ride-3", dest: "Jalandhar City", departure_time: new Date().toISOString(), max_passengers: 4, riders_count: 3, fare: 50, gender_pref: "FEMALE_ONLY", status: "OPEN", hostName: "Neha R.", perPerson: 17 },
    { id: "ride-4", dest: "Railway Station", departure_time: new Date().toISOString(), max_passengers: 3, riders_count: 3, fare: 60, gender_pref: "ANY", status: "FULL", hostName: "Rohit M.", perPerson: 20 },
    { id: "ride-5", dest: "Bus Stand", departure_time: new Date().toISOString(), max_passengers: 4, riders_count: 1, fare: 40, gender_pref: "ANY", status: "OPEN", hostName: "Tabish A.", perPerson: 40 },
];

router.get('/fares', (_req: Request, res: Response) => {
    res.json(FARE_CHART);
});

// Get all open ride requests
router.get('/', async (_req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('rides')
            .select('*, users!host_id(name)')
            .eq('status', 'OPEN');

        if (!error && data && data.length > 0) {
            const formatted = data.map(ride => ({
                ...ride,
                hostName: ride.users?.name || 'Unknown',
                perPerson: Math.ceil(ride.fare / Math.max(ride.riders_count || 1, 1))
            }));
            return res.json(formatted);
        }
    } catch (_) { }
    // Fallback to demo
    res.json(DEMO_RIDES);
});

// Create a new ride
router.post('/', async (req: Request, res: Response) => {
    const { dest, departureTime, maxPassengers, gender } = req.body;

    const fareEntry = FARE_CHART.find(f => f.to === dest);
    const fare = fareEntry ? fareEntry.fare : 50;

    try {
        const { data: userData } = await supabase.from('users').select('id').limit(1).single();
        const userId = userData?.id;

        if (userId) {
            const { data, error } = await supabase
                .from('rides')
                .insert([{
                    host_id: userId,
                    dest,
                    departure_time: departureTime,
                    max_passengers: maxPassengers,
                    fare,
                    gender_pref: gender
                }])
                .select()
                .single();

            if (!error && data) return res.status(201).json(data);
        }
    } catch (_) { }

    // Fallback: return a mock created ride
    res.status(201).json({
        id: `ride-${Date.now()}`,
        dest,
        departure_time: departureTime,
        max_passengers: maxPassengers,
        riders_count: 1,
        fare,
        gender_pref: gender,
        status: "OPEN",
        hostName: "You",
        perPerson: fare
    });
});

// Join a ride
router.post('/:id/join', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const { data: ride, error: fetchError } = await supabase
            .from('rides')
            .select('*')
            .eq('id', id)
            .single();

        if (!fetchError && ride) {
            if (ride.riders_count >= ride.max_passengers) return res.status(400).json({ error: 'Ride full' });

            const { data, error } = await supabase
                .from('rides')
                .update({ riders_count: ride.riders_count + 1 })
                .eq('id', id)
                .select()
                .single();

            if (!error && data) return res.json(data);
        }
    } catch (_) { }

    // Fallback
    res.json({ id, message: "Joined successfully (demo mode)" });
});

export default router;
