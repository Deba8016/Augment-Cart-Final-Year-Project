using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using System.Collections.Generic;

public class FreeRoamCamera : MonoBehaviour
{
    public float moveSpeed = 5f;
    public float mouseSensitivity = 2f;
    public float minYPosition = 1f;
    public float maxYPosition = 1f;
    public Camera playerCamera; // Camera for raycasting
    public GameObject crosshair; // Reference to the crosshair UI element

    public GraphicRaycaster uiRaycaster;
    public EventSystem eventSystem;

    float rotationX = 0f;
    float rotationY = 0f;

    bool isCursorLocked = true;

    private GameObject lastHoveredButton;
    private Color originalButtonColor;

    void Start()
    {
        if (playerCamera == null)
        {
            // Automatically find the Camera component if not assigned
            playerCamera = Camera.main;
        }

        // Lock the cursor at the start for gameplay
        LockCursor();

        // Ensure the crosshair is visible when the game starts
        if (crosshair != null)
        {
            crosshair.SetActive(true);  // Show crosshair on start
        }
    }

    void Update()
{
    if (Input.GetKeyDown(KeyCode.Escape))
    {
        if (isCursorLocked)
        {
            UnlockCursor(); // Unlock and show cursor for UI interaction
        }
        else
        {
            LockCursor(); // Lock the cursor back to the center for gameplay
        }
    }

    if (isCursorLocked)
    {
        // Mouse look (camera control)
        rotationX += Input.GetAxis("Mouse X") * mouseSensitivity;
        rotationY -= Input.GetAxis("Mouse Y") * mouseSensitivity;
        rotationY = Mathf.Clamp(rotationY, -90f, 90f);

        transform.localRotation = Quaternion.Euler(rotationY, rotationX, 0);

        // WASD movement
        float x = Input.GetAxis("Horizontal") * moveSpeed * Time.deltaTime;
        float z = Input.GetAxis("Vertical") * moveSpeed * Time.deltaTime;
        transform.Translate(x, 0, z);

        // Keep the camera within the min and max Y position
        Vector3 pos = transform.position;
        pos.y = Mathf.Clamp(pos.y, minYPosition, maxYPosition);
        transform.position = pos;

        // Raycast to interact with objects when the left mouse button is clicked
        if (Input.GetMouseButtonDown(0)) // Left click
        {
            Ray ray = playerCamera.ScreenPointToRay(new Vector2(Screen.width / 2, Screen.height / 2)); // Ray from center
            RaycastHit hit;
            if (Physics.Raycast(ray, out hit))
            {
                // If ray hits an object, trigger interaction (e.g., print the name of the hit object)
                Debug.Log("Hit object: " + hit.collider.name);
                // Here you can trigger the actual interaction (e.g., picking up an item, opening a door)
            }

            // Also raycast into the UI for locked-cursor clicking
            PointerEventData pointerData = new PointerEventData(eventSystem);
            pointerData.position = new Vector2(Screen.width / 2, Screen.height / 2); // Center of screen

            List<RaycastResult> results = new List<RaycastResult>();
            uiRaycaster.Raycast(pointerData, results);

            // Handle UI Button hover/darkening effect on hover
            bool hoveredAnyButton = false;

            foreach (RaycastResult result in results)
            {
                GameObject hitUI = result.gameObject;

                // Check for Button component
                Button button = hitUI.GetComponent<Button>();
                if (button != null)
                {
                    // If this is a new button being hovered
                    if (hitUI != lastHoveredButton)
                    {
                        ClearLastHovered();

                        // Save current button and its original color
                        lastHoveredButton = hitUI;
                        originalButtonColor = button.colors.normalColor;

                        // Darken the button color for hover effect
                        ColorBlock cb = button.colors;
                        cb.normalColor = new Color(cb.normalColor.r * 0.7f, cb.normalColor.g * 0.7f, cb.normalColor.b * 0.7f); // Darker color
                        button.colors = cb;
                    }

                    hoveredAnyButton = true;
                    break; // Only handle one button at a time
                }
            }

            // If no button is hovered this frame, reset last one
            if (!hoveredAnyButton)
            {
                ClearLastHovered();
            }

            foreach (RaycastResult result in results)
            {
                Debug.Log("UI Element hit: " + result.gameObject.name);
                ExecuteEvents.Execute(result.gameObject, pointerData, ExecuteEvents.pointerClickHandler);
            }
        }
    }
}

void ClearLastHovered()
{
    if (lastHoveredButton != null)
    {
        Button b = lastHoveredButton.GetComponent<Button>();
        if (b != null)
        {
            ColorBlock cb = b.colors;
            cb.normalColor = originalButtonColor; // Restore the original color
            b.colors = cb;
        }
        lastHoveredButton = null;
    }
}

    void LockCursor()
    {
        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false; // Hide the cursor when locked
        isCursorLocked = true; // Track cursor lock state
    }

    void UnlockCursor()
    {
        Cursor.lockState = CursorLockMode.None;
        Cursor.visible = true; // Show the cursor when unlocked for UI interaction
        isCursorLocked = false; // Track cursor unlock state
    }

    
}
