import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import markerRoutes from "./routes/markerRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import connectToDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => res.send("API Running"));
app.use("/api/users", userRoutes);
app.use("/api/markers", markerRoutes);
const corsOptions = {
  origin: 'https://kittymap-fe.onrender.com',
  
};

app.use(cors(corsOptions));
// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://kittymap-fe.onrender.com');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Running on ${process.env.PORT || 5000}`)
);
connectToDb();
