using UnityEngine;

public class CheckoutManager : MonoBehaviour
{
    public CartManager cartManager;

    public void OnCheckoutClicked()
    {
        CartManager.Instance.SendCartToServer();
        string frontendUrl = EnvironmentManager.GetFrontendUrl();
        Application.OpenURL(frontendUrl + "/cart");
    }
}
