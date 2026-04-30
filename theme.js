const themeColors = {
    general: { color1: '#4f46e5', color2: '#818cf8', accent: '#c7d2fe' },
    india: { color1: '#f97316', color2: '#10b981', accent: '#3b82f6' },
    us: { color1: '#dc2626', color2: '#1d4ed8', accent: '#fca5a5' },
    uk: { color1: '#1d4ed8', color2: '#dc2626', accent: '#bfdbfe' },
    germany: { color1: '#1f2937', color2: '#ef4444', accent: '#facc15' }
};

function applyTheme(region) {
    const root = document.documentElement;
    const theme = themeColors[region] || themeColors['general'];
    root.style.setProperty('--theme-color-1', theme.color1);
    root.style.setProperty('--theme-color-2', theme.color2);
    root.style.setProperty('--theme-accent', theme.accent);
    localStorage.setItem('userRegion', region);
}

// Automatically apply theme on load across all pages
document.addEventListener('DOMContentLoaded', () => {
    const userRegion = localStorage.getItem('userRegion') || 'general';
    applyTheme(userRegion);
});
