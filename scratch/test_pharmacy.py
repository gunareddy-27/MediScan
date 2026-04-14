import requests

def test_pharmacy():
    url = "http://127.0.0.1:5000/search_medicines"
    params = {"disease": "Diabetes"}
    try:
        response = requests.get(url, params=params)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_pharmacy()
