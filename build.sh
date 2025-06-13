#!/bin/bash

# Unity WebGL Build Script for Roll-a-Ball Game
# Created by: Juan Gabriel
# License: 1200221

echo "Building Roll-a-Ball for WebGL..."

# Check if Unity is installed
if ! command -v unity &> /dev/null; then
    echo "Error: Unity is not installed or not in PATH."
    echo "Please install Unity 2022.3 LTS and make sure it's accessible from command line."
    exit 1
fi

# Create build directory if it doesn't exist
mkdir -p WebGL-Build

# Build the project
echo "Starting Unity build process..."
unity -batchmode -quit -projectPath . -buildTarget WebGL -buildPath WebGL-Build -executeMethod BuildScript.BuildWebGL

if [ $? -eq 0 ]; then
    echo "Build completed successfully!"
    echo "Build output location: $(pwd)/WebGL-Build"
    echo ""
    echo "To deploy to GitHub Pages:"
    echo "1. Create a new repository on GitHub"
    echo "2. Upload the contents of WebGL-Build folder to the repository"
    echo "3. Enable GitHub Pages in repository settings"
    echo "4. Access your game at: https://yourusername.github.io/your-repo-name"
else
    echo "Build failed!"
    exit 1
fi 