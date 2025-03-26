import express from "express";
import cors from "cors";
import { db } from "./config/firebase.js"; // Firestore instance
import authenticateUser from "./middleware/authenticateUser.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import questionnaireRoutes from "./routes/questionnaireRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import dietRoutes from "./routes/dietRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Use Routes
app.use("/auth", authRoutes);  //signup,user
app.use("/onboarding", questionnaireRoutes);
app.use("/workout", workoutRoutes);
app.use("/diet", dietRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
