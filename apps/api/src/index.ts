import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import busRoutes from './routes/buses';
import rideRoutes from './routes/rides';
import complaintRoutes from './routes/complaints';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'SafeTravels API', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/complaints', complaintRoutes);

app.listen(PORT, () => {
  console.log(`SafeTravels API running on http://localhost:${PORT}`);
});
