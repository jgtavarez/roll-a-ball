using UnityEngine;

[RequireComponent(typeof(MeshFilter), typeof(MeshRenderer))]
public class TriangleMeshGenerator : MonoBehaviour
{
    void Start()
    {
        GenerateTriangleMesh();
    }
    
    void GenerateTriangleMesh()
    {
        Mesh mesh = new Mesh();
        
        // Define vertices for a triangular prism
        Vector3[] vertices = new Vector3[]
        {
            // Front triangle
            new Vector3(0, 1, 0.5f),      // Top
            new Vector3(-0.5f, -0.5f, 0.5f), // Bottom left
            new Vector3(0.5f, -0.5f, 0.5f),  // Bottom right
            
            // Back triangle
            new Vector3(0, 1, -0.5f),     // Top
            new Vector3(-0.5f, -0.5f, -0.5f), // Bottom left
            new Vector3(0.5f, -0.5f, -0.5f),  // Bottom right
        };
        
        // Define triangles (each triangle needs 3 vertex indices)
        int[] triangles = new int[]
        {
            // Front face
            0, 1, 2,
            
            // Back face
            3, 5, 4,
            
            // Left side
            0, 4, 1,
            1, 4, 5,
            
            // Right side
            0, 2, 3,
            2, 5, 3,
            
            // Bottom
            1, 5, 2,
            1, 4, 5
        };
        
        // Define normals for lighting
        Vector3[] normals = new Vector3[]
        {
            Vector3.forward,
            Vector3.forward,
            Vector3.forward,
            Vector3.back,
            Vector3.back,
            Vector3.back
        };
        
        // Define UV coordinates for texturing
        Vector2[] uvs = new Vector2[]
        {
            new Vector2(0.5f, 1),
            new Vector2(0, 0),
            new Vector2(1, 0),
            new Vector2(0.5f, 1),
            new Vector2(0, 0),
            new Vector2(1, 0)
        };
        
        mesh.vertices = vertices;
        mesh.triangles = triangles;
        mesh.normals = normals;
        mesh.uv = uvs;
        
        mesh.RecalculateNormals();
        mesh.RecalculateBounds();
        
        GetComponent<MeshFilter>().mesh = mesh;
    }
} 