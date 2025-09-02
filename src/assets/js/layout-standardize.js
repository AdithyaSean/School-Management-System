// Prototype layout normalization & gap-fill helpers
// Ensures: consistent notification trigger buttons, activity log access, empty states, status badges
document.addEventListener('DOMContentLoaded', () => {
  // Normalize notification triggers: wrap lone bell icons in button if needed
  document.querySelectorAll('i.fa-bell').forEach(icon => {
    if (!icon.closest('.notification-trigger')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-outline-secondary btn-sm notification-trigger position-relative';
      icon.parentNode.insertBefore(btn, icon);
      btn.appendChild(icon);
      // Move sibling badge if present
      const badge = btn.parentElement.querySelector('.notification-badge');
      if (badge && !btn.contains(badge)) btn.appendChild(badge);
    }
  });

  // Add activity log trigger if missing in dashboard headers
  const header = document.querySelector('.main-content .container-fluid > .d-flex, .container > .d-flex');
  if (header && !header.querySelector('.activity-log-trigger')) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-secondary btn-sm activity-log-trigger';
    btn.innerHTML = '<i class="fas fa-list"></i>';
    header.querySelector('.d-flex.align-items-center, .d-flex.gap-2, .d-flex.gap-3')?.appendChild(btn);
  }

  // Empty state utility: any table/list with data-empty-state & no rows/items
  document.querySelectorAll('[data-empty-state]').forEach(el => {
    const state = el.getAttribute('data-empty-state');
    let hasContent = false;
    if (el.matches('table')) {
      hasContent = el.querySelector('tbody tr');
      if (!hasContent) {
        const tbody = el.querySelector('tbody') || el.appendChild(document.createElement('tbody'));
        const cols = el.querySelectorAll('thead th').length || 1;
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = cols;
        td.className = 'text-center text-muted py-4';
        td.innerHTML = `<div class="small">${state}</div>`;
        tr.appendChild(td);
        tbody.appendChild(tr);
      }
    } else if (el.matches('.list-group')) {
      hasContent = el.querySelector('.list-group-item');
      if (!hasContent) {
        const div = document.createElement('div');
        div.className = 'list-group-item text-center text-muted';
        div.textContent = state;
        el.appendChild(div);
      }
    }
  });

  // Add logout confirmation (prototype) for links with .logout-link
  document.querySelectorAll('a.logout-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      if (window.UIUtils) {
        UIUtils.confirm({title:'Logout', body:'End your session?', confirmText:'Logout', confirmBtnClass:'btn-danger'})
          .then(ok => { if (ok) window.location.href = link.getAttribute('href'); });
      } else {
        if (confirm('Logout?')) window.location.href = link.getAttribute('href');
      }
    });
  });
});
