document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const subjectFilter = document.getElementById('subjectFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.querySelector('input[placeholder="Search assessments..."]');
    const viewButtons = document.querySelectorAll('.btn-group .btn');
    const assessmentCards = document.querySelectorAll('.card');

    // Filter functionality
    function filterAssessments() {
        const subject = subjectFilter.value.toLowerCase();
        const status = statusFilter.value.toLowerCase();
        const search = searchInput.value.toLowerCase();

        document.querySelectorAll('.col-md-6.col-lg-4').forEach(card => {
            const cardSubject = card.querySelector('.badge').textContent.toLowerCase();
            const cardStatus = card.querySelector('.badge:nth-child(2)').textContent.toLowerCase();
            const cardTitle = card.querySelector('.card-title').textContent.toLowerCase();
            const cardText = card.querySelector('.card-text').textContent.toLowerCase();

            const matchesSubject = !subject || cardSubject.includes(subject);
            const matchesStatus = !status || cardStatus.includes(status);
            const matchesSearch = !search || 
                                cardTitle.includes(search) || 
                                cardText.includes(search);

            card.style.display = (matchesSubject && matchesStatus && matchesSearch) ? '' : 'none';
        });
    }

    // Add filter event listeners
    subjectFilter.addEventListener('change', filterAssessments);
    statusFilter.addEventListener('change', filterAssessments);
    searchInput.addEventListener('input', filterAssessments);

    // View switching functionality
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const isListView = this.querySelector('.fa-list');
            const container = document.querySelector('.card-body .row');
            
            if (isListView) {
                container.classList.remove('g-4');
                container.querySelectorAll('.col-md-6').forEach(card => {
                    card.className = 'col-12 mb-3';
                });
            } else {
                container.classList.add('g-4');
                container.querySelectorAll('.col-12').forEach(card => {
                    card.className = 'col-md-6 col-lg-4';
                });
            }
        });
    });

    // File upload validation
    const submissionFile = document.getElementById('submissionFile');
    submissionFile.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['application/pdf', 'application/msword', 
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'image/png', 'image/jpeg'];

        const invalidFiles = files.filter(file => {
            return file.size > maxSize || !allowedTypes.includes(file.type);
        });

        if (invalidFiles.length > 0) {
            alert('Some files are invalid. Please ensure all files are under 10MB and in the correct format.');
            e.target.value = ''; // Clear the file input
        }
    });

    // Assessment submission handling
    window.submitAssessment = function() {
        const form = document.getElementById('assessmentSubmissionForm');
        const files = document.getElementById('submissionFile').files;
        const comments = document.getElementById('submissionComments').value;
        const confirmed = document.getElementById('confirmSubmission').checked;

        if (!files.length || !confirmed) {
            alert('Please upload files and confirm the submission guidelines.');
            return;
        }

        // In a real application, this would be an API call
        // Simulating submission
        const modal = bootstrap.Modal.getInstance(document.getElementById('submitModal'));
        
        // Show loading state
        const submitButton = document.querySelector('[onclick="submitAssessment()"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';

        // Simulate API call
        setTimeout(() => {
            // Reset form
            form.reset();
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Close modal
            modal.hide();

            // Show success message
            const toast = document.createElement('div');
            toast.className = 'position-fixed bottom-0 end-0 p-3';
            toast.style.zIndex = '1050';
            toast.innerHTML = `
                <div class="toast show" role="alert">
                    <div class="toast-header bg-success text-white">
                        <strong class="me-auto">Success</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body">
                        Assessment submitted successfully!
                    </div>
                </div>
            `;
            document.body.appendChild(toast);

            // Remove toast after 3 seconds
            setTimeout(() => {
                toast.remove();
                // Refresh the assessment list (in production, this would fetch updated data)
                location.reload();
            }, 3000);
        }, 2000);
    };

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});