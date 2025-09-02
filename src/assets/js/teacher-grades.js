// Teacher gradebook page script (prototype)
(function(){
    const data = generateMock();
    let weighting = {assessments:40, exams:60};

    const tableWrapper = document.getElementById('gradeTableWrapper');
    const analyticsWrapper = document.getElementById('gradeAnalyticsWrapper');

    const filters = {
        class: document.getElementById('classFilter'),
        subject: document.getElementById('subjectFilter'),
        type: document.getElementById('typeFilter'),
        status: document.getElementById('statusFilter'),
        student: document.getElementById('studentSearch')
    };

    function generateMock(){
        const students10A = ['Alice','Bob','Charlie','Diana','Evan'];
        const students11B = ['Fiona','George','Hannah','Ian','Jane'];
        const students9C = ['Kyle','Liam','Mia','Nina','Owen'];
        const classes = [ ['10A',students10A], ['11B',students11B], ['9C',students9C] ];
        const subjects = ['Mathematics','Science','English'];
        const list = [];
        classes.forEach(([cls, studs])=>{
            subjects.forEach(sub=>{
                // assessments
                for(let i=1;i<=3;i++){
                    studs.forEach(stu=>{
                        const statusRand=Math.random();
                        const status = statusRand>0.9? 'pending': (statusRand>0.2?'graded':'published');
                        const score = status==='pending'? null : Math.floor(50+Math.random()*50);
                        list.push({id:crypto.randomUUID(), class:cls, student:stu, subject:sub, type:'assessment', item:`${sub} A${i}`, max:100, score, status, date:new Date(2025,3,i+5)});
                    });
                }
                // exams
                studs.forEach(stu=>{
                    const statusRand=Math.random();
                    const status = statusRand>0.85? 'pending': (statusRand>0.3?'graded':'published');
                    const score = status==='pending'? null : Math.floor(40+Math.random()*60);
                    list.push({id:crypto.randomUUID(), class:cls, student:stu, subject:sub, type:'exam', item:`${sub} Midterm`, max:100, score, status, date:new Date(2025,3,20)});
                });
            });
        });
        return list;
    }

    function applyFilters(){
        return data.filter(r=>{
            if (filters.class.value && r.class!==filters.class.value) return false;
            if (filters.subject.value && r.subject!==filters.subject.value) return false;
            if (filters.type.value && r.type!==filters.type.value) return false;
            if (filters.status.value && r.status!==filters.status.value) return false;
            if (filters.student && filters.student.value && !r.student.toLowerCase().includes(filters.student.value.toLowerCase())) return false;
            return true;
        });
    }

    function renderTable(){
        const rows = applyFilters();
        if (!rows.length){
            tableWrapper.innerHTML = document.getElementById('emptyGradesTemplate').innerHTML;
            return;
        }
        tableWrapper.innerHTML = `<table class="table table-sm table-hover align-middle"><thead><tr><th>Student</th><th>Class</th><th>Subject</th><th>Type</th><th>Item</th><th>Score</th><th>Status</th><th>Date</th><th></th></tr></thead><tbody>${rows.map(r=>`<tr data-id='${r.id}'><td>${r.student}</td><td>${r.class}</td><td>${r.subject}</td><td>${badgeType(r.type)}</td><td>${r.item}</td><td>${r.score==null? '<span class=\'text-muted\'>--</span>' : r.score}</td><td>${badgeStatus(r.status)}</td><td>${r.date.toLocaleDateString()}</td><td><div class='btn-group btn-group-sm'><button class='btn btn-outline-primary edit-grade' ${r.score==null?'':'data-can-edit="1"'}><i class='fas fa-edit'></i></button></div></td></tr>`).join('')}</tbody></table>`;
    }

    function badgeStatus(st){
        const map={pending:'warning', graded:'secondary', published:'success'}; return `<span class='badge bg-${map[st]||'primary'} text-uppercase'>${st}</span>`;
    }
    function badgeType(t){ const map={assessment:'info', exam:'dark'}; return `<span class='badge bg-${map[t]||'secondary'}'>${t}</span>`; }

    function updateSummary(){
        const graded = data.filter(r=> r.score!=null);
        const avg = graded.reduce((a,b)=>a+b.score,0)/graded.length || 0;
        document.getElementById('avgAll').textContent = avg.toFixed(1)+'%';
        const published = data.filter(r=> r.status==='published');
        const pass = published.filter(r=> r.score>=50).length / (published.length||1) * 100;
        document.getElementById('passRate').textContent = pass.toFixed(0)+'%';
        document.getElementById('pendingAssessments').textContent = data.filter(r=> r.type==='assessment' && r.status==='pending').length;
        document.getElementById('pendingExams').textContent = data.filter(r=> r.type==='exam' && r.status==='pending').length;
    }

    function attachEvents(){
        Object.values(filters).forEach(el=> el && el.addEventListener('input', renderTable));
        document.getElementById('resetFilters').addEventListener('click', ()=>{Object.values(filters).forEach(el=>{if(!el) return; if (el.tagName==='SELECT') el.value=''; else el.value='';}); renderTable();});
        tableWrapper.addEventListener('click', e=>{
            const btn = e.target.closest('.edit-grade');
            if (!btn) return;
            const tr = btn.closest('tr');
            const rec = data.find(r=> r.id===tr.dataset.id);
            if (!rec) return;
            openEdit(rec);
        });
        document.getElementById('viewAnalytics').addEventListener('click', ()=>toggleView(false));
        document.getElementById('viewGradesTable').addEventListener('click', ()=>toggleView(true));
        document.getElementById('exportGrades').addEventListener('click', exportCSV);
        document.getElementById('openWeighting').addEventListener('click', ()=> new bootstrap.Modal('#weightingModal').show());
        document.getElementById('saveWeighting').addEventListener('click', saveWeighting);
    }

    function toggleView(table=true){
        document.getElementById('viewGradesTable').classList.toggle('active',table);
        document.getElementById('viewAnalytics').classList.toggle('active',!table);
        tableWrapper.parentElement.classList.toggle('d-none',!table);
        analyticsWrapper.classList.toggle('d-none',table);
        if (!table) renderAnalytics();
    }

    function openEdit(rec){
        document.getElementById('gradeStudent').value = rec.student;
        document.getElementById('gradeItem').value = rec.item;
        document.getElementById('gradeScore').value = rec.score==null? '' : rec.score;
        document.getElementById('gradeStatus').value = rec.status;
        const modal = new bootstrap.Modal('#editGradeModal');
        modal.show();
        document.getElementById('saveGradeBtn').onclick = function(){
            const scoreEl=document.getElementById('gradeScore');
            const v = scoreEl.value===''? null : Number(scoreEl.value);
            if (v!=null && (v<0||v>100)){scoreEl.reportValidity();return;}
            rec.score = v; rec.status = document.getElementById('gradeStatus').value;
            renderTable(); updateSummary(); modal.hide();
            UIUtils && UIUtils.showToast('Grade updated','success');
        };
    }

    function exportCSV(){
        const rows=[['Student','Class','Subject','Type','Item','Score','Status','Date']];
        applyFilters().forEach(r=> rows.push([r.student,r.class,r.subject,r.type,r.item,r.score==null?'':r.score,r.status,r.date.toISOString().split('T')[0]]));
        const csv=rows.map(r=> r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
        const blob=new Blob([csv],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='grades.csv'; a.click();
    }

    function saveWeighting(){
        const a = Number(document.getElementById('weightAssessments').value||0);
        const e = Number(document.getElementById('weightExams').value||0);
        if (a+e!==100){
            UIUtils && UIUtils.showToast('Weights must total 100%','danger');
            return;
        }
        weighting.assessments=a; weighting.exams=e; UIUtils && UIUtils.showToast('Weighting saved','success');
        bootstrap.Modal.getInstance(document.getElementById('weightingModal')).hide();
    }

    // Analytics with Chart.js
    let distChart, trendChart;
    function renderAnalytics(){
        // distribution
        const ctxDist = document.getElementById('gradeDistributionChart');
        const published = data.filter(r=> r.score!=null);
        const buckets = { '90+':0,'80-89':0,'70-79':0,'60-69':0,'<60':0 };
        published.forEach(r=>{const s=r.score; if(s>=90)buckets['90+']++; else if(s>=80)buckets['80-89']++; else if(s>=70)buckets['70-79']++; else if(s>=60)buckets['60-69']++; else buckets['<60']++;});
        if (distChart) distChart.destroy();
        distChart = new Chart(ctxDist,{type:'doughnut', data:{labels:Object.keys(buckets), datasets:[{data:Object.values(buckets), backgroundColor:['#0d6efd','#198754','#ffc107','#0dcaf0','#dc3545']} ]}, options:{plugins:{legend:{position:'bottom'}}}});
        // trend (average assessment vs exam by class)
        const ctxTrend = document.getElementById('gradeTrendChart');
        const classes=[...new Set(data.map(r=>r.class))];
        const assessAvg = classes.map(c=> avg(data.filter(r=> r.class===c && r.type==='assessment' && r.score!=null)) );
        const examAvg = classes.map(c=> avg(data.filter(r=> r.class===c && r.type==='exam' && r.score!=null)) );
        if (trendChart) trendChart.destroy();
        trendChart = new Chart(ctxTrend,{type:'bar', data:{labels:classes, datasets:[{label:'Assessments', data:assessAvg, backgroundColor:'#0d6efd'},{label:'Exams', data:examAvg, backgroundColor:'#198754'}]}, options:{responsive:true, scales:{y:{beginAtZero:true,max:100}}}});
    }
    function avg(arr){return arr.length? (arr.reduce((a,b)=>a+b.score,0)/arr.length).toFixed(1):0;}

    updateSummary();
    renderTable();
    attachEvents();
})();
