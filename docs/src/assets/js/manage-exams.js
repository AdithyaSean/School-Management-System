document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Month navigation in exam calendar
    document.querySelectorAll('.list-group-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.list-group-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            // In production, this would fetch the exam schedule for the selected month
            // For now, we'll just show a loading indicator
            showLoading();
            setTimeout(hideLoading, 1000);
        });
    });

    // Form validation and date/time constraints
    const examForm = document.getElementById('createExamForm');
    if (examForm) {
        const dateInput = examForm.querySelector('input[type="date"]');
        const timeInput = examForm.querySelector('input[type="time"]');
        const durationInput = examForm.querySelector('input[type="number"]');

        // Set minimum date to today
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;

        // Validate duration
        durationInput.addEventListener('input', function() {
            const value = parseInt(this.value);
            if (value < 30) {
                this.setCustomValidity('Duration must be at least 30 minutes');
            } else if (value > 180) {
                this.setCustomValidity('Duration cannot exceed 180 minutes');
            } else {
                this.setCustomValidity('');
            }
        });
    }
});

// Exam CRUD Operations
window.viewExamDetails = function(examId) {
    // In production, this would fetch exam details from an API
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Exam Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <h6>General Information</h6>
                            <dl class="row">
                                <dt class="col-sm-4">Title:</dt>
                                <dd class="col-sm-8">Mid-Term Mathematics</dd>
                                <dt class="col-sm-4">Class:</dt>
                                <dd class="col-sm-8">Grade 10A</dd>
                                <dt class="col-sm-4">Subject:</dt>
                                <dd class="col-sm-8">Mathematics</dd>
                                <dt class="col-sm-4">Date & Time:</dt>
                                <dd class="col-sm-8">May 10, 2025 9:00 AM</dd>
                                <dt class="col-sm-4">Duration:</dt>
                                <dd class="col-sm-8">90 minutes</dd>
                                <dt class="col-sm-4">Room:</dt>
                                <dd class="col-sm-8">Room 301</dd>
                            </dl>
                        </div>
                        <div class="col-md-6">
                            <h6>Statistics</h6>
                            <div class="card bg-light">
                                <div class="card-body">
                                    <p class="mb-2">Total Students: 25</p>
                                    <p class="mb-2">Materials Uploaded: 2 files</p>
                                    <p class="mb-0">Status: <span class="badge bg-warning">Upcoming</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <h6>Instructions</h6>
                            <p>Bring your calculator and necessary stationary. No mobile phones allowed.</p>
                            <h6>Materials</h6>
                            <ul class="list-group">
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    Question Paper.pdf
                                    <button class="btn btn-sm btn-primary">Download</button>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    Formula Sheet.pdf
                                    <button class="btn btn-sm btn-primary">Download</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="editExam(${examId})">Edit Exam</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    modal.addEventListener('hidden.bs.modal', () => {
        modal.remove();
    });
};

window.editExam = function(examId) {
    // Close the view modal if it's open
    const viewModal = document.querySelector('.modal');
    if (viewModal) {
        bootstrap.Modal.getInstance(viewModal).hide();
    }

    // Show the create/edit modal
    const modal = document.getElementById('createExamModal');
    const modalInstance = new bootstrap.Modal(modal);
    
    // In production, this would fetch exam data and populate the form
    // For now, we'll just show the empty form
    document.querySelector('.modal-title').textContent = 'Edit Exam';
    document.querySelector('[onclick="scheduleExam()"]').textContent = 'Save Changes';
    
    modalInstance.show();
};

window.deleteExam = function(examId) {
    if (confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
        // In production, this would make an API call
        const row = document.querySelector(`[onclick="deleteExam(${examId})"]`).closest('tr');
        row.remove();
        showToast('Exam deleted successfully', 'success');
    }
};

window.scheduleExam = function() {
    const form = document.getElementById('createExamForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Show loading state
    const submitButton = document.querySelector('[onclick="scheduleExam()"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';

    // Simulate API call
    setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('createExamModal'));
        modal.hide();

        // Show success message
        showToast('Exam scheduled successfully', 'success');

        // Reset form
        form.reset();

        // In production, this would refresh the list from the API
        location.reload();
    }, 1500);
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

function showLoading() {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </td>
        </tr>
    `;
}

function hideLoading() {
    // In production, this would be replaced with actual data
    // For now, we'll just restore the original content
    location.reload();
}