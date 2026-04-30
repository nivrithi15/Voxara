/**
 * QUIZ CONTENT DATA
 */
const quizData = [
    {
        question: "What is the main purpose of an election?",
        options: [
            "To give citizens a day off from work",
            "To choose leaders and make decisions on laws",
            "To raise money for the government",
            "To test the voting machines"
        ],
        correctAnswer: 1,
        explanation: "Elections are the core of democracy, allowing citizens to actively choose their leaders and vote on important laws."
    },
    {
        question: "Generally, what is the minimum age to vote in most national elections?",
        options: [
            "16 years old",
            "18 years old",
            "21 years old",
            "25 years old"
        ],
        correctAnswer: 1,
        explanation: "In most democratic countries, citizens must be at least 18 years old to be eligible to vote."
    },
    {
        question: "What must you usually do BEFORE you can vote on Election Day?",
        options: [
            "Pass a political test",
            "Pay a voting fee",
            "Register to vote",
            "Meet the candidates"
        ],
        correctAnswer: 2,
        explanation: "Voter registration is required to confirm you are eligible and to assign you to the correct local voting district."
    },
    {
        question: "During the 'Campaigning' stage, what do candidates do?",
        options: [
            "Count the votes",
            "Share their ideas and try to win support",
            "Officially take office",
            "Create the ballots"
        ],
        correctAnswer: 1,
        explanation: "Campaigning involves debates, rallies, and ads where candidates explain their plans to convince citizens to vote for them."
    },
    {
        question: "Where do people usually go to vote in person?",
        options: [
            "The capital city",
            "A designated polling place",
            "The candidate's house",
            "Any post office"
        ],
        correctAnswer: 1,
        explanation: "Voters go to specific local polling places (like schools or community centers) assigned based on their registered address."
    },
    {
        question: "Why can the 'Vote Counting' process sometimes take days?",
        options: [
            "Officials take frequent breaks",
            "They wait for more people to register",
            "Accuracy is prioritized, and mail-in ballots take time to verify",
            "They have to recount everything three times"
        ],
        correctAnswer: 2,
        explanation: "Counting every single vote accurately is more important than speed, especially when verifying signatures on mail-in ballots."
    }
];

/**
 * UI ELEMENT SELECTORS
 */
const DOM = {
    startScreen: document.getElementById('start-screen'),
    questionScreen: document.getElementById('question-screen'),
    resultsScreen: document.getElementById('results-screen'),
    
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    nextBtn: document.getElementById('next-btn'),
    startBtn: document.getElementById('start-btn'),
    restartBtn: document.getElementById('restart-btn'),
    
    feedbackContainer: document.getElementById('feedback-container'),
    feedbackTitle: document.getElementById('feedback-title'),
    feedbackText: document.getElementById('feedback-text'),
    feedbackIcon: document.getElementById('feedback-icon'),
    
    progressFill: document.getElementById('quiz-progress-fill'),
    scoreText: document.getElementById('score-text'),
    resultsMessage: document.getElementById('results-message')
};

/**
 * QUIZ STATE
 */
let currentQuestionIndex = 0;
let score = 0;
let hasAnswered = false;

/**
 * CORE LOGIC SECTION
 */

function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    updateProgress();
    
    DOM.startScreen.style.display = 'block';
    DOM.questionScreen.style.display = 'none';
    DOM.resultsScreen.style.display = 'none';
    DOM.startScreen.classList.add('active');
}

/**
 * loadQuestion - Renders the current question and generates option buttons.
 */
function loadQuestion() {
    hasAnswered = false;
    const currentQuizData = quizData[currentQuestionIndex];
    
    // Reset UI state for new question
    DOM.feedbackContainer.style.display = 'none';
    DOM.nextBtn.style.display = 'none';
    DOM.optionsContainer.innerHTML = '';
    
    DOM.questionText.innerText = currentQuizData.question;
    
    // Create option buttons dynamically
    currentQuizData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectAnswer(index, button));
        DOM.optionsContainer.appendChild(button);
    });

    updateProgress();
}

/**
 * selectAnswer - Handles the user selection, provides feedback, and updates score.
 */
function selectAnswer(selectedIndex, buttonElement) {
    if (hasAnswered) return;
    hasAnswered = true;

    const currentQuizData = quizData[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQuizData.correctAnswer;
    const allOptions = DOM.optionsContainer.children;

    // Highlight correct and incorrect answers visually
    for (let i = 0; i < allOptions.length; i++) {
        allOptions[i].disabled = true;
        
        if (i === currentQuizData.correctAnswer) {
            allOptions[i].classList.add('correct');
        } else if (i === selectedIndex && !isCorrect) {
            allOptions[i].classList.add('incorrect');
        }
    }

    // Display localized feedback and explanation
    DOM.feedbackContainer.style.display = 'flex';
    DOM.feedbackText.innerText = currentQuizData.explanation;
    
    if (isCorrect) {
        score++;
        DOM.feedbackContainer.className = 'feedback-box correct-fb';
        DOM.feedbackTitle.innerText = "Correct! 🎉";
        DOM.feedbackIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
    } else {
        DOM.feedbackContainer.className = 'feedback-box incorrect-fb';
        DOM.feedbackTitle.innerText = "Not quite!";
        DOM.feedbackIcon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    }

    DOM.nextBtn.style.display = 'inline-flex';
    if(currentQuestionIndex === quizData.length - 1) {
        DOM.nextBtn.innerText = "See Results";
    }
}

function updateProgress() {
    const percentage = ((currentQuestionIndex) / quizData.length) * 100;
    DOM.progressFill.style.width = `${percentage}%`;
}

function showResults() {
    DOM.questionScreen.style.display = 'none';
    DOM.resultsScreen.style.display = 'block';
    
    DOM.progressFill.style.width = '100%';
    DOM.scoreText.innerText = score;
    
    const percentage = score / quizData.length;
    if (percentage === 1) {
        DOM.resultsMessage.innerText = "Perfect score! You're an election expert! 🌟";
    } else if (percentage >= 0.6) {
        DOM.resultsMessage.innerText = "Great job learning about democracy! 👍";
    } else {
        DOM.resultsMessage.innerText = "Good try! Feel free to review the chat to learn more.";
    }
}

/**
 * NAVIGATION EVENT LISTENERS
 */
DOM.startBtn.addEventListener('click', () => {
    DOM.startScreen.style.display = 'none';
    DOM.questionScreen.style.display = 'block';
    loadQuestion();
});

DOM.restartBtn.addEventListener('click', initQuiz);

DOM.nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// Initial load
initQuiz();
