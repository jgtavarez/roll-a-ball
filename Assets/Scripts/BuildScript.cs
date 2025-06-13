using UnityEngine;
using UnityEditor;
using System.IO;

public class BuildScript
{
    [MenuItem("Build/Build WebGL")]
    public static void BuildWebGL()
    {
        // Get all scenes in build settings
        string[] scenes = GetScenePaths();
        
        // Define build options
        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions();
        buildPlayerOptions.scenes = scenes;
        buildPlayerOptions.locationPathName = "WebGL-Build";
        buildPlayerOptions.target = BuildTarget.WebGL;
        buildPlayerOptions.options = BuildOptions.None;
        
        // Ensure WebGL platform is selected
        EditorUserBuildSettings.SwitchActiveBuildTarget(BuildTargetGroup.WebGL, BuildTarget.WebGL);
        
        // Set WebGL template
        PlayerSettings.WebGL.template = "APPLICATION:Default";
        
        // Set company and product name
        PlayerSettings.companyName = "Juan Gabriel";
        PlayerSettings.productName = "Roll-a-Ball";
        
        // Build the project
        BuildReport report = BuildPipeline.BuildPlayer(buildPlayerOptions);
        BuildSummary summary = report.summary;
        
        if (summary.result == BuildResult.Succeeded)
        {
            Debug.Log("Build succeeded: " + summary.totalSize + " bytes");
            
            // Create a simple HTML file for GitHub Pages
            CreateGitHubPagesIndex();
        }
        else if (summary.result == BuildResult.Failed)
        {
            Debug.LogError("Build failed");
        }
    }
    
    static string[] GetScenePaths()
    {
        string[] scenes = new string[EditorBuildSettings.scenes.Length];
        
        for (int i = 0; i < scenes.Length; i++)
        {
            scenes[i] = EditorBuildSettings.scenes[i].path;
        }
        
        return scenes;
    }
    
    static void CreateGitHubPagesIndex()
    {
        string indexPath = Path.Combine("WebGL-Build", "index.html");
        string gameTitle = "Roll-a-Ball by Juan Gabriel";
        
        string htmlContent = $@"<!DOCTYPE html>
<html lang=""en-us"">
<head>
    <meta charset=""utf-8"">
    <meta http-equiv=""Content-Type"" content=""text/html; charset=utf-8"">
    <title>{gameTitle}</title>
    <link rel=""shortcut icon"" href=""TemplateData/favicon.ico"">
    <link rel=""stylesheet"" href=""TemplateData/style.css"">
    <style>
        body {{
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
        }}
        .header {{
            text-align: center;
            color: white;
            margin-bottom: 20px;
        }}
        .license {{
            position: absolute;
            top: 10px;
            right: 10px;
            color: white;
            font-size: 14px;
            background: rgba(0,0,0,0.3);
            padding: 10px;
            border-radius: 5px;
        }}
        .game-container {{
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            max-width: 1000px;
            margin: 0 auto;
        }}
        .controls {{
            margin-top: 20px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 5px;
        }}
        .controls h3 {{
            margin-top: 0;
            color: #333;
        }}
        .controls ul {{
            margin: 10px 0;
            padding-left: 20px;
        }}
        .controls li {{
            margin: 5px 0;
        }}
    </style>
</head>
<body>
    <div class=""license"">
        Created by: Juan Gabriel<br>
        License: 1200221
    </div>
    
    <div class=""header"">
        <h1>{gameTitle}</h1>
        <p>A 3D Ball Rolling Adventure with 10 Challenging Levels</p>
    </div>
    
    <div class=""game-container"">
        <div id=""unity-container"" class=""unity-desktop"">
            <canvas id=""unity-canvas"" width=960 height=600></canvas>
            <div id=""unity-loading-bar"">
                <div id=""unity-logo""></div>
                <div id=""unity-progress-bar-empty"">
                    <div id=""unity-progress-bar-full""></div>
                </div>
            </div>
            <div id=""unity-warning""> </div>
            <div id=""unity-footer"">
                <div id=""unity-webgl-logo""></div>
                <div id=""unity-fullscreen-button""></div>
                <div id=""unity-build-title"">{gameTitle}</div>
            </div>
        </div>
        
        <div class=""controls"">
            <h3>🎮 Game Controls</h3>
            <ul>
                <li><strong>WASD Keys or Arrow Keys:</strong> Move the ball</li>
                <li><strong>Mouse:</strong> Navigate menus</li>
                <li><strong>ESC:</strong> Pause game</li>
            </ul>
            
            <h3>🎯 Objective</h3>
            <ul>
                <li>Collect all triangles and cylinders in each level</li>
                <li>Complete each level within 120 seconds</li>
                <li>Avoid falling off platforms</li>
                <li>Navigate through mazes and avoid moving obstacles</li>
            </ul>
            
            <h3>🏆 Level Overview</h3>
            <ol>
                <li><strong>Tutorial</strong> - Learn the basics</li>
                <li><strong>Speed Course</strong> - Fast-paced collection</li>
                <li><strong>Narrow Paths</strong> - Precision platforming</li>
                <li><strong>The Maze</strong> - Navigate complex paths</li>
                <li><strong>Moving Obstacles</strong> - Avoid dynamic challenges</li>
                <li><strong>Elevation</strong> - Multi-level collection</li>
                <li><strong>Time Crunch</strong> - Reduced timer challenge</li>
                <li><strong>Spiral Challenge</strong> - Circular maze pattern</li>
                <li><strong>The Gauntlet</strong> - Combined challenges</li>
                <li><strong>Final Boss</strong> - Ultimate challenge</li>
            </ol>
        </div>
    </div>
    
    <script>
        var container = document.querySelector(""#unity-container"");
        var canvas = document.querySelector(""#unity-canvas"");
        var loadingBar = document.querySelector(""#unity-loading-bar"");
        var progressBarFull = document.querySelector(""#unity-progress-bar-full"");
        var fullscreenButton = document.querySelector(""#unity-fullscreen-button"");
        var warningBanner = document.querySelector(""#unity-warning"");

        function unityShowBanner(msg, type) {{
            function updateBannerVisibility() {{
                warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
            }}
            var div = document.createElement('div');
            div.innerHTML = msg;
            warningBanner.appendChild(div);
            if (type == 'error') div.style = 'background: red; padding: 10px;';
            else {{
                if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
                setTimeout(function() {{
                    warningBanner.removeChild(div);
                    updateBannerVisibility();
                }}, 5000);
            }}
            updateBannerVisibility();
        }}

        var buildUrl = ""Build"";
        var loaderUrl = buildUrl + ""/WebGL-Build.loader.js"";
        var config = {{
            dataUrl: buildUrl + ""/WebGL-Build.data"",
            frameworkUrl: buildUrl + ""/WebGL-Build.framework.js"",
            codeUrl: buildUrl + ""/WebGL-Build.wasm"",
            streamingAssetsUrl: ""StreamingAssets"",
            companyName: ""Juan Gabriel"",
            productName: ""{gameTitle}"",
            productVersion: ""1.0"",
            showBanner: unityShowBanner,
        }};

        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {{
            container.className = ""unity-mobile"";
            config.devicePixelRatio = 1;
            unityShowBanner('WebGL builds are not supported on mobile devices.');
        }} else {{
            canvas.style.width = ""960px"";
            canvas.style.height = ""600px"";
        }}
        
        loadingBar.style.display = ""block"";

        var script = document.createElement(""script"");
        script.src = loaderUrl;
        script.onload = () => {{
            createUnityInstance(canvas, config, (progress) => {{
                progressBarFull.style.width = 100 * progress + ""%"";
            }}).then((unityInstance) => {{
                loadingBar.style.display = ""none"";
                fullscreenButton.onclick = () => {{
                    unityInstance.SetFullscreen(1);
                }};
            }}).catch((message) => {{
                alert(message);
            }});
        }};
        document.body.appendChild(script);
    </script>
</body>
</html>";

        File.WriteAllText(indexPath, htmlContent);
        Debug.Log("Created GitHub Pages index.html file");
    }
} 