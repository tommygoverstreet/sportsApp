# 🚀 Quick Netlify Deployment Guide

Your Softball Assistant Coach app is ready for deployment! Here are your options:

## Option 1: Drag & Drop (Fastest - 2 minutes)

1. **Zip the deployment folder**:
   - Right-click on the `deployment` folder
   - Select "Send to > Compressed (zipped) folder"

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up/log in (free account is fine)
   - Drag and drop your ZIP file to the deploy area
   - Wait 30 seconds for deployment
   - Your site is LIVE!

3. **Customize your URL**:
   - Click "Site settings" > "Change site name"
   - Choose something like: `yourteam-softball-coach`
   - Your final URL: `https://yourteam-softball-coach.netlify.app`

## Option 2: GitHub Integration (Best for updates)

1. **Create GitHub account** (if you don't have one):
   - Go to [github.com](https://github.com)
   - Sign up for free

2. **Create new repository**:
   - Click "New repository"
   - Name it: `softball-assistant-coach`
   - Make it public
   - Don't initialize with README (you already have one)

3. **Upload your files**:
   - Click "uploading an existing file"
   - Drag all files from the `deployment` folder
   - Commit changes

4. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub
   - Select your repository
   - Deploy settings:
     - Build command: (leave empty)
     - Publish directory: (leave empty)
   - Click "Deploy site"

## 🔐 Setting Up Access Control

Once deployed:

1. **Admin Login**:
   - Visit your site URL
   - Enter `tommygoverstreet@gmail.com` when prompted
   - You now have full admin access!

2. **Add Team Members**:
   - Click the red "Admin" tab (with crown icon)
   - Add approved email addresses for coaches and parents
   - Choose role: Coach or Parent

3. **Configure Team Settings**:
   - Set team name, season year, and league
   - Add player contact information
   - Export contact lists for emergencies

## 📱 Sharing Your App

- **Coaches**: Send them the URL and add their emails in Admin
- **Parents**: Perfect for checking lineups and team communication
- **Mobile Friendly**: Works great on phones and tablets
- **Offline Capable**: Most features work without internet

## 🔄 Making Updates

If you used GitHub integration:
1. Make changes to your files
2. Upload to GitHub
3. Netlify automatically updates your live site!

If you used drag & drop:
1. Make changes to files in `deployment` folder
2. Zip and drag & drop again to Netlify

---

🥎 **Your softball assistant coach app is ready to help manage your team professionally!**

Need help? The app includes sample data and is fully functional out of the box.
