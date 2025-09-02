document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const filters = {
        class: document.getElementById('classFilter'),
        status: document.getElementById('statusFilter'),
        type: document.getElementById('typeFilter'),
        search: document.querySelector('input[placeholder="Search assessments..."]')
    };

    // Apply filters
    function applyFilters() {
        const selectedClass = filters.class.value.toLowerCase();
        const selectedStatus = filters.status.value.toLowerCase();
        const selectedType = filters.type.value.toLowerCase();
        const searchTerm = filters.search.value.toLowerCase();

        const rows = document.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const classText = row.cells[1].textContent.toLowerCase();
            const statusText = row.querySelector('.badge').textContent.toLowerCase();
            const typeText = row.cells[2].textContent.toLowerCase();
            const titleText = row.cells[0].textContent.toLowerCase();

            const matchesClass = !selectedClass || classText.includes(selectedClass);
            const matchesStatus = !selectedStatus || statusText.includes(selectedStatus);
            const matchesType = !selectedType || typeText.includes(selectedType);
            const matchesSearch = !searchTerm || titleText.includes(searchTerm);

            row.style.display = (matchesClass && matchesStatus && matchesType && matchesSearch) ? '' : 'none';
        });
    }

    // Add filter event listeners
    Object.values(filters).forEach(filter => {
        filter.addEventListener('change', applyFilters);
        if (filter.tagName === 'INPUT') {
            filter.addEventListener('input', applyFilters);
        }
    });

    // Assessment CRUD operations
    window.viewSubmissions = function(assessmentId) {
        // In production, this would fetch submissions from an API
        // For now, we'll show a modal with dummy data
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">View Submissions</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Submission Date</th>
                                        <th>Status</th>
                                        <th>Grade</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>John Doe</td>
                                        <td>May 1, 2025</td>
                                        <td><span class="badge bg-success">On Time</span></td>
                                        <td>95/100</td>
                                        <td>
                                            <button class="btn btn-sm btn-primary">View</button>
                                            <button class="btn btn-sm btn-success">Grade</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
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

    window.gradeAssessment = function(assessmentId) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Grade Submissions</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-4">
                            <div class="progress" style="height: 20px;">
                                <div class="progress-bar" style="width: 60%;">15/25 Graded</div>
                            </div>
                        </div>
                        <div class="card mb-3">
                            <div class="card-body">
                                <h6>Current Submission</h6>
                                <p class="mb-2">Student: Jane Smith</p>
                                <div class="mb-3">
                                    <label class="form-label">Score</label>
                                    <input type="number" class="form-control" max="100">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Feedback</label>
                                    <textarea class="form-control" rows="3"></textarea>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <button class="btn btn-secondary">Previous</button>
                                    <div>
                                        <button class="btn btn-primary me-2">Save</button>
                                        <button class="btn btn-success">Next</button>
                                    </div>
                                </div>
                            </div>
                        </div>
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

    window.editAssessment = function(assessmentId) {
        const createModal = document.getElementById('createAssessmentModal');
        const modal = new bootstrap.Modal(createModal);
        // In production, this would fetch assessment data from an API
        // For now, we'll just show the empty form
        modal.show();
    };

    window.deleteAssessment = async function(assessmentId) {
        const ok = await UIUtils.confirm({title:'Delete Assessment', body:'Delete this assessment? This cannot be undone.'});
        if (ok) {
            const row = document.querySelector(`[onclick="deleteAssessment(${assessmentId})"]`)?.closest('tr');
            if (row) row.remove();
            UIUtils.showToast('Assessment deleted','danger');
            UIUtils.log('Deleted assessment '+assessmentId,'assessment');
        }
    };

    window.saveAssessment = function() {
        const form = document.getElementById('createAssessmentForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Show loading state
        const submitButton = document.querySelector('[onclick="saveAssessment()"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';

        // Simulate API call
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('createAssessmentModal'));
            modal.hide();

            // Show success message
            showToast('Assessment created successfully', 'success');

            // Reset form
            form.reset();

            // In production, this would refresh the list from the API
            location.reload();
        }, 1500);
    };

    // Utility function to show toasts
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

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});