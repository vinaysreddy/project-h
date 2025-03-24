import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // Import path module
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import planRoutes from './routes/planRoutes.js';

// Get __dirname in ES modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the homepage
app.get('/', (req, res) => {
    // Directly send the static HTML file
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);

// Register routes - note we're mounting at /api
app.use('/api', authRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
