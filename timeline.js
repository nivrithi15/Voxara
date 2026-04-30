/**
 * TIMELINE INTERACTION LOGIC
 * Implements an accordion-style interaction for the election timeline stages.
 */
document.addEventListener('DOMContentLoaded', () => {
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach(item => {
        item.addEventListener('click', () => {
            // Check if the clicked item is already expanded
            const isActive = item.classList.contains('active');

            // Reset all items to collapsed state for a clean accordion effect
            timelineItems.forEach(el => {
                el.classList.remove('active');
            });

            // Toggle the clicked item: Expand if it was closed, stay closed if it was open
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});
