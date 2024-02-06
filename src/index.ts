import rateLimit from "express-rate-limit";
import cors from "cors";
const express = require("express");
const dotenv = require("dotenv");
import statsRouter from "./routes/stats";

dotenv.config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000,
});

app.use(limiter);
app.use(cors());
const port = process.env.PORT;

app.use('/stats', statsRouter);
app.listen(port, () => {
  console.log(
    `[server]: Server is running at http://localhost:${port} (${app.get(
      "env"
    )})`
  );
});