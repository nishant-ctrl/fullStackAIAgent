import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { serve } from "inngest/express";
import userRoutes from "./routes/user.route.js";
import ticketRoutes from "./routes/ticket.route.js";
import { inngest } from "./inngest/client.js";
import { onUserSignup } from "./inngest/functions/on-signup.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";
import { errorHandler } from "./middleware/error.middleware.js";
dotenv.config({
    path: "./.env",
});

const port = process.env.PORT || 5001;
const app = express();
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);

app.use(
    "/api/inngest",
    serve({
        client: inngest,
        functions: [onUserSignup, onTicketCreated],
    })
);
app.use(errorHandler)

await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected ✅");
        app.listen(port, () => {
            console.log("App listening on port: ", port);
        });
    })
    .catch((err) => console.log("MongoDB connection error: ", err));
