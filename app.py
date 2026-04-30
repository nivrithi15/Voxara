from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

# Configuration - Move to environment variables in production
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'AIzaSyBKd-KxEIfRjlEkdkTi3ewI_9hmrEjQ_Bc')
GEMINI_MODEL = 'gemini-1.5-flash'
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"

# In-memory data (could be moved to a database later)
QUIZ_DATA = [
    {"question": "What is the minimum voting age in most countries?", "options": ["16", "18", "21", "25"], "correct": 1},
    {"question": "Which of these is usually required BEFORE you can cast a vote?", "options": ["A college degree", "Voter registration", "A social media account", "A fee payment"], "correct": 1},
    {"question": "In a 'First-Past-The-Post' system, who wins?", "options": ["The person with over 50% of votes", "The person with the most votes", "The person chosen by the military", "Everyone who gets at least 10%"], "correct": 1},
    # ... more questions can be added here
]

TIMELINE_DATA = [
    {
        "phase": "Months Before",
        "title": "Candidate Filing & Registration",
        "content": "The journey begins with candidates officially declaring their intent to run.",
        "badge": "purple"
    },
    {
        "phase": "Campaign Season",
        "title": "The Campaign Trail",
        "content": "Candidates hit the road! This phase is filled with debates, rallies, and advertisements.",
        "badge": "blue"
    },
    {
        "phase": "Election Day",
        "title": "Casting Your Ballot",
        "content": "The big day arrives! Polling stations open across the country.",
        "badge": "yellow"
    },
    {
        "phase": "Counting & Results",
        "title": "The Tally & Declaration",
        "content": "Once polls close, the counting begins. Officials audit the votes.",
        "badge": "green"
    }
]

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message')
    region_info = data.get('region', 'General')

    if not user_input:
        return jsonify({"error": "Message is required"}), 400

    system_prompt = f"You are Voxara, an intelligent election assistant. Region context: {region_info}."
    
    try:
        payload = {
            "contents": [{
                "role": "user",
                "parts": [{"text": f"{system_prompt}\n\nUser: {user_input}"}]
            }]
        }
        response = requests.post(GEMINI_API_URL, json=payload, timeout=10)
        response.raise_for_status()
        
        result = response.json()
        ai_response = result['candidates'][0]['content']['parts'][0]['text']
        return jsonify({"response": ai_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/quiz/score', methods=['POST'])
def quiz_score():
    data = request.json
    answers = data.get('answers') # List of indices

    if answers is None or not isinstance(answers, list):
        return jsonify({"error": "Answers list is required"}), 400

    score = 0
    feedback = []
    for i, ans in enumerate(answers):
        if i < len(QUIZ_DATA):
            is_correct = (ans == QUIZ_DATA[i]['correct'])
            if is_correct:
                score += 1
            feedback.append({
                "question_index": i,
                "correct": is_correct,
                "correct_answer": QUIZ_DATA[i]['correct']
            })

    return jsonify({
        "score": score,
        "total": len(QUIZ_DATA),
        "feedback": feedback
    })

@app.route('/api/timeline', methods=['GET'])
def get_timeline():
    return jsonify(TIMELINE_DATA)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
