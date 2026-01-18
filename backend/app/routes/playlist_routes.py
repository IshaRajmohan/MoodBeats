from flask import Blueprint, jsonify, request
import requests
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from collections import Counter
import traceback
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import your database collections
# Make sure this matches your actual database file location
try:
    from db import users_collection, moods_collection
    print("✅ Successfully imported database collections")
except ImportError as e:
    print(f"❌ Failed to import from db.py: {e}")
    # Fallback if db.py doesn't exist
    from pymongo import MongoClient
    from dotenv import load_dotenv
    
    load_dotenv()
    MONGO_URI = os.getenv("MONGO_URI")
    client = MongoClient(MONGO_URI)
    db = client.get_database("moodbeats")  # Updated to your database name
    users_collection = db["users"]
    moods_collection = db["moods"]
    print("✅ Database collections loaded via fallback")

playlist_bp = Blueprint("playlist", __name__)

# Mood to genre/energy mapping - USING VALID SPOTIFY GENRES ONLY
# Valid genres list: https://developer.spotify.com/documentation/web-api/reference/get-recommendation-genres
MOOD_TO_SPOTIFY_PARAMS = {
    "happy": {
        "seed_genres": ["pop", "dance", "happy"],
        "target_valence": 0.8,
        "target_energy": 0.7,
        "min_tempo": 120
    },
    "sad": {
        "seed_genres": ["acoustic", "piano", "sad"],
        "target_valence": 0.2,
        "target_energy": 0.3,
        "max_tempo": 100
    },
    "angry": {
        "seed_genres": ["rock", "metal", "hard-rock"],
        "target_valence": 0.3,
        "target_energy": 0.9,
        "min_tempo": 140
    },
    "neutral": {
        "seed_genres": ["chill", "indie", "ambient"],
        "target_valence": 0.5,
        "target_energy": 0.5,
        "target_tempo": 110
    },
    "surprised": {
        "seed_genres": ["electronic", "edm", "house"],
        "target_valence": 0.7,
        "target_energy": 0.8,
        "min_tempo": 125
    },
    "fear": {
        "seed_genres": ["ambient", "classical", "soundtracks"],
        "target_valence": 0.2,
        "target_energy": 0.4,
        "max_tempo": 90
    },
    "disgust": {
        "seed_genres": ["alternative", "grunge", "punk"],
        "target_valence": 0.3,
        "target_energy": 0.6,
        "target_tempo": 115
    }
}


def get_spotify_token(user):
    """Helper to get valid Spotify access token"""
    return user.get("spotify_access_token")


def analyze_user_moods(user_id, days=7):
    """Analyze user's mood patterns over the last N days"""
    try:
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        # Query moods - handle both datetime and string timestamps
        moods = list(moods_collection.find({
            "user_id": user_id
        }))
        
        print(f"📊 Found {len(moods)} total moods for user {user_id}")
        
        # Filter by date (handle string timestamps from your frontend)
        filtered_moods = []
        for mood in moods:
            timestamp_str = mood.get("timestamp")
            if timestamp_str:
                try:
                    # Parse ISO format timestamp - remove 'Z' and parse
                    mood_date = datetime.fromisoformat(timestamp_str.replace('Z', ''))
                    
                    # Debug: print first mood date
                    if len(filtered_moods) == 0:
                        print(f"🕐 First mood timestamp: {timestamp_str}")
                        print(f"🕐 Parsed as: {mood_date}")
                        print(f"🕐 Cutoff date: {cutoff_date}")
                        print(f"🕐 Is within range: {mood_date >= cutoff_date}")
                    
                    if mood_date >= cutoff_date:
                        filtered_moods.append(mood)
                except Exception as parse_error:
                    print(f"⚠️ Failed to parse timestamp: {timestamp_str} - {parse_error}")
                    # Include it anyway if we can't parse the date
                    filtered_moods.append(mood)
        
        print(f"📊 {len(filtered_moods)} moods within last {days} days")
        
        if not filtered_moods:
            print(f"❌ No moods found within {days} days")
            return None
        
        # Count mood occurrences
        mood_counts = Counter([m["emotion"].lower() for m in filtered_moods])
        
        # Calculate dominant mood
        dominant_mood = mood_counts.most_common(1)[0][0]
        
        # Calculate average confidence
        avg_confidence = sum(m["confidence"] for m in filtered_moods) / len(filtered_moods)
        
        print(f"✅ Dominant mood: {dominant_mood} from {len(filtered_moods)} moods")
        
        return {
            "dominant_mood": dominant_mood,
            "mood_distribution": dict(mood_counts),
            "total_moods": len(filtered_moods),
            "avg_confidence": avg_confidence,
            "days_analyzed": days
        }
    except Exception as e:
        print(f"❌ Error analyzing moods: {str(e)}")
        traceback.print_exc()
        return None


def get_spotify_recommendations(access_token, mood_params, limit=20):
    """Get track recommendations from Spotify based on mood - using user's top tracks as seeds"""
    try:
        # Strategy: Use user's top tracks instead of genres since genre seeds aren't working
        # This is actually better for personalization!
        
        # First, get user's top tracks
        top_tracks_url = "https://api.spotify.com/v1/me/top/tracks"
        headers = {"Authorization": f"Bearer {access_token}"}
        
        print(f"🎵 Getting user's top tracks for seed...")
        top_response = requests.get(
            top_tracks_url,
            headers=headers,
            params={"limit": 5, "time_range": "medium_term"}
        )
        
        if top_response.status_code != 200:
            print(f"⚠️ Couldn't get top tracks: {top_response.status_code} - {top_response.text}")
            print(f"🔄 Falling back to search-based recommendations...")
            # Fallback: search for tracks based on mood
            return get_recommendations_via_search(access_token, mood_params, limit)
        
        top_tracks = top_response.json().get("items", [])
        if not top_tracks:
            print(f"⚠️ No top tracks found, using search fallback")
            return get_recommendations_via_search(access_token, mood_params, limit)
        
        # Get track IDs for seeds (max 5)
        seed_tracks = [track["id"] for track in top_tracks[:5]]
        
        print(f"✅ Using {len(seed_tracks)} seed tracks from user's top tracks")
        
        # Now get recommendations based on those tracks + mood parameters
        url = "https://api.spotify.com/v1/recommendations"
        
        params = {
            "limit": min(limit, 100),
            "seed_tracks": ",".join(seed_tracks[:5]),  # Max 5 seeds
        }
        
        # Add mood-based audio features
        if "target_valence" in mood_params:
            params["target_valence"] = mood_params["target_valence"]
        if "target_energy" in mood_params:
            params["target_energy"] = mood_params["target_energy"]
        if "min_tempo" in mood_params:
            params["min_tempo"] = mood_params["min_tempo"]
        if "max_tempo" in mood_params:
            params["max_tempo"] = mood_params["max_tempo"]
        if "target_tempo" in mood_params:
            params["target_tempo"] = mood_params["target_tempo"]
        
        print(f"🎵 Requesting recommendations with track seeds and mood params")
        response = requests.get(url, headers=headers, params=params)
        
        print(f"📡 Spotify API Response Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Spotify API error: {response.status_code}")
            print(f"Response: {response.text}")
            # Final fallback
            return get_recommendations_via_search(access_token, mood_params, limit)
        
        data = response.json()
        print(f"✅ Got {len(data.get('tracks', []))} recommendations")
        return data
        
    except Exception as e:
        print(f"❌ Error getting recommendations: {str(e)}")
        traceback.print_exc()
        return None


def get_recommendations_via_search(access_token, mood_params, limit=20):
    """Fallback: Get recommendations by searching for mood-related playlists"""
    try:
        headers = {"Authorization": f"Bearer {access_token}"}
        
        # Map mood to search query
        mood_queries = {
            "happy": "happy upbeat positive",
            "sad": "sad emotional melancholy",
            "angry": "aggressive intense rock",
            "neutral": "chill relaxing ambient",
            "surprised": "energetic exciting",
            "fear": "dark atmospheric",
            "disgust": "alternative punk"
        }
        
        # Get dominant mood from params (we'll pass it separately)
        search_query = mood_queries.get("neutral", "chill relaxing")  # default
        
        print(f"🔍 Searching for tracks with query: {search_query}")
        
        # Search for tracks
        search_url = "https://api.spotify.com/v1/search"
        response = requests.get(
            search_url,
            headers=headers,
            params={
                "q": search_query,
                "type": "track",
                "limit": limit
            }
        )
        
        if response.status_code != 200:
            print(f"❌ Search failed: {response.status_code}")
            return None
        
        data = response.json()
        tracks = data.get("tracks", {}).get("items", [])
        
        print(f"✅ Found {len(tracks)} tracks via search")
        
        # Format to match recommendations API response
        return {"tracks": tracks}
        
    except Exception as e:
        print(f"❌ Search fallback failed: {str(e)}")
        traceback.print_exc()
        return None


def create_spotify_playlist(access_token, user_id, name, description, track_uris):
    """Create a new Spotify playlist and add tracks"""
    try:
        # Create playlist
        create_url = f"https://api.spotify.com/v1/users/{user_id}/playlists"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        playlist_data = {
            "name": name,
            "description": description,
            "public": False
        }
        
        print(f"📝 Creating playlist: {name}")
        response = requests.post(create_url, headers=headers, json=playlist_data)
        
        if response.status_code != 201:
            print(f"❌ Failed to create playlist: {response.status_code}")
            print(f"Response: {response.text}")
            return None
        
        playlist = response.json()
        playlist_id = playlist["id"]
        
        # Add tracks to playlist
        add_tracks_url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
        
        print(f"🎵 Adding {len(track_uris)} tracks to playlist")
        track_response = requests.post(
            add_tracks_url,
            headers=headers,
            json={"uris": track_uris}
        )
        
        if track_response.status_code not in [200, 201]:
            print(f"⚠️ Warning: Failed to add some tracks: {track_response.status_code}")
        
        return playlist
    except Exception as e:
        print(f"❌ Error creating playlist: {str(e)}")
        traceback.print_exc()
        return None


@playlist_bp.route("/api/playlist/analyze-moods", methods=["GET"])
@jwt_required()
def analyze_moods():
    """Analyze user's mood patterns"""
    try:
        spotify_id = get_jwt_identity()
        print(f"📊 Analyzing moods for user: {spotify_id}")
        
        days = request.args.get("days", 7, type=int)
        
        analysis = analyze_user_moods(spotify_id, days)
        
        if not analysis:
            return jsonify({
                "error": "No mood data found",
                "message": f"No moods recorded in the last {days} days"
            }), 404
        
        print(f"✅ Analysis complete: {analysis}")
        return jsonify(analysis), 200
    
    except Exception as e:
        print(f"❌ Error in analyze_moods: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@playlist_bp.route("/api/playlist/generate", methods=["POST"])
@jwt_required()
def generate_playlist():
    """Generate a Spotify playlist based on user's moods"""
    try:
        spotify_id = get_jwt_identity()
        print(f"🎵 Generating playlist for user: {spotify_id}")
        
        # Get user from database
        user = users_collection.find_one({"spotify_id": spotify_id})
        if not user:
            print(f"❌ User not found: {spotify_id}")
            return jsonify({"error": "User not found"}), 404
        
        access_token = get_spotify_token(user)
        if not access_token:
            print(f"❌ No Spotify access token for user: {spotify_id}")
            return jsonify({"error": "No Spotify access token. Please login again."}), 401
        
        # Get parameters from request
        data = request.get_json() or {}
        days = data.get("days", 7)
        num_tracks = data.get("num_tracks", 20)
        mood_override = data.get("mood")
        
        # Analyze moods
        if mood_override and mood_override.lower() in MOOD_TO_SPOTIFY_PARAMS:
            dominant_mood = mood_override.lower()
            mood_analysis = {"dominant_mood": dominant_mood, "override": True}
            print(f"🎭 Using override mood: {dominant_mood}")
        else:
            mood_analysis = analyze_user_moods(spotify_id, days)
            if not mood_analysis:
                print(f"❌ No mood data found for user: {spotify_id}")
                return jsonify({
                    "error": "No mood data found",
                    "message": f"No moods recorded in the last {days} days. Try using the camera to record some moods first!"
                }), 404
            dominant_mood = mood_analysis["dominant_mood"]
            print(f"🎭 Detected dominant mood: {dominant_mood}")
        
        # Get mood parameters
        mood_params = MOOD_TO_SPOTIFY_PARAMS.get(
            dominant_mood,
            MOOD_TO_SPOTIFY_PARAMS["neutral"]
        )
        
        # Get recommendations from Spotify
        recommendations = get_spotify_recommendations(
            access_token,
            mood_params,
            limit=num_tracks
        )
        
        if not recommendations or "tracks" not in recommendations:
            print(f"❌ Failed to get recommendations from Spotify")
            return jsonify({"error": "Failed to get recommendations from Spotify. Your token may have expired."}), 500
        
        # Extract track URIs
        track_uris = [track["uri"] for track in recommendations["tracks"]]
        print(f"✅ Got {len(track_uris)} track recommendations")
        
        # Create playlist name and description
        playlist_name = f"Mood Mix: {dominant_mood.title()}"
        playlist_description = (
            f"Generated based on your {dominant_mood} mood "
            f"from the last {days} days. Created by Mood Music."
        )
        
        # Create playlist
        playlist = create_spotify_playlist(
            access_token,
            spotify_id,
            playlist_name,
            playlist_description,
            track_uris
        )
        
        if not playlist:
            print(f"❌ Failed to create playlist on Spotify")
            return jsonify({"error": "Failed to create playlist on Spotify"}), 500
        
        print(f"✅ Playlist created successfully: {playlist['id']}")
        
        return jsonify({
            "success": True,
            "playlist": {
                "id": playlist["id"],
                "name": playlist["name"],
                "url": playlist["external_urls"]["spotify"],
                "tracks_added": len(track_uris)
            },
            "mood_analysis": mood_analysis,
            "dominant_mood": dominant_mood
        }), 201
    
    except Exception as e:
        print(f"❌ Error in generate_playlist: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e), "details": "Check server logs for more info"}), 500


@playlist_bp.route("/api/playlist/preview-recommendations", methods=["POST"])
@jwt_required()
def preview_recommendations():
    """Preview track recommendations without creating a playlist"""
    try:
        spotify_id = get_jwt_identity()
        print(f"👁️ Previewing recommendations for user: {spotify_id}")
        
        user = users_collection.find_one({"spotify_id": spotify_id})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        access_token = get_spotify_token(user)
        if not access_token:
            return jsonify({"error": "No Spotify access token"}), 401
        
        data = request.get_json() or {}
        days = data.get("days", 7)
        num_tracks = data.get("num_tracks", 20)
        mood_override = data.get("mood")
        
        # Analyze or override mood
        if mood_override and mood_override.lower() in MOOD_TO_SPOTIFY_PARAMS:
            dominant_mood = mood_override.lower()
            mood_analysis = {"dominant_mood": dominant_mood, "override": True}
        else:
            mood_analysis = analyze_user_moods(spotify_id, days)
            if not mood_analysis:
                return jsonify({
                    "error": "No mood data found",
                    "message": f"No moods recorded in the last {days} days"
                }), 404
            dominant_mood = mood_analysis["dominant_mood"]
        
        mood_params = MOOD_TO_SPOTIFY_PARAMS.get(
            dominant_mood,
            MOOD_TO_SPOTIFY_PARAMS["neutral"]
        )
        
        recommendations = get_spotify_recommendations(
            access_token,
            mood_params,
            limit=num_tracks
        )
        
        if not recommendations or "tracks" not in recommendations:
            return jsonify({"error": "Failed to get recommendations from Spotify"}), 500
        
        # Format track info
        tracks = [{
            "name": track["name"],
            "artist": ", ".join([artist["name"] for artist in track["artists"]]),
            "album": track["album"]["name"],
            "preview_url": track.get("preview_url"),
            "uri": track["uri"],
            "image": track["album"]["images"][0]["url"] if track["album"]["images"] else None
        } for track in recommendations["tracks"]]
        
        print(f"✅ Preview complete: {len(tracks)} tracks")
        
        return jsonify({
            "mood_analysis": mood_analysis,
            "dominant_mood": dominant_mood,
            "recommendations": tracks,
            "mood_params": mood_params
        }), 200
    
    except Exception as e:
        print(f"❌ Error in preview_recommendations: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500