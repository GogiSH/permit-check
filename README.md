# Permit Check

Simple Windows CLI tool to check Greek residence permit status via the official website.

---

## ⚙️ Prerequisites

### 1. Node.js
Install Node.js (LTS recommended):
https://nodejs.org/

Verify:
node -v
npm -v

---

### 2. Browser

Supported:
- Microsoft Edge (recommended)
- Google Chrome

Default paths supported:
- C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
- C:\Program Files\Microsoft\Edge\Application\msedge.exe
- C:\Program Files\Google\Chrome\Application\chrome.exe
- C:\Program Files (x86)\Google\Chrome\Application\chrome.exe

---

### 3. Internet Access

Required endpoint:
https://pf.emigrants.ypes.gr/pf/

---

## 🌐 Proxy Configuration (Optional)

If you are behind a corporate network or proxy:

### Option 1 — Environment variables

Windows PowerShell:

setx HTTP_PROXY http://user:password@proxy:port
setx HTTPS_PROXY http://user:password@proxy:port

Restart terminal after setting.

---

### Option 2 — Playwright config (advanced)

Edit src/index.js:

const browser = await chromium.launch({
  headless: true,
  proxy: {
    server: "http://proxy:port",
    username: "user",
    password: "password"
  }
});

---

## 📦 Installation

git clone <your-repo-url>
cd permit-check

npm install

npx playwright install

---

## 🚀 Usage

node src/index.js SURNAME PASSPORT

Example:
node src/index.js DOE AA1234567

Or:

run-permit.bat DOE AA1234567

---

## 🔄 How it works

1. Opens official website
2. Switches to English
3. Fills form
4. Saves captcha.png
5. Opens image in Paint
6. Waits for clipboard input
7. Submits form
8. Prints status

---

## 🧠 CAPTCHA Flow

Manual step required:
- Read captcha
- Copy text
- Script continues automatically

---

## 🖥 Output

Example:
THE APPLICATION HAS BEEN RECEIVED AND IS UNDER EXAMINATION

---

## ⚠️ Troubleshooting

### CAPTCHA not opening
Check:
C:\Windows\System32\mspaint.exe

### Browser not found
Edit src/browser.js

### Script stuck
Copy captcha text to clipboard

### Playwright issues
npx playwright install

---

## 🔒 Security

Do NOT commit:
- surname
- passport number
- result files
- screenshots
- local paths

---

## 📁 Ignored Files

captcha.png
last-response.txt
last-response.png

---

## 📌 Disclaimer

- Uses official public website
- No CAPTCHA bypass
- Human interaction required
