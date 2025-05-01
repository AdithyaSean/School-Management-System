document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

// Initialize performance charts
function initializeCharts() {
    initializeSubjectTrendChart();
    initializeSubjectDistributionChart();
}

// Initialize subject performance trend chart
function initializeSubjectTrendChart() {
    const ctx = document.getElementById('subjectTrendChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [
                {
                    label: 'Mathematics',
                    data: [85, 88, 82, 85, 90],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                },
                {
                    label: 'English',
                    data: [78, 82, 88, 85, 88],
                    borderColor: 'rgb(153, 102, 255)',
                    tension: 0.1
                },
                {
                    label: 'Science',
                    data: [92, 88, 85, 90, 92],
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Subject Performance Over Time'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
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

// Initialize subject distribution chart
function initializeSubjectDistributionChart() {
    const ctx = document.getElementById('subjectDistributionChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['A', 'B', 'C', 'D', 'F'],
            datasets: [{
                data: [8, 4, 2, 1, 0],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Grade Distribution'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((context.raw / total) * 100);
                            return `${context.label}: ${context.raw} subjects (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Filter results based on type
window.filterResults = function(type) {
    const rows = document.querySelectorAll('#currentResults tbody tr');
    rows.forEach(row => {
        const resultType = row.cells[1].textContent.toLowerCase();
        if (type === 'all' || resultType.includes(type)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Download results report
window.downloadResults = function() {
    // In production, this would generate and download a PDF report
    showToast('Generating results report...', 'info');
    // Simulated delay for report generation
    setTimeout(() => {
        showToast('Results report downloaded successfully!', 'success');
    }, 2000);
}

// View semester details
window.viewSemesterDetails = function(semesterId) {
    // In production, this would fetch semester details from an API
    const semesterDetails = {
        'math-2024-fall': {
            subject: 'Mathematics',
            semester: 'Fall 2024',
            instructor: 'Dr. Smith',
            assignments: [
                { name: 'Assignment 1', score: 90, weight: 15 },
                { name: 'Mid-term', score: 88, weight: 30 },
                { name: 'Assignment 2', score: 85, weight: 15 },
                { name: 'Final Exam', score: 92, weight: 40 }
            ],
            feedback: 'Excellent performance in calculus. Shows strong problem-solving skills.'
        },
        'eng-2024-fall': {
            subject: 'English',
            semester: 'Fall 2024',
            instructor: 'Prof. Johnson',
            assignments: [
                { name: 'Essay 1', score: 85, weight: 20 },
                { name: 'Presentation', score: 88, weight: 20 },
                { name: 'Mid-term', score: 90, weight: 30 },
                { name: 'Final Paper', score: 87, weight: 30 }
            ],
            feedback: 'Strong analytical writing skills. Could improve on oral presentations.'
        }
    };

    const details = semesterDetails[semesterId];
    if (!details) return;

    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${details.subject} - ${details.semester}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <h6 class="card-title">Course Information</h6>
                                    <dl class="row mb-0">
                                        <dt class="col-sm-4">Instructor:</dt>
                                        <dd class="col-sm-8">${details.instructor}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <h6 class="card-title">Grade Distribution</h6>
                                    <canvas id="gradeDistributionChart"></canvas>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="card">
                                <div class="card-body">
                                    <h6 class="card-title">Assignment Breakdown</h6>
                                    <div class="table-responsive">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th>Assignment</th>
                                                    <th>Score</th>
                                                    <th>Weight</th>
                                                    <th>Weighted Score</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${details.assignments.map(assignment => `
                                                    <tr>
                                                        <td>${assignment.name}</td>
                                                        <td>${assignment.score}%</td>
                                                        <td>${assignment.weight}%</td>
                                                        <td>${(assignment.score * assignment.weight / 100).toFixed(2)}</td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="card">
                                <div class="card-body">
                                    <h6 class="card-title">Instructor's Feedback</h6>
                                    <p class="mb-0">${details.feedback}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="downloadSemesterReport('${semesterId}')">
                        <i class="fas fa-download me-2"></i>Download Report
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

    // Initialize grade distribution chart
    const ctx = modal.querySelector('#gradeDistributionChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['A', 'B', 'C', 'D', 'F'],
                datasets: [{
                    data: [12, 8, 5, 3, 2],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Class Grade Distribution'
                    }
                }
            }
        });
    }
}

// Download semester report
window.downloadSemesterReport = function(semesterId) {
    showToast('Generating semester report...', 'info');
    setTimeout(() => {
        showToast('Semester report downloaded successfully!', 'success');
    }, 2000);
}

// Utility function to show toast notifications
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