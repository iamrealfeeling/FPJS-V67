'use strict';

// Thread-local in Zig → simple module-level variable here (single-threaded event loop).
// For multi-worker setups you'd use AsyncLocalStorage.
let _addr = '';

function termWidth() {
  return process.stdout.columns || 80;
}

function visibleLen(s) {
  // Count Unicode code-points
  return [...s].length;
}

function center(visible) {
  const W = termWidth();

  if (W > visible) {
    process.stdout.write(' '.repeat(Math.floor((W - visible) / 2)));
  }
}

function emit(s) {
  process.stdout.write(s);
}

// ── Public API ───────────────────────────────────────────────────────────────

function setAddr(addr) {
  // addr is a string like "127.0.0.1:12345" — strip the port
  const idx = addr.lastIndexOf(':');
  _addr = idx !== -1 ? addr.slice(0, idx) : addr;
}

function getAddr() {
  return _addr;
}

function banner() {
  const lines = [
    ' ______ _____     _  _____    __      __________ ',
    '|  ____|  __ \\   | |/ ____|   \\ \\    / / /____  |',
    '| |__  | |__) |  | | (___ _____\\ \\  / / /_   / / ',
    '|  __| |  ___/   | |\\___ \\______\\ \\/ / \'_ \\ / /  ',
    '| |    | |  | |__| |____) |      \\  /| (_) / /   ',
    '|_|    |_|   \\____/|_____/        \\/  \\___/_/    ',
    '                                                  ',
    'FPJS-V67 | by @iamfeelingbad | Core by: github.com/FMZNkdv'
  ];

  const colors = [
    '\x1b[38;2;0;255;255m',
    '\x1b[38;2;0;180;255m',
    '\x1b[38;2;80;100;255m',
    '\x1b[38;2;160;60;255m',
    '\x1b[38;2;220;40;220m',
    '\x1b[38;2;255;180;220m',
    '\x1b[38;2;255;255;255m',
    '\x1b[38;2;180;180;180m'
  ];

  const lineLen = 70;

  emit('\n');

  for (let i = 0; i < lines.length; i++) {
    center(lineLen);

    emit(
      `${colors[Math.min(i, colors.length - 1)]}\x1b[1m${lines[i]}\x1b[0m\n`
    );
  }

  emit('\n');
}

function serverInfo(msg) {
  center(10 + 2 + visibleLen(msg));

  emit(`\x1b[36m\x1b[1m[ SERVER ]\x1b[0m  ${msg}\n`);
}

function connect() {
  const a = getAddr();

  center(2 + visibleLen(a) + 4 + 13);

  emit(
    `\x1b[32m\x1b[1m[ ${a} ]\x1b[0m\x1b[32m  ●  Connected\x1b[0m\n`
  );
}

function disconnect() {
  const a = getAddr();

  center(2 + visibleLen(a) + 4 + 16);

  emit(
    `\x1b[33m\x1b[1m[ ${a} ]\x1b[0m\x1b[33m  ○  Disconnected\x1b[0m\n`
  );
}

function packetName(id) {
  switch (id) {
    case 10100:
      return 'Hello';

    case 10101:
      return 'Auth';

    case 20100:
      return 'Hello';

    case 20104:
      return 'AuthOk';

    case 24101:
      return 'HomeData';

    default:
      return 'Unknown';
  }
}

function packetIn(id) {
  const a = getAddr();
  const name = packetName(id);

  if (name === 'Unknown') {
    const msg = `Not Found (${id})`;

    center(2 + visibleLen(a) + 4 + 5 + visibleLen(msg));

    emit(
      `\x1b[34m\x1b[1m[ ${a} ]\x1b[0m\x1b[34m  ←  \x1b[0m\x1b[33m${msg}\x1b[0m\n`
    );
  } else {
    center(2 + visibleLen(a) + 4 + 5 + visibleLen(name));

    emit(
      `\x1b[34m\x1b[1m[ ${a} ]\x1b[0m\x1b[34m  ←  \x1b[0m${name}\n`
    );
  }
}

function packetOut(id) {
  const a = getAddr();
  const name = packetName(id);

  if (name === 'Unknown') {
    const msg = `Not Found (${id})`;

    center(2 + visibleLen(a) + 4 + 5 + visibleLen(msg));

    emit(
      `\x1b[35m\x1b[1m[ ${a} ]\x1b[0m\x1b[35m  →  \x1b[0m\x1b[33m${msg}\x1b[0m\n`
    );
  } else {
    center(2 + visibleLen(a) + 4 + 5 + visibleLen(name));

    emit(
      `\x1b[35m\x1b[1m[ ${a} ]\x1b[0m\x1b[35m  →  \x1b[0m${name}\n`
    );
  }
}

function unknown(id) {
  const a = getAddr();
  const msg = `Not Found (${id})`;

  center(2 + visibleLen(a) + 4 + 5 + visibleLen(msg));

  emit(
    `\x1b[33m\x1b[1m[ ${a} ]\x1b[0m\x1b[33m  ?  ${msg}\x1b[0m\n`
  );
}

function clientErr(msg) {
  const a = getAddr();

  center(2 + visibleLen(a) + 4 + 5 + visibleLen(msg));

  emit(
    `\x1b[31m\x1b[1m[ ${a} ]  ✗  ${msg}\x1b[0m\n`
  );
}

module.exports = {
  setAddr,
  getAddr,

  banner,
  serverInfo,

  connect,
  disconnect,

  packetIn,
  packetOut,
  packetName,

  unknown,
  clientErr,
};
