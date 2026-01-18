import requests

def get_or_create_playlist(user, spotify_token):
    if "mood_playlist_id" in user:
        return user["mood_playlist_id"]

    res = requests.post(
        "https://api.spotify.com/v1/users/{}/playlists".format(user["spotify_id"]),
        headers={
            "Authorization": f"Bearer {spotify_token}",
            "Content-Type": "application/json",
        },
        json={
            "name": "MoodBeats 🎭",
            "description": "Updates in real time with your mood",
            "public": False,
        },
    )

    playlist = res.json()
    return playlist["id"]
