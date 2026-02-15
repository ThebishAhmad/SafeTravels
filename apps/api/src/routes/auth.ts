import { Router, Request, Response } from 'express';

const router = Router();

const mockUsers = [
    { id: '1', email: '21104070@nitj.ac.in', name: 'Tabish Ahmad', role: 'STUDENT', phone: '+91 98765 43210' },
];

router.post('/send-otp', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email?.endsWith('@nitj.ac.in')) {
        res.status(400).json({ error: 'Only @nitj.ac.in emails are accepted' });
        return;
    }
    res.json({ success: true, message: 'OTP sent (demo mode)' });
});

router.post('/verify-otp', (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!otp || otp.length !== 6) {
        res.status(400).json({ error: 'Invalid OTP' });
        return;
    }
    const user = mockUsers.find(u => u.email === email) || {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: 'STUDENT',
        phone: null,
    };
    res.json({ success: true, user, token: 'demo-jwt-token-' + user.id });
});

router.get('/me', (req: Request, res: Response) => {
    res.json(mockUsers[0]);
});

export default router;
