document.addEventListener('DOMContentLoaded', function() {
    // Initialize performance chart
    initializePerformanceChart();
});

// Initialize the performance chart
function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [
                {
                    label: 'Your Score',
                    data: [85, 88, 92, 85, 88],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                },
                {
                    label: 'Class Average',
                    data: [80, 82, 85, 81, 83],
                    borderColor: 'rgb(153, 102, 255)',
                    tension: 0.1,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Exam Performance Trend'
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

// View exam details
window.viewExamDetails = function(examId) {
    // In production, this would fetch exam details from an API
    const examDetails = {
        1: {
            subject: 'Mathematics',
            date: 'May 10, 2025',
            time: '9:00 AM',
            duration: '2 hours',
            room: 'Room 301',
            type: 'Final',
            syllabus: ['Algebra', 'Calculus', 'Trigonometry'],
            instructions: [
                'Bring scientific calculator',
                'No phones allowed',
                'Show all working'
            ]
        },
        2: {
            subject: 'Science',
            date: 'May 15, 2025',
            time: '10:30 AM',
            duration: '2 hours',
            room: 'Room 305',
            type: 'Final',
            syllabus: ['Physics', 'Chemistry', 'Biology'],
            instructions: [
                'Lab safety rules apply',
                'No electronic devices',
                'Answer all sections'
            ]
        }
    };

    const exam = examDetails[examId];
    if (!exam) return;

    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${exam.subject} Exam Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card mb-3">
                                <div class="card-body">
                                    <h6 class="card-title">Exam Information</h6>
                                    <dl class="row mb-0">
                                        <dt class="col-sm-4">Date:</dt>
                                        <dd class="col-sm-8">${exam.date}</dd>
                                        
                                        <dt class="col-sm-4">Time:</dt>
                                        <dd class="col-sm-8">${exam.time}</dd>
                                        
                                        <dt class="col-sm-4">Duration:</dt>
                                        <dd class="col-sm-8">${exam.duration}</dd>
                                        
                                        <dt class="col-sm-4">Room:</dt>
                                        <dd class="col-sm-8">${exam.room}</dd>
                                        
                                        <dt class="col-sm-4">Type:</dt>
                                        <dd class="col-sm-8">${exam.type}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card mb-3">
                                <div class="card-body">
                                    <h6 class="card-title">Syllabus</h6>
                                    <ul class="list-unstyled mb-0">
                                        ${exam.syllabus.map(topic => `<li><i class="fas fa-check text-success me-2"></i>${topic}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="card">
                                <div class="card-body">
                                    <h6 class="card-title">Instructions</h6>
                                    <ul class="mb-0">
                                        ${exam.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="downloadExamDetails(${examId})">
                        <i class="fas fa-download me-2"></i>Download Details
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

// View result details
window.viewResultDetails = function(resultId) {
    // In production, this would fetch result details from an API
    const resultDetails = {
        1: {
            subject: 'English',
            type: 'Mid-term',
            date: 'Apr 15, 2025',
            score: 88,
            grade: 'A',
            classAverage: 82,
            sections: [
                { name: 'Reading Comprehension', score: 90, maxScore: 100 },
                { name: 'Grammar', score: 85, maxScore: 100 },
                { name: 'Essay Writing', score: 88, maxScore: 100 }
            ],
            feedback: 'Excellent work on reading comprehension. Consider focusing more on complex grammar structures.'
        },
        2: {
            subject: 'Mathematics',
            type: 'Mid-term',
            date: 'Apr 10, 2025',
            score: 85,
            grade: 'B+',
            classAverage: 80,
            sections: [
                { name: 'Algebra', score: 88, maxScore: 100 },
                { name: 'Geometry', score: 82, maxScore: 100 },
                { name: 'Statistics', score: 85, maxScore: 100 }
            ],
            feedback: 'Good understanding of algebra concepts. Need more practice with geometric proofs.'
        }
    };

    const result = resultDetails[resultId];
    if (!result) return;

    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${result.subject} Result Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <h6 class="card-title">Result Summary</h6>
                                    <dl class="row mb-0">
                                        <dt class="col-sm-6">Overall Score:</dt>
                                        <dd class="col-sm-6">${result.score}%</dd>
                                        
                                        <dt class="col-sm-6">Grade:</dt>
                                        <dd class="col-sm-6">${result.grade}</dd>
                                        
                                        <dt class="col-sm-6">Class Average:</dt>
                                        <dd class="col-sm-6">${result.classAverage}%</dd>
                                        
                                        <dt class="col-sm-6">Percentile:</dt>
                                        <dd class="col-sm-6">${Math.round((result.score - result.classAverage) + 50)}th</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <canvas id="resultChart"></canvas>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="card">
                                <div class="card-body">
                                    <h6 class="card-title">Section Breakdown</h6>
                                    <div class="table-responsive">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th>Section</th>
                                                    <th>Score</th>
                                                    <th>Max Score</th>
                                                    <th>Percentage</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${result.sections.map(section => `
                                                    <tr>
                                                        <td>${section.name}</td>
                                                        <td>${section.score}</td>
                                                        <td>${section.maxScore}</td>
                                                        <td>${Math.round(section.score / section.maxScore * 100)}%</td>
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
                                    <h6 class="card-title">Teacher's Feedback</h6>
                                    <p class="mb-0">${result.feedback}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="downloadResultDetails(${resultId})">
                        <i class="fas fa-download me-2"></i>Download Result
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

    // Initialize result chart
    const ctx = document.getElementById('resultChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: result.sections.map(section => section.name),
                datasets: [{
                    label: 'Score',
                    data: result.sections.map(section => section.score),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Section Scores'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
};

// View all results history
window.viewResults = function() {
    window.location.href = 'results.html';
};

// Download exam schedule
window.downloadSchedule = function() {
    // In production, this would generate and download a PDF schedule
    showToast('Downloading exam schedule...', 'info');
};

// Download exam details
window.downloadExamDetails = function(examId) {
    // In production, this would generate and download a PDF of exam details
    showToast('Downloading exam details...', 'info');
};

// Download result details
window.downloadResultDetails = function(resultId) {
    // In production, this would generate and download a PDF of result details
    showToast('Downloading result details...', 'info');
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