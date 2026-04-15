# Permit Check

![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![Platform](https://img.shields.io/badge/platform-windows-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

Windows-first CLI tool for checking Greek residence permit status through the official public website.

## What it does

- Opens the official page in a headless browser
- Switches to English
- Fills surname and passport number from CLI arguments or environment variables
- Saves the CAPTCHA image locally as `captcha.png`
- Opens the image using the default Windows image viewer
- Waits for you to type the CAPTCHA value in the command prompt
- Submits the form
- Prints only the final permit status
- Stores the last known status in `.status.json`
- Can optionally print JSON output for automation

## Why manual CAPTCHA?

This tool intentionally requires manual CAPTCHA input.

Reasons:
- CAPTCHA is designed to prevent automation
- OCR is unreliable for distorted images
- Clipboard-based flows are fragile across environments
- Manual entry is the most stable and predictable workflow

## Important

This tool keeps a human in the loop for CAPTCHA entry.

It does **not** bypass, solve, or evade CAPTCHA protections.

## Prerequisites

### 1. Node.js

Install Node.js LTS:

- https://nodejs.org/

Verify installation:

```bash
node -v
npm -v
```

### 2. Browser

The tool prefers an already installed local browser and checks these paths in order:

- `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`
- `C:\Program Files\Microsoft\Edge\Application\msedge.exe`
- `C:\Program Files\Google\Chrome\Application\chrome.exe`
- `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`

If one of these is found, it will be used automatically.

If no local browser is found, the tool falls back to the Playwright-managed browser.

### 3. Internet access

The tool connects to:

- `https://pf.emigrants.ypes.gr/pf/`

## Installation

Clone the repository:

```bash
git clone https://github.com/GogiSH/permit-check.git
cd permit-check
```

Install dependencies:

```bash
npm install
```

## Playwright browser installation

In most Windows setups, **you do not need this step**, because the tool uses your installed Edge or Chrome.

Run this only if:

- you do not have a supported local browser installed, or
- you want to use the Playwright-managed browser fallback

```bash
npx playwright install
```

## Proxy configuration

If you are behind a corporate proxy, set proxy environment variables before running the tool.

PowerShell:

```powershell
$env:HTTP_PROXY="http://user:password@proxy:port"
$env:HTTPS_PROXY="http://user:password@proxy:port"
node src/index.js DOE AA1234567
```

Persistent Windows setting:

```powershell
setx HTTP_PROXY "http://user:password@proxy:port"
setx HTTPS_PROXY "http://user:password@proxy:port"
```

Then open a new terminal window.

## Usage

Run directly:

```bash
node src/index.js SURNAME PASSPORT
```

Example:

```bash
node src/index.js DOE AA1234567
```

Use compatibility wrapper:

```bash
node check-permit.js DOE AA1234567
```

Use installed binary locally after `npm install`:

```bash
npx permit-check DOE AA1234567
```

Or use the batch file:

```bat
run-permit.bat DOE AA1234567
```

## Environment variables

You can also pass values through environment variables.

PowerShell:

```powershell
$env:SURNAME="DOE"
$env:PASSPORT="AA1234567"
node src/index.js
```

Optional timeout override:

```powershell
$env:TIMEOUT_MS="90000"
node src/index.js DOE AA1234567
```

## JSON output

For automation or scripting, use:

```bash
node src/index.js DOE AA1234567 --json
```

Example output:

```json
{
  "status": "THE APPLICATION HAS BEEN RECEIVED AND IS UNDER EXAMINATION",
  "changed": false,
  "previousStatus": "THE APPLICATION HAS BEEN RECEIVED AND IS UNDER EXAMINATION",
  "checkedAt": "2026-04-15T12:00:00.000Z"
}
```

## Status history

The tool stores the last known status in:

```text
.status.json
```

This allows you to detect whether the status changed since the previous run.

## How the CAPTCHA flow works

1. The script opens the official website
2. The script switches to English
3. The script fills surname and passport number
4. The script saves `captcha.png`
5. The script opens the image using the default Windows image viewer
6. You read the CAPTCHA value from the image
7. You type the CAPTCHA value into the command prompt
8. The script submits the form
9. If needed, the script refreshes the CAPTCHA and retries
10. The script prints only the status

## Output

Example:

```text
THE APPLICATION HAS BEEN RECEIVED AND IS UNDER EXAMINATION
```

## Troubleshooting

### `npx playwright install` fails with `ENOTFOUND cdn.playwright.dev`

If you already have Edge or Chrome installed, skip `npx playwright install`.

The tool is designed to work with your installed browser first.

Only the Playwright fallback needs a Playwright browser download.

### Browser not found

Edit `src/browser.js` and add your browser path if needed.

### CAPTCHA image does not open

Make sure Windows has a default image viewer associated with PNG files.

### Status could not be parsed

The tool saves:

- `last-response.txt`
- `last-response.png`

Review them locally and do not commit them.

## Security and privacy

Do not commit:

- real surname
- passport number
- application IDs
- generated result files
- screenshots
- local machine paths
- any personal status output

## Files that should stay out of Git

- `captcha.png`
- `last-response.txt`
- `last-response.png`
- `.status.json`

## Disclaimer

- Uses a public official website
- Requires human interaction for CAPTCHA
- Does not bypass CAPTCHA
- Intended for personal use
