// Shared UI utilities: toasts, confirmation modal, notification center, status badges (prototype only)
window.UIUtils = (function() {
    const exports = {};

    // -------------------------------------------------------------
    // Centralized In‑Memory Data Service (prototype only)
    // Provides pub/sub + shared state so individual pages stop
    // duplicating arrays. NOT persistent; resets per page load.
    // -------------------------------------------------------------
    const DataService = (function() {
        const state = {
            currentRole: null,
            notifications: [], // {id,msg,type,time,audience:[roles], category}
            activity: [],      // {id,message,category,ts}
            subscribers: { notification: [], activity: [] }
        };
        const roleFromPath = () => {
            const m = window.location.pathname.match(/\b(student|teacher|admin|principal|sectional-head)\b/);
            return m? m[1] : null;
        };
        state.currentRole = roleFromPath();

        function notify(kind) {
            state.subscribers[kind].forEach(fn => { try { fn(state); } catch(e){ console.warn(e); } });
        }

        return {
            getRole: () => state.currentRole,
            setRole: r => { state.currentRole = r; },
            on: (kind, fn) => { if (state.subscribers[kind]) state.subscribers[kind].push(fn); },
            pushNotification: (n) => { state.notifications.push(n); notify('notification'); },
            getNotifications: () => state.notifications.slice(),
            log: (evt) => { state.activity.push(evt); if (state.activity.length>1000) state.activity.shift(); notify('activity'); },
            getActivity: () => state.activity.slice(),
        };
    })();
    exports.DataService = DataService;

    const activityEvents = []; // legacy array kept for backward compat (will mirror DataService)

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
        offcanvas.setAttribute('aria-labelledby','notificationOffcanvasLabel');
        offcanvas.innerHTML = `
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="notificationOffcanvasLabel">Notifications</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>
            <div class="offcanvas-body d-flex flex-column">
                <div class="d-flex gap-2 mb-2">
                    <select id="notificationAudienceFilter" class="form-select form-select-sm" style="max-width:160px">
                        <option value="">All Audiences</option>
                        <option value="student">Students</option>
                        <option value="teacher">Teachers</option>
                        <option value="sectional-head">Sectional Heads</option>
                        <option value="principal">Principals</option>
                        <option value="admin">Admins</option>
                    </select>
                    <input id="notificationSearch" type="search" placeholder="Search" class="form-control form-control-sm" />
                </div>
                <div id="notificationList" class="list-group small flex-grow-1 overflow-auto mb-3" role="list"></div>
                <div class="d-flex gap-2 flex-wrap">
                    <button class="btn btn-sm btn-outline-secondary flex-grow-1" id="clearNotificationsBtn">Clear</button>
                    <button class="btn btn-sm btn-outline-primary flex-grow-1" id="mockAddNotificationBtn">Mock Add</button>
                </div>
            </div>`;
        document.body.appendChild(offcanvas);
        // Seed initial notifications only once
        if (!DataService.getNotifications().length) {
            [
                {msg: 'Welcome to the new messaging beta!', type: 'info', audience:['teacher','student','admin','principal','sectional-head'], category:'system'},
                {msg: 'Exam schedule updated for Grade 10A', type: 'warning', audience:['student','teacher'], category:'exam'},
                {msg: 'New message from Principal', type: 'primary', audience:['teacher','sectional-head'], category:'message'}
            ].forEach(n => DataService.pushNotification({id:Date.now()+Math.random(), ...n, time:new Date()}));
        }
        // Render function
        function renderNotifications() {
            const list = document.getElementById('notificationList');
            const role = DataService.getRole();
            const audFilter = document.getElementById('notificationAudienceFilter').value;
            const search = document.getElementById('notificationSearch').value.toLowerCase();
            list.innerHTML='';
            let items = DataService.getNotifications().slice().reverse().filter(n => !audFilter || (n.audience||[]).includes(audFilter));
            if (role) items = items.filter(n => (n.audience||[]).includes(role));
            if (search) items = items.filter(n => n.msg.toLowerCase().includes(search));
            if (!items.length) { list.innerHTML = '<div class="p-3 text-center text-muted">No notifications</div>'; return; }
            items.forEach(n => {
                const item = document.createElement('button');
                item.type='button';
                item.className='list-group-item list-group-item-action d-flex justify-content-between align-items-start';
                item.innerHTML = `
                    <div class="me-2 text-start">
                        <div>${n.msg}</div>
                        <small class="text-muted">${(n.time instanceof Date)? n.time.toLocaleTimeString(): n.time}</small>
                        <div class="mt-1"><span class="badge bg-light text-dark border me-1">${(n.audience||[]).join(', ')||'all'}</span><span class="badge bg-secondary">${n.category||'general'}</span></div>
                    </div>
                    <span class="badge bg-${n.type}"><i class="fas fa-circle"></i></span>`;
                item.addEventListener('click', () => {
                    // rudimentary deep link heuristics
                    if (/exam/i.test(n.msg)) window.location.href = '../../pages/teacher/manage-exams.html';
                    else if (/message/i.test(n.msg)) window.location.href = '../../pages/teacher/messages.html';
                });
                list.appendChild(item);
            });
        }
        DataService.on('notification', renderNotifications);
        document.getElementById('notificationAudienceFilter').addEventListener('change', renderNotifications);
        document.getElementById('notificationSearch').addEventListener('input', renderNotifications);
        renderNotifications();
        document.querySelectorAll('.notification-trigger, .fa-bell').forEach(icon => {
            icon.addEventListener('click', () => {
                new bootstrap.Offcanvas(offcanvas).toggle();
                const badge = icon.querySelector('.notification-badge');
                if (badge) badge.style.display = 'none';
            });
        });
        offcanvas.querySelector('#clearNotificationsBtn').addEventListener('click', () => {
            // Clear only those relevant to current role for prototype clarity
            const role = DataService.getRole();
            const remaining = DataService.getNotifications().filter(n => role && !(n.audience||[]).includes(role));
            // Replace state (simple since no persistence)
            remaining.length = 0; // ensure reference not lost (skip for simplicity)
            renderNotifications();
        });
        offcanvas.querySelector('#mockAddNotificationBtn').addEventListener('click', () => {
            exports.pushNotification('Mock event at '+new Date().toLocaleTimeString(), 'secondary', 'now', {audience:[DataService.getRole()||'student'], category:'system'});
        });
    };

    exports.pushNotification = function(message, type='primary', time='now', {audience=['student','teacher','admin','principal','sectional-head'], category='general'}={}) {
        DataService.pushNotification({id:Date.now()+Math.random(), msg:message, type, time: (time==='now'? new Date(): time), audience: Array.isArray(audience)? audience: [audience], category});
    };

    exports.statusBadge = function(status) {
        if (!status) return '';
        const s = status.toString().toLowerCase();
        const map = {
            pending: 'warning', graded: 'success', late: 'danger', upcoming: 'info', draft: 'secondary',
            active:'success', inactive:'secondary', disabled:'dark', student:'primary', teacher:'info', 'sectional-head':'warning', principal:'dark', admin:'danger'
        };
        const cls = map[s] || 'primary';
        return `<span class="badge bg-${cls} text-uppercase">${status}</span>`;
    };

    // --- Activity / Audit Log (prototype only) ---
    exports.initActivityLog = function() {
        if (document.getElementById('activityLogOffcanvas')) return;
        const wrap = document.createElement('div');
        wrap.className = 'offcanvas offcanvas-end';
        wrap.id = 'activityLogOffcanvas';
        wrap.setAttribute('aria-labelledby','activityLogOffcanvasLabel');
        wrap.innerHTML = `
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="activityLogOffcanvasLabel">Activity Log</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body d-flex flex-column">
                <div class="d-flex flex-wrap gap-2 mb-2">
                    <select id="activityFilter" class="form-select form-select-sm" style="max-width:150px">
                        <option value="">All</option>
                        <option value="auth">Auth</option>
                        <option value="user">User</option>
                        <option value="assessment">Assessment</option>
                        <option value="exam">Exam</option>
                        <option value="attendance">Attendance</option>
                        <option value="notification">Notification</option>
                        <option value="report">Report</option>
                        <option value="message">Message</option>
                        <option value="profile">Profile</option>
                        <option value="system">System</option>
                    </select>
                    <input id="activitySearch" type="search" class="form-control form-control-sm" placeholder="Search" style="max-width:180px" />
                    <div class="btn-group btn-group-sm" role="group" aria-label="Pagination" id="activityPager"></div>
                    <button class="btn btn-sm btn-outline-secondary ms-auto" id="exportActivityBtn">Export CSV</button>
                    <button class="btn btn-sm btn-outline-danger" id="clearActivityLog">Clear</button>
                </div>
                <div id="activityLogList" class="list-group small flex-grow-1 overflow-auto border rounded" role="log" aria-live="polite"></div>
                <div class="mt-2 text-muted small">Session only – filtered & paginated.</div>
            </div>`;
        document.body.appendChild(wrap);
        document.querySelectorAll('.activity-log-trigger').forEach(btn => {
            btn.addEventListener('click', () => new bootstrap.Offcanvas(wrap).toggle());
        });
        wrap.querySelector('#activityFilter').addEventListener('change', () => exports.renderActivity());
        wrap.querySelector('#activitySearch').addEventListener('input', () => exports.renderActivity());
        wrap.querySelector('#clearActivityLog').addEventListener('click', () => { activityEvents.length = 0; exports.renderActivity(); });
        wrap.querySelector('#exportActivityBtn').addEventListener('click', () => {
            const rows = activityEvents.map(e => `${e.ts.toISOString()},${e.category},"${e.message.replace(/"/g,'""')}"`);
            const csv = 'timestamp,category,message\n'+rows.join('\n');
            const blob = new Blob([csv], {type:'text/csv'});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob); a.download='activity-log.csv'; a.click(); URL.revokeObjectURL(a.href);
        });
        exports.renderActivity();
    };

    exports.log = function(message, category='general') {
        const evt = { id: Date.now()+Math.random(), message, category, ts: new Date() };
        activityEvents.push(evt);
        DataService.log(evt); // mirror into DataService central store
        if (activityEvents.length > 1000) activityEvents.shift();
        exports.renderActivity();
    };

    exports.renderActivity = function() {
        const list = document.getElementById('activityLogList');
        if (!list) return;
        const filter = document.getElementById('activityFilter')?.value || '';
        const search = document.getElementById('activitySearch')?.value.toLowerCase() || '';
        const pageSize = 20;
        // Determine current page from selected pager button (data-page attr) default 1
        const currentPageBtn = document.querySelector('#activityPager .active');
        let currentPage = currentPageBtn? parseInt(currentPageBtn.getAttribute('data-page')) : 1;
        let filtered = activityEvents.slice().reverse().filter(e => (!filter || e.category === filter) && (!search || e.message.toLowerCase().includes(search)));
        const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
        if (currentPage > totalPages) currentPage = totalPages;
        const start = (currentPage-1)*pageSize;
        const pageItems = filtered.slice(start, start+pageSize);
        list.innerHTML='';
        if (!pageItems.length) { list.innerHTML = '<div class="p-3 text-center text-muted">No activity</div>'; }
        pageItems.forEach(e => {
            const item = document.createElement('div');
            item.className = 'list-group-item';
            item.innerHTML = `<div class="d-flex justify-content-between"><span><span class="badge bg-secondary me-2 text-uppercase">${e.category}</span>${e.message}</span><small class="text-muted">${e.ts.toLocaleTimeString()}</small></div>`;
            list.appendChild(item);
        });
        // Render pagination buttons
        const pager = document.getElementById('activityPager');
        if (pager) {
            pager.innerHTML='';
            for (let p=1;p<=totalPages && p<=5;p++) { // cap at 5 for prototype
                const btn = document.createElement('button');
                btn.type='button';
                btn.className='btn btn-outline-secondary'+(p===currentPage?' active':'');
                btn.textContent=p; btn.setAttribute('data-page',p);
                btn.addEventListener('click', () => { document.querySelectorAll('#activityPager .btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); exports.renderActivity(); });
                pager.appendChild(btn);
            }
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        exports.initNotificationCenter();
        exports.initActivityLog();
        exports.log('UI initialized','system');
    });
    return exports;
})();
