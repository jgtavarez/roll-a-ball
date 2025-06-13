using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class MainMenuController : MonoBehaviour
{
    public Button startButton;
    public Button optionsButton;
    public Button quitButton;
    public Text playerInfoText;
    
    void Start()
    {
        // Display player info
        if (playerInfoText != null)
        {
            playerInfoText.text = "Juan Gabriel\nLicense: 1200221";
        }
        
        // Setup button listeners
        if (startButton != null)
            startButton.onClick.AddListener(StartGame);
        if (optionsButton != null)
            optionsButton.onClick.AddListener(ShowOptions);
        if (quitButton != null)
            quitButton.onClick.AddListener(QuitGame);
    }
    
    public void StartGame()
    {
        SceneManager.LoadScene("Level01");
    }
    
    public void ShowOptions()
    {
        SceneManager.LoadScene("OptionsMenu");
    }
    
    public void QuitGame()
    {
        Application.Quit();
        
        #if UNITY_EDITOR
        UnityEditor.EditorApplication.isPlaying = false;
        #endif
    }
    
    public void LoadLevel(int levelNumber)
    {
        string levelName = "Level" + levelNumber.ToString("00");
        SceneManager.LoadScene(levelName);
    }
} 