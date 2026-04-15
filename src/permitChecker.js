const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');
const { decodeBase64Image, parseStatus } = require('./utils');

function ask(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function openFileOnWindows(path) {
  exec(`start "" "${path}"`);
}

async function switchToEnglish(page) {
  const englishLink = page.locator('a:has-text("English")').first();
  if (await englishLink.count()) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {}),
      englishLink.click(),
    ]);
  }
}

async function saveCaptcha(page, filePath) {
  const src = await page.locator('img.-ddi-captcha-').getAttribute('src');
  if (!src) {
    throw new Error('Captcha image not found');
  }

  const buffer = decodeBase64Image(src);
  fs.writeFileSync(filePath, buffer);
}

async function refreshCaptcha(page) {
  await Promise.all([
    page.waitForLoadState('domcontentloaded').catch(() => {}),
    page.locator('#refreshcaptcha').click(),
  ]);

  await page.waitForTimeout(500);
}

async function attemptSubmit(page, captchaText, timeoutMs) {
  await page.fill('#captcha', '');
  await page.fill('#captcha', captchaText);

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: timeoutMs }).catch(() => {}),
    page.locator('#submit').click(),
  ]);

  await page.waitForTimeout(1200);

  const finalUrl = page.url();
  const text = await page.locator('body').innerText();
  const status = parseStatus(text, finalUrl);

  return { finalUrl, text, status };
}

async function resolveCaptchaValue(captchaPath, attempt, maxAttempts) {
  openFileOnWindows(captchaPath);

  const captcha = await ask(`Enter captcha [attempt ${attempt}/${maxAttempts}]: `);
  if (!captcha) {
    throw new Error('Captcha was not entered');
  }

  return captcha.trim();
}

module.exports = {
  ask,
  openFileOnWindows,
  switchToEnglish,
  saveCaptcha,
  refreshCaptcha,
  attemptSubmit,
  resolveCaptchaValue,
};
