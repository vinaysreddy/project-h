import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import questionnaireRoutes from './routes/questionnaireRoutes.js';
import planRoutes from './routes/planRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questionnaires', questionnaireRoutes);
app.use('/api/plans', planRoutes);

// Root route for API health check

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
