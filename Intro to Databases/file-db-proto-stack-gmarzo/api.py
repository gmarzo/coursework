import requests
import asyncio

ACCESS_TOKEN = "pk.eyJ1IjoiZ21hcnpvIiwiYSI6ImNsNmd6amZpbzAzMmYzY3ByMDU3N283bWMifQ.DAN_IyL5mXxlGWF2t2AYxA"


def find_coords(address):
  formatted_address = address.replace(" ", "%20")
  result = requests.get(f"https://api.mapbox.com/geocoding/v5/mapbox.places/{formatted_address}.json?&access_token={ACCESS_TOKEN}&limit=1")
  features = result.json()['features']
  return features[0]['center']