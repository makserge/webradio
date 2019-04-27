import SerialPort from 'serialport';

import config from '../config';

export default (db, socket, serialController, mqttClient) => {
  const parser = new SerialPort.parsers.Readline({
    delimiter: config.serialPortDelimiter,
  });
  serialController.serialPort.pipe(parser);

  parser.on('data', (data) => {
    serialController.process(db, socket, mqttClient, data);
  });
};
