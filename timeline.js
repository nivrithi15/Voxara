document.addEventListener('DOMContentLoaded', () => {
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach(item => {
        item.addEventListener('click', () => {
            // Check if currently active
            const isActive = item.classList.contains('active');

            // Close all items
            timelineItems.forEach(el => {
                el.classList.remove('active');
            });

            // If it wasn't active before, open it now
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});
