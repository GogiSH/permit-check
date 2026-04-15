function normalizeWhitespace(value) {
  return (value || '').replace(/\s+/g, ' ').trim();
}

function extractField(text, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`${escaped}\\s+(.+)`, 'i');
  const match = text.match(re);
  return match ? normalizeWhitespace(match[1]) : null;
}

function parseStatus(text, finalUrl) {
  const isResultPage =
    /Search result|Αποτέλεσμα αναζήτησης/i.test(text) ||
    /\/pf\/result/i.test(finalUrl);

  if (!isResultPage) {
    return null;
  }

  return (
    extractField(text, 'Permit status') ||
    extractField(text, 'Κατάσταση άδειας')
  );
}

function decodeBase64Image(dataUrl) {
  const match = dataUrl.match(/^data:image\/png;base64,(.+)$/);
  if (!match) {
    throw new Error('Captcha image is not a PNG data URL');
  }
  return Buffer.from(match[1], 'base64');
}

module.exports = {
  normalizeWhitespace,
  extractField,
  parseStatus,
  decodeBase64Image,
};
