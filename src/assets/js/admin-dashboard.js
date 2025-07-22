// Admin Dashboard JS
// Replace mock data and logic with real API calls as needed.

document.addEventListener('DOMContentLoaded', function() {
    // User Management
    const userTableBody = document.querySelector('#userTable tbody');
    const addUserForm = document.getElementById('addUserForm');
    const updateUserForm = document.getElementById('updateUserForm');
    const showAddUserFormBtn = document.getElementById('showAddUserFormBtn');
    const cancelAddUserBtn = document.getElementById('cancelAddUserBtn');
    const cancelUpdateUserBtn = document.getElementById('cancelUpdateUserBtn');
    const addUserFormMsg = document.getElementById('addUserFormMsg');
    const updateUserFormMsg = document.getElementById('updateUserFormMsg');

    // Mock user data
    let userList = [
        { id: 1, username: 'admin', email: 'admin@school.com', role: 'admin' },
        { id: 2, username: 'principal', email: 'principal@school.com', role: 'principal' },
        { id: 3, username: 'sh1', email: 'sh1@school.com', role: 'sectional-head' },
        { id: 4, username: 'teacher1', email: 'teacher1@school.com', role: 'teacher' },
        { id: 5, username: 'student1', email: 'student1@school.com', role: 'student' }
    ];
    let nextId = 6;

    function renderUserTable() {
        userTableBody.innerHTML = '';
        userList.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editUser(${user.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="removeUser(${user.id})">Delete</button>
                </td>
            `;
            userTableBody.appendChild(tr);
        });
    }

    // Expose edit/remove for inline onclick
    window.editUser = function(id) {
        const user = userList.find(u => u.id === id);
        if (!user) return;
        document.getElementById('updateUserId').value = user.id;
        document.getElementById('updateUsername').value = user.username;
        document.getElementById('updateEmail').value = user.email;
        document.getElementById('updateRole').value = user.role;
        updateUserForm.classList.remove('hidden');
        addUserForm.classList.add('hidden');
        updateUserFormMsg.textContent = '';
    };

    window.removeUser = function(id) {
        if (confirm('Are you sure you want to delete this user?')) {
            userList = userList.filter(u => u.id !== id);
            renderUserTable();
        }
    };

    showAddUserFormBtn.addEventListener('click', function() {
        addUserForm.classList.remove('hidden');
        updateUserForm.classList.add('hidden');
        addUserFormMsg.textContent = '';
    });
    cancelAddUserBtn.addEventListener('click', function() {
        addUserForm.classList.add('hidden');
    });
    cancelUpdateUserBtn.addEventListener('click', function() {
        updateUserForm.classList.add('hidden');
    });

    document.getElementById('userAddForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = this.username.value.trim();
        const email = this.email.value.trim();
        const role = this.role.value;
        if (!username || !email || !role) {
            addUserFormMsg.textContent = 'All fields are required.';
            addUserFormMsg.className = 'error';
            return;
        }
        userList.push({ id: nextId++, username, email, role });
        renderUserTable();
        addUserFormMsg.textContent = 'User added successfully!';
        addUserFormMsg.className = 'success';
        this.reset();
        setTimeout(() => { addUserForm.classList.add('hidden'); }, 800);
    });

    document.getElementById('userUpdateForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = parseInt(this.id.value);
        const username = this.username.value.trim();
        const email = this.email.value.trim();
        const role = this.role.value;
        if (!username || !email || !role) {
            updateUserFormMsg.textContent = 'All fields are required.';
            updateUserFormMsg.className = 'error';
            return;
        }
        const user = userList.find(u => u.id === id);
        if (user) {
            user.username = username;
            user.email = email;
            user.role = role;
            renderUserTable();
            updateUserFormMsg.textContent = 'User updated successfully!';
            updateUserFormMsg.className = 'success';
            setTimeout(() => { updateUserForm.classList.add('hidden'); }, 800);
        }
    });

    renderUserTable();
});

// System Monitor/Reports
window.generateReport = function(type) {
    const reportResults = document.getElementById('reportResults');
    let html = '';
    switch(type) {
        case 'user-engagement':
            html = `<div class="report-box"><h4>User Engagement Report</h4><p>Mock: Shows user login frequency, active users, etc.</p></div>`;
            break;
        case 'performance':
            html = `<div class="report-box"><h4>Performance Report</h4><p>Mock: Shows system and user performance metrics.</p></div>`;
            break;
        case 'utilization':
            html = `<div class="report-box"><h4>System Utilization Report</h4><p>Mock: Shows server load, resource usage, etc.</p></div>`;
            break;
        case 'content-popularity':
            html = `<div class="report-box"><h4>Content Popularity Report</h4><p>Mock: Shows most accessed content/resources.</p></div>`;
            break;
        case 'attendance':
            html = `<div class="report-box"><h4>Monthly Attendance Report</h4><p>Mock: Shows attendance stats for the month.</p></div>`;
            break;
        default:
            html = `<div class="report-box"><h4>Unknown Report</h4></div>`;
    }
    reportResults.innerHTML = html;
};
