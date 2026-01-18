from flask import Blueprint, redirect, request
import requests
import base64
import os

from db import users_collection
from flask_jwt_extended import create_access_token

spotify_bp = Blueprint("spotify", __name__)

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = "http://127.0.0.1:5000/auth/spotify/callback"


@spotify_bp.route("/auth/spotify/login")
def spotify_login():
    # ✅ UPDATED SCOPES - Added user-top-read for recommendations
    scope = (
        "user-read-email "
        "user-top-read "
        "playlist-read-private "
        "playlist-modify-private "
        "playlist-modify-public"
    )

    url = (
        "https://accounts.spotify.com/authorize"
        f"?client_id={CLIENT_ID}"
        f"&response_type=code"
        f"&redirect_uri={REDIRECT_URI}"
        f"&scope={scope}"
    )
    return redirect(url)


@spotify_bp.route("/auth/spotify/callback")
def spotify_callback():
    code = request.args.get("code")

    # 🔹 Exchange code for Spotify tokens
    token_url = "https://accounts.spotify.com/api/token"
    auth_header = base64.b64encode(
        f"{CLIENT_ID}:{CLIENT_SECRET}".encode()
    ).decode()

    response = requests.post(
        token_url,
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": REDIRECT_URI,
        },
        headers={
            "Authorization": f"Basic {auth_header}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )

    token_data = response.json()
    spotify_access_token = token_data["access_token"]
    spotify_refresh_token = token_data.get("refresh_token")

    # 🔹 Get Spotify user profile
    profile = requests.get(
        "https://api.spotify.com/v1/me",
        headers={
            "Authorization": f"Bearer {spotify_access_token}"
        },
    ).json()

    spotify_id = profile["id"]

    # 🔹 Save / Update user in MongoDB
    users_collection.update_one(
        {"spotify_id": spotify_id},
        {"$set": {
            "spotify_id": spotify_id,
            "email": profile.get("email"),
            "display_name": profile.get("display_name"),
            "spotify_access_token": spotify_access_token,
            "spotify_refresh_token": spotify_refresh_token,
        }},
        upsert=True
    )

    # 🔐 CREATE JWT FOR YOUR APP
    jwt_token = create_access_token(identity=spotify_id)

    # 🔁 Redirect to frontend with JWT
    return redirect(
        f"http://127.0.0.1:3000/dashboard?token={jwt_token}"
    )