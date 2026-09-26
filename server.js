import express from "express"
import httpError from "./middlewares/httpError.js"
import connectDB from "./config/DB.js";

import router from "./routes/adminRoute.js";
import managerRoute from "./routes/managerRoute.js"



import dotenv from "dotenv";
dotenv.config({ path: "./.env" })

const app = express()


app.use(express.json());

app.use("/admin", router)
app.use("/manager", managerRoute)

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "hello from server"
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return new httpError(error.message)
    }

    res.status(error.statusCode || 500).json({ message: error.message || "internal server error" })
})

const port = 5000


async function startServer() {
    try {
        const connect = await connectDB();

        if (!connect) {
            return next(new httpError("failed to connect DB", 500));
        }

        app.listen(port, (err) => {
            if (err) {
                return console.log(err.message);
            }

            console.log(`server is running on port ${port}`);
        });

    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

startServer();
