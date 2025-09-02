// Shared UI utilities: toasts, confirmation modal, notification center, status badges (prototype only)
window.UIUtils = (function() {
    const exports = {};

    function ensureToastContainer() {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            container.style.zIndex = '2000';
            document.body.appendChild(container);
        }
        return container;
    }

    exports.showToast = function(message, type = 'primary', timeout = 3000) {
        const container = ensureToastContainer();
        const wrapper = document.createElement('div');
        wrapper.className = 'toast align-items-center show border-0 shadow';
        wrapper.setAttribute('role', 'alert');
        wrapper.innerHTML = `
            <div class="d-flex w-100">
                <div class="toast-body flex-grow-1 text-${type === 'light' ? 'dark' : 'white'} bg-${type} rounded-start">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>`;
        container.appendChild(wrapper);
        setTimeout(() => wrapper.remove(), timeout);
    };

    exports.confirm = function({title='Confirm', body='Are you sure?', confirmText='Confirm', cancelText='Cancel', confirmBtnClass='btn-danger'} = {}) {
        return new Promise(resolve => {
            const modalEl = document.createElement('div');
            modalEl.className = 'modal fade';
            modalEl.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body"><p class="mb-0">${body}</p></div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${cancelText}</button>
                            <button type="button" class="btn ${confirmBtnClass}" id="__confirmBtn">${confirmText}</button>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(modalEl);
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
            modalEl.querySelector('#__confirmBtn').addEventListener('click', () => {
                resolve(true);
                modal.hide();
            });
            modalEl.addEventListener('hidden.bs.modal', () => {
                modalEl.remove();
            });
        });
    };

    exports.initNotificationCenter = function() {
        if (document.getElementById('notificationOffcanvas')) return;
        const offcanvas = document.createElement('div');
        offcanvas.className = 'offcanvas offcanvas-end';
        offcanvas.id = 'notificationOffcanvas';
        offcanvas.innerHTML = `
            <div class="offcanvas-header">
                <h5 class="offcanvas-title">Notifications</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>
            <div class="offcanvas-body d-flex flex-column">
                <div id="notificationList" class="list-group small flex-grow-1 overflow-auto mb-3"></div>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-secondary flex-grow-1" id="clearNotificationsBtn">Clear</button>
                    <button class="btn btn-sm btn-primary flex-grow-1" id="mockAddNotificationBtn">Mock Add</button>
                </div>
            </div>`;
        document.body.appendChild(offcanvas);
        const seed = [
            {msg: 'Welcome to the new messaging beta!', time: 'Just now', type: 'info'},
            {msg: 'Exam schedule updated for Grade 10A', time: '5m', type: 'warning'},
            {msg: 'New message from Principal', time: '12m', type: 'primary'}
        ];
        seed.forEach(n => exports.pushNotification(n.msg, n.type, n.time));
        document.querySelectorAll('.notification-trigger, .fa-bell').forEach(icon => {
            icon.addEventListener('click', () => {
                new bootstrap.Offcanvas(offcanvas).toggle();
                const badge = icon.querySelector('.notification-badge');
                if (badge) badge.style.display = 'none';
            });
        });
        offcanvas.querySelector('#clearNotificationsBtn').addEventListener('click', () => {
            document.getElementById('notificationList').innerHTML = '<div class="text-center text-muted py-3">No notifications</div>';
        });
        offcanvas.querySelector('#mockAddNotificationBtn').addEventListener('click', () => {
            exports.pushNotification('Mock event at '+new Date().toLocaleTimeString(), 'secondary', 'now');
        });
    };

    exports.pushNotification = function(message, type='primary', time='now') {
        const list = document.getElementById('notificationList');
        if (!list) return;
        const item = document.createElement('div');
        item.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-start';
        item.innerHTML = `
            <div class="me-2">
                <div>${message}</div>
                <small class="text-muted">${time}</small>
            </div>
            <span class="badge bg-${type}"><i class="fas fa-circle"></i></span>`;
        list.prepend(item);
    };

    exports.statusBadge = function(status) {
        const map = { pending: 'warning', graded: 'success', late: 'danger', upcoming: 'info', draft: 'secondary' };
        const cls = map[status.toLowerCase()] || 'primary';
        return `<span class="badge bg-${cls} text-uppercase">${status}</span>`;
    };

    document.addEventListener('DOMContentLoaded', () => exports.initNotificationCenter());
    return exports;
})();
