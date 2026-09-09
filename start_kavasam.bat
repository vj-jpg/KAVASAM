@echo off
title KAVASAM Disaster Intelligence Platform
echo Starting KAVASAM Local Mission Control Server...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
