# app/services/spotify_token.py
import requests
import os

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

def refresh_spotify_access_token(access_token, refresh_token):
    """
    Refresh Spotify access token if expired.
    Returns a new token or the same token if still valid.
    """
    # Normally you'd check expiration; for simplicity, always refresh here
    token_url = "https://accounts.spotify.com/api/token"
    response = requests.post(
        token_url,
        data={
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET
        },
        headers={
            "Content-Type": "application/x-www-form-urlencoded"
        }
    )

    data = response.json()
    return data.get("access_token", access_token)
