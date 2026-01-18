from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import moods_collection, playlists_collection
from datetime import datetime, timedelta

dashboard_bp = Blueprint("dashboard", __name__)
@dashboard_bp.route("/api/dashboard/summary", methods=["GET"])
@jwt_required()
def dashboard_summary():
    spotify_id = get_jwt_identity()

    today = datetime.utcnow().replace(hour=0, minute=0, second=0)

    moods_today = moods_collection.count_documents({
        "spotify_id": spotify_id,
        "timestamp": {"$gte": today}
    })

    playlists_today = playlists_collection.count_documents({
        "spotify_id": spotify_id,
        "created_at": {"$gte": today}
    })

    last_mood = moods_collection.find(
        {"spotify_id": spotify_id}
    ).sort("timestamp", -1).limit(1)

    last_mood = list(last_mood)

    return jsonify({
        "playlists_today": playlists_today,
        "current_mood": last_mood[0]["mood"] if last_mood else None,
        "confidence": round(last_mood[0]["confidence"] * 100, 1) if last_mood else 0
    })
@dashboard_bp.route("/api/dashboard/mood-timeline", methods=["GET"])
@jwt_required()
def mood_timeline():
    spotify_id = get_jwt_identity()

    moods = moods_collection.find(
        {"spotify_id": spotify_id}
    ).sort("timestamp", -1).limit(20)

    data = [{
        "mood": m["mood"],
        "confidence": m["confidence"],
        "timestamp": m["timestamp"]
    } for m in moods]

    return jsonify(data)
@dashboard_bp.route("/api/mood", methods=["POST"])
@jwt_required()
def save_mood():
    spotify_id = get_jwt_identity()
    data = request.json

    moods_collection.insert_one({
        "spotify_id": spotify_id,
        "mood": data["mood"],
        "confidence": data["confidence"],
        "timestamp": datetime.utcnow()
    })

    return jsonify({"status": "saved"})
