document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeGradesChart();
    initializeAttendanceChart();

    // Initialize tab handling
    const tabLinks = document.querySelectorAll('.nav-tabs .nav-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            // Hide all tab panes
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('show', 'active');
            });
            
            // Show selected tab pane
            if (target) {
                target.classList.add('show', 'active');
            }
            
            // Update active tab
            tabLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Initialize academic performance chart
function initializeGradesChart() {
    const ctx = document.getElementById('gradesChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Assessment 1', 'Assessment 2', 'Midterm', 'Assessment 3', 'Assessment 4', 'Final'],
            datasets: [
                {
                    label: 'Mathematics',
                    data: [85, 88, 88, 92, 90, 90],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                },
                {
                    label: 'Science',
                    data: [82, 80, 85, 88, 85, 87],
                    borderColor: 'rgb(54, 162, 235)',
                    tension: 0.1
                },
                {
                    label: 'English',
                    data: [90, 88, 92, 85, 88, 88],
                    borderColor: 'rgb(153, 102, 255)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Subject Performance Trend'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 60,
                    max: 100,
                    ticks: {
                        callback: value => `${value}%`
                    }
                }
            }
        }
    });
}

// Initialize attendance chart
function initializeAttendanceChart() {
    const ctx = document.getElementById('attendanceChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Monthly Attendance Rate',
                data: [95, 92, 88, 100, 90],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Attendance Trend'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 60,
                    max: 100,
                    ticks: {
                        callback: value => `${value}%`
                    }
                }
            }
        }
    });
}

// Profile editing functionality
window.editProfile = function() {
    const modal = document.getElementById('editProfileModal');
    const modalInstance = new bootstrap.Modal(modal);

    // Pre-fill form with current values
    const form = document.getElementById('editProfileForm');
    if (form) {
        // In production, this would fetch current values from an API
        // For now, we'll just show the modal with empty fields
        modalInstance.show();
    }
};

window.saveProfile = function() {
    const form = document.getElementById('editProfileForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Show loading state
    const submitButton = document.querySelector('[onclick="saveProfile()"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';

    // Simulate API call
    setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
        modal.hide();

        // Show success message
        showToast('Profile updated successfully', 'success');

        // In production, this would update the UI with new values
        // For now, we'll just reload the page
        location.reload();
    }, 1500);
};

// Activity management
window.addActivity = function() {
    // In production, this would show a modal to add a new activity
    showToast('Activity adding functionality coming soon', 'info');
};

// Utility functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '1050';
    toast.innerHTML = `
        <div class="toast show" role="alert">
            <div class="toast-header bg-${type} text-white">
                <strong class="me-auto">Notification</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Photo upload functionality
document.querySelector('.btn-outline-primary.btn-sm')?.addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            // In production, this would upload the file to a server
            // For now, we'll just show a success message
            showToast('Photo uploaded successfully', 'success');
        }
    };
    input.click();
});