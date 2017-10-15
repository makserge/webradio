import IO from 'koa-socket';

import config from './config';

export default (app) => {
  const options = {
    ioOptions: {
      pingInterval: config.socketHeartBeatInterval,
      pingTimeout: config.socketHeartBeatTimeout
    }
  };
  const socket = new IO(options);
  socket.attach(app);
  return socket;
};
