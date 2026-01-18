from flask import Blueprint, request, jsonify
from db import moods_collection
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

emotion_cam_bp = Blueprint("emotion_camera", __name__, url_prefix="/api/emotion")

@emotion_cam_bp.route("/store", methods=["POST"])
@jwt_required()
def analyze_frame():
    """
    Receives emotion data from frontend and stores it in MongoDB.
    Expects JSON:
    {
        "emotion": "happy",
        "confidence": 92,
        "timestamp": "2026-01-15T13:40:00Z"
    }
    """
    data = request.get_json()

    if not data or "emotion" not in data or "confidence" not in data:
        return jsonify({"error": "Emotion and confidence are required"}), 400

    user_id = get_jwt_identity()  # associate emotion with the logged-in user
    

    mood_entry = {
        "user_id": user_id,
        "emotion": data["emotion"],
        "confidence": data["confidence"],
        "timestamp": data.get("timestamp", datetime.utcnow())
    }

    moods_collection.insert_one(mood_entry)

    return jsonify({"message": "Emotion saved successfully"}), 200

@emotion_cam_bp.route("/test-auth", methods=["GET"])
@jwt_required()
def test_auth():
    user_id = get_jwt_identity()
    print("JWT USER:", user_id)

    return jsonify({
        "message": "JWT works",
        "user": user_id
    }), 200
