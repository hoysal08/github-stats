import rateLimit from "express-rate-limit";
import cors from "cors";
import dotenv from 'dotenv';
import statsRouter from "./routes/stats";
import error from './middleware/error';
import express from 'express';

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
app.use(error.notFound);

app.listen(port, () => {
  console.log(
    `[server]: Server is running at http://localhost:${port} (${app.get(
      "env"
    )})`
  );
});