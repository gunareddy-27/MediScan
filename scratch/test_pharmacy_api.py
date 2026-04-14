import requests

def test_lookup(disease):
    url = f"http://127.0.0.1:5000/search_medicines?disease={disease}"
    try:
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_lookup("Diabetes")
    test_lookup("flu")
    test_lookup("Gerd")
