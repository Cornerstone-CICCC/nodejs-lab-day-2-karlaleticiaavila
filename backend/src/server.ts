// Create your server
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/user.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4500;

app.use(
  cors({
    origin: 'http://localhost:4321',
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SIGN_KEY));

app.use('/', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});