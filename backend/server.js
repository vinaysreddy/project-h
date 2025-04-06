import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes.js";
import questionnaireRoutes from "./routes/questionnaireRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import dietRoutes from "./routes/dietRoutes.js";
import coachRoutes from './routes/coachRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Use Routes
app.use("/auth", authRoutes);  //signup,user
app.use("/onboarding", questionnaireRoutes);
app.use("/workout", workoutRoutes);
app.use("/diet", dietRoutes);
app.use('/coach', coachRoutes);

// Health check route
app.get('/', (req, res) => {
    res.send('API is running...');
  });

app.listen(PORT, () => {
    
  });
