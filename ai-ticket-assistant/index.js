import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";

dotenv.config({
    path: "./.env",
});

const port = process.env.PORT || 5001;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes);

await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected ✅");
        app.listen(port, () => {
            console.log("App listening on port: ", port);
        });
    })
    .catch((err) => console.log("MongoDB connection error: ", err));
