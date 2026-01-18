from flask import Blueprint, request, jsonify
from app.services.sentiment_analyzer import SentimentAnalyzer

bp = Blueprint('emotion_text', __name__, url_prefix='/api/emotion')

# Initialize analyzer once
analyzer = SentimentAnalyzer()

@bp.route('/analyze-text', methods=['POST'])
def analyze_text():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Text is required"}), 400

    text = data["text"]
    result = analyzer.analyze_text(text)

    return jsonify(result), 200
