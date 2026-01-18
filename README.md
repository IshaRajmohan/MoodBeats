
#  MoodBeats — Real-Time Emotion-Aware Music Recommendation System

MoodBeats is a full-stack web application that performs **real-time facial emotion analysis** using the user's webcam and dynamically generates personalized **Spotify playlists** based on the detected mood.

The system combines computer vision (via `face-api.js`), emotion-to-music mapping, and the **Spotify Web API** to deliver an adaptive and immersive music experience.

## Features

- Real-time facial emotion detection from webcam feed
- Mapping of detected emotions to Spotify musical attributes (valence, energy)
- Dynamic generation of mood-based Spotify playlists
- Secure user authentication with Spotify OAuth 2.0 + JWT
- Persistent storage of user data and Spotify tokens in MongoDB
- Clean, interactive frontend dashboard with mood visualization

## Tech Stack

### Frontend
- Next.js (React + TypeScript)
- face-api.js (TinyFaceDetector + FaceExpressionNet)

### Backend
- Flask (Python)
- Flask-JWT-Extended
- Flask-CORS
- PyMongo
- Requests

### Database
- MongoDB (local or Atlas)

### External API
- Spotify Web API (OAuth 2.0 + Recommendations)

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- MongoDB (running locally or via Atlas)
- Webcam-enabled device
- Spotify Developer Account

### Spotify Developer Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Create a new app
3. Copy your **Client ID** and **Client Secret**

### Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
JWT_SECRET_KEY=your_strong_jwt_secret_key_here
MONGO_URI=mongodb://localhost:27017/moodbeats

### Installation & Running

#### Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate

# Install dependencies
pip install flask flask-cors flask-jwt-extended pymongo requests python-dotenv

# Run the server
python app.py
```


#### Frontend

```bash
cd frontend

npm install
npm run dev
```


##  How It Works

1. **Login with Spotify** → Authenticates via OAuth and stores tokens securely
2. **Allow webcam access** → Real-time emotion detection starts
3. **Emotion detection** → face-api.js analyzes facial expressions every few seconds
4. **Mood mapping** → Emotions are converted to Spotify parameters:
   - Happy → High valence, medium energy
   - Sad → Low valence, low energy
   - Angry → Low valence, high energy
   - Neutral → Balanced values
5. **Generate playlist** → Click the button to create a mood-matched Spotify playlist

### Supported Emotions

- Happy 
- Sad 
- Angry 
- Neutral 
- Surprise 
- Fear 
- Disgust 

## Security

- JWT-protected API routes
- Spotify tokens never exposed to frontend
- Automatic token refresh before expiration
- CORS restricted to frontend origin

## Common Issues & Fixes

- **Webcam not working?** Ensure HTTPS or localhost and allow camera permissions
- **Spotify login failed?** Double-check redirect URI in Spotify dashboard
- **Token expired errors?** Backend automatically refreshes tokens
- **MongoDB connection error?** Make sure MongoDB is running and URI is correct

## Future Ideas

- Automatic playlist updates based on mood changes
- Historical mood analytics dashboard
- Collaborative multi-user playlists
- Mobile-responsive design improvements
- Smoother emotion confidence averaging





