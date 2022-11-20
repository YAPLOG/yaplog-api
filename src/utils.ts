const crypto = require('node:crypto');

function getRandomUUID() {
  return crypto.randomUUID();
}

function getRandomHash() {
  return crypto.randomBytes(20).toString('hex');
}

export { getRandomUUID, getRandomHash };
