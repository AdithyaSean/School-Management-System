// Sectional Head Staff Management JS
// This is a starter file. Replace mock data and logic with real API calls as needed.

document.addEventListener('DOMContentLoaded', function() {
    const staffTableBody = document.querySelector('#staffTable tbody');
    const addForm = document.getElementById('addForm');
    const updateForm = document.getElementById('updateForm');
    const showAddFormBtn = document.getElementById('showAddFormBtn');
    const cancelAddBtn = document.getElementById('cancelAddBtn');
    const cancelUpdateBtn = document.getElementById('cancelUpdateBtn');
    const addFormMsg = document.getElementById('addFormMsg');
    const updateFormMsg = document.getElementById('updateFormMsg');

    // Mock staff data
    let staffList = [
        { id: 1, name: 'John Doe', email: 'john@example.com', subject: 'Math', role: 'Teacher' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', subject: 'English', role: 'Assistant' }
    ];
    let nextId = 3;

    function renderStaffTable() {
        staffTableBody.innerHTML = '';
        staffList.forEach(staff => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${staff.name}</td>
                <td>${staff.email}</td>
                <td>${staff.subject}</td>
                <td>${staff.role}</td>
                <td>
                    <button onclick="editStaff(${staff.id})">Edit</button>
                    <button onclick="removeStaff(${staff.id})">Remove</button>
                </td>
            `;
            staffTableBody.appendChild(tr);
        });
    }

    // Expose edit/remove for inline onclick
    window.editStaff = function(id) {
        const staff = staffList.find(s => s.id === id);
        if (!staff) return;
        document.getElementById('updateId').value = staff.id;
        document.getElementById('updateName').value = staff.name;
        document.getElementById('updateEmail').value = staff.email;
        document.getElementById('updateSubject').value = staff.subject;
        document.getElementById('updateRole').value = staff.role;
        updateForm.classList.remove('hidden');
        addForm.classList.add('hidden');
        updateFormMsg.textContent = '';
    };

    window.removeStaff = function(id) {
        if (confirm('Are you sure you want to remove this staff member?')) {
            staffList = staffList.filter(s => s.id !== id);
            renderStaffTable();
        }
    };

    showAddFormBtn.addEventListener('click', function() {
        addForm.classList.remove('hidden');
        updateForm.classList.add('hidden');
        addFormMsg.textContent = '';
    });
    cancelAddBtn.addEventListener('click', function() {
        addForm.classList.add('hidden');
    });
    cancelUpdateBtn.addEventListener('click', function() {
        updateForm.classList.add('hidden');
    });

    document.getElementById('staffAddForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.name.value.trim();
        const email = this.email.value.trim();
        const subject = this.subject.value.trim();
        const role = this.role.value;
        if (!name || !email || !subject || !role) {
            addFormMsg.textContent = 'All fields are required.';
            addFormMsg.className = 'error';
            return;
        }
        staffList.push({ id: nextId++, name, email, subject, role });
        renderStaffTable();
        addFormMsg.textContent = 'Staff member added successfully!';
        addFormMsg.className = 'success';
        this.reset();
        setTimeout(() => { addForm.classList.add('hidden'); }, 800);
    });

    document.getElementById('staffUpdateForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = parseInt(this.id.value);
        const name = this.name.value.trim();
        const email = this.email.value.trim();
        const subject = this.subject.value.trim();
        const role = this.role.value;
        if (!name || !email || !subject || !role) {
            updateFormMsg.textContent = 'All fields are required.';
            updateFormMsg.className = 'error';
            return;
        }
        const staff = staffList.find(s => s.id === id);
        if (staff) {
            staff.name = name;
            staff.email = email;
            staff.subject = subject;
            staff.role = role;
            renderStaffTable();
            updateFormMsg.textContent = 'Staff member updated successfully!';
            updateFormMsg.className = 'success';
            setTimeout(() => { updateForm.classList.add('hidden'); }, 800);
        }
    });

    renderStaffTable();
});
