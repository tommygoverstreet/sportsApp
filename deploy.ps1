# 🥎 Softball Assistant Coach - Netlify Deployment Helper
Write-Host "🥎 Softball Assistant Coach - Netlify Deployment Helper" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will help you prepare your app for Netlify deployment." -ForegroundColor Yellow
Write-Host ""

Write-Host "Step 1: Creating deployment-ready files..." -ForegroundColor Green
Write-Host ""

# Create deployment folder
if (!(Test-Path "deployment")) {
    New-Item -ItemType Directory -Name "deployment"
}

# Copy all necessary files
$files = @("index.html", "styles.css", "script.js", "package.json", "netlify.toml", "README.md")

foreach ($file in $files) {
    if (Test-Path $file) {
        Copy-Item $file "deployment\"
        Write-Host "✅ Copied $file" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $file not found" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Files copied to 'deployment' folder" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Next steps for Netlify deployment:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option A - Drag & Drop:" -ForegroundColor Cyan
Write-Host "  1. Zip the 'deployment' folder" -ForegroundColor White
Write-Host "  2. Go to https://netlify.com" -ForegroundColor White
Write-Host "  3. Drag and drop the zip file" -ForegroundColor White
Write-Host ""
Write-Host "Option B - GitHub:" -ForegroundColor Cyan
Write-Host "  1. Create a new repository on GitHub" -ForegroundColor White
Write-Host "  2. Upload the 'deployment' folder contents" -ForegroundColor White
Write-Host "  3. Connect to Netlify via GitHub" -ForegroundColor White
Write-Host ""
Write-Host "Your app will be live at: https://[yoursite].netlify.app" -ForegroundColor Magenta
Write-Host ""
Write-Host "🔐 Don't forget to set up authentication:" -ForegroundColor Yellow
Write-Host "  - Use tommygoverstreet@gmail.com for admin access" -ForegroundColor White
Write-Host "  - Add approved emails in the Admin dashboard" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to continue"
