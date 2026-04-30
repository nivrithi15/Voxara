import { auth, db, collection, addDoc, serverTimestamp } from "./firebase-config.js";

const quizData = [
    {
        question: "What is the minimum voting age in most countries including India and the US?",
        options: ["16", "18", "21", "25"],
        correct: 1,
        explanation: "The 26th Amendment in the US and the 61st Amendment in India lowered the voting age to 18."
    },
    {
        question: "Which of these is usually required BEFORE you can cast a vote?",
        options: ["A college degree", "Voter registration", "A social media account", "A fee payment"],
        correct: 1,
        explanation: "Registration ensures you are a qualified voter and prevents duplicate voting."
    },
    {
        question: "In a 'First-Past-The-Post' system, who wins?",
        options: ["The person with over 50% of votes", "The person with the most votes", "The person chosen by the military", "Everyone who gets at least 10%"],
        correct: 1,
        explanation: "The candidate with the most votes (plurality) wins, even if they don't have a majority."
    },
    {
        question: "What is a 'Polling Station'?",
        options: ["A news station", "Where people go to cast votes", "A candidate's house", "A social media poll"],
        correct: 1,
        explanation: "Polling stations are local venues (like schools or community centers) where voting happens."
    },
    {
        question: "What does the term 'Incumbent' mean?",
        options: ["A new candidate", "The person currently holding the office", "A voter who is undecided", "The head of the election commission"],
        correct: 1,
        explanation: "An incumbent is an official who is currently in office and seeking re-election."
    },
    {
        question: "Why is a 'Secret Ballot' important?",
        options: ["To keep the election a surprise", "To protect voters from pressure or intimidation", "To save money on printing", "To make it harder to count"],
        correct: 1,
        explanation: "Privacy ensures that voters can make independent choices without fear of reprisal."
    },
    {
        question: "What is a 'Manifesto'?",
        options: ["A list of candidates", "A document outlining a party's goals and policies", "A map of polling stations", "A law about voting"],
        correct: 1,
        explanation: "Manifestos help voters understand what a party intends to do if they win."
    },
    {
        question: "Which body usually manages the election process to ensure fairness?",
        options: ["The Ruling Party", "An independent Election Commission", "The Police", "International Media"],
        correct: 1,
        explanation: "Independent bodies are crucial for maintaining neutrality and public trust."
    },
    {
        question: "What is 'Absentee Voting'?",
        options: ["Voting for someone who isn't running", "Voting when you cannot be at the polls in person", "Not voting at all", "Voting twice"],
        correct: 1,
        explanation: "Mail-in or early voting allows participation for those traveling or working."
    },
    {
        question: "What happens after the polls close?",
        options: ["The results are deleted", "The votes are counted and audited", "The candidates go home", "A new election starts immediately"],
        correct: 1,
        explanation: "Counting and auditing are the final steps to determine the official winner."
    }
];

let currentQuestion = 0;
let score = 0;
let canAnswer = true;
let userAnswers = [];
const BACKEND_URL = 'http://localhost:5000/api';

const DOM = {
    startScreen: document.getElementById('start-screen'),
    questionScreen: document.getElementById('question-screen'),
    resultsScreen: document.getElementById('results-screen'),
    startBtn: document.getElementById('start-quiz-btn'),
    restartBtn: document.getElementById('restart-quiz-btn'),
    questionText: document.getElementById('question-text'),
    optionsGrid: document.getElementById('options-grid'),
    progressFill: document.getElementById('progress-fill'),
    questionCount: document.getElementById('question-count'),
    feedbackText: document.getElementById('feedback-text'),
    finalScore: document.getElementById('final-score'),
    resultTitle: document.getElementById('result-title'),
    resultMessage: document.getElementById('result-message')
};

// --- INITIALIZATION ---
DOM.startBtn.addEventListener('click', startQuiz);
DOM.restartBtn.addEventListener('click', restartQuiz);

function startQuiz() {
    DOM.startScreen.classList.remove('active');
    DOM.questionScreen.classList.add('active');
    loadQuestion();
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    DOM.resultsScreen.classList.remove('active');
    DOM.startScreen.classList.add('active');
}


// --- CORE LOGIC ---
function loadQuestion() {
    canAnswer = true;
    const q = quizData[currentQuestion];
    DOM.questionText.innerText = q.question;
    DOM.questionCount.innerText = `Question ${currentQuestion + 1} of ${quizData.length}`;
    DOM.feedbackText.innerText = '';
    DOM.feedbackText.className = 'feedback-text';
    
    // Progress
    const progress = ((currentQuestion) / quizData.length) * 100;
    DOM.progressFill.style.width = `${progress}%`;

    // Options
    DOM.optionsGrid.innerHTML = '';
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-card';
        btn.innerText = opt;
        btn.onclick = () => handleAnswer(index);
        DOM.optionsGrid.appendChild(btn);
    });
}

function handleAnswer(index) {
    if (!canAnswer) return;
    canAnswer = false;

    const q = quizData[currentQuestion];
    const cards = DOM.optionsGrid.querySelectorAll('.option-card');
    
    userAnswers.push(index);

    if (index === q.correct) {

        score++;
        cards[index].classList.add('correct');
        DOM.feedbackText.innerText = "Correct! " + q.explanation;
        DOM.feedbackText.classList.add('correct');
    } else {
        cards[index].classList.add('wrong');
        cards[q.correct].classList.add('correct');
        DOM.feedbackText.innerText = "Not quite. " + q.explanation;
        DOM.feedbackText.classList.add('wrong');
    }

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 2500);
}

async function showResults() {
    DOM.questionScreen.classList.remove('active');
    DOM.resultsScreen.classList.add('active');
    DOM.progressFill.style.width = `100%`;
    
    DOM.finalScore.innerText = "...";
    
    try {
        const response = await fetch(`${BACKEND_URL}/quiz/score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers: userAnswers })
        });
        const data = await response.json();
        score = data.score;
        DOM.finalScore.innerText = score;

        // --- SAVE TO FIRESTORE ---
        const user = auth.currentUser;
        if (user) {
            await addDoc(collection(db, "quiz_results"), {
                userId: user.uid,
                userName: user.displayName,
                score: score,
                total: quizData.length,
                timestamp: serverTimestamp()
            });
            console.log("Score saved to Firestore");
        }
    } catch (e) {

        console.error("Backend scoring failed:", e);
        DOM.finalScore.innerText = score + " (Local)";
    }
    
    if (score === quizData.length) {
        DOM.resultTitle.innerText = "Elite Citizen!";
        DOM.resultMessage.innerText = "Perfect score! You're fully ready to navigate any election.";
    } else if (score >= 7) {
        DOM.resultTitle.innerText = "Informed Voter!";
        DOM.resultMessage.innerText = "Great job! You have a strong grasp of how democracy works.";
    } else {
        DOM.resultTitle.innerText = "Good Effort!";
        DOM.resultMessage.innerText = "You've got a solid foundation. Keep learning to become a pro voter!";
    }
    
    initSharing();
}


// --- SOCIAL SHARING LOGIC ---
function initSharing() {
    const shareText = `I just scored ${score}/10 on the Voxara Election Knowledge Quiz! Can you beat me? 🗳️⚡`;
    const shareUrl = window.location.href;

    document.getElementById('share-twitter').onclick = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    document.getElementById('share-whatsapp').onclick = () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`, '_blank');
    };

    const copyBtn = document.getElementById('copy-link');
    const tooltip = document.getElementById('copy-tooltip');

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            tooltip.classList.add('show');
            setTimeout(() => tooltip.classList.remove('show'), 2000);
        });
    };
}
