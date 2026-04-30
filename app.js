/**
 * CHATBOT CONFIGURATION & STATE
 */
let DOM = {};

let userRegion = localStorage.getItem('userRegion') || 'general';

/**
 * REGIONAL CONTENT MAPPING
 * Maps internal region IDs to specific localized terms used in chatbot responses.
 */
const regionData = {
    general: { displayName: "General / Global", legislature: "the national legislature", votingAge: "18", votingDay: "Election Day" },
    india: { displayName: "India", legislature: "the Lok Sabha (Parliament)", votingAge: "18", votingDay: "Polling Day" },
    us: { displayName: "United States", legislature: "Congress", votingAge: "18", votingDay: "Election Day" },
    uk: { displayName: "United Kingdom", legislature: "Parliament", votingAge: "18", votingDay: "Polling Day" },
    germany: { displayName: "Germany", legislature: "the Bundestag", votingAge: "18", votingDay: "Election Day" }
};

/**
 * BACKEND API CONFIGURATION
 */
const BACKEND_URL = 'http://localhost:5000/api';



/**
 * processText - Replaces placeholder tokens {{key}} with region-specific data.
 */
function processText(text) {
    let result = text;
    const data = regionData[userRegion];
    if (!data) return result;

    for (const key in data) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
    }
    return result;
}

/**
 * CONVERSATION FLOW ENGINE
 * Defines the logical nodes and branching paths of the chatbot.
 */
const flowData = {
    init: {
        text: ["Hi! I'm Voxara 👋", "Ask me anything about elections.", "Please select your country to continue:"],
        options: [
            { label: "India", next: "set_india" },
            { label: "United States", next: "set_us" },
            { label: "United Kingdom", next: "set_uk" },
            { label: "Germany", next: "set_germany" },
            { label: "General / Other", next: "set_general" }
        ]
    },
    // Region set nodes - update theme then bridge to start node
    set_india: { setRegion: "india", nextNode: "start" },
    set_us: { setRegion: "us", nextNode: "start" },
    set_uk: { setRegion: "uk", nextNode: "start" },
    set_germany: { setRegion: "germany", nextNode: "start" },
    set_general: { setRegion: "general", nextNode: "start" },

    start: {
        text: ["Hi! I'm Voxara 👋 Ask me anything about elections. What would you like to explore?"],
        options: [
            { label: "How elections work", next: "how_work" },
            { label: "View timeline", next: "redirect_timeline" },
            { label: "Take quiz", next: "redirect_quiz" },
            { label: "Voting Simulation", next: "redirect_simulate", isPrimary: true },
            { label: "Compare Countries", next: "redirect_compare" },
            { label: "Change country", next: "init" }
        ]
    },

    // Redirection nodes
    redirect_timeline: {
        text: ["Taking you to the interactive timeline..."],
        redirect: "timeline.html"
    },
    redirect_quiz: {
        text: ["Opening the knowledge quiz..."],
        redirect: "quiz.html"
    },
    redirect_compare: {
        text: ["Opening the comparison tool..."],
        redirect: "compare.html"
    },
    redirect_simulate: {
        text: ["Entering the voting simulation booth..."],
        redirect: "simulate.html"
    },

    // Additional flow nodes (how_work, steps_start, etc.) remain configured in flowData...
    // [Flow nodes follow consistent structure: text[] and options[]]

    steps_start: {
        progressTotal: ["Register", "Prepare", "Vote"],
        progressStep: 0,
        text: ["Great! Let's walk through the steps to vote.", "Step 1 is Registration. You must register before you can vote in most places."],
        options: [
            { label: "Next", next: "steps_prepare", isPrimary: true },
            { label: "Explain More", next: "steps_register_more" }
        ]
    },
    steps_register_more: {
        text: ["Registration confirms your eligibility and assigns you to a local voting district.", "Got it?"],
        options: [
            { label: "Yes, Next", next: "steps_prepare", isPrimary: true }
        ]
    },
    steps_prepare: {
        progressStep: 1,
        text: ["Step 2 is Preparation.", "Find out where your polling place is and what's on the ballot for {{legislature}} and local offices."],
        options: [
            { label: "Next", next: "steps_vote", isPrimary: true },
            { label: "Want an example?", next: "steps_prepare_more" }
        ]
    },
    steps_prepare_more: {
        text: ["For example, you might look up candidate platforms or local propositions online before {{votingDay}}.", "Make sense?"],
        options: [
            { label: "Yes, Next", next: "steps_vote", isPrimary: true }
        ]
    },
    steps_vote: {
        progressStep: 2,
        text: ["Step 3 is Voting!", "Go to your polling place on {{votingDay}}, show ID if required, and cast your ballot."],
        options: [
            { label: "Finish", next: "steps_summary", isPrimary: true },
            { label: "Explain More", next: "steps_vote_more" }
        ]
    },
    steps_vote_more: {
        text: ["You can vote in person on {{votingDay}}, early, or by mail depending on your local rules."],
        options: [
            { label: "Finish", next: "steps_summary", isPrimary: true }
        ]
    },
    steps_summary: {
        text: ["Awesome! To summarize: You register, prepare your choices, and cast your vote.", "What next?"],
        options: [
            { label: "Explore another topic", next: "start" },
            { label: "Restart", next: "start" }
        ]
    },
    how_work: {
        progressTotal: ["Basics", "Campaign", "Results"],
        progressStep: 0,
        text: ["Elections are how citizens choose their leaders (like for {{legislature}}) and decide on laws.", "It starts with candidates declaring they want to run."],
        options: [
            { label: "Next", next: "how_campaign", isPrimary: true },
            { label: "Got it?", next: "how_campaign" }
        ]
    },
    how_campaign: {
        progressStep: 1,
        text: ["Next, candidates campaign. They share their ideas and try to win support from voters."],
        options: [
            { label: "Next", next: "how_results", isPrimary: true },
            { label: "Explain More", next: "how_campaign_more" }
        ]
    },
    how_campaign_more: {
        text: ["Campaigns involve debates, rallies, and advertisements so voters can make informed choices."],
        options: [
            { label: "Next", next: "how_results", isPrimary: true }
        ]
    },
    how_results: {
        progressStep: 2,
        text: ["Finally, votes are cast and counted. The winner is declared based on the rules of the election."],
        options: [
            { label: "Finish", next: "how_summary", isPrimary: true }
        ]
    },
    how_summary: {
        text: ["Summary: Candidates run, campaign for support, and the people vote to decide the winner.", "What next?"],
        options: [
            { label: "Explore another topic", next: "start" }
        ]
    },
    timeline_start: {
        progressTotal: ["Months Prior", "Election Day", "Post-Election"],
        progressStep: 0,
        text: ["Months before the election, deadlines pass for voter registration and candidates file to run."],
        options: [
            { label: "Next", next: "timeline_day", isPrimary: true },
            { label: "Got it?", next: "timeline_day" }
        ]
    },
    timeline_day: {
        progressStep: 1,
        text: ["On {{votingDay}}, polls open. This is the final day to cast your vote in person."],
        options: [
            { label: "Next", next: "timeline_post", isPrimary: true }
        ]
    },
    timeline_post: {
        progressStep: 2,
        text: ["Post-election, officials count all ballots, audit the results, and officially certify the winner."],
        options: [
            { label: "Finish", next: "timeline_summary", isPrimary: true },
            { label: "Explain More", next: "timeline_post_more" }
        ]
    },
    timeline_post_more: {
        text: ["Counting can take days, especially with mail-in ballots. Accuracy is prioritized over speed."],
        options: [
            { label: "Finish", next: "timeline_summary", isPrimary: true }
        ]
    },
    timeline_summary: {
        text: ["Summary: The timeline spans from early registration, to {{votingDay}} voting, to the final official count.", "What next?"],
        options: [
            { label: "Explore another topic", next: "start" }
        ]
    },
    eligibility_start: {
        progressTotal: ["Age & Cit.", "Residency", "Rules"],
        progressStep: 0,
        text: ["To vote in most national elections, you must be a citizen and at least {{votingAge}} years old."],
        options: [
            { label: "Next", next: "eligibility_residency", isPrimary: true },
            { label: "Got it?", next: "eligibility_residency" }
        ]
    },
    eligibility_residency: {
        progressStep: 1,
        text: ["You also need to meet residency requirements for the state or district where you are voting."],
        options: [
            { label: "Next", next: "eligibility_rules", isPrimary: true },
            { label: "Want an example?", next: "eligibility_residency_more" }
        ]
    },
    eligibility_residency_more: {
        text: ["For example, you usually must live in a state for a certain number of days before you can register there."],
        options: [
            { label: "Yes, Next", next: "eligibility_rules", isPrimary: true }
        ]
    },
    eligibility_rules: {
        progressStep: 2,
        text: ["Every area has its own specific rules, like ID requirements or absentee voting restrictions."],
        options: [
            { label: "Finish", next: "eligibility_summary", isPrimary: true }
        ]
    },
    eligibility_summary: {
        text: ["Summary: You generally need to be an {{votingAge}}+ citizen meeting local residency and ID rules to vote.", "What next?"],
        options: [
            { label: "Explore another topic", next: "start" }
        ]
    }
};

/**
 * GEMINI API INTEGRATION
 */

async function callGeminiAPI(userInput) {
    const region = regionData[userRegion] || regionData.general;
    
    const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: userInput,
            region: region.displayName
        })
    });

    if (!response.ok) {
        throw new Error('BACKEND_API_FAILED');
    }

    const data = await response.json();
    return data.response;
}


async function handleUserInput() {
    const text = DOM.userInput.value.trim();
    if (!text) return;

    // 1. Clear input and show user message
    DOM.userInput.value = '';
    appendMessage(text, true);

    // 2. Clear current options to focus on the dynamic response
    DOM.optionsContainer.innerHTML = '';

    // 3. Show typing indicator
    DOM.typingIndicator.style.display = 'flex';
    scrollToBottom();

    try {
        // 4. Call Gemini API
        const response = await callGeminiAPI(text);

        // 5. Hide typing and show response
        DOM.typingIndicator.style.display = 'none';
        appendMessage(response, false);

        // 6. Provide a way back to the main flow
        renderOptions([
            { label: "Back to menu", next: "start" },
            { label: "Ask something else", isPrimary: true, action: () => DOM.userInput.focus() }
        ]);
    } catch (error) {
        console.error('Gemini Error:', error);
        DOM.typingIndicator.style.display = 'none';

        let fallbackMsg = "I'm having trouble connecting to my AI brain right now. 🤖";
        if (error.message === 'BACKEND_API_FAILED') {
            fallbackMsg = "The Voxara backend is currently unreachable. Please ensure the server is running!";
        }

        appendMessage(fallbackMsg, false);
        appendMessage("In the meantime, you can explore these topics:", false);

        renderOptions(flowData.start.options);
    }
}


/**
 * UI RENDERING SECTION
 * Handles DOM manipulation for chat bubbles, options, and progress bars.
 */

function renderProgressBar(totalSteps, currentStep) {
    if (!totalSteps) {
        DOM.progressContainer.style.display = 'none';
        return;
    }

    DOM.progressContainer.style.display = 'flex';
    DOM.progressContainer.innerHTML = '';

    totalSteps.forEach((stepName, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';

        if (index < currentStep) stepDiv.classList.add('completed');
        else if (index === currentStep) stepDiv.classList.add('active');

        stepDiv.innerHTML = `
            <div class="step-icon">
                ${index < currentStep ? '<i class="fa-solid fa-check"></i>' : index + 1}
            </div>
            <div class="step-label">${stepName}</div>
        `;
        DOM.progressContainer.appendChild(stepDiv);
    });
}

function appendMessage(text, isUser = false) {
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${isUser ? 'user' : 'bot'}`;

    if (!isUser) {
        const avatar = document.createElement('div');
        avatar.className = 'avatar-small';
        avatar.innerHTML = '<i class="fa-solid fa-robot"></i>';
        wrapper.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerText = text;
    wrapper.appendChild(bubble);

    DOM.chatArea.insertBefore(wrapper, DOM.typingIndicator);
    scrollToBottom();
}

function scrollToBottom() {
    DOM.chatArea.scrollTop = DOM.chatArea.scrollHeight;
}

function renderOptions(options) {
    DOM.optionsContainer.innerHTML = '';
    options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = `option-btn ${opt.isPrimary ? 'primary' : ''}`;
        btn.innerText = opt.label;
        btn.style.animationDelay = `${index * 0.1}s`;
        btn.onclick = () => {
            if (opt.action) opt.action();
            else handleOptionClick(opt);
        };
        DOM.optionsContainer.appendChild(btn);
    });
}

/**
 * CORE LOGIC SECTION
 * Handles message processing, flow transitions, and initialization.
 */

async function processNode(nodeId) {
    DOM.optionsContainer.innerHTML = '';
    const node = flowData[nodeId];
    if (!node) return;

    // Region setting bridge
    if (node.setRegion) {
        userRegion = node.setRegion;
        applyTheme(userRegion);
        return processNode(node.nextNode);
    }

    // Progress Bar management
    if (node.progressTotal) {
        DOM.progressContainer.dataset.steps = JSON.stringify(node.progressTotal);
    }

    if (node.progressStep !== undefined) {
        const steps = JSON.parse(DOM.progressContainer.dataset.steps || '[]');
        renderProgressBar(steps, node.progressStep);
    } else if (nodeId === 'start' || nodeId === 'init') {
        DOM.progressContainer.style.display = 'none';
    }

    // BOT INTERACTION FLOW: 
    // Show typing indicator -> Wait (delay) -> Hide typing -> Append message bubble
    for (let i = 0; i < node.text.length; i++) {
        DOM.typingIndicator.style.display = 'flex';
        scrollToBottom();

        const processedText = processText(node.text[i]);
        const delay = Math.min(Math.max(processedText.length * 15, 600), 1500);

        await new Promise(r => setTimeout(r, delay));

        DOM.typingIndicator.style.display = 'none';
        appendMessage(processedText, false);
    }

    // Handle Redirection
    if (node.redirect) {
        setTimeout(() => {
            window.location.href = node.redirect;
        }, 1000);
        return;
    }

    renderOptions(node.options);
}

function handleOptionClick(option) {
    appendMessage(option.label, true);
    processNode(option.next);
}

/**
 * INITIALIZATION & NAVIGATION FLOW
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize DOM references
    DOM = {
        chatArea: document.getElementById('chat-area'),
        userInput: document.getElementById('user-input'),
        sendBtn: document.getElementById('send-btn'),
        optionsContainer: document.getElementById('options-container'),
        typingIndicator: document.getElementById('typing-indicator'),
        restartBtn: document.getElementById('restart-btn'),
        progressContainer: document.getElementById('progress-container'),
        progressFill: document.getElementById('progress-fill'),
        progressText: document.getElementById('progress-text')
    };

    // 2. Setup Listeners
    if (DOM.restartBtn) {
        DOM.restartBtn.addEventListener('click', () => {
            // 1. Clear UI Elements
            DOM.chatArea.innerHTML = '';
            DOM.chatArea.appendChild(DOM.typingIndicator);
            DOM.optionsContainer.innerHTML = '';
            if (DOM.progressContainer) DOM.progressContainer.style.display = 'none';

            // 2. Reset regional state to allow a fresh start
            localStorage.removeItem('userRegion');
            userRegion = 'general';
            applyTheme('general');

            // 3. Restart conversation from the very beginning
            processNode('init');
        });
    }

    if (DOM.sendBtn) {
        DOM.sendBtn.addEventListener('click', handleUserInput);
    }

    if (DOM.userInput) {
        DOM.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUserInput();
        });
    }

    // 3. STARTUP LOGIC:
    // Automatically trigger the correct conversation node on page load.
    if (!localStorage.getItem('userRegion')) {
        processNode('init');
    } else {
        processNode('start');
    }

    // 4. Focus input if it exists
    if (DOM.userInput) {
        DOM.userInput.focus();
    }
});
