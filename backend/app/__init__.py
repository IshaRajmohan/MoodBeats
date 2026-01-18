import os
from flask import Flask, app
from flask_cors import CORS
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager

load_dotenv()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    CORS(
    app,
    resources={r"/api/*": {"origins": "http://127.0.0.1:3000"}},
    supports_credentials=True,
    allow_headers=["Authorization", "Content-Type"],
    methods=["GET", "POST", "OPTIONS"]
)
    

    # Import and register blueprints here
    # from .your_blueprint import your_blueprint
    # app.register_blueprint(your_blueprint)
    jwt.init_app(app)
    from app.routes import health
    app.register_blueprint(health.health_bp)

    #from .routes import emotion_text
    #app.register_blueprint(emotion_text.bp)

    from .routes.spotify_routes import spotify_bp
    app.register_blueprint(spotify_bp)

    from .routes.dashboard_routes import dashboard_bp
    app.register_blueprint(dashboard_bp)

    from .routes.emotion_camera import emotion_cam_bp
    app.register_blueprint(emotion_cam_bp)

    from .routes.playlist_routes import playlist_bp
    app.register_blueprint(playlist_bp)

    return app
