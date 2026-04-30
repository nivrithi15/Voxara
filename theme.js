/**
 * THEME MANAGEMENT SECTION
 * Handles regional color schemes and persistence.
 */
const themeColors = {
    general: { color1: '#4f46e5', color2: '#818cf8', accent: '#c7d2fe' },
    india: { color1: '#f97316', color2: '#10b981', accent: '#3b82f6' },
    us: { color1: '#dc2626', color2: '#1d4ed8', accent: '#fca5a5' },
    uk: { color1: '#1d4ed8', color2: '#dc2626', accent: '#bfdbfe' },
    germany: { color1: '#1f2937', color2: '#ef4444', accent: '#facc15' }
};

/**
 * applyTheme - Updates CSS variables based on the selected region.
 * This logic ensures that the UI (aurora background, buttons, avatars) 
 * visually reflects the selected country.
 */
function applyTheme(region) {
    const root = document.documentElement;
    const theme = themeColors[region] || themeColors['general'];
    
    // Update global CSS variables for consistency
    root.style.setProperty('--theme-color-1', theme.color1);
    root.style.setProperty('--theme-color-2', theme.color2);
    root.style.setProperty('--theme-accent', theme.accent);
    
    // Persist choice so the theme remains when navigating between pages
    localStorage.setItem('userRegion', region);
}

/**
 * NAVIGATION & INITIALIZATION SECTION
 * Ensures all components start correctly on page load.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Restore User Region & Theme
    const userRegion = localStorage.getItem('userRegion') || 'general';
    applyTheme(userRegion);
    
    // 2. Initialize Features
    initAccessibility();
    initGoogleServices();
});

/**
 * GOOGLE SERVICES SECTION
 * Lightweight integration for Analytics and Translation.
 */
function initGoogleServices() {
    // Inject Google Analytics (Mock ID)
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-MOCK-ID';
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-MOCK-ID');
    
    // Inject Google Translate element.js
    const translateScript = document.createElement('script');
    translateScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(translateScript);

    // Callback for Google Translate widget
    window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
    };
}

/**
 * ACCESSIBILITY SECTION
 * Handles floating widget injection and accessibility preferences.
 */
function initAccessibility() {
    // Inject the Accessibility Floating Widget
    const widget = document.createElement('div');
    widget.className = 'a11y-widget';
    widget.innerHTML = `
        <button class="a11y-toggle" id="a11y-toggle" title="Accessibility Settings" aria-label="Open Accessibility Settings">
            <i class="fa-solid fa-universal-access"></i>
        </button>
        <div class="a11y-menu" id="a11y-menu">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0; font-size: 0.9rem;">Settings</h3>
                <span style="font-size: 0.6rem; background: #10b981; color: white; padding: 2px 6px; border-radius: 10px;">GA Active</span>
            </div>
            <h3>Text Size</h3>
            <div class="a11y-controls">
                <button class="a11y-btn" id="font-dec" aria-label="Decrease Font Size">A-</button>
                <button class="a11y-btn" id="font-inc" aria-label="Increase Font Size">A+</button>
            </div>
            <hr style="margin: 10px 0; border: 0; border-top: 1px solid #eee;">
            <button class="a11y-mode-toggle" id="a11y-mode-toggle">High Contrast Mode</button>
        </div>
    `;
    document.body.appendChild(widget);

    const toggle = document.getElementById('a11y-toggle');
    const menu = document.getElementById('a11y-menu');
    const fontInc = document.getElementById('font-inc');
    const fontDec = document.getElementById('font-dec');
    const modeToggle = document.getElementById('a11y-mode-toggle');

    // Menu toggle logic
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
    });

    // Persistent Font Scaling logic
    let currentSize = parseInt(localStorage.getItem('fontSize')) || 16;
    document.documentElement.style.setProperty('--base-font-size', `${currentSize}px`);

    fontInc.addEventListener('click', () => {
        if (currentSize < 24) {
            currentSize += 2;
            updateFontSize();
        }
    });

    fontDec.addEventListener('click', () => {
        if (currentSize > 12) {
            currentSize -= 2;
            updateFontSize();
        }
    });

    function updateFontSize() {
        document.documentElement.style.setProperty('--base-font-size', `${currentSize}px`);
        localStorage.setItem('fontSize', currentSize);
    }

    // High Contrast Mode logic
    let isA11yMode = localStorage.getItem('a11yMode') === 'true';
    if (isA11yMode) {
        document.body.classList.add('a11y-mode');
        modeToggle.textContent = 'Disable High Contrast';
    }

    modeToggle.addEventListener('click', () => {
        isA11yMode = !isA11yMode;
        document.body.classList.toggle('a11y-mode', isA11yMode);
        localStorage.setItem('a11yMode', isA11yMode);
        modeToggle.textContent = isA11yMode ? 'Disable High Contrast' : 'High Contrast Mode';
    });

    // Close menu when clicking anywhere else
    document.addEventListener('click', (e) => {
        if (!widget.contains(e.target)) menu.classList.remove('show');
    });
}
