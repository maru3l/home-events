/**
 * Module dependencies.
 */

import http from 'http';

import { MQTT_PORT, MQTT_SERVER } from '../../config/config';
import app from '../app';
import { connect as mqttConnect, disconnect as mqttDisconnect } from '../mqtt';
import logger from '../logger';

// /**
//  * Create HTTP server.
//  */
const server = http.createServer(app);

// /**
//  * Normalize a port into a number, string, or false.
//  */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// /**
//  * Get port from environment and store in Express.
//  */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// /**
//  * Event listener for HTTP server "error" event.
//  */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      throw new Error(`${bind} requires elevated privileges`);
    case 'EADDRINUSE':
      throw new Error(`${bind} is already in use`);
    default:
      throw error;
  }
}

// /**
//  * Event listener for HTTP server "listening" event.
//  */

function onListening() {
  const addr = server.address();

  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;

  logger.info(`Listening on ${bind}`);
}

async function closeGracefully(signal) {
  mqttDisconnect();

  process.exit();
}

async function run() {
  try {
    await mqttConnect(`mqtt://${MQTT_SERVER}:${MQTT_PORT}`, { autoUseTopicAlias: true });

    server.listen(port);

    server.on('error', onError);

    server.on('listening', onListening);

    process.on('SIGINT', closeGracefully);
  } catch (error) {
    logger.error(error);

    process.exit(1);
  }
}

run();
