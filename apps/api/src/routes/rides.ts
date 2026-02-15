import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Fare chart — MUST be before /:id routes
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

router.get('/fares', (_req: Request, res: Response) => {
    res.json(FARE_CHART);
});

// Get all open ride requests
router.get('/', async (_req: Request, res: Response) => {
    const { data, error } = await supabase
        .from('rides')
        .select('*, users!host_id(name)')
        .eq('status', 'OPEN');

    if (error) return res.status(500).json({ error: error.message });

    const formatted = (data || []).map(ride => ({
        ...ride,
        hostName: ride.users?.name || 'Unknown',
        perPerson: Math.ceil(ride.fare / Math.max(ride.riders_count || 1, 1))
    }));

    res.json(formatted);
});

// Create a new ride
router.post('/', async (req: Request, res: Response) => {
    const { dest, departureTime, maxPassengers, gender } = req.body;

    const { data: userData } = await supabase.from('users').select('id').limit(1).single();
    const userId = userData?.id;

    if (!userId) {
        return res.status(401).json({ error: 'User not found (Seed DB first)' });
    }

    // Look up fare from chart
    const fareEntry = FARE_CHART.find(f => f.to === dest);
    const fare = fareEntry ? fareEntry.fare : 50;

    const { data, error } = await supabase
        .from('rides')
        .insert([
            {
                host_id: userId,
                dest,
                departure_time: departureTime,
                max_passengers: maxPassengers,
                fare,
                gender_pref: gender
            }
        ])
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// Join a ride
router.post('/:id/join', async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data: ride, error: fetchError } = await supabase
        .from('rides')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError || !ride) return res.status(404).json({ error: 'Ride not found' });
    if (ride.riders_count >= ride.max_passengers) return res.status(400).json({ error: 'Ride full' });

    const { data, error } = await supabase
        .from('rides')
        .update({ riders_count: ride.riders_count + 1 })
        .eq('id', id)
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

export default router;
