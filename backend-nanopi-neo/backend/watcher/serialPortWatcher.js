import SerialPort from 'serialport';

import config from '../config';
import serialController from '../controller/serialController';

export default (db, port) => {
  const Readline = SerialPort.parsers.Readline;
  const parser = new Readline({
    delimiter: config.serialPortDelimiter
  });
  port.pipe(parser);

  parser.on('data', (data) => {
  	serialController.process(db, data);
  });
}
