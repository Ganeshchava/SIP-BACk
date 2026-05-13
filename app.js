import express from "express";
import cors from "cors";

import client from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import investorRoutes from "./routes/investorRoutes.js";
import fundRoutes from "./routes/fundRoutes.js";
import sipRoutes from "./routes/sipRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/investors", investorRoutes);
app.use("/api/funds", fundRoutes);
app.use("/api/sips", sipRoutes);

app.get("/", async (req, res) => {

    try {

        const result = await client.query(
            "SELECT NOW()"
        );

        res.json({
            success: true,
            message: "Database Connected",
            time: result.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default app;