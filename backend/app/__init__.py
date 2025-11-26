from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Import and register blueprints here
    # from .your_blueprint import your_blueprint
    # app.register_blueprint(your_blueprint)
    
    from app.routes import health
    app.register_blueprint(health.health_bp)

    from .routes import emotion_text
    app.register_blueprint(emotion_text.bp)


    return app
