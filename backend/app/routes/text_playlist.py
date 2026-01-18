"""
Test your Spotify token and API access
Run this to verify your token is working
"""

import os
from pymongo import MongoClient
from dotenv import load_dotenv
import requests

load_dotenv()

# Get user from database
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database("moodbeats")
users_collection = db["users"]

user = users_collection.find_one({"spotify_id": "t1y4vr9viy5az7hczkk2shz5m"})

if not user:
    print("❌ User not found")
    exit()

token = user.get("spotify_access_token")
print(f"✅ Got token: {token[:30]}...")

# Test 1: Get user profile (basic test)
print("\n" + "="*50)
print("TEST 1: Get User Profile")
print("="*50)

response = requests.get(
    "https://api.spotify.com/v1/me",
    headers={"Authorization": f"Bearer {token}"}
)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"✅ User: {data.get('display_name')}")
else:
    print(f"❌ Error: {response.text}")

# Test 2: Get available genres
print("\n" + "="*50)
print("TEST 2: Get Available Genre Seeds")
print("="*50)

response = requests.get(
    "https://api.spotify.com/v1/recommendations/available-genre-seeds",
    headers={"Authorization": f"Bearer {token}"}
)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    genres = response.json().get("genres", [])
    print(f"✅ Available genres ({len(genres)} total):")
    print(f"First 20: {genres[:20]}")
else:
    print(f"❌ Error: {response.text}")

# Test 3: Get recommendations with minimal params
print("\n" + "="*50)
print("TEST 3: Get Recommendations (Minimal)")
print("="*50)

response = requests.get(
    "https://api.spotify.com/v1/recommendations",
    headers={"Authorization": f"Bearer {token}"},
    params={"seed_genres": "pop", "limit": 5}
)
print(f"Status: {response.status_code}")
print(f"URL: {response.url}")
if response.status_code == 200:
    data = response.json()
    print(f"✅ Got {len(data.get('tracks', []))} tracks")
    if data.get('tracks'):
        print(f"First track: {data['tracks'][0]['name']} by {data['tracks'][0]['artists'][0]['name']}")
else:
    print(f"❌ Error: {response.text}")
    print(f"Headers: {response.headers}")

# Test 4: Try with seed_artists instead
print("\n" + "="*50)
print("TEST 4: Get Recommendations (With Seed Artists)")
print("="*50)

# Get user's top artists first
top_artists_response = requests.get(
    "https://api.spotify.com/v1/me/top/artists",
    headers={"Authorization": f"Bearer {token}"},
    params={"limit": 1}
)

if top_artists_response.status_code == 200:
    artists = top_artists_response.json().get("items", [])
    if artists:
        artist_id = artists[0]["id"]
        print(f"Using seed artist: {artists[0]['name']} ({artist_id})")
        
        response = requests.get(
            "https://api.spotify.com/v1/recommendations",
            headers={"Authorization": f"Bearer {token}"},
            params={"seed_artists": artist_id, "limit": 5}
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Got {len(data.get('tracks', []))} tracks using artist seed")
        else:
            print(f"❌ Error: {response.text}")
    else:
        print("No top artists found")
else:
    print(f"❌ Couldn't get top artists: {top_artists_response.text}")