import { Router, Request, Response } from 'express';

const router = Router();

interface Ride {
    id: string;
    hostId: string;
    hostName: string;
    dest: string;
    departureTime: string;
    riders: number;
    maxPassengers: number;
    fare: number;
    perPerson: number;
    gender: string;
    status: string;
}

const rides: Ride[] = [
    { id: 'RIDE-42', hostId: '1', hostName: 'Aman S.', dest: 'Jalandhar City Station', departureTime: '2026-02-15T16:30:00', riders: 2, maxPassengers: 4, fare: 100, perPerson: 25, gender: 'ANY', status: 'OPEN' },
    { id: 'RIDE-43', hostId: '2', hostName: 'Priya K.', dest: 'Railway Station', departureTime: '2026-02-15T17:00:00', riders: 1, maxPassengers: 3, fare: 120, perPerson: 40, gender: 'FEMALE_ONLY', status: 'OPEN' },
    { id: 'RIDE-44', hostId: '3', hostName: 'Rohit M.', dest: 'Bus Stand', departureTime: '2026-02-15T17:30:00', riders: 3, maxPassengers: 4, fare: 80, perPerson: 20, gender: 'ANY', status: 'OPEN' },
];

const fareChart = [
    { from: 'Campus', to: 'City Stand', fare: 100 },
    { from: 'Campus', to: 'Railway Station', fare: 120 },
    { from: 'Campus', to: 'Bus Stand', fare: 80 },
    { from: 'Campus', to: 'Model Town', fare: 90 },
];

router.get('/', (_req: Request, res: Response) => {
    res.json(rides.filter(r => r.status === 'OPEN'));
});

router.post('/', (req: Request, res: Response) => {
    const { dest, departureTime, maxPassengers, gender } = req.body;
    const routeFare = fareChart.find(f => f.to === dest);
    const newRide: Ride = {
        id: 'RIDE-' + (rides.length + 40),
        hostId: 'current-user',
        hostName: 'You',
        dest,
        departureTime,
        riders: 1,
        maxPassengers: maxPassengers || 4,
        fare: routeFare?.fare || 100,
        perPerson: routeFare ? Math.ceil(routeFare.fare / (maxPassengers || 4)) : 25,
        gender: gender || 'ANY',
        status: 'OPEN',
    };
    rides.push(newRide);
    res.status(201).json(newRide);
});

router.post('/:id/join', (req: Request, res: Response) => {
    const ride = rides.find(r => r.id === req.params.id);
    if (!ride) { res.status(404).json({ error: 'Ride not found' }); return; }
    if (ride.riders >= ride.maxPassengers) { res.status(400).json({ error: 'Ride is full' }); return; }
    ride.riders += 1;
    ride.perPerson = Math.ceil(ride.fare / ride.riders);
    if (ride.riders >= ride.maxPassengers) ride.status = 'FULL';
    res.json(ride);
});

router.get('/fares', (_req: Request, res: Response) => {
    res.json(fareChart);
});

export default router;
