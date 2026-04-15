const fs = require('fs');

const STATUS_FILE = '.status.json';

function readPreviousStatus() {
  if (!fs.existsSync(STATUS_FILE)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(STATUS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeCurrentStatus(payload) {
  fs.writeFileSync(STATUS_FILE, JSON.stringify(payload, null, 2), 'utf8');
}

module.exports = {
  STATUS_FILE,
  readPreviousStatus,
  writeCurrentStatus,
};
