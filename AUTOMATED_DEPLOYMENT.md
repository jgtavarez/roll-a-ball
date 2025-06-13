# Automated Deployment Setup

**Created by:** Juan Gabriel  
**License:** 1200221

## 🚀 **Automatic Deployment with GitHub Actions**

This setup will automatically build and deploy your Unity game whenever you push to the main branch!

## 📋 **Setup Requirements**

### 1. **Unity License Setup**

You need to add your Unity credentials as GitHub repository secrets:

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:

```
UNITY_EMAIL     = your-unity-account@email.com
UNITY_PASSWORD  = your-unity-password
UNITY_LICENSE   = your-unity-license-content
```

### 2. **Getting Your Unity License**

#### Option A: Personal License (Free)
```bash
# Request activation file
unity -batchmode -createManualActivationFile -quit

# This creates Unity_v20XX.X.XXXX.alf
# Upload this file to: https://license.unity3d.com/manual
# Download the .ulf license file
# Copy the contents to UNITY_LICENSE secret
```

#### Option B: Unity Pro License
Use your existing Unity Pro license file content.

### 3. **Repository Setup**

```bash
# Initialize your repository
git init
git add .
git commit -m "Initial Unity Roll-a-Ball project"
git remote add origin https://github.com/yourusername/roll-a-ball-curso.git
git push -u origin main
```

## 🔧 **How It Works**

### **Triggers**
- ✅ **Push to main branch** - Automatic deployment
- ✅ **Pull Request** - Build test (no deployment)
- ✅ **Manual trigger** - Run workflow manually

### **Workflow Steps**
1. **Checkout** - Gets your code
2. **Cache Unity Library** - Speeds up builds
3. **Free Disk Space** - Ensures enough space
4. **Build Unity Project** - Creates WebGL build
5. **Create Custom Index** - Adds your branding
6. **Deploy to GitHub Pages** - Publishes the game
7. **Upload Artifacts** - Saves build for download

## 🎯 **Deployment Process**

### **Automatic Deployment**
```bash
# Make changes to your Unity project
git add .
git commit -m "Updated level design"
git push origin main

# GitHub Actions automatically:
# 1. Builds your Unity project
# 2. Deploys to GitHub Pages
# 3. Game is live at: https://yourusername.github.io/roll-a-ball-curso
```

### **Manual Deployment**
1. Go to **Actions** tab in your GitHub repository
2. Click **Build and Deploy Unity Game to GitHub Pages**
3. Click **Run workflow**
4. Select branch and click **Run workflow**

## 📁 **File Structure for Deployment**

```
Your Repository/
├── .github/
│   └── workflows/
│       └── deploy.yml          # 🔥 AUTO-DEPLOYMENT WORKFLOW
├── Assets/                     # Unity project files
├── ProjectSettings/            # Unity settings
├── README.md                   # Project documentation
├── DEPLOYMENT.md               # Manual deployment guide
└── AUTOMATED_DEPLOYMENT.md     # This file
```

## 🎮 **Game Deployment Features**

### **Automatic Features**
- ✅ **Custom branded index.html** with your info
- ✅ **Player info displayed** (Juan Gabriel, License: 1200221)
- ✅ **Game controls documentation**
- ✅ **Level overview and objectives**
- ✅ **Mobile-friendly warnings**
- ✅ **Professional styling**

### **Build Optimizations**
- ✅ **WebGL compression** (Gzip)
- ✅ **Artifact caching** for faster builds
- ✅ **Disk space management**
- ✅ **Build artifact downloads**

## 🔍 **Monitoring Deployments**

### **View Build Status**
- Go to **Actions** tab in your repository
- Click on latest workflow run
- Monitor build progress in real-time

### **Deployment URLs**
- **Game URL**: `https://yourusername.github.io/roll-a-ball-curso`
- **Repository**: `https://github.com/yourusername/roll-a-ball-curso`

## ⚠️ **Troubleshooting**

### **Common Issues**

#### 1. **Unity License Errors**
```
Error: Unity license not found
```
**Solution**: Verify `UNITY_LICENSE` secret is correctly set with .ulf file content

#### 2. **Build Failures**
```
Error: Build failed with Unity errors
```
**Solution**: Check Unity console errors in project, fix script issues

#### 3. **GitHub Pages Not Working**
```
Error: 404 - Site not found
```
**Solution**: 
- Ensure repository is public
- Check GitHub Pages settings
- Verify deployment completed successfully

#### 4. **Disk Space Issues**
```
Error: No space left on device
```
**Solution**: The workflow includes disk space cleanup, but large projects may need optimization

### **Debug Steps**
1. Check **Actions** tab for detailed error logs
2. Verify all secrets are set correctly
3. Ensure Unity project builds locally first
4. Check GitHub Pages settings in repository

## 🎉 **Benefits of Automated Deployment**

- ✅ **No manual builds** required
- ✅ **Consistent deployments** every time
- ✅ **Version control** integration
- ✅ **Team collaboration** support
- ✅ **Professional CI/CD** pipeline
- ✅ **Automatic optimization** for web
- ✅ **Build artifact** preservation

## 📝 **Next Steps**

1. **Set up secrets** in your GitHub repository
2. **Push your project** to trigger first deployment
3. **Monitor the build** in Actions tab
4. **Share your game** at the GitHub Pages URL!

Your Roll-a-Ball game will be automatically deployed and available worldwide! 🌍

**Happy Gaming! 🎮** 