document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const userType = document.getElementById('userType').value;
        
        // In a real application, this would be an API call
        handleLogin(username, password, userType);
    });
});

function handleLogin(username, password, userType) {
    // Simulate authentication - In production, this would be an API call
    if (username && password) {
        // Redirect to appropriate dashboard based on user type
        switch(userType) {
            case 'student':
                window.location.href = 'pages/student/dashboard.html';
                break;
            case 'teacher':
                window.location.href = 'pages/teacher/dashboard.html';
                break;
            case 'sectional-head':
                window.location.href = 'pages/sectional-head/dashboard.html';
                break;
            case 'principal':
                window.location.href = 'pages/principal/dashboard.html';
                break;
            case 'admin':
                window.location.href = 'pages/admin/dashboard.html';
                break;
            default:
                showError('Invalid user type');
        }
    } else {
        showError('Please fill in all fields');
    }
}

function showError(message) {
    // Create error alert if it doesn't exist
    let errorAlert = document.querySelector('.alert-danger');
    if (!errorAlert) {
        errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger mt-3';
        document.querySelector('.card-body').insertBefore(
            errorAlert,
            document.querySelector('form')
        );
    }
    errorAlert.textContent = message;
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        errorAlert.remove();
    }, 3000);
}