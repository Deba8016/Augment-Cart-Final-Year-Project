using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class PopupController : MonoBehaviour
{
    public static PopupController Instance;

    public GameObject popupPanel;
    public TextMeshProUGUI itemNameText;
    public TextMeshProUGUI priceText;
    public Image itemImage;

    void Awake()
{
    if (Instance == null)
    {
        Instance = this;
    }
    else if (Instance != this)
    {
        Debug.LogWarning("PopupController Instance already exists! Destroying duplicate.");
        Destroy(gameObject);
        return;
    }

    if (popupPanel == null)
    {
        Debug.LogError("Popup Panel is not assigned! Assign it in the Inspector.");
    }
    else
    {
        popupPanel.SetActive(false);
    }
}
    void Start()
    {
        popupPanel.SetActive(false);
    }
void OnDestroy()
{
    Debug.LogWarning("PopupController was destroyed: " + gameObject.name);
}


    public void UpdatePopup(string name, string price, Sprite sprite, Vector3 worldPosition)
    {
        itemNameText.text = name;
        priceText.text = price;
        itemImage.sprite = sprite;

        // Set popup position in World Space
        popupPanel.transform.position = worldPosition + new Vector3(-1.8f, 1.5f, -1.5f); // Adjust offset if needed

        popupPanel.SetActive(true);
    }



    public void ClosePopup()
    {
        popupPanel.SetActive(false);
    }
}
