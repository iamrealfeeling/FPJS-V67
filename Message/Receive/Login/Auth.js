'use strict';

const { Stream }  = require('../../../Core/Byte/Stream');
const { AuthOk }  = require('../../Transmit/Login/AuthOk');
const { OwnData } = require('../../Transmit/Home/OwnData');

class Auth {
  constructor(socket, payload) {
    this.stream  = new Stream(payload);
    this.socket  = socket;
    this.highId  = 0;
    this.lowId   = 0;
    this.token   = '';
    this.major   = 0;
    this.build   = 0;
    this.content = 0;
  }

  decode() {
    this.highId  = this.stream.readInt();
    this.lowId   = this.stream.readInt();
    this.token   = this.stream.readString();
    this.major   = this.stream.readVInt();
    this.build   = this.stream.readVInt();
    this.content = this.stream.readVInt();
  }

  process() {
    // Original Zig sleeps 2 s before replying — replicated with setTimeout
    setTimeout(() => {
      const ok = new AuthOk(this.socket);
      ok.send();

      const home = new OwnData(this.socket);
      home.send();
    }, 2000);
  }
}

module.exports = { Auth };
