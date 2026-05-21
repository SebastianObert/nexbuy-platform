@echo off
title NexBuy AI Services
cd /d "%~dp0ai-engine"
echo Starting NexBuy AI Engine     at http://localhost:8000 ...
echo Starting NexBuy Anomaly Service at http://localhost:8001 ...
start "AI Engine"       %USERPROFILE%\anaconda3\python.exe -m uvicorn app.main:app --port 8000
start "Anomaly Service" %USERPROFILE%\anaconda3\python.exe -m uvicorn anomaly_service:app --port 8001
echo.
echo Kedua service berjalan. Tutup jendela ini untuk menghentikan.
pause
