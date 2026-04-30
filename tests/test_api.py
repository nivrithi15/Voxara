import pytest
import json
from unittest.mock import patch

def test_timeline_endpoint(client):
    """Test that the timeline endpoint returns correct data."""
    response = client.get('/api/timeline')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "title" in data[0]

def test_quiz_score_correct(client):
    """Test quiz scoring with correct answers."""
    # Based on app.py QUIZ_DATA, correct answers are [1, 1, 1]
    payload = {"answers": [1, 1, 1]}
    response = client.post('/api/quiz/score', 
                           data=json.dumps(payload),
                           content_type='application/json')
    assert response.status_code == 200
    data = response.get_json()
    assert data['score'] == 3
    assert data['total'] == 3

def test_quiz_score_mixed(client):
    """Test quiz scoring with mixed correct/wrong answers."""
    payload = {"answers": [1, 0, 1]}
    response = client.post('/api/quiz/score', 
                           data=json.dumps(payload),
                           content_type='application/json')
    data = response.get_json()
    assert data['score'] == 2

def test_quiz_score_invalid_input(client):
    """Edge Case: Test quiz scoring with invalid input."""
    response = client.post('/api/quiz/score', 
                           data=json.dumps({"answers": "not a list"}),
                           content_type='application/json')
    assert response.status_code == 400

def test_chat_empty_input(client):
    """Edge Case: Test chat endpoint with empty input."""
    response = client.post('/api/chat', 
                           data=json.dumps({"message": ""}),
                           content_type='application/json')
    assert response.status_code == 400

@patch('requests.post')
def test_chat_success(mock_post, client):
    """Test successful chat response using mocked Gemini API."""
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {
        "candidates": [{"content": {"parts": [{"text": "AI response"}]}}]
    }
    
    response = client.post('/api/chat', 
                           data=json.dumps({"message": "Hello", "region": "India"}),
                           content_type='application/json')
    assert response.status_code == 200
    assert response.get_json()['response'] == "AI response"

@patch('requests.post')
def test_chat_api_failure(mock_post, client):
    """Edge Case: Test chat endpoint when external API fails."""
    mock_post.side_effect = Exception("API connection error")
    
    response = client.post('/api/chat', 
                           data=json.dumps({"message": "Hello"}),
                           content_type='application/json')
    assert response.status_code == 500
    assert "error" in response.get_json()
