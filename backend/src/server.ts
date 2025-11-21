import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import userManagementRoutes from './routes/userManagementRoutes';
import userRoutes from './routes/userRoutes'; // Import the new user routes
import batchRoutes from './routes/batchRoutes'; // Import the new batch routes
import partnerRoutes from './routes/partnerRoutes'; // Import the new partner routes

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Define allowed origins for CORS
const allowedOrigins = [
  process.env.FRONTEND_URL, // This would be the Render frontend URL if set
  'http://localhost:32100', // Local development origin (from your error message)
  'http://192.168.0.104:32100', // Another local development origin (from your error message)
  'http://localhost:8080' // Default frontend URL from package.json
].filter(Boolean); // Filter out any undefined values

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    // Check if the requesting origin is in our allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('CoffeeLedger Backend is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user-management', userManagementRoutes);
app.use('/api/users', userRoutes); // Use the new user routes
app.use('/api/batches', batchRoutes); // Use the new batch routes
app.use('/api/partners', partnerRoutes); // Use the new partner routes

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});