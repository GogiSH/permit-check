const fs = require('fs');

function findInstalledBrowser() {
  const candidates = [
    {
      name: 'Microsoft Edge (x86)',
      path: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    },
    {
      name: 'Microsoft Edge',
      path: 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    },
    {
      name: 'Google Chrome',
      path: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    },
    {
      name: 'Google Chrome (x86)',
      path: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    }
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate.path)) {
      return candidate;
    }
  }

  return null;
}

function buildLaunchOptions() {
  const installed = findInstalledBrowser();

  if (installed) {
    return {
      name: installed.name,
      launchOptions: {
        headless: true,
        executablePath: installed.path
      }
    };
  }

  return {
    name: 'Playwright bundled browser',
    launchOptions: {
      headless: true
    }
  };
}

module.exports = {
  findInstalledBrowser,
  buildLaunchOptions,
};
