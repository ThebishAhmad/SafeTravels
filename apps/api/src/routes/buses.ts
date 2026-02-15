import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

router.get('/routes', async (_req: Request, res: Response) => {
    const { data, error } = await supabase.from('bus_routes').select('*, route_stops(*)');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

router.get('/active', async (_req: Request, res: Response) => {
    const { data, error } = await supabase.from('buses').select('*, bus_routes(name)').eq('is_active', true);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

export default router;
