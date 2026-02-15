import { Router, Request, Response } from 'express';

const router = Router();

const routes = [
    {
        id: 'route-1',
        name: 'Campus → City Stand',
        stops: [
            { id: 's1', name: 'Main Gate', lat: 31.3955, lng: 75.5359, arrivalOffset: 0 },
            { id: 's2', name: 'Workshop Chowk', lat: 31.3800, lng: 75.5450, arrivalOffset: 8 },
            { id: 's3', name: 'Lovely Chowk', lat: 31.3650, lng: 75.5600, arrivalOffset: 15 },
            { id: 's4', name: 'City Stand', lat: 31.3260, lng: 75.5762, arrivalOffset: 25 },
        ],
        frequency: 'Every 20 min',
        isActive: true,
    },
    {
        id: 'route-2',
        name: 'Campus → Railway Station',
        stops: [
            { id: 's5', name: 'Main Gate', lat: 31.3955, lng: 75.5359, arrivalOffset: 0 },
            { id: 's6', name: 'PAP Chowk', lat: 31.3700, lng: 75.5700, arrivalOffset: 10 },
            { id: 's7', name: 'Model Town', lat: 31.3450, lng: 75.5800, arrivalOffset: 18 },
            { id: 's8', name: 'Railway Station', lat: 31.3180, lng: 75.5850, arrivalOffset: 30 },
        ],
        frequency: 'Every 30 min',
        isActive: true,
    },
    {
        id: 'route-3',
        name: 'Campus → Bus Stand',
        stops: [
            { id: 's9', name: 'Main Gate', lat: 31.3955, lng: 75.5359, arrivalOffset: 0 },
            { id: 's10', name: 'Jalandhar Bypass', lat: 31.3750, lng: 75.5500, arrivalOffset: 12 },
            { id: 's11', name: 'BMC Chowk', lat: 31.3500, lng: 75.5750, arrivalOffset: 20 },
            { id: 's12', name: 'Bus Stand', lat: 31.3300, lng: 75.5900, arrivalOffset: 28 },
        ],
        frequency: 'Every 25 min',
        isActive: true,
    },
];

const activeBuses = [
    { id: 'BUS-01', routeId: 'route-1', lat: 31.3900, lng: 75.5400, load: 'LOW', eta: '5 min', lastSeen: 'Near Main Gate' },
    { id: 'BUS-02', routeId: 'route-2', lat: 31.3600, lng: 75.5700, load: 'MEDIUM', eta: '12 min', lastSeen: 'Crossing PAP Chowk' },
    { id: 'BUS-03', routeId: 'route-3', lat: 31.3850, lng: 75.5450, load: 'HIGH', eta: '20 min', lastSeen: 'Departed Campus' },
    { id: 'BUS-04', routeId: 'route-1', lat: 31.3750, lng: 75.5500, load: 'MEDIUM', eta: '22 min', lastSeen: 'At Workshop Chowk' },
];

router.get('/routes', (_req: Request, res: Response) => {
    res.json(routes);
});

router.get('/routes/:id', (req: Request, res: Response) => {
    const route = routes.find(r => r.id === req.params.id);
    if (!route) { res.status(404).json({ error: 'Route not found' }); return; }
    const buses = activeBuses.filter(b => b.routeId === route.id);
    res.json({ ...route, buses });
});

router.get('/active', (_req: Request, res: Response) => {
    res.json(activeBuses);
});

router.get('/eta/:busId', (req: Request, res: Response) => {
    const bus = activeBuses.find(b => b.id === req.params.busId);
    if (!bus) { res.status(404).json({ error: 'Bus not found' }); return; }
    res.json({ busId: bus.id, eta: bus.eta, load: bus.load, lastSeen: bus.lastSeen });
});

export default router;
