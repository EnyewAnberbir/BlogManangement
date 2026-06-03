function parsePagination(query) {
  const rawPage = Number(query.page || 1);
  const rawLimit = Number(query.limit || 20);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(Math.floor(rawLimit), 50) : 20;

  return { page, limit, skip: (page - 1) * limit };
}

function buildPageEnvelope({ page, limit, total, items }) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 0,
    items
  };
}

module.exports = { parsePagination, buildPageEnvelope };
