const blockedTags = new Set(['script', 'iframe', 'object', 'embed', 'link', 'meta']);

function stripDangerousHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/ on\w+="[^"]*"/gi, '')
    .replace(/ on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

function extractTextPreview(html, maxLength = 180) {
  const plain = stripDangerousHtml(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength - 1)}…`;
}

function validateRenderableHtml(html) {
  const lower = String(html || '').toLowerCase();
  for (const tag of blockedTags) {
    if (lower.includes(`<${tag}`)) {
      return { ok: false, reason: `disallowed tag: ${tag}` };
    }
  }
  return { ok: true };
}

module.exports = { stripDangerousHtml, extractTextPreview, validateRenderableHtml };
