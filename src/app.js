import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { publish } from './mqtt';
import logger from './logger';

const app = express();

app.enable('trust proxy');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/driveway/motion/on', (req, res) => {
  try {
    publish('home/driveway/camera/motion', 'ON');

    res.json({ response: 'OK' });
  } catch (error) {
    console.error(error);

    logger.error(error);

    res.status(500).json({ error });
  }
});

app.get('/driveway/motion/off', (req, res) => {
  try {
    publish('home/driveway/camera/motion', 'OFF');

    res.json({ response: 'OK' });
  } catch (error) {
    logger.error(error);

    res.status(500).json({ error });
  }
});

app.get('/front_yard/motion/on', (req, res) => {
  try {
    publish('home/front_yard/camera/motion', 'ON');

    res.json({ response: 'OK' });
  } catch (error) {
    logger.error(error);

    res.status(500).json({ error });
  }
});

app.get('/front_yard/motion/off', (req, res) => {
  try {
    publish('home/front_yard/camera/motion', 'OFF');

    res.json({ response: 'OK' });
  } catch (error) {
    logger.error(error);

    res.status(500).json({ error });
  }
});

export default app;
