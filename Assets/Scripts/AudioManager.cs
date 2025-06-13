using UnityEngine;

public class AudioManager : MonoBehaviour
{
    public AudioSource backgroundMusic;
    public AudioSource sfxSource;
    
    public AudioClip collectSound;
    public AudioClip winSound;
    public AudioClip loseSound;
    
    private static AudioManager instance;
    
    void Awake()
    {
        // Singleton pattern to persist audio across scenes
        if (instance == null)
        {
            instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    void Start()
    {
        if (backgroundMusic != null)
        {
            backgroundMusic.loop = true;
            backgroundMusic.Play();
        }
    }
    
    public static void PlayCollectSound()
    {
        if (instance != null && instance.sfxSource != null && instance.collectSound != null)
        {
            instance.sfxSource.PlayOneShot(instance.collectSound);
        }
    }
    
    public static void PlayWinSound()
    {
        if (instance != null && instance.sfxSource != null && instance.winSound != null)
        {
            instance.sfxSource.PlayOneShot(instance.winSound);
        }
    }
    
    public static void PlayLoseSound()
    {
        if (instance != null && instance.sfxSource != null && instance.loseSound != null)
        {
            instance.sfxSource.PlayOneShot(instance.loseSound);
        }
    }
    
    public static void SetMusicVolume(float volume)
    {
        if (instance != null && instance.backgroundMusic != null)
        {
            instance.backgroundMusic.volume = volume;
        }
    }
    
    public static void SetSFXVolume(float volume)
    {
        if (instance != null && instance.sfxSource != null)
        {
            instance.sfxSource.volume = volume;
        }
    }
} 