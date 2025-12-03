@echo off
echo ====================================
echo Starting EISHRO Backend Server...
echo ====================================

echo Installing dependencies...
cd backend
npm install

echo Starting server on port 5000...
npm start

pause