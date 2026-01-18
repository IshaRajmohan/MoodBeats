from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["moodbeats"]   # database name

# Collections
users_collection = db["users"]
playlists_collection = db["playlists"]
moods_collection = db["moods"]
