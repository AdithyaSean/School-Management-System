// Teacher Reports Center interactions (prototype)
(function(){
    const host = document.getElementById('dynamicModalHost');
    const historyTbody = () => document.querySelector('#reportHistoryTable tbody');
    const history = [];

    const REPORT_DEFS = {
        attendance: {
            title: 'Attendance Report',
            fields: [
                {id:'dateFrom', label:'From Date', type:'date', required:true},
                {id:'dateTo', label:'To Date', type:'date', required:true},
                {id:'class', label:'Class', type:'select', options:['All','Grade 10A','Grade 11B','Grade 9C']},
                {id:'threshold', label:'Low Attendance Threshold (%)', type:'number', value:75}
            ]
        },
        performance: {
            title: 'Performance Report',
            fields: [
                {id:'term', label:'Term', type:'select', options:['Current','Previous','Full Year']},
                {id:'class', label:'Class', type:'select', options:['All','Grade 10A','Grade 11B','Grade 9C']},
                {id:'subject', label:'Subject', type:'select', options:['All','Mathematics','Science','English']},
                {id:'metrics', label:'Metrics', type:'select-multi', options:['Average','Pass Rate','Trend','Top Performers'], value:['Average','Pass Rate']}
            ]
        },
        enrollment: {
            title: 'Enrollment Report',
            fields: [
                {id:'window', label:'Window', type:'select', options:['This Term','This Year','All Time','Custom Range']},
                {id:'dateFrom', label:'From Date', type:'date'},
                {id:'dateTo', label:'To Date', type:'date'}
            ]
        }
    };

    function buildField(f){
        const common = `<label class="form-label">${f.label}${f.required?' *':''}</label>`;
        if (f.type==='select') {
            return `<div class="col-md-6"><div>${common}<select class="form-select form-select-sm" id="${f.id}">${(f.options||[]).map(o=>`<option ${f.value===o?'selected':''}>${o}</option>`).join('')}</select></div></div>`;
        }
        if (f.type==='select-multi') {
            return `<div class="col-12"><div>${common}<select multiple class="form-select" id="${f.id}">${(f.options||[]).map(o=>`<option ${Array.isArray(f.value)&&f.value.includes(o)?'selected':''}>${o}</option>`).join('')}</select><div class="form-text">Ctrl / Cmd click to multi-select.</div></div></div>`;
        }
        return `<div class="col-md-6"><div>${common}<input type="${f.type}" class="form-control form-control-sm" id="${f.id}" ${f.value!=null?`value='${f.value}'`:''} ${f.required?'required':''}></div></div>`;
    }

    function serializeFields(def){
        const data={};
        def.fields.forEach(f=>{
            const el = document.getElementById(f.id);
            if (!el) return;
            if (f.type==='select-multi') data[f.id] = Array.from(el.selectedOptions).map(o=>o.value);
            else data[f.id] = el.value;
        });
        data.format = document.querySelector('input[name=reportFormat]:checked')?.value || 'PDF';
        return data;
    }

    function renderHistory(){
        const tb = historyTbody(); tb.innerHTML='';
        if (!history.length) { tb.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">No reports generated yet.</td></tr>'; return; }
        history.slice().reverse().forEach(item=>{
            const tr=document.createElement('tr');
            tr.innerHTML = `<td class="text-capitalize">${item.type}</td><td><code class="small">${Object.entries(item.filters).filter(([k])=>k!=='format').map(([k,v])=>`${k}:${Array.isArray(v)?v.join('|'):v}`).join(', ')||'-'}</code></td><td>${item.filters.format}</td><td>${new Date(item.ts).toLocaleTimeString()}</td><td>${UIUtils.statusBadge(item.status)}</td><td>${item.blob? `<a href="${URL.createObjectURL(item.blob)}" download="${item.type}-report.${item.filters.format==='CSV'?'csv':'pdf'}" class="btn btn-sm btn-outline-primary">Download</a>`:''}</td>`;
            tb.appendChild(tr);
        });
    }

    function showGeneratingModal(type){
        const wrapper=document.createElement('div');
        wrapper.className='modal fade';
        wrapper.innerHTML=`<div class='modal-dialog modal-dialog-centered'><div class='modal-content'><div class='modal-header'><h5 class='modal-title'>Generating ${type} Report</h5><button class='btn-close' data-bs-dismiss='modal'></button></div><div class='modal-body text-center'><div class='mb-3 spinner-border text-primary'></div><p class='mb-0'>Please wait while we compile data...</p></div></div></div>`;
        host.appendChild(wrapper);
        const m=new bootstrap.Modal(wrapper,{backdrop:'static'}); m.show();
        wrapper.addEventListener('hidden.bs.modal',()=>wrapper.remove());
        return { modal:m, el:wrapper };
    }

    function generateReport(type, filters){
        UIUtils.log(`Started ${type} report generation`,'report');
        const rec = { id:Date.now()+Math.random(), type, filters, ts: Date.now(), status:'pending', blob:null };
        history.push(rec); renderHistory();
        const gen = showGeneratingModal(type);
        setTimeout(()=>{
            // mock CSV content
            const csv = `Report,${type}\nGenerated,${new Date().toISOString()}\nFilters,${JSON.stringify(filters)}`;
            rec.status='graded'; // reuse status badge mapping (graded -> success)
            rec.blob = new Blob([csv], {type:'text/csv'});
            renderHistory();
            UIUtils.showToast('Report ready','success');
            UIUtils.log(`${type} report ready`,'report');
            gen.modal.hide();
        }, 1200 + Math.random()*800);
    }

    function openConfig(type){
        const def = REPORT_DEFS[type]; if (!def) return;
        const wrapper=document.createElement('div');
        wrapper.className='modal fade';
        wrapper.innerHTML = `<div class='modal-dialog modal-lg modal-dialog-scrollable'><div class='modal-content'><form id='reportConfigForm'>
            <div class='modal-header'><h5 class='modal-title'>${def.title} Configuration</h5><button type='button' class='btn-close' data-bs-dismiss='modal'></button></div>
            <div class='modal-body'>
                <div class='row g-3 mb-3'>${def.fields.map(buildField).join('')}</div>
                <div class='row g-3'>
                    <div class='col-md-6'>
                        <label class='form-label'>Output Format</label>
                        <div class='d-flex gap-3'>
                            <div class='form-check'>
                                <input class='form-check-input' type='radio' name='reportFormat' id='fmtPdf' value='PDF' checked>
                                <label for='fmtPdf' class='form-check-label'>PDF</label>
                            </div>
                            <div class='form-check'>
                                <input class='form-check-input' type='radio' name='reportFormat' id='fmtCsv' value='CSV'>
                                <label for='fmtCsv' class='form-check-label'>CSV</label>
                            </div>
                        </div>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label'>Delivery</label>
                        <div class='d-flex gap-3'>
                            <div class='form-check'>
                                <input class='form-check-input' type='checkbox' id='deliverNotify' checked>
                                <label for='deliverNotify' class='form-check-label'>Notify me</label>
                            </div>
                            <div class='form-check'>
                                <input class='form-check-input' type='checkbox' id='deliverLog' checked>
                                <label for='deliverLog' class='form-check-label'>Log activity</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='modal-footer'>
                <button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>Cancel</button>
                <button type='submit' class='btn btn-primary'><i class='fas fa-play me-1'></i>Generate</button>
            </div></form></div></div>`;
        host.appendChild(wrapper);
        const m=new bootstrap.Modal(wrapper); m.show();
        wrapper.addEventListener('hidden.bs.modal',()=>wrapper.remove());
        wrapper.querySelector('#reportConfigForm').addEventListener('submit', e=>{
            e.preventDefault();
            const filters = serializeFields(def);
            if (filters.dateFrom && filters.dateTo && filters.dateFrom>filters.dateTo) { UIUtils.showToast('Invalid date range','danger'); return; }
            m.hide();
            if (document.getElementById('deliverNotify')?.checked) UIUtils.showToast('Generating '+type+' report','info');
            generateReport(type, filters);
        });
    }

    document.getElementById('clearHistoryBtn')?.addEventListener('click', ()=>{ history.length=0; renderHistory(); UIUtils.showToast('History cleared','secondary'); });

    window.ReportCenter = { openConfig };
})();
