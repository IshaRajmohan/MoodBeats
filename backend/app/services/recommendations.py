import requests
from app.services.mood_mapper import MOOD_TO_SEED

def get_tracks_for_mood(mood, spotify_token):
    params = MOOD_TO_SEED.get(mood, MOOD_TO_SEED["neutral"])

    res = requests.get(
        "https://api.spotify.com/v1/recommendations",
        headers={"Authorization": f"Bearer {spotify_token}"},
        params={
            "limit": 5,
            "seed_genres": "pop",
            "target_valence": params["valence"],
            "target_energy": params["energy"],
        },
    )

    tracks = res.json().get("tracks", [])
    return [track["uri"] for track in tracks]
