import requests

def add_tracks(playlist_id, tracks, spotify_token):
    if not tracks:
        return

    requests.post(
        f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks",
        headers={
            "Authorization": f"Bearer {spotify_token}",
            "Content-Type": "application/json",
        },
        json={"uris": tracks},
    )
