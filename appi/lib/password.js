const bcrypt = require('bcryptjs');

const defaultSaltRounds = 10;
const salt = bcrypt.genSaltSync(defaultSaltRounds);

function hashPassword(plainText) {
  return bcrypt.hashSync(plainText, salt);
}

function verifyPassword(plainText, hashed) {
  return bcrypt.compareSync(plainText, hashed);
}

module.exports = { hashPassword, verifyPassword, salt };
