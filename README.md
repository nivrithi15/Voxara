# Voxara — Reimagining Civic Education Through Interactive AI

Voxara is a modern, AI-powered web application designed to simplify and personalize the way users understand electoral systems. By combining an interactive timeline, adaptive quizzes, and an intelligent chatbot, Voxara transforms complex democratic processes into an engaging, user-friendly experience.

---

## Live Demo

[https://voxaraa.netlify.app/]

---

## Problem Statement

Understanding how elections work is often confusing due to:

* Complex procedures
* Lack of interactive learning tools
* Limited personalization

Voxara addresses this by delivering:

> **Clear, interactive, and intelligent civic education for everyone**

---

## Key Features

### AI Chatbot (Powered by Google Gemini)

* Ask questions about elections in natural language
* Get dynamic, context-aware explanations
* Personalized responses based on user interaction

---

### Interactive Timeline

* Step-by-step breakdown of election processes
* Clickable stages with detailed explanations
* AI-powered summaries for better understanding

---

### Smart Quiz System

* Test your knowledge with interactive quizzes
* Instant feedback with explanations
* Tracks performance and highlights weak areas

---

### User Authentication (Firebase)

* Secure login/signup system
* Personalized experience for each user

---

### Data Persistence (Firebase Firestore)

* Stores quiz scores
* Saves chat history
* Enables personalized learning paths

---

### Dynamic UI & Accessibility

* Futuristic aurora-themed design
* High contrast for readability
* Smooth animations and transitions
* Responsive across devices

---

## Tech Stack

### Frontend

* HTML, CSS, JavaScript
* Modern UI/UX principles

### Backend & AI

* Python / Flask *(if applicable)*
* Google Gemini API (Generative AI)

### Cloud & Database

* Firebase Authentication
* Firebase Firestore

### Testing

* pytest (Python testing framework)

---

## Testing

Voxara includes test coverage to ensure reliability and robustness:

* Unit tests for quiz logic
* API tests for chatbot responses
* Edge case handling (invalid inputs, empty responses)


## Project Structure

```bash
/voxara
  /frontend
    Chat.js
    Timeline.js
    Quiz.js
  /backend
    routes/
    services/
    models/
  /tests
    test_chat.py
    test_quiz.py
    test_api.py

##  Acknowledgements

* Google Gemini API
* Firebase
* Open-source community


