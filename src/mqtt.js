import * as mqtt from 'mqtt';
import logger from './logger';

let client;

export async function connect(server, options) {
  return new Promise((resolve, reject) => {
    client = mqtt.connect(
      server,
      { autoUseTopicAlias: true, properties: {}, ...options },
    );

    client.on('connect', () => {
      logger.info('Connected to MQTT server');

      // console.log(client);

      resolve();
    });

    client.on('error', (error) => {
      reject(error);
    });
  });
}

export async function publish(topic, message, options = {}) {
  if (!client) {
    throw new Error('MQTT client not initialized');
  }

  return new Promise((resolve, reject) => {
    client.publish(topic, message, options, (error) => {
      if (error) {
        reject(error);
      }

      resolve();
    });
  });
}

export async function disconnect() {
  if (!client) {
    throw new Error('MQTT client not initialized');
  }

  return new Promise((resolve, reject) => {
    client.end(false, (error) => {
      if (error) {
        reject(error);
      }

      resolve();
    });
  });
}
