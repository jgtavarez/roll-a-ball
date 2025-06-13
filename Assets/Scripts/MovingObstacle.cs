using UnityEngine;

public class MovingObstacle : MonoBehaviour
{
    public Transform pointA;
    public Transform pointB;
    public float speed = 2.0f;
    public float waitTime = 1.0f;
    
    private Transform target;
    private float waitTimer;
    private bool isWaiting = false;
    
    void Start()
    {
        target = pointB;
    }
    
    void Update()
    {
        if (isWaiting)
        {
            waitTimer -= Time.deltaTime;
            if (waitTimer <= 0)
            {
                isWaiting = false;
            }
            return;
        }
        
        // Move towards target
        transform.position = Vector3.MoveTowards(transform.position, target.position, speed * Time.deltaTime);
        
        // Check if reached target
        if (Vector3.Distance(transform.position, target.position) < 0.1f)
        {
            // Switch target
            target = (target == pointA) ? pointB : pointA;
            
            // Start waiting
            isWaiting = true;
            waitTimer = waitTime;
        }
    }
    
    void OnCollisionEnter(Collision collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            // Push the player
            Rigidbody playerRb = collision.gameObject.GetComponent<Rigidbody>();
            if (playerRb != null)
            {
                Vector3 pushDirection = (collision.transform.position - transform.position).normalized;
                playerRb.AddForce(pushDirection * 500f);
            }
        }
    }
} 