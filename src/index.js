const fs = require('fs');
const { chromium } = require('playwright');
const { buildLaunchOptions } = require('./browser');
const { readPreviousStatus, writeCurrentStatus } = require('./history');
const {
  switchToEnglish,
  saveCaptcha,
  refreshCaptcha,
  attemptSubmit,
  resolveCaptchaValue,
} = require('./permitChecker');

function parseFlags(argv) {
  return {
    json: argv.includes('--json')
  };
}

function getCliArgs() {
  const args = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
  const surname = args[0];
  const passport = args[1];

  if (!surname || !passport) {
    console.error('Usage: node src/index.js <SURNAME> <PASSPORT> [--json]');
    console.error('Example: node src/index.js DOE AA1234567 --json');
    process.exit(1);
  }

  return { surname, passport };
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));
  const { surname, passport } = getCliArgs();
  const maxAttempts = 5;

  const { name: browserName, launchOptions } = buildLaunchOptions();
  if (!flags.json) {
    console.error(`Using browser: ${browserName}`);
  }

  const browser = await chromium.launch(launchOptions);
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('https://pf.emigrants.ypes.gr/pf/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await switchToEnglish(page);

    await page.waitForSelector('#surname', { timeout: 15000 });
    await page.waitForSelector('#passport', { timeout: 15000 });
    await page.waitForSelector('#captcha', { timeout: 15000 });
    await page.waitForSelector('#submit', { timeout: 15000 });
    await page.waitForSelector('#refreshcaptcha', { timeout: 15000 });
    await page.waitForSelector('img.-ddi-captcha-', { timeout: 15000 });

    await page.fill('#surname', surname);
    await page.fill('#passport', passport);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const captchaPath = 'captcha.png';
      await saveCaptcha(page, captchaPath);

      if (!flags.json) {
        console.error(`Captcha attempt ${attempt}/${maxAttempts}`);
      }

      const captcha = await resolveCaptchaValue(captchaPath, attempt, maxAttempts);
      const { text, status } = await attemptSubmit(page, captcha);

      if (status) {
        const previous = readPreviousStatus();
        const current = {
          status,
          checkedAt: new Date().toISOString()
        };

        writeCurrentStatus(current);

        if (flags.json) {
          const result = {
            status,
            changed: previous ? previous.status !== status : null,
            previousStatus: previous ? previous.status : null,
            checkedAt: current.checkedAt
          };
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log(status);

          if (previous && previous.status !== status) {
            console.error(`Status changed: "${previous.status}" -> "${status}"`);
          }
        }

        return;
      }

      if (attempt < maxAttempts) {
        if (!flags.json) {
          console.error(`Captcha or submission failed on attempt ${attempt}. Retrying...`);
        }
        await refreshCaptcha(page);
        await page.fill('#surname', surname);
        await page.fill('#passport', passport);
      } else {
        fs.writeFileSync('last-response.txt', text, 'utf8');
        await page.screenshot({ path: 'last-response.png', fullPage: true });
        throw new Error(
          `Could not parse status after ${maxAttempts} attempts. Saved last-response.txt and last-response.png`
        );
      }
    }
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
