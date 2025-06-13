using UnityEngine;
using UnityEngine.UI;

public class PlayerController : MonoBehaviour
{
    public float speed = 10.0f;
    public Text countText;
    public Text winText;
    public Text timerText;
    public Text gameOverText;
    public Text playerInfoText; // For Juan Gabriel and license display
    
    private Rigidbody rb;
    private int count;
    private float timer = 120.0f; // 120 seconds timer
    private bool gameActive = true;
    private int totalCollectibles;
    
    void Start()
    {
        rb = GetComponent<Rigidbody>();
        count = 0;
        totalCollectibles = GameObject.FindGameObjectsWithTag("Pick Up").Length;
        SetCountText();
        winText.text = "";
        gameOverText.text = "";
        
        // Display player info in upper right corner
        if (playerInfoText != null)
        {
            playerInfoText.text = "Juan Gabriel\nLicense: 1200221";
        }
    }

    void Update()
    {
        if (gameActive)
        {
            // Update timer
            timer -= Time.deltaTime;
            UpdateTimerText();
            
            // Check if time is up
            if (timer <= 0)
            {
                GameOver();
            }
        }
        
        // ESC to pause
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            // Toggle pause functionality could be added here
        }
    }

    void FixedUpdate()
    {
        if (gameActive)
        {
            float moveHorizontal = Input.GetAxis("Horizontal");
            float moveVertical = Input.GetAxis("Vertical");

            Vector3 movement = new Vector3(moveHorizontal, 0.0f, moveVertical);
            rb.AddForce(movement * speed);
        }
    }

    void OnTriggerEnter(Collider other)
    {
        if (other.gameObject.CompareTag("Pick Up"))
        {
            other.gameObject.SetActive(false);
            count++;
            SetCountText();
        }
    }

    void SetCountText()
    {
        countText.text = "Count: " + count.ToString() + " / " + totalCollectibles.ToString();
        if (count >= totalCollectibles)
        {
            WinGame();
        }
    }
    
    void UpdateTimerText()
    {
        int minutes = Mathf.FloorToInt(timer / 60f);
        int seconds = Mathf.FloorToInt(timer % 60f);
        timerText.text = string.Format("Time: {0:00}:{1:00}", minutes, seconds);
        
        // Change color when time is running low
        if (timer <= 30f)
        {
            timerText.color = Color.red;
        }
        else if (timer <= 60f)
        {
            timerText.color = Color.yellow;
        }
    }
    
    void WinGame()
    {
        gameActive = false;
        winText.text = "YOU WIN!";
        winText.fontSize = 72;
        winText.color = Color.green;
        
        // Return to main menu after 5 seconds
        Invoke("ReturnToMainMenu", 5.0f);
    }
    
    void GameOver()
    {
        gameActive = false;
        gameOverText.text = "TIME'S UP!\nGAME OVER";
        gameOverText.fontSize = 60;
        gameOverText.color = Color.red;
        
        // Return to main menu after 5 seconds
        Invoke("ReturnToMainMenu", 5.0f);
    }
    
    void ReturnToMainMenu()
    {
        UnityEngine.SceneManagement.SceneManager.LoadScene("MainMenu");
    }
    
    public void RestartLevel()
    {
        timer = 120.0f;
        gameActive = true;
        count = 0;
        winText.text = "";
        gameOverText.text = "";
        timerText.color = Color.white;
        
        // Reactivate all collectibles
        GameObject[] collectibles = GameObject.FindGameObjectsWithTag("Pick Up");
        foreach (GameObject collectible in collectibles)
        {
            collectible.SetActive(true);
        }
        
        SetCountText();
        
        // Reset player position
        transform.position = new Vector3(0, 0.5f, 0);
        rb.velocity = Vector3.zero;
        rb.angularVelocity = Vector3.zero;
    }
} 