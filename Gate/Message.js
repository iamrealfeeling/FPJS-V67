'use strict';

const { Hello }  = require('../Message/Receive/Login/Hello');
const { Auth }   = require('../Message/Receive/Login/Auth');
const Logger     = require('../Core/Logger');

function dispatch(id, payload, socket) {
  switch (id) {
    case 10100: {
      const msg = new Hello(socket, payload);
      msg.decode();
      msg.process();
      break;
    }
    case 10101: {
      const msg = new Auth(socket, payload);
      msg.decode();
      msg.process();
      break;
    }
    default:
      Logger.unknown(id);
  }
}

module.exports = { dispatch };
