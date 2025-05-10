using UnityEngine;
using System.Collections;  // For IEnumerator and coroutines
using UnityEngine.Networking;

public class PopupTrigger : MonoBehaviour
{
    public string productId;     // Assigned from editor dropdown
    public string itemName;
    public string itemPrice;
    public string imageUrl;

    public Sprite itemSprite;

    void OnMouseDown()
{
    if (PopupController.Instance == null)
    {
        Debug.LogError("PopupController is missing in the scene.");
        return;
    }

    if (PopupController.Instance.popupPanel.activeSelf)
    {
        PopupController.Instance.ClosePopup();
    }
    else
    {
        // Before showing the popup, initialize CartUIController with product data
        if (CartUIController.Instance != null)
        {
            CartUIController.Instance.InitializePopup(productId, itemPrice);
        }
        else
        {
            Debug.LogError("CartUIController is missing in the scene.");
        }

        if (itemSprite == null && !string.IsNullOrEmpty(imageUrl))
        {
            StartCoroutine(LoadImageAndShowPopup());
        }
        else
        {
            PopupController.Instance.UpdatePopup(itemName, itemPrice, itemSprite, transform.position);
        }
    }
}

    IEnumerator LoadImageAndShowPopup()
    {
        // Use UnityWebRequest to fetch the image as raw data
        UnityWebRequest request = UnityWebRequest.Get(imageUrl);
        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            // Log the URL being used to fetch the image for debugging
            Debug.Log($"Image loaded successfully from: {imageUrl}");

            // Log the raw response content for debugging
            Debug.Log("Response Content: " + request.downloadHandler.text.Substring(0, Mathf.Min(200, request.downloadHandler.text.Length))); // Limit to 200 chars

            // Get the image data as bytes and try to load it into a texture
            byte[] imageBytes = request.downloadHandler.data;
            Texture2D texture = new Texture2D(2, 2); // Temporarily small texture
            bool isLoaded = texture.LoadImage(imageBytes);  // Load the image as raw data into the texture

            if (isLoaded)
            {
                // Log the texture dimensions to confirm it's processed correctly
                Debug.Log($"Loaded texture dimensions: {texture.width}x{texture.height}");

                // Create the sprite from the texture
                itemSprite = Sprite.Create(texture, new Rect(0, 0, texture.width, texture.height), new Vector2(0.5f, 0.5f));
            }
            else
            {
                Debug.LogError("Failed to process the texture data.");
            }
        }
        else
        {
            Debug.LogError("Failed to load image: " + request.error);
            // Log additional error details from the response
            Debug.LogError($"Error Response Code: {request.responseCode}");
            Debug.LogError($"Error Message: {request.downloadHandler.text}");
        }

        // Update the popup with the fetched image
        PopupController.Instance.UpdatePopup(itemName, itemPrice, itemSprite, transform.position);
    }

    public void AssignProduct(ProductData product)
    {
        productId = product._id;
        itemName = product.name;
        itemPrice = product.price;
        string backendUrl = EnvironmentManager.GetBackendUrl();
        imageUrl = backendUrl + "/images/product-images/" + product.image;
        itemSprite = null; // Force reload if already loaded
    }

    void Start()
    {
        // Check if collider is attached; if not, add a BoxCollider
        if (GetComponent<Collider>() == null)
        {
            Debug.LogWarning("PopupTrigger: No collider attached to object. Adding a BoxCollider.");
            gameObject.AddComponent<BoxCollider>();
        }
    }
}
