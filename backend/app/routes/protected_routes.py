from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import users_collection

user_bp = Blueprint("user", __name__)

@user_bp.route("/api/me", methods=["GET"])
@jwt_required()
def get_me():
    spotify_id = get_jwt_identity()
    user = users_collection.find_one({"spotify_id": spotify_id}, {"_id": 0})
    return jsonify(user)
