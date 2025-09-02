// Sectional Head Dashboard Logic (prototype placeholder)
// Provides mock KPIs, upcoming timetable changes, staff glance, attendance alerts, announcements subset, and quick export.
// Replace mock arrays with API calls / DataService aggregation in future iterations.

document.addEventListener('DOMContentLoaded', () => {
  const staffCountEl = document.getElementById('kpiStaffCount');
  const timetableCountEl = document.getElementById('kpiTimetableCount');
  const pendingCountEl = document.getElementById('kpiPendingCount');
  const upcomingList = document.getElementById('upcomingTimetableList');
  const staffGlanceList = document.getElementById('staffGlanceList');
  const attendanceAlertsList = document.getElementById('attendanceAlertsList');
  const alertBadge = document.getElementById('attendanceAlertBadge');
  const announcementsList = document.getElementById('shAnnouncementsList');
  const refreshChangesBtn = document.getElementById('refreshChangesBtn');
  const exportBtn = document.getElementById('exportSectionBtn');

  // Mock data (session only)
  let staff = [
    { id:1, name:'John Doe', subject:'Math', status:'active' },
    { id:2, name:'Jane Smith', subject:'English', status:'active' },
    { id:3, name:'Alan Turing', subject:'Computing', status:'active' }
  ];
  let timetables = [
    { id:1, class:'10A', effective:'2025-09-05', status:'published' },
    { id:2, class:'10B', effective:'2025-09-07', status:'pending' }
  ];
  let timetableChanges = [
    { id:101, class:'10A', change:'Room change to Lab 2', effective:'2025-09-03' },
    { id:102, class:'10B', change:'Added revision period', effective:'2025-09-04' },
    { id:103, class:'11A', change:'Rescheduled Maths test', effective:'2025-09-06' }
  ];
  let attendanceAlerts = [
    { id:201, class:'10A', todayAttendance:78 },
    { id:202, class:'10B', todayAttendance:81 }
  ];
  let announcements = [
    { id:301, title:'Exam Schedule', msg:'Final exams start 15 Oct', date:'2025-09-01' },
    { id:302, title:'Workshop', msg:'Teacher workshop on Friday', date:'2025-09-01' }
  ];

  function renderKPIs() {
    staffCountEl.textContent = staff.length;
    timetableCountEl.textContent = timetables.filter(t=>t.status==='published').length;
    pendingCountEl.textContent = timetables.filter(t=>t.status==='pending').length;
  }

  function renderUpcoming() {
    upcomingList.innerHTML='';
    if (!timetableChanges.length) { upcomingList.innerHTML='<li class="list-group-item text-muted small">No upcoming changes.</li>'; return; }
    timetableChanges.slice(0,5).forEach(c => {
      const li = document.createElement('li');
      li.className='list-group-item d-flex justify-content-between align-items-start';
      li.innerHTML = `<div><strong>${c.class}</strong>: ${c.change}<br><small class="text-muted">Effective ${c.effective}</small></div>`+
        `<div class="btn-group btn-group-sm"><button class="btn btn-outline-primary" title="Approve" disabled>✓</button><button class="btn btn-outline-secondary" title="Edit" disabled><i class="fas fa-pen"></i></button></div>`;
      upcomingList.appendChild(li);
    });
  }

  function renderStaffGlance() {
    staffGlanceList.innerHTML='';
    staff.slice(0,5).forEach(s => {
      const li = document.createElement('li');
      li.className='list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `<span>${s.name} <small class="text-muted">(${s.subject})</small></span><span class="badge bg-success">${s.status}</span>`;
      staffGlanceList.appendChild(li);
    });
    if (!staff.length) staffGlanceList.innerHTML='<li class="list-group-item text-muted">No staff records.</li>';
  }

  function renderAttendanceAlerts() {
    attendanceAlertsList.innerHTML='';
    if (!attendanceAlerts.length) { attendanceAlertsList.innerHTML='<li class="list-group-item text-muted">No attendance issues.</li>'; alertBadge.style.display='none'; return; }
    attendanceAlerts.forEach(a => {
      const li = document.createElement('li');
      li.className='list-group-item d-flex justify-content-between align-items-start';
      li.innerHTML = `<div><strong>${a.class}</strong> low attendance</div><span class="badge bg-danger">${a.todayAttendance}%</span>`;
      attendanceAlertsList.appendChild(li);
    });
    alertBadge.textContent = attendanceAlerts.length;
    alertBadge.style.display='inline-block';
  }

  function renderAnnouncements() {
    announcementsList.innerHTML='';
    if (!announcements.length) { announcementsList.innerHTML='<div class="p-3 text-center text-muted small">No announcements.</div>'; return; }
    announcements.slice(0,5).forEach(a => {
      const item = document.createElement('div');
      item.className='list-group-item';
      item.innerHTML = `<div class="fw-semibold">${a.title}</div><div>${a.msg}</div><small class="text-muted">${a.date}</small>`;
      announcementsList.appendChild(item);
    });
  }

  refreshChangesBtn?.addEventListener('click', () => {
    UIUtils.showToast('Refreshed timetable changes','info');
    UIUtils.log('Refreshed timetable changes','system');
    renderUpcoming();
  });

  exportBtn?.addEventListener('click', () => {
    const csvRows = ['type,data'];
    csvRows.push('staff_count,'+staff.length);
    csvRows.push('published_timetables,'+timetables.filter(t=>t.status==='published').length);
    csvRows.push('pending_timetables,'+timetables.filter(t=>t.status==='pending').length);
    const blob = new Blob([csvRows.join('\n')], {type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download='section-summary.csv'; a.click(); URL.revokeObjectURL(a.href);
    UIUtils.showToast('Exported section report','success');
    UIUtils.log('Export section summary','report');
  });

  // Initial renders
  renderKPIs();
  renderUpcoming();
  renderStaffGlance();
  renderAttendanceAlerts();
  renderAnnouncements();
});
