'use strict';

const { Piranha } = require('../../../Core/Piranha');

class AuthOk {
  constructor(socket) {
    this.msg = new Piranha(socket, 20104, 1);
  }

  encode() {
    const w  = this.msg.stream;
    const ts = Date.now().toString();

    w.writeLong(0, 1);
    w.writeLong(0, 1);
    w.writeString('psinatoken');
    w.writeString(null);
    w.writeString(null);
    w.writeInt(67);
    w.writeInt(264);
    w.writeInt(1);
    w.writeString('prod');
    w.writeInt(0);
    w.writeInt(0);
    w.writeInt(1);
    w.writeString('');
    w.writeString(ts);
    w.writeString(ts);
  }

  send() {
    this.encode();
    this.msg.send();
  }
}

module.exports = { AuthOk };
