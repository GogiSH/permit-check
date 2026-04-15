@echo off
cd /d "%~dp0"
node src\index.js %1 %2
timeout /t 5 /nobreak >nul
exit
