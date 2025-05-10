using UnityEngine;

public class CameraEnterStore : MonoBehaviour
{
    public Transform targetPosition; // Assign target position in Inspector
    public float moveSpeed = 2f; // Adjust speed as needed

    public void MoveCamera()
    {
        // Debug.Log("Button Clicked");
        StartCoroutine(MoveToTarget());
    }

    private System.Collections.IEnumerator MoveToTarget()
    {
        while (Vector3.Distance(transform.position, targetPosition.position) > 0.1f)
        {
            transform.position = Vector3.Lerp(transform.position, targetPosition.position, moveSpeed * Time.deltaTime);
            yield return null;
        }
        GetComponent<FreeRoamCamera>().enabled = true;
    }
}
