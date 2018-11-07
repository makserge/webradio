import SerialPort from 'serialport';

import config from '../config';
import serialController from '../controller/serialController';

export default (db, socket, mqttClient, port) => {
  const parser = new SerialPort.parsers.Readline({
    delimiter: config.serialPortDelimiter,
  });
  port.pipe(parser);

  parser.on('data', (data) => {
    serialController.process(db, socket, mqttClient, data);
  });
};
