using UnityEngine;
using System.Collections.Generic;

public class LevelGenerator : MonoBehaviour
{
    [Header("Prefabs")]
    public GameObject groundPrefab;
    public GameObject wallPrefab;
    public GameObject triangleCollectiblePrefab;
    public GameObject cylinderCollectiblePrefab;
    public GameObject movingObstaclePrefab;
    
    [Header("Level Settings")]
    public int levelNumber = 1;
    public int collectibleCount = 8;
    
    void Start()
    {
        GenerateLevel();
    }
    
    void GenerateLevel()
    {
        switch (levelNumber)
        {
            case 1:
                GenerateTutorialLevel();
                break;
            case 2:
                GenerateSpeedCourse();
                break;
            case 3:
                GenerateNarrowPaths();
                break;
            case 4:
                GenerateMazeLevel();
                break;
            case 5:
                GenerateMovingObstacleLevel();
                break;
            case 6:
                GenerateElevationLevel();
                break;
            case 7:
                GenerateTimeCrunchLevel();
                break;
            case 8:
                GenerateSpiralLevel();
                break;
            case 9:
                GenerateGauntletLevel();
                break;
            case 10:
                GenerateFinalBossLevel();
                break;
            default:
                GenerateTutorialLevel();
                break;
        }
    }
    
    void GenerateTutorialLevel()
    {
        // Simple square platform
        CreateGround(Vector3.zero, new Vector3(20, 1, 20));
        
        // Place collectibles in a circle
        for (int i = 0; i < collectibleCount; i++)
        {
            float angle = i * Mathf.PI * 2 / collectibleCount;
            Vector3 position = new Vector3(Mathf.Cos(angle) * 6, 1, Mathf.Sin(angle) * 6);
            
            if (i % 2 == 0)
                CreateTriangleCollectible(position);
            else
                CreateCylinderCollectible(position);
        }
    }
    
    void GenerateMazeLevel()
    {
        // Create larger ground
        CreateGround(Vector3.zero, new Vector3(30, 1, 30));
        
        // Generate maze walls
        GenerateMazeWalls();
        
        // Place collectibles throughout maze
        List<Vector3> mazePositions = GetMazeCollectiblePositions();
        for (int i = 0; i < collectibleCount && i < mazePositions.Count; i++)
        {
            if (i % 2 == 0)
                CreateTriangleCollectible(mazePositions[i]);
            else
                CreateCylinderCollectible(mazePositions[i]);
        }
    }
    
    void GenerateMovingObstacleLevel()
    {
        // Platform with gaps
        CreateGround(new Vector3(-10, 0, 0), new Vector3(8, 1, 20));
        CreateGround(new Vector3(10, 0, 0), new Vector3(8, 1, 20));
        CreateGround(new Vector3(0, 0, -12), new Vector3(6, 1, 6));
        CreateGround(new Vector3(0, 0, 12), new Vector3(6, 1, 6));
        
        // Add moving obstacles
        if (movingObstaclePrefab != null)
        {
            GameObject obstacle = Instantiate(movingObstaclePrefab, new Vector3(0, 2, 0), Quaternion.identity);
            MovingObstacle obstacleScript = obstacle.GetComponent<MovingObstacle>();
            if (obstacleScript != null)
            {
                // Create waypoints
                GameObject pointA = new GameObject("PointA");
                GameObject pointB = new GameObject("PointB");
                pointA.transform.position = new Vector3(-8, 2, 0);
                pointB.transform.position = new Vector3(8, 2, 0);
                
                obstacleScript.pointA = pointA.transform;
                obstacleScript.pointB = pointB.transform;
            }
        }
        
        // Place collectibles on different platforms
        CreateTriangleCollectible(new Vector3(-8, 1.5f, -8));
        CreateCylinderCollectible(new Vector3(-8, 1.5f, 8));
        CreateTriangleCollectible(new Vector3(8, 1.5f, -8));
        CreateCylinderCollectible(new Vector3(8, 1.5f, 8));
        CreateTriangleCollectible(new Vector3(0, 1.5f, -10));
        CreateCylinderCollectible(new Vector3(0, 1.5f, 10));
    }
    
    void GenerateMazeWalls()
    {
        // Simple maze pattern
        Vector3[,] wallPositions = new Vector3[,]
        {
            {new Vector3(-12, 1, -8), new Vector3(2, 2, 8)},
            {new Vector3(-12, 1, 8), new Vector3(2, 2, 8)},
            {new Vector3(-4, 1, -12), new Vector3(8, 2, 2)},
            {new Vector3(4, 1, -4), new Vector3(2, 2, 8)},
            {new Vector3(12, 1, 4), new Vector3(2, 2, 8)},
            {new Vector3(8, 1, 12), new Vector3(8, 2, 2)}
        };
        
        for (int i = 0; i < wallPositions.GetLength(0); i++)
        {
            CreateWall(wallPositions[i, 0], wallPositions[i, 1]);
        }
    }
    
    List<Vector3> GetMazeCollectiblePositions()
    {
        return new List<Vector3>
        {
            new Vector3(-8, 1.5f, -4),
            new Vector3(-8, 1.5f, 12),
            new Vector3(0, 1.5f, -8),
            new Vector3(0, 1.5f, 0),
            new Vector3(8, 1.5f, -12),
            new Vector3(8, 1.5f, 8),
            new Vector3(-4, 1.5f, 4),
            new Vector3(12, 1.5f, -4)
        };
    }
    
    void CreateGround(Vector3 position, Vector3 scale)
    {
        if (groundPrefab != null)
        {
            GameObject ground = Instantiate(groundPrefab, position, Quaternion.identity);
            ground.transform.localScale = scale;
        }
    }
    
    void CreateWall(Vector3 position, Vector3 scale)
    {
        if (wallPrefab != null)
        {
            GameObject wall = Instantiate(wallPrefab, position, Quaternion.identity);
            wall.transform.localScale = scale;
        }
    }
    
    void CreateTriangleCollectible(Vector3 position)
    {
        if (triangleCollectiblePrefab != null)
        {
            Instantiate(triangleCollectiblePrefab, position, Quaternion.identity);
        }
    }
    
    void CreateCylinderCollectible(Vector3 position)
    {
        if (cylinderCollectiblePrefab != null)
        {
            Instantiate(cylinderCollectiblePrefab, position, Quaternion.identity);
        }
    }
    
    // Placeholder methods for other levels
    void GenerateSpeedCourse() { GenerateTutorialLevel(); }
    void GenerateNarrowPaths() { GenerateTutorialLevel(); }
    void GenerateElevationLevel() { GenerateTutorialLevel(); }
    void GenerateTimeCrunchLevel() { GenerateTutorialLevel(); }
    void GenerateSpiralLevel() { GenerateTutorialLevel(); }
    void GenerateGauntletLevel() { GenerateMovingObstacleLevel(); }
    void GenerateFinalBossLevel() { GenerateMazeLevel(); }
} 