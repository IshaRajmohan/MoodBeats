"use client";

import { useEffect } from "react";

export default function SpotifySuccess() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const access = url.searchParams.get("access_token");
    const refresh = url.searchParams.get("refresh_token");

    if (access) {
      localStorage.setItem("spotify_access_token", access);
    }
    if (refresh) {
      localStorage.setItem("spotify_refresh_token", refresh);
    }

    // redirect to dashboard or mood page
    window.location.href = "/";
  }, []);

  return (
    <div className="p-10">
      Connecting to Spotify...
    </div>
  );
}
