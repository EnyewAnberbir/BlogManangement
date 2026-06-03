function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildPostSearchFilter(term) {
  const trimmed = String(term || '').trim();
  if (!trimmed) {
    return null;
  }

  const pattern = new RegExp(escapeRegex(trimmed), 'i');
  return {
    $or: [{ title: pattern }, { summary: pattern }, { content: pattern }, { slug: pattern }]
  };
}

module.exports = { buildPostSearchFilter, escapeRegex };
