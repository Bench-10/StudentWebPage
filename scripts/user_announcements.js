document.addEventListener('DOMContentLoaded', () => {
    const announcementsContainer = document.getElementById('user-announcements-container');

    async function fetchAndDisplayAnnouncements() {
        try {
            const response = await fetch('api/announcements.php');
            const announcements = await response.json();
            
            announcementsContainer.innerHTML = '';
            
            if (announcements.length === 0) {
                announcementsContainer.innerHTML = '<p class="no-announcements">No announcements</p>';
            } else {
                // Sort announcements by importance and date
                announcements.sort((a, b) => {
                    if (a.is_important !== b.is_important) {
                        return b.is_important - a.is_important;
                    }
                    return new Date(b.created_at) - new Date(a.created_at);
                });

                announcements.forEach(announcement => {
                    const announcementDiv = document.createElement('div');
                    announcementDiv.classList.add('main-announcement-info');
                    if (parseInt(announcement.is_important)) {
                        announcementDiv.classList.add('important');
                    }
                    announcementDiv.innerHTML = `
                        <h1>${announcement.title}</h1>
                        <hr>
                        <p>${announcement.content}</p>
                    `;
                    announcementsContainer.appendChild(announcementDiv);
                });
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
            announcementsContainer.innerHTML = '<p class="no-announcements">Failed to load announcements</p>';
        }
    }

    // Initial load
    fetchAndDisplayAnnouncements();
    
    // Refresh announcements every 30 seconds
    setInterval(fetchAndDisplayAnnouncements, 30000);
});