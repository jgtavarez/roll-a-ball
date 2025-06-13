# Deployment Guide for Roll-a-Ball Game

**Created by:** Juan Gabriel  
**License:** 1200221

## Prerequisites

1. **Unity 2022.3 LTS** installed
2. **Git** installed
3. **GitHub account** created
4. **WebGL Build Support** module installed in Unity

## Step-by-Step Deployment Process

### 1. Prepare the Unity Project

```bash
# Open Unity Hub and load this project
# Make sure WebGL Build Support is installed
```

### 2. Configure Build Settings

1. Open Unity and load the project
2. Go to `File > Build Settings`
3. Click `Add Open Scenes` to add all scenes
4. Select `WebGL` platform
5. Click `Switch Platform`
6. Configure the following:
   - **Compression Format:** Gzip
   - **Code Optimization:** Size
   - **Strip Engine Code:** Enabled

### 3. Build the Project

#### Option A: Using the Build Script (Recommended)
```bash
# From the project root directory
./build.sh
```

#### Option B: Manual Build
1. In Unity, go to `File > Build Settings`
2. Click `Build`
3. Choose `WebGL-Build` folder as destination
4. Wait for build to complete

### 4. Prepare for GitHub Pages

The build script automatically creates an optimized `index.html` file. The WebGL-Build folder will contain:

```
WebGL-Build/
├── index.html          # GitHub Pages entry point
├── Build/              # Unity WebGL build files
├── TemplateData/       # Unity template assets
└── StreamingAssets/    # Game assets
```

### 5. Deploy to GitHub Pages

#### Method 1: New Repository

1. Create a new repository on GitHub
2. Upload the contents of `WebGL-Build` folder
3. Enable GitHub Pages in repository settings
4. Set source to main branch / (root)

```bash
# Commands to deploy
cd WebGL-Build
git init
git add .
git commit -m "Initial deployment of Roll-a-Ball game"
git remote add origin https://github.com/yourusername/roll-a-ball-game.git
git push -u origin main

# Then enable GitHub Pages in repository settings
```

#### Method 2: Existing Repository with gh-pages Branch

```bash
# From WebGL-Build directory
git checkout --orphan gh-pages
git add .
git commit -m "Deploy Roll-a-Ball to GitHub Pages"
git push origin gh-pages
```

### 6. Access Your Game

Your game will be available at:
```
https://yourusername.github.io/your-repository-name
```

## Game Features

✅ **Complete Feature List:**
- Main menu with options
- 10 progressive levels
- Triangular and cylindrical collectibles
- 120-second timer per level
- Maze level (#4)
- Moving obstacle level (#5)
- Win/lose conditions with large text display
- Player info display (Juan Gabriel, License: 1200221)
- Background music support
- Return to main menu after completion
- WebGL optimized for web deployment

## Level Overview

1. **Tutorial** - Basic movement and collection (8 collectibles)
2. **Speed Course** - Faster-paced gameplay
3. **Narrow Paths** - Precision platforming
4. **The Maze** - Complex navigation challenge
5. **Moving Obstacles** - Dynamic obstacle avoidance
6. **Elevation** - Multi-level collection
7. **Time Crunch** - Reduced timer challenge
8. **Spiral Challenge** - Circular maze pattern
9. **The Gauntlet** - Combined challenge elements
10. **Final Boss** - Ultimate difficulty level

## Troubleshooting

### Build Issues
- Ensure Unity WebGL Build Support is installed
- Check that all scenes are added to build settings
- Verify sufficient disk space for build output

### GitHub Pages Issues
- Ensure repository is public (for free GitHub accounts)
- Check that GitHub Pages is enabled in repository settings
- Verify all files are properly uploaded
- Clear browser cache if game doesn't load

### Performance Issues
- WebGL builds may run slower than native builds
- Recommend modern browsers (Chrome, Firefox, Safari)
- Some features may not work on mobile devices

## Custom Modifications

The game includes all requested features:
- ✅ Collectibles are triangles and cylinders (not cubes)
- ✅ Win text appears in large letters in screen center
- ✅ Ambient music system implemented
- ✅ Player name "Juan Gabriel" and license "1200221" in upper right
- ✅ Main menu with options scene for controls
- ✅ Return to main menu after 5 seconds on completion
- ✅ 120-second timer with lose condition
- ✅ 10 levels with increasing difficulty
- ✅ Maze level (#4) and moving obstacle level (#5)
- ✅ WebGL build ready for GitHub Pages

## Support

For issues or questions about deployment, refer to:
- [Unity WebGL Documentation](https://docs.unity3d.com/Manual/webgl.html)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

**Created with ❤️ by Juan Gabriel - License: 1200221** 