const { createHttpError } = require('../lib/httpError');

const roleRank = {
  reader: 1,
  author: 2,
  editor: 3,
  admin: 4
};

function requireRole(minimumRole) {
  return (req, _res, next) => {
    const role = req.auth?.role || 'reader';
    const currentRank = roleRank[role] || 0;
    const requiredRank = roleRank[minimumRole] || 0;

    if (currentRank < requiredRank) {
      return next(createHttpError(403, 'insufficient role'));
    }

    return next();
  };
}

module.exports = { requireRole, roleRank };
