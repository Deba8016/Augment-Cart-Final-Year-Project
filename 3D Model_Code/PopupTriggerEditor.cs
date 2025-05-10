#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using UnityEngine.Networking;
using System.Collections.Generic;
using System.Collections;
using Unity.EditorCoroutines.Editor;

[CustomEditor(typeof(PopupTrigger))]
public class PopupTriggerEditor : Editor
{
    private List<ProductData> products = new List<ProductData>();
    private string[] productNames;
    private int selectedIndex = 0;
    private bool isLoaded = false;

    void FetchProducts(System.Action onComplete)
    {
        EditorCoroutineUtility.StartCoroutineOwnerless(FetchRoutine(onComplete));
    }

    IEnumerator FetchRoutine(System.Action onComplete)
    {
         string backendUrl = EnvironmentManager.GetBackendUrl() + "/products/getAllProducts";
        UnityWebRequest request = UnityWebRequest.Get(backendUrl);
        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            string json = "{\"products\":" + request.downloadHandler.text + "}";
            ProductListWrapper wrapper = JsonUtility.FromJson<ProductListWrapper>(json);
            products = wrapper.products;
            productNames = products.ConvertAll(p => p.name).ToArray();
            isLoaded = true;
        }
        else
        {
            Debug.LogError("Failed to fetch products: " + request.error);
        }

        onComplete?.Invoke();
    }

    public override void OnInspectorGUI()
    {
        PopupTrigger trigger = (PopupTrigger)target;

        if (!isLoaded)
        {
            if (GUILayout.Button("🔄 Load Product List"))
            {
                FetchProducts(() => Repaint());
            }
            return;
        }

        if (productNames != null && products.Count > 0)
        {
            selectedIndex = EditorGUILayout.Popup("🛒 Select Product", selectedIndex, productNames);

            if (GUILayout.Button("✅ Assign Product"))
            {
                ProductData selected = products[selectedIndex];
                trigger.AssignProduct(selected);
                EditorUtility.SetDirty(trigger);
            }
        }

        DrawDefaultInspector(); // Show any other fields
    }

    [System.Serializable]
    public class ProductListWrapper
    {
        public List<ProductData> products;
    }
}
#endif
