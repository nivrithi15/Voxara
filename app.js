const DOM = {
    chatArea: document.getElementById('chat-area'),
    optionsContainer: document.getElementById('options-container'),
    typingIndicator: document.getElementById('typing-indicator'),
    progressContainer: document.getElementById('progress-container'),
    restartBtn: document.getElementById('restart-btn')
};

// Global state
let currentTimeout = null;
let userRegion = localStorage.getItem('userRegion') || 'general';

const regionData = {
    general: { legislature: "the national legislature", votingAge: "18", votingDay: "Election Day" },
    india: { legislature: "the Lok Sabha (Parliament)", votingAge: "18", votingDay: "Polling Day" },
    us: { legislature: "Congress", votingAge: "18", votingDay: "Election Day" },
    uk: { legislature: "Parliament", votingAge: "18", votingDay: "Polling Day" },
    germany: { legislature: "the Bundestag", votingAge: "18", votingDay: "Election Day" }
};

function processText(text) {
    let result = text;
    const data = regionData[userRegion];
    for (const key in data) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
    }
    return result;
}

// Conversation Flow Data
const flowData = {
    init: {
        text: ["Hi there! 👋 I'm Voxara.", "Before we start, which region's election process are you most interested in?"],
        options: [
            { label: "India", next: "set_india" },
            { label: "United States", next: "set_us" },
            { label: "United Kingdom", next: "set_uk" },
            { label: "Germany", next: "set_germany" },
            { label: "General / Other", next: "set_general" }
        ]
    },
    set_india: { setRegion: "india", nextNode: "start" },
    set_us: { setRegion: "us", nextNode: "start" },
    set_uk: { setRegion: "uk", nextNode: "start" },
    set_germany: { setRegion: "germany", nextNode: "start" },
    set_general: { setRegion: "general", nextNode: "start" },
    start: {
        text: ["Great! What would you like to learn about today?"],
        options: [
            { label: "How elections work", next: "how_work" },
            { label: "Steps to vote", next: "steps_start" },
            { label: "Timeline of elections", next: "timeline_start" },
            { label: "Eligibility and rules", next: "eligibility_start" }
        ]
    },
    
    // --- TOPIC: Steps to Vote ---
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

    // --- TOPIC: How Elections Work ---
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

    // --- TOPIC: Timeline of elections ---
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

    // --- TOPIC: Eligibility and rules ---
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

function showTyping() {
    DOM.typingIndicator.style.display = 'flex';
    scrollToBottom();
}

function hideTyping() {
    DOM.typingIndicator.style.display = 'none';
}

function renderOptions(options) {
    DOM.optionsContainer.innerHTML = '';
    options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = `option-btn ${opt.isPrimary ? 'primary' : ''}`;
        btn.innerText = opt.label;
        btn.style.animationDelay = `${index * 0.1}s`;
        btn.onclick = () => handleOptionClick(opt);
        DOM.optionsContainer.appendChild(btn);
    });
}

function clearOptions() {
    DOM.optionsContainer.innerHTML = '';
}

async function processNode(nodeId) {
    clearOptions();
    const node = flowData[nodeId];
    if (!node) return;

    if (node.setRegion) {
        userRegion = node.setRegion;
        applyTheme(userRegion);
        return processNode(node.nextNode);
    }

    // Handle Progress Bar
    if (node.progressTotal) {
        // Store current total steps in DOM dataset so we don't have to redefine them every step
        DOM.progressContainer.dataset.steps = JSON.stringify(node.progressTotal);
    }
    
    if (node.progressStep !== undefined) {
        const steps = JSON.parse(DOM.progressContainer.dataset.steps || '[]');
        renderProgressBar(steps, node.progressStep);
    } else if (nodeId === 'start') {
        DOM.progressContainer.style.display = 'none';
    }

    // Process Bot Messages with typing delay
    for (let i = 0; i < node.text.length; i++) {
        showTyping();
        const processedText = processText(node.text[i]);
        // Dynamic delay based on text length, min 600ms, max 1500ms
        const delay = Math.min(Math.max(processedText.length * 15, 600), 1500);
        await new Promise(r => setTimeout(r, delay));
        hideTyping();
        appendMessage(processedText, false);
    }

    renderOptions(node.options);
}

function handleOptionClick(option) {
    appendMessage(option.label, true);
    processNode(option.next);
}

// Initialization
DOM.restartBtn.addEventListener('click', () => {
    DOM.chatArea.innerHTML = '';
    DOM.chatArea.appendChild(DOM.typingIndicator); // Restore typing indicator element
    applyTheme('general');
    processNode('init');
});

// Start the flow
// applyTheme is called on DOMContentLoaded in theme.js
if (userRegion === 'general' && !localStorage.getItem('userRegion')) {
    processNode('init');
} else {
    processNode('start');
}
