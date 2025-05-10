using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Newtonsoft.Json;
using UnityEngine.Networking;
using System.Text.RegularExpressions;

public class CartManager : MonoBehaviour
{
    public static CartManager Instance { get; private set; }

    [System.Serializable]
    public class CartItem
    {
        public string _id;
        public int quantity;
        public float price;

    }

    private Dictionary<string, CartItem> cartItems = new Dictionary<string, CartItem>(); // key = _id

    public CartItem GetCartItem(string _id)
    {
        if (cartItems.ContainsKey(_id))
        {
            return cartItems[_id];
        }
        return null;
    }

    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject); // Optional: keep it alive between scenes
        }
        else
        {
            Destroy(gameObject); // Prevent duplicate instances
        }
    }




    public void UpdateItem(string id, int quantity, string priceString)
    {
        float price = ExtractPrice(priceString);

        if (cartItems.ContainsKey(id))
        {
            cartItems[id].quantity = quantity;
        }
        else
        {
            cartItems[id] = new CartItem
            {
                _id = id,
                quantity = quantity,
                price = price
            };
        }
    }


    public void RemoveItem(string id)
{
    if (cartItems.ContainsKey(id))
        cartItems.Remove(id);
}


    public string GetCartJson()
{
    List<CartItem> itemList = new List<CartItem>(cartItems.Values);
    return JsonConvert.SerializeObject(itemList);
}


    public float GetTotalPrice()
    {
        float total = 0f;
        foreach (var item in cartItems.Values)
        {
            total += item.price * item.quantity;
        }
        return total;
    }

    // ✅ Add this to send cart data to server
    public void SendCartToServer()
    {
        string json = GetCartJson();
        Debug.Log("Sending cart to server: " + json);
        string backendUrl = EnvironmentManager.GetBackendUrl();
        Debug.Log("Backend URL: " + backendUrl);
        StartCoroutine(PostCartData(backendUrl + "/cart", json));
    }

    IEnumerator PostCartData(string url, string json)
    {
        UnityWebRequest request = new UnityWebRequest(url, "POST");
        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(json);
        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            Debug.Log("✅ Cart sent successfully!");
            Debug.Log("Server Response: " + request.downloadHandler.text);
        }
        else
        {
            Debug.LogError("❌ Error sending cart: " + request.error);
        }
    }

    // Helper method to extract the price from a string like "$19.99/100g"
    private float ExtractPrice(string priceString)
    {
        // Use a regular expression to extract the first number (including decimals) from the string
        Match match = Regex.Match(priceString, @"[\d.]+");

        if (match.Success)
        {
            // Convert the extracted number to float
            return float.Parse(match.Value);
        }
        else
        {
            // If no valid price is found, return 0
            Debug.LogError("Failed to extract price from string: " + priceString);
            return 0f;
        }
    }
}
