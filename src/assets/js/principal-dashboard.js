// Principal Dashboard JS
// Replace mock data and logic with real API calls as needed.

document.addEventListener('DOMContentLoaded', function() {
    const announcementForm = document.getElementById('announcementForm');
    const announcementFormMsg = document.getElementById('announcementFormMsg');
    const announcementsContainer = document.getElementById('announcementsContainer');

    // Mock announcements data
    let announcements = [
        { title: 'Welcome Back!', message: 'School reopens on Monday. Please be on time.', audience: 'All Users', date: '2025-06-01' },
        { title: 'Exam Schedule', message: 'Final exams will start from June 15.', audience: 'Students', date: '2025-05-28' }
    ];

    function renderAnnouncements() {
        announcementsContainer.innerHTML = '';
        if (announcements.length === 0) {
            announcementsContainer.innerHTML = '<p>No announcements yet.</p>';
            return;
        }
        announcements.forEach(a => {
            const div = document.createElement('div');
            div.className = 'announcement-item';
            div.innerHTML = `
                <h5>${a.title}</h5>
                <p>${a.message}</p>
                <div><strong>Audience:</strong> ${a.audience}</div>
                <div><small>${a.date}</small></div>
            `;
            announcementsContainer.appendChild(div);
        });
    }

    announcementForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = this.title.value.trim();
        const message = this.message.value.trim();
        const audience = this.audience.options[this.audience.selectedIndex].text;
        if (!title || !message || !audience) {
            announcementFormMsg.textContent = 'All fields are required.';
            announcementFormMsg.className = 'error';
            return;
        }
        const today = new Date().toISOString().slice(0, 10);
        announcements.unshift({ title, message, audience, date: today });
        renderAnnouncements();
        announcementFormMsg.textContent = 'Announcement broadcasted!';
        announcementFormMsg.className = 'success';
        // Map audience text to roles list for prototype filtering
        let audRoles = ['student','teacher','admin','principal','sectional-head'];
        const lower = audience.toLowerCase();
        if (lower.includes('student')) audRoles=['student'];
        else if (lower.includes('teacher')) audRoles=['teacher'];
        else if (lower.includes('sectional')) audRoles=['sectional-head'];
        else if (lower.includes('principal')) audRoles=['principal'];
        else if (lower.includes('admin')) audRoles=['admin'];
        UIUtils.pushNotification(`${title}: ${message.substring(0,60)}${message.length>60?'…':''}`,'primary','now',{audience:audRoles, category:'notification'});
        UIUtils.showToast('Announcement sent','success');
        UIUtils.log('Broadcast announcement: '+title,'notification');
        this.reset();
        setTimeout(() => { announcementFormMsg.textContent = ''; }, 1200);
    });

    renderAnnouncements();
});
