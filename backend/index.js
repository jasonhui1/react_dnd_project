import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import dotenv from 'dotenv'
import board from './routes/board.js';

dotenv.config()

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// app.use('/todo', todo);
// app.use('/section', section);
app.use('/board', board);


const CONNECTION_URL =  process.env.DATABASE_URL
const PORT = process.env.PORT || 5000
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true });

app.listen(PORT, () => {
  console.log('Server started on port 5000');
});

