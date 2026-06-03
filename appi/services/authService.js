const jwt = require('jsonwebtoken');
const { createHttpError } = require('../lib/httpError');
const { hashPassword, verifyPassword } = require('../lib/password');
const userRepository = require('../repositories/userRepository');
const auditService = require('./auditService');
const {
  validateRegisterPayload,
  validateLoginPayload,
  validateProfileUpdatePayload
} = require('../lib/validators');

const authCookieName = 'token';

function buildAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  };
}

function signToken(userDoc, jwtSecret) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        id: userDoc._id,
        username: userDoc.username,
        role: userDoc.role || 'author'
      },
      jwtSecret,
      {},
      (err, token) => {
        if (err) return reject(err);
        return resolve(token);
      }
    );
  });
}

async function registerUser(body) {
  const { username, password, displayName } = validateRegisterPayload(body);
  const userDoc = await userRepository.createUser({
    username,
    password: hashPassword(password),
    displayName: displayName || username
  });
  await auditService.record(userDoc._id, 'user.register', 'user', userDoc._id);
  return userDoc;
}

async function loginUser(body, jwtSecret) {
  const { username, password } = validateLoginPayload(body);
  const userDoc = await userRepository.findByUsername(username);

  if (!userDoc || !verifyPassword(password, userDoc.password)) {
    throw createHttpError(400, 'wrong credentials');
  }

  const token = await signToken(userDoc, jwtSecret);
  await auditService.record(userDoc._id, 'user.login', 'user', userDoc._id);

  return {
    token,
    profile: {
      id: userDoc._id,
      username: userDoc.username,
      role: userDoc.role,
      displayName: userDoc.displayName
    }
  };
}

async function updateProfile(auth, body) {
  const payload = validateProfileUpdatePayload(body);
  const userDoc = await userRepository.findById(auth.id);

  if (!userDoc) {
    throw createHttpError(404, 'user not found');
  }

  if (payload.displayName !== undefined) userDoc.displayName = payload.displayName;
  if (payload.bio !== undefined) userDoc.bio = payload.bio;
  await userDoc.save();

  await auditService.record(auth.id, 'user.profile.update', 'user', auth.id);
  return {
    id: userDoc._id,
    username: userDoc.username,
    role: userDoc.role,
    displayName: userDoc.displayName,
    bio: userDoc.bio
  };
}

module.exports = {
  authCookieName,
  buildAuthCookieOptions,
  registerUser,
  loginUser,
  updateProfile
};
