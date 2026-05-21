@echo off
title NexBuy AI Engine
cd /d "%~dp0ai-engine"
echo Starting NexBuy AI Engine at http://localhost:8000 ...
%USERPROFILE%\anaconda3\python.exe -m uvicorn app.main:app --port 8000 --reload
pause
