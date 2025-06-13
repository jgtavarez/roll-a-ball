using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class LevelSelector : MonoBehaviour
{
    public Button[] levelButtons;
    public Text playerInfoText;
    
    void Start()
    {
        // Display player info
        if (playerInfoText != null)
        {
            playerInfoText.text = "Juan Gabriel\nLicense: 1200221";
        }
        
        // Setup level buttons
        for (int i = 0; i < levelButtons.Length; i++)
        {
            int levelIndex = i + 1; // Levels start from 1
            levelButtons[i].onClick.AddListener(() => LoadLevel(levelIndex));
            
            // Set button text
            Text buttonText = levelButtons[i].GetComponentInChildren<Text>();
            if (buttonText != null)
            {
                buttonText.text = GetLevelName(levelIndex);
            }
        }
    }
    
    string GetLevelName(int levelNumber)
    {
        switch (levelNumber)
        {
            case 1: return "Tutorial";
            case 2: return "Speed Course";
            case 3: return "Narrow Paths";
            case 4: return "The Maze";
            case 5: return "Moving Obstacles";
            case 6: return "Elevation";
            case 7: return "Time Crunch";
            case 8: return "Spiral Challenge";
            case 9: return "The Gauntlet";
            case 10: return "Final Boss";
            default: return "Level " + levelNumber;
        }
    }
    
    public void LoadLevel(int levelNumber)
    {
        string levelName = "Level" + levelNumber.ToString("00");
        SceneManager.LoadScene(levelName);
    }
    
    public void ReturnToMainMenu()
    {
        SceneManager.LoadScene("MainMenu");
    }
} 