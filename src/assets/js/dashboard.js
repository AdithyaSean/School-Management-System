document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Mobile sidebar toggle
    const sidebarToggle = document.createElement('button');
    sidebarToggle.className = 'btn btn-primary position-fixed d-md-none';
    sidebarToggle.style.cssText = 'top: 10px; left: 10px; z-index: 1040;';
    sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(sidebarToggle);

    sidebarToggle.addEventListener('click', function() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('show');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        const sidebar = document.querySelector('.sidebar');
        const sidebarButton = document.querySelector('.btn-primary.position-fixed');
        
        if (window.innerWidth < 768 && 
            !e.target.closest('.sidebar') && 
            !e.target.closest('.btn-primary.position-fixed') &&
            sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    });

    // Handle notifications
    const notificationBell = document.querySelector('.fa-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            // In production, this would fetch notifications from an API
            const notifications = [
                { message: 'New assignment posted in Mathematics', time: '5 minutes ago' },
                { message: 'Exam results published', time: '1 hour ago' },
                { message: 'Schedule updated for next week', time: '2 hours ago' }
            ];
            
            // Create or update notifications dropdown
            let dropdown = document.getElementById('notificationsDropdown');
            if (!dropdown) {
                dropdown = document.createElement('div');
                dropdown.id = 'notificationsDropdown';
                dropdown.className = 'position-absolute bg-white shadow rounded p-3';
                dropdown.style.cssText = 'top: 100%; right: 0; width: 300px; z-index: 1000;';
                notificationBell.parentElement.style.position = 'relative';
                notificationBell.parentElement.appendChild(dropdown);
            }

            // Populate notifications
            dropdown.innerHTML = `
                <h6 class="border-bottom pb-2">Notifications</h6>
                ${notifications.map(notification => `
                    <div class="notification-item border-bottom py-2">
                        <p class="mb-1 small">${notification.message}</p>
                        <small class="text-muted">${notification.time}</small>
                    </div>
                `).join('')}
                <div class="text-center mt-2">
                    <a href="#" class="small text-primary">View All</a>
                </div>
            `;

            // Toggle dropdown
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';

            // Update notification badge
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                badge.style.display = 'none';
            }
        });

        // Close notifications when clicking outside
        document.addEventListener('click', function(e) {
            const dropdown = document.getElementById('notificationsDropdown');
            if (dropdown && !e.target.closest('.fa-bell') && !e.target.closest('#notificationsDropdown')) {
                dropdown.style.display = 'none';
            }
        });
    }

    // Handle active navigation
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});