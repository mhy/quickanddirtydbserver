# import requests #pip install requests

# url = "http://localhost:8080/add/"
# data = {"id": 1, "temp": 1, "spin": 2}
# response = requests.post(url, json=data)

# if response.status_code == 200:
#     print("POST request successful!")
# else:
#     print("POST Failed")

#------------------------------------------

# url = "http://localhost:8080/item/1"
# response = requests.get(url)

# if response.status_code == 200:
#    data = response.json()
#    print("json", data)
#    value = data["data"]["id"]
#    print("id", value)

#------------------------------------------

# url = "http://localhost:8080/increase_count"
# data = {"id": 1}
# response = requests.patch(url, json=data)

# if response.status_code == 200:
#     print("Increased successfully")
