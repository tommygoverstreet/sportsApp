@echo off
echo 🥎 Softball Assistant Coach - Netlify Deployment Helper
echo =====================================================
echo.
echo This script will help you prepare your app for Netlify deployment.
echo.
echo Step 1: Creating deployment-ready files...
echo.

REM Create a deployment folder
if not exist "deployment" mkdir deployment

REM Copy all necessary files
copy index.html deployment\
copy styles.css deployment\
copy script.js deployment\
copy package.json deployment\
copy netlify.toml deployment\
copy README.md deployment\

echo ✅ Files copied to 'deployment' folder
echo.
echo Step 2: Next steps for Netlify deployment:
echo.
echo Option A - Drag & Drop:
echo   1. Zip the 'deployment' folder
echo   2. Go to https://netlify.com
echo   3. Drag and drop the zip file
echo.
echo Option B - GitHub:
echo   1. Create a new repository on GitHub
echo   2. Upload the 'deployment' folder contents
echo   3. Connect to Netlify via GitHub
echo.
echo Your app will be live at: https://[yoursite].netlify.app
echo.
echo 🔐 Don't forget to set up authentication:
echo   - Use tommygoverstreet@gmail.com for admin access
echo   - Add approved emails in the Admin dashboard
echo.
pause
