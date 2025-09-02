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
                <td>${UIUtils.statusBadge(user.role)}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editUser(${user.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="removeUser(${user.id})">Delete</button>
                </td>`;
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

    window.removeUser = async function(id) {
        const user = userList.find(u=>u.id===id);
        const ok = await UIUtils.confirm({title:'Delete User', body:`Delete user <strong>${user?.username||id}</strong>? This cannot be undone.`});
        if (ok) {
            userList = userList.filter(u => u.id !== id);
            renderUserTable();
            UIUtils.showToast('User deleted','danger');
            UIUtils.log('Deleted user '+(user?.username||id),'user');
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
    UIUtils.showToast('User added','success');
    UIUtils.log('Added user '+username,'user');
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
            UIUtils.showToast('User updated','primary');
            UIUtils.log('Updated user '+username,'user');
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
            html = `<div class=\"report-box\"><h4>User Engagement Report</h4><p class=\"mb-1\">Mock: Shows user login frequency, active users, etc.</p><canvas id=\"chartUserEngagement\" height=\"140\"></canvas></div>`;
            break;
        case 'performance':
            html = `<div class=\"report-box\"><h4>Performance Report</h4><p class=\"mb-1\">Mock: Shows system and user performance metrics.</p><canvas id=\"chartPerformance\" height=\"140\"></canvas></div>`;
            break;
        case 'utilization':
            html = `<div class=\"report-box\"><h4>System Utilization Report</h4><p class=\"mb-1\">Mock: Shows server load, resource usage, etc.</p><div class=\"progress mb-2\"><div class=\"progress-bar bg-success\" style=\"width:65%\">CPU 65%</div></div><div class=\"progress mb-2\"><div class=\"progress-bar bg-info\" style=\"width:40%\">Memory 40%</div></div><div class=\"progress\"><div class=\"progress-bar bg-warning\" style=\"width:55%\">Disk 55%</div></div></div>`;
            break;
        case 'content-popularity':
            html = `<div class=\"report-box\"><h4>Content Popularity Report</h4><p class=\"mb-1\">Mock: Shows most accessed content/resources.</p><ul class=\"small mb-0\"><li>Math Quiz Bank (120 views)</li><li>Science Lab Guide (95 views)</li><li>English Essay Rubric (78 views)</li></ul></div>`;
            break;
        case 'attendance':
            html = `<div class=\"report-box\"><h4>Monthly Attendance Report</h4><p class=\"mb-1\">Mock: Shows attendance stats for the month.</p><canvas id=\"chartAttendance\" height=\"140\"></canvas></div>`;
            break;
        default:
            html = `<div class="report-box"><h4>Unknown Report</h4></div>`;
    }
    reportResults.innerHTML = html;
    UIUtils.showToast('Generated '+type.replace('-', ' ')+' report','info');
    UIUtils.log('Generated report '+type,'report');
    // Simple chart mocks if Chart.js present
    if (window.Chart) {
        if (document.getElementById('chartUserEngagement')) new Chart(chartUserEngagement.getContext('2d'), {type:'line',data:{labels:['M','T','W','T','F'],datasets:[{label:'Logins',data:[12,19,14,22,18],borderColor:'#0d6efd'}]}});
        if (document.getElementById('chartPerformance')) new Chart(chartPerformance.getContext('2d'), {type:'bar',data:{labels:['Resp','Throughput','Errors'],datasets:[{label:'Metric',data:[220,130,5],backgroundColor:['#0d6efd','#198754','#dc3545']}]},options:{scales:{y:{beginAtZero:true}}}});
        if (document.getElementById('chartAttendance')) new Chart(chartAttendance.getContext('2d'), {type:'doughnut',data:{labels:['Present','Absent','Late'],datasets:[{data:[92,5,3],backgroundColor:['#198754','#dc3545','#ffc107']} ]}});
    }
};
