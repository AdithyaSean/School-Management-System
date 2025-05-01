document.addEventListener('DOMContentLoaded', function() {
    // Initialize date inputs with today's date
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.value = today;
    });

    // Initialize filters
    const filters = {
        class: document.getElementById('classSelect'),
        date: document.getElementById('dateSelect'),
        subject: document.getElementById('subjectSelect')
    };

    // Add filter event listeners
    Object.values(filters).forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });

    // View toggle buttons
    const viewButtons = document.querySelectorAll('.btn-group .btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Toggle between table and chart view
            const isChartView = this.querySelector('.fa-chart-bar');
            const tableView = document.querySelector('.table-responsive');
            const chartView = document.getElementById('attendanceChart');
            
            if (isChartView && !chartView) {
                createAttendanceChart();
            }
            
            if (tableView && chartView) {
                tableView.style.display = isChartView ? 'none' : 'block';
                chartView.style.display = isChartView ? 'block' : 'none';
            }
        });
    });

    // Initialize select all checkbox in take attendance modal
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('#attendanceForm .form-check-input:not(#selectAll)');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
                updateAttendanceStatus(checkbox);
            });
        });
    }
});

// Filter functionality
function applyFilters() {
    const selectedClass = document.getElementById('classSelect').value.toLowerCase();
    const selectedDate = document.getElementById('dateSelect').value;
    const selectedSubject = document.getElementById('subjectSelect').value.toLowerCase();

    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const classText = row.cells[1].textContent.toLowerCase();
        const dateText = row.cells[0].textContent;
        const subjectText = row.cells[2].textContent.toLowerCase();

        const matchesClass = !selectedClass || classText.includes(selectedClass);
        const matchesDate = !selectedDate || dateText === formatDate(selectedDate);
        const matchesSubject = !selectedSubject || subjectText.includes(selectedSubject);

        row.style.display = (matchesClass && matchesDate && matchesSubject) ? '' : 'none';
    });
}

// Take attendance functionality
window.takeAttendance = function() {
    const modal = document.getElementById('takeAttendanceModal');
    const modalInstance = new bootstrap.Modal(modal);
    
    // Set default date to today
    const dateInput = modal.querySelector('input[type="date"]');
    dateInput.value = new Date().toISOString().split('T')[0];
    
    // In production, this would fetch the class list from an API
    // For now, we'll just show the modal with sample data
    modalInstance.show();
};

window.submitAttendance = function() {
    const form = document.getElementById('attendanceForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Show loading state
    const submitButton = document.querySelector('[onclick="submitAttendance()"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';

    // Simulate API call
    setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('takeAttendanceModal'));
        modal.hide();

        // Show success message
        showToast('Attendance recorded successfully', 'success');

        // Reset form
        form.reset();

        // In production, this would refresh the list from the API
        location.reload();
    }, 1500);
};

// View attendance details
window.viewAttendanceDetails = function(classId, date) {
    // In production, this would fetch attendance details from an API
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Attendance Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="d-flex justify-content-between mb-4">
                        <div>
                            <h6>Class: ${classId}</h6>
                            <p class="mb-0">Date: ${formatDate(date)}</p>
                        </div>
                        <div class="text-end">
                            <h6>Attendance Rate</h6>
                            <h4 class="text-success">92%</h4>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Roll Number</th>
                                    <th>Status</th>
                                    <th>Time</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>John Doe</td>
                                    <td>101</td>
                                    <td><span class="badge bg-success">Present</span></td>
                                    <td>9:00 AM</td>
                                    <td>-</td>
                                </tr>
                                <tr>
                                    <td>Jane Smith</td>
                                    <td>102</td>
                                    <td><span class="badge bg-warning">Late</span></td>
                                    <td>9:15 AM</td>
                                    <td>Bus delay</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="editAttendance('${classId}', '${date}')">
                        Edit Attendance
                    </button>
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

// Edit attendance
window.editAttendance = function(classId, date) {
    // Close details modal if open
    const detailsModal = document.querySelector('.modal');
    if (detailsModal) {
        bootstrap.Modal.getInstance(detailsModal).hide();
    }

    // Show take attendance modal with pre-filled data
    const modal = document.getElementById('takeAttendanceModal');
    const modalInstance = new bootstrap.Modal(modal);
    
    // In production, this would fetch attendance data and populate the form
    document.querySelector('.modal-title').textContent = 'Edit Attendance';
    document.querySelector('[onclick="submitAttendance()"]').textContent = 'Save Changes';
    
    modalInstance.show();
};

// View attendance reports
window.viewAttendanceReports = function() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Attendance Reports</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row mb-4">
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body text-center">
                                    <h6>Monthly Average</h6>
                                    <h3 class="text-primary">85%</h3>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body text-center">
                                    <h6>Weekly Average</h6>
                                    <h3 class="text-success">88%</h3>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body text-center">
                                    <h6>Today's Average</h6>
                                    <h3 class="text-info">93%</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mb-4">
                        <canvas id="attendanceChart"></canvas>
                    </div>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Class</th>
                                    <th>Total Students</th>
                                    <th>Average Attendance</th>
                                    <th>Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Grade 10A</td>
                                    <td>25</td>
                                    <td>92%</td>
                                    <td><i class="fas fa-arrow-up text-success"></i></td>
                                </tr>
                                <tr>
                                    <td>Grade 11B</td>
                                    <td>28</td>
                                    <td>88%</td>
                                    <td><i class="fas fa-arrow-down text-danger"></i></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="downloadReport()">Download Report</button>
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

    // Initialize chart
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{
                label: 'Weekly Attendance',
                data: [88, 85, 90, 93, 87],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
};

// Download attendance report
window.downloadReport = function() {
    // In production, this would generate and download a PDF report
    showToast('Downloading attendance report...', 'info');
};

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

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

function createAttendanceChart() {
    const tableView = document.querySelector('.table-responsive');
    const chartContainer = document.createElement('div');
    chartContainer.id = 'attendanceChart';
    chartContainer.style.display = 'none';
    chartContainer.innerHTML = '<canvas></canvas>';
    tableView.parentNode.insertBefore(chartContainer, tableView.nextSibling);

    const ctx = chartContainer.querySelector('canvas').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Grade 10A', 'Grade 11B', 'Grade 9C'],
            datasets: [{
                label: 'Attendance Rate (%)',
                data: [92, 93, 88],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}