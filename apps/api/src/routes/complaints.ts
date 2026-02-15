import { Router, Request, Response } from 'express';

const router = Router();

interface Complaint {
    id: string;
    userId: string;
    type: string;
    target: string;
    description: string;
    status: string;
    createdAt: string;
}

const complaints: Complaint[] = [
    { id: 'C-1', userId: '1', type: 'DRIVER', target: 'Auto #PB-08-1234', description: 'Driver demanded ₹150 for City Stand (fixed fare ₹100).', status: 'IN_PROGRESS', createdAt: '2026-02-14' },
    { id: 'C-2', userId: '1', type: 'BUS', target: 'BUS-03', description: 'Bus did not stop at Workshop Chowk.', status: 'RESOLVED', createdAt: '2026-02-10' },
];

router.get('/', (_req: Request, res: Response) => {
    res.json(complaints);
});

router.post('/', (req: Request, res: Response) => {
    const { type, target, description } = req.body;
    const newComplaint: Complaint = {
        id: 'C-' + (complaints.length + 1),
        userId: 'current-user',
        type,
        target: target || 'N/A',
        description,
        status: 'OPEN',
        createdAt: new Date().toISOString().split('T')[0],
    };
    complaints.push(newComplaint);
    res.status(201).json(newComplaint);
});

router.patch('/:id/status', (req: Request, res: Response) => {
    const complaint = complaints.find(c => c.id === req.params.id);
    if (!complaint) { res.status(404).json({ error: 'Complaint not found' }); return; }
    complaint.status = req.body.status;
    res.json(complaint);
});

export default router;
