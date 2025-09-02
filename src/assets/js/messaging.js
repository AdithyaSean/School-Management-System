// In-memory messaging prototype for teacher role
document.addEventListener('DOMContentLoaded', () => {
    const threadListEl = document.getElementById('threadList');
    const messageListEl = document.getElementById('messageList');
    const titleEl = document.getElementById('activeThreadTitle');
    const metaEl = document.getElementById('activeThreadMeta');
    const replyInput = document.getElementById('replyInput');
    const replySendBtn = document.getElementById('replySendBtn');
    const starBtn = document.getElementById('starThreadBtn');
    const delBtn = document.getElementById('deleteThreadBtn');
    const composeForm = document.getElementById('composeForm');
    const sendComposeBtn = document.getElementById('sendComposeBtn');
    const threadSearch = document.getElementById('threadSearch');

    let threads = [
        { id: 1, subject: 'Exam Review Meeting', participants: ['Principal', 'You'], messages: [
            { from: 'Principal', body: 'Please review the mid-term results before Friday.', ts: Date.now()-3600_000 },
            { from: 'You', body: 'Acknowledged. Will prepare summary.', ts: Date.now()-1800_000 }
        ], unread: 1, starred: false },
        { id: 2, subject: 'Grade 10A Attendance', participants: ['Sectional Head', 'You'], messages: [
            { from: 'Sectional Head', body: 'Attendance dipped last week, any issues?', ts: Date.now()-7200_000 }
        ], unread: 1, starred: true }
    ];
    let activeId = null;

    function tsLabel(ts) { return new Date(ts).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }

    function renderThreads(filter='all', search='') {
        threadListEl.innerHTML = '';
        const filtered = threads.filter(t => {
            if (filter==='unread' && !t.unread) return false;
            if (filter==='starred' && !t.starred) return false;
            if (search && !t.subject.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        });
        if (!filtered.length) {
            threadListEl.innerHTML = '<div class="p-3 text-center text-muted small">No conversations</div>';
            return;
        }
        filtered.forEach(t => {
            const last = t.messages[t.messages.length-1];
            const a = document.createElement('button');
            a.type = 'button';
            a.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-start' + (t.id===activeId?' active':'');
            a.innerHTML = `
                <div class="me-2 text-start">
                    <div class="fw-semibold">${t.subject}</div>
                    <small class="text-muted">${last.from}: ${last.body.slice(0,25)}${last.body.length>25?'…':''}</small>
                </div>
                <div class="text-end">
                    <small class="d-block text-muted">${tsLabel(last.ts)}</small>
                    ${t.unread?'<span class="badge bg-danger rounded-pill">'+t.unread+'</span>':''}
                </div>`;
            a.addEventListener('click', () => openThread(t.id));
            threadListEl.appendChild(a);
        });
    }

    function openThread(id) {
        const thread = threads.find(t=>t.id===id);
        if (!thread) return;
        activeId = id;
        thread.unread = 0;
        titleEl.textContent = thread.subject;
        metaEl.textContent = thread.participants.join(', ');
        replyInput.disabled = false; replySendBtn.disabled = false; starBtn.disabled=false; delBtn.disabled=false;
        starBtn.classList.toggle('btn-warning', thread.starred);
        renderMessages(thread);
        renderThreads(currentFilter, threadSearch.value);
    }

    function renderMessages(thread) {
        messageListEl.innerHTML = thread.messages.map(m => `
            <div class="mb-2 ${m.from==='You'?'text-end':''}">
                <div class="d-inline-block px-3 py-2 rounded ${m.from==='You'?'bg-primary text-white':'bg-white border'}" style="max-width:75%">
                    <div class="small fw-semibold">${m.from}</div>
                    <div>${m.body}</div>
                    <div class="text-muted mt-1" style="font-size:10px">${tsLabel(m.ts)}</div>
                </div>
            </div>`).join('');
        messageListEl.scrollTop = messageListEl.scrollHeight;
    }

    document.getElementById('replyForm').addEventListener('submit', e => {
        e.preventDefault();
        const body = replyInput.value.trim();
        if (!body) return;
        const thread = threads.find(t=>t.id===activeId);
        thread.messages.push({from:'You', body, ts: Date.now()});
        replyInput.value='';
        renderMessages(thread);
        UIUtils.showToast('Message sent','success');
    });

    sendComposeBtn.addEventListener('click', () => {
        const subject = document.getElementById('composeSubject').value.trim();
        const body = document.getElementById('composeBody').value.trim();
        const to = document.getElementById('composeTo').value.trim() || 'Recipient';
        if (!subject || !body) return;
        const newThread = { id: Date.now(), subject, participants: [to, 'You'], messages: [{from:'You', body, ts: Date.now()}], unread:0, starred:false };
        threads.unshift(newThread);
        bootstrap.Modal.getInstance(document.getElementById('composeModal')).hide();
        composeForm.reset();
        renderThreads();
        openThread(newThread.id);
        UIUtils.showToast('Conversation started','primary');
    });

    starBtn.addEventListener('click', () => {
        const t = threads.find(x=>x.id===activeId); if (!t) return; t.starred=!t.starred; starBtn.classList.toggle('btn-warning', t.starred); renderThreads(currentFilter, threadSearch.value);
    });
    delBtn.addEventListener('click', async () => {
        if (!activeId) return;
        const ok = await UIUtils.confirm({title:'Delete Conversation', body:'This will remove the entire conversation.'});
        if (ok) {
            threads = threads.filter(t=>t.id!==activeId);
            activeId=null; titleEl.textContent='Select a conversation'; metaEl.textContent=''; replyInput.disabled=true; replySendBtn.disabled=true; starBtn.disabled=true; delBtn.disabled=true; messageListEl.innerHTML=''; renderThreads(currentFilter, threadSearch.value); UIUtils.showToast('Conversation deleted','danger');
        }
    });

    let currentFilter='all';
    document.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => {currentFilter=btn.getAttribute('data-filter'); renderThreads(currentFilter, threadSearch.value);}));
    threadSearch.addEventListener('input', () => renderThreads(currentFilter, threadSearch.value));
    renderThreads();
});
