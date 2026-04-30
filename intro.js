document.addEventListener('DOMContentLoaded', () => {
    const regionSelect = document.getElementById('region-select');
    
    // Set initial value
    const savedRegion = localStorage.getItem('userRegion') || 'general';
    regionSelect.value = savedRegion;

    // Handle change
    regionSelect.addEventListener('change', (e) => {
        const newRegion = e.target.value;
        if (typeof applyTheme === 'function') {
            applyTheme(newRegion);
        }
    });
});
