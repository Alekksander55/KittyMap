import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import markerRoutes from './routes/markerRoutes.js'
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import connectToDb from "./config/db.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.get("/", (req, res) => res.send("API Running"));
app.use("/api/users", userRoutes);
app.use('/api/markers', markerRoutes)

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.SERVER_PORT || 5000, () =>
  console.log(`Running on ${process.env.SERVER_PORT || 5000}`)
);
connectToDb();
