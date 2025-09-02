// Student attendance page script (prototype)
(function(){
    const records = generateMock();
    const monthSelect = document.getElementById('monthSelect');
    const subjectFilter = document.getElementById('subjectFilter');
    const statusFilter = document.getElementById('statusFilter');
    const studentSearch = null; // placeholder if individual student search needed in future
    const tableWrapper = document.getElementById('attendanceTableWrapper');
    const summaryWrapper = document.getElementById('attendanceSummaryWrapper');

    function generateMock(){
        const today = new Date();
        const monthsBack = 4; // include this + previous 3 months
        const subjects = ['Mathematics','Science','English'];
        const list = [];
        for (let m=0; m<monthsBack; m++) {
            const dt = new Date(today.getFullYear(), today.getMonth()-m, 1);
            const year = dt.getFullYear();
            const month = dt.getMonth();
            const days = new Date(year, month+1, 0).getDate();
            for (let d=1; d<=days; d++) {
                const weekday = new Date(year, month, d).getDay();
                if (weekday===0 || weekday===6) continue; // skip weekends
                const subj = subjects[Math.floor(Math.random()*subjects.length)];
                const statusRand = Math.random();
                let status='Present';
                if (statusRand>0.92) status='Absent'; else if (statusRand>0.85) status='Late';
                list.push({date: new Date(year, month, d), subject: subj, status, remarks: status==='Late'?'Arrived 10m late':''});
            }
        }
        return list.sort((a,b)=>b.date-a.date);
    }

    function initMonths(){
        const uniqueMonths = [...new Set(records.map(r=> r.date.getFullYear()+ '-' + r.date.getMonth()))];
        uniqueMonths.sort((a,b)=> b.localeCompare(a));
        monthSelect.innerHTML = uniqueMonths.map(val => {
            const [y,m] = val.split('-').map(Number);
            const label = new Date(y,m).toLocaleDateString(undefined,{month:'long', year:'numeric'});
            return `<option value="${val}">${label}</option>`;
        }).join('');
        if (uniqueMonths[0]) monthSelect.value = uniqueMonths[0];
    }

    function formatDate(d){return d.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});}    

    function render(){
        const monthVal = monthSelect.value;
        const subjVal = subjectFilter.value;
        const statusVal = statusFilter.value;
        const filtered = records.filter(r => {
            const key = r.date.getFullYear()+ '-' + r.date.getMonth();
            if (monthVal && key!==monthVal) return false;
            if (subjVal && r.subject!==subjVal) return false;
            if (statusVal && r.status!==statusVal) return false;
            return true;
        });
        updateStats();
        if (!filtered.length){
            tableWrapper.innerHTML = document.getElementById('emptyStateTemplate').innerHTML;
            return;
        }
        tableWrapper.innerHTML = `<table class="table table-hover"><thead><tr><th>Date</th><th>Subject</th><th>Status</th><th>Remarks</th><th></th></tr></thead><tbody>${filtered.map(r=>`<tr><td>${formatDate(r.date)}</td><td>${r.subject}</td><td>${badgeFor(r.status)}</td><td>${r.remarks||''}</td><td><button class='btn btn-sm btn-outline-primary' data-date='${r.date.toISOString()}'><i class='fas fa-eye'></i></button></td></tr>`).join('')}</tbody></table>`;
    }

    function badgeFor(status){
        const map={Present:'success',Absent:'danger',Late:'warning'};return `<span class='badge bg-${map[status]||'secondary'}'>${status}</span>`;
    }

    function updateStats(){
        const overallPct = (records.filter(r=>r.status==='Present').length / records.length * 100).toFixed(1);
        document.getElementById('overallPct').textContent = (isNaN(overallPct)?'--':overallPct)+'%';
        const selMonth = monthSelect.value;
        if (selMonth){
            const monthRecords = records.filter(r=> (r.date.getFullYear()+ '-' + r.date.getMonth())===selMonth);
            const monthPct = (monthRecords.filter(r=>r.status==='Present').length / monthRecords.length * 100).toFixed(1);
            document.getElementById('monthPct').textContent = (isNaN(monthPct)?'--':monthPct)+'%';
            const [yy,mm]=selMonth.split('-').map(Number);
            document.getElementById('monthLabel').textContent = new Date(yy,mm).toLocaleDateString(undefined,{month:'long',year:'numeric'});
            document.getElementById('absenceCount').textContent = monthRecords.filter(r=>r.status==='Absent').length;
            document.getElementById('lateCount').textContent = monthRecords.filter(r=>r.status==='Late').length;
        }
    }

    function showDetail(dateISO){
        const rec = records.find(r=> r.date.toISOString()===dateISO);
        if (!rec) return;
        document.getElementById('attendanceDetailBody').innerHTML = `<dl class='row mb-0'>
            <dt class='col-4'>Date</dt><dd class='col-8'>${formatDate(rec.date)}</dd>
            <dt class='col-4'>Subject</dt><dd class='col-8'>${rec.subject}</dd>
            <dt class='col-4'>Status</dt><dd class='col-8'>${badgeFor(rec.status)}</dd>
            <dt class='col-4'>Remarks</dt><dd class='col-8'>${rec.remarks||'<span class="text-muted">None</span>'}</dd>
        </dl>`;
        new bootstrap.Modal('#attendanceDetailModal').show();
    }

    function attachEvents(){
        [monthSelect, subjectFilter, statusFilter].forEach(el=> el.addEventListener('change', render));
        document.getElementById('resetFilters').addEventListener('click', ()=>{subjectFilter.value='';statusFilter.value='';render();});
        tableWrapper.addEventListener('click', e=>{const btn=e.target.closest('button[data-date]'); if(btn) showDetail(btn.getAttribute('data-date'));});
        document.getElementById('viewSummaryBtn').addEventListener('click', ()=> toggleView(false));
        document.getElementById('viewTableBtn').addEventListener('click', ()=> toggleView(true));
        document.getElementById('downloadAttendance').addEventListener('click', exportCSV);
        document.getElementById('attendanceHelp').addEventListener('click', showHelp);
    }

    function toggleView(table=true){
        document.getElementById('viewTableBtn').classList.toggle('active',table);
        document.getElementById('viewSummaryBtn').classList.toggle('active',!table);
        tableWrapper.parentElement.classList.toggle('d-none',!table);
        summaryWrapper.classList.toggle('d-none',table);
        if (!table) renderSummary();
    }

    function renderSummary(){
        const selMonth = monthSelect.value;
        const monthRecords = records.filter(r=> (r.date.getFullYear()+ '-' + r.date.getMonth())===selMonth);
        const subjects = [...new Set(monthRecords.map(r=>r.subject))];
        const container = document.getElementById('summaryProgress');
        container.innerHTML = subjects.map(sub=>{
            const list = monthRecords.filter(r=>r.subject===sub);
            const pct = (list.filter(r=>r.status==='Present').length / list.length * 100).toFixed(1);
            return `<div class='col-md-4'><div class='card h-100'><div class='card-body'><h6>${sub}</h6><div class='progress mb-2' style='height:8px'><div class='progress-bar' style='width:${pct}%' aria-valuenow='${pct}'></div></div><small>${pct}% present (${list.length} sessions)</small></div></div></div>`;
        }).join('');
    }

    function exportCSV(){
        const rows = [['Date','Subject','Status','Remarks']];
        records.forEach(r=> rows.push([r.date.toISOString().split('T')[0], r.subject, r.status, r.remarks||'']));
        const csv = rows.map(r=> r.map(v=>`"${v.replace(/"/g,'""')}"`).join(',')).join('\n');
        const blob = new Blob([csv],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='attendance.csv'; a.click();
    }

    function showHelp(){
        const modal=document.createElement('div'); modal.className='modal fade'; modal.innerHTML=`<div class='modal-dialog'><div class='modal-content'><div class='modal-header'><h5 class='modal-title'>Attendance Help</h5><button class='btn-close' data-bs-dismiss='modal'></button></div><div class='modal-body small'><p>This page shows your daily attendance records per subject. Use filters to refine the view or switch to summary analytics.</p><ul><li>Late arrivals count toward presence but are highlighted.</li><li>Download exports a CSV for personal tracking.</li><li>Data is mock for prototype purposes.</li></ul></div><div class='modal-footer'><button class='btn btn-primary' data-bs-dismiss='modal'>Close</button></div></div></div>`; document.body.appendChild(modal); const inst=new bootstrap.Modal(modal); inst.show(); modal.addEventListener('hidden.bs.modal',()=>modal.remove());
    }

    initMonths();
    attachEvents();
    render();
})();
