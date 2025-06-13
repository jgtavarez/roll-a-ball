using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class OptionsMenuController : MonoBehaviour
{
    public Button backButton;
    public Text controlsText;
    public Text playerInfoText;
    
    void Start()
    {
        // Display player info
        if (playerInfoText != null)
        {
            playerInfoText.text = "Juan Gabriel\nLicense: 1200221";
        }
        
        // Display controls
        if (controlsText != null)
        {
            controlsText.text = @"GAME CONTROLS

Movement:
• WASD Keys - Move the ball
• Arrow Keys - Alternative movement
• ESC - Pause menu

Objective:
• Collect all triangles and cylinders
• Complete each level within 120 seconds
• Avoid falling off the platform
• Navigate through mazes and obstacles

Tips:
• Use momentum to jump small gaps
• Be careful near edges
• Plan your route in maze levels
• Watch the timer!";
        }
        
        // Setup back button
        if (backButton != null)
            backButton.onClick.AddListener(ReturnToMainMenu);
    }
    
    public void ReturnToMainMenu()
    {
        SceneManager.LoadScene("MainMenu");
    }
} 