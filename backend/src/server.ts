import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import userManagementRoutes from './routes/userManagementRoutes';
import userRoutes from './routes/userRoutes'; // Import the new user routes
import batchRoutes from './routes/batchRoutes'; // Import the new batch routes
import partnerRoutes from './routes/partnerRoutes'; // Import the new partner routes
import { authMiddleware } from './middleware/authMiddleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Define allowed origins for CORS
const allowedOrigins = [
  process.env.FRONTEND_URL, // This would be the Render frontend URL if set
  'http://localhost:32100', // Local development origin
  'http://192.168.0.104:32100', // Another local development origin
  'http://localhost:8080' // Default frontend URL
].filter(Boolean); // Filter out any undefined values

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// --- Public Routes ---
// These routes do not require authentication.
app.get('/', (req, res) => {
  res.send('CoffeeLedger Backend is running!');
});
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// --- Protected Routes ---
// The authMiddleware will run for all routes defined after this line.
app.use(authMiddleware);

app.use('/api/user-management', userManagementRoutes);
app.use('/api/users', userRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/partners', partnerRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});