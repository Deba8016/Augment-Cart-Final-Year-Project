using UnityEngine;
using TMPro;

public class CartUIController : MonoBehaviour
{
    // Singleton pattern to ensure there's only one instance of CartUIController
    public static CartUIController Instance { get; private set; }

    public GameObject addToCartButton;
    public GameObject quantityPanel;
    public TextMeshProUGUI quantityText;

    public TextMeshProUGUI itemName;
    public TextMeshProUGUI itemPrice;
    public string _id;

    private int quantity = 0;

    // Ensures only one instance of CartUIController exists in the scene


    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
        }
        else if (Instance != this)
        {
            Destroy(gameObject);
            return;
        }
    }


    public void OnAddToCartClicked()
    {
        quantity = 1;
        UpdateQuantityUI();
        addToCartButton.SetActive(false);
        quantityPanel.SetActive(true);

        CartManager.Instance.UpdateItem(_id, quantity, itemPrice.text);
    }

    public void OnPlusClicked()
    {
        quantity++;
        UpdateQuantityUI();
        CartManager.Instance.UpdateItem(_id, quantity, itemPrice.text);
    }

    public void OnMinusClicked()
    {
        quantity--;
        if (quantity <= 0)
        {
            quantity = 0;
            quantityPanel.SetActive(false);
            addToCartButton.SetActive(true);
            CartManager.Instance.RemoveItem(_id);

        }
        else
        {
            CartManager.Instance.UpdateItem(_id, quantity, itemPrice.text);
        }

        UpdateQuantityUI();
    }

    void UpdateQuantityUI()
    {
        quantityText.text = quantity.ToString();
    }

    public void InitializePopup(string id, string price)
    {
        itemPrice.text = price;
        _id = id;

        // Check if this item already exists in cart
        var cartItem = CartManager.Instance.GetCartItem(_id);
        if (cartItem != null)
        {
            quantity = cartItem.quantity;
            addToCartButton.SetActive(false);
            quantityPanel.SetActive(true);
        }
        else
        {
            quantity = 0;
            addToCartButton.SetActive(true);
            quantityPanel.SetActive(false);
        }

        UpdateQuantityUI();
    }
}
