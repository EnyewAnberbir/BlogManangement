const { createHttpError } = require('../lib/httpError');

const buckets = new Map();

function createRateLimiter({ windowMs = 60_000, maxRequests = 30, keyFn } = {}) {
  const resolveKey =
    keyFn ||
    ((req) => req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown');

  return (req, _res, next) => {
    const key = `${req.path}:${resolveKey(req)}`;
    const now = Date.now();
    const current = buckets.get(key);

    if (!current || now >= current.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (current.count >= maxRequests) {
      return next(createHttpError(429, 'too many requests'));
    }

    current.count += 1;
    return next();
  };
}

function resetRateLimitBuckets() {
  buckets.clear();
}

module.exports = { createRateLimiter, resetRateLimitBuckets };
