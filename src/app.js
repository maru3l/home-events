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

app.get('/:id/motion', (req, res) => {
  const topic = `home/${req.params.id}/camera/motion`;

  if (!['ON', 'OFF'].includes(req.query.Message)) throw new Error('Invalid Message');

  const message = req.query.Message;

  try {
    publish(topic, message);

    res.json({ response: 'OK' });
  } catch (error) {
    console.error(error);

    logger.error(error);

    res.status(500).json({ error });
  }
});

export default app;
