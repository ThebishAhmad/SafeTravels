import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
    const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

router.post('/', async (req: Request, res: Response) => {
    const { type, target, description } = req.body;

    // Demo: pick first user as reporter
    const { data: userData } = await supabase.from('users').select('id').limit(1).single();

    const { data, error } = await supabase
        .from('complaints')
        .insert([
            {
                user_id: userData?.id,
                type,
                target,
                description
            }
        ])
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

export default router;
