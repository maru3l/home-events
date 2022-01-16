import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.prettyPrint(),
        format.colorize({ all: true, colors: { info: 'blue', error: 'red' } }),
        format.errors({ stack: true }),
      ),
    }),
    // new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;
