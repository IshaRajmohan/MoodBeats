from transformers import pipeline

class SentimentAnalyzer:
    def __init__(self):
        self.analyzer = pipeline("sentiment-analysis")

    def analyze_text(self, text):
        result = self.analyzer(text)[0]
        return {
        "label": result["label"],
        "score": result["score"]
    }
