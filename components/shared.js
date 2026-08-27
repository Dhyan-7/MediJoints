/* ═══════════════════════════════════════════════
   MEDI JOINTS — Shared UI Components
   Reusable rendering functions
   ═══════════════════════════════════════════════ */

window.UI = (function() {

    function statusBadge(status) {
        const map = {
            available: { class: 'badge-available badge-dot', text: 'Available' },
            limited:   { class: 'badge-limited badge-dot', text: 'Limited' },
            critical:  { class: 'badge-critical badge-dot', text: 'Critical' },
            offline:   { class: 'badge-offline badge-dot', text: 'Offline' }
        };
        const s = map[status] || map.offline;
        return `<span class="badge ${s.class}">${s.text}</span>`;
    }

    function verifiedBadge() {
        return `<span class="badge badge-verified">✓ Verified</span>`;
    }

    function accreditationBadges(accreditations) {
        return accreditations.map(a =>
            `<span class="badge badge-accent">${a}</span>`
        ).join(' ');
    }

    function freshnessIndicator(timestamp) {
        const diff = Date.now() - timestamp;
        const mins = Math.floor(diff / 60000);
        let cls, text;
        if (mins < 10) { cls = 'freshness-fresh'; text = `Updated ${mins} min ago`; }
        else if (mins < 60) { cls = 'freshness-stale'; text = `Updated ${mins} min ago`; }
        else if (mins < 1440) { cls = 'freshness-offline'; text = `Updated ${Math.floor(mins/60)}h ago`; }
        else { cls = 'freshness-offline'; text = 'Not updating'; }
        return `<span class="freshness ${cls}"><span class="freshness-dot"></span>${text}</span>`;
    }

    function bedMatrix(beds, editable, hospitalId) {
        const categories = Object.keys(beds);
        let html = `<div class="bed-matrix">
            <div class="bed-row bed-row-header">
                <div>Category</div><div style="text-align:center">Available</div><div style="text-align:center">Reserved</div><div style="text-align:center">Occupied</div><div style="text-align:center">Total</div>
            </div>`;
        const icons = { General: '🛏️', ICU: '🫀', Ventilator: '💨', Pediatric: '👶', Maternity: '🤰', Isolation: '🔬', Burn: '🔥' };
        categories.forEach(cat => {
            const b = beds[cat];
            if (b.total === 0 && !editable) return;
            html += `<div class="bed-row">
                <div class="bed-category"><span class="bed-category-icon">${icons[cat] || '🛏️'}</span>${cat}</div>
                <div class="bed-count bed-count-available">${editable ? counterControl(hospitalId, cat, 'available', b.available) : b.available}</div>
                <div class="bed-count bed-count-reserved">${b.reserved}</div>
                <div class="bed-count bed-count-occupied">${editable ? counterControl(hospitalId, cat, 'occupied', b.occupied) : b.occupied}</div>
                <div class="bed-count">${b.total}</div>
            </div>`;
        });
        html += '</div>';
        return html;
    }

    function counterControl(hospitalId, category, field, value) {
        return `<div class="counter-control">
            <button class="counter-btn" onclick="MediJointsStore.updateBedCount('${hospitalId}','${category}','${field}',-1); window.MediJoints.refreshPage()">−</button>
            <span class="counter-value">${value}</span>
            <button class="counter-btn" onclick="MediJointsStore.updateBedCount('${hospitalId}','${category}','${field}',1); window.MediJoints.refreshPage()">+</button>
        </div>`;
    }

    function bedChips(beds) {
        const cats = ['ICU', 'General', 'Ventilator'];
        return cats.map(c => {
            const b = beds[c];
            if (!b || b.total === 0) return '';
            const color = b.available > 0 ? (b.available > 2 ? 'var(--color-success)' : 'var(--color-warning)') : 'var(--color-critical)';
            return `<span class="hospital-bed-chip"><span style="color:${color};font-weight:700">${b.available}</span> ${c}</span>`;
        }).join('');
    }

    function availabilityBar(available, total) {
        if (total === 0) return '';
        const pct = Math.round((available / total) * 100);
        const color = pct > 50 ? 'var(--color-success)' : pct > 20 ? 'var(--color-warning)' : 'var(--color-critical)';
        return `<div class="avail-bar"><div class="avail-bar-fill progress-animate" style="width:${pct}%;background:${color}"></div></div>`;
    }

    function kpiCard(label, value, sub, colorClass) {
        return `<div class="kpi-card ${colorClass}">
            <div class="kpi-label">${label}</div>
            <div class="kpi-value count-animate">${value}</div>
            ${sub ? `<div class="kpi-sub">${sub}</div>` : ''}
        </div>`;
    }

    function timeAgo(timestamp) {
        const diff = Date.now() - timestamp;
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        if (mins < 1440) return `${Math.floor(mins/60)}h ago`;
        return `${Math.floor(mins/1440)}d ago`;
    }

    function countdown(expiresAt) {
        const remaining = expiresAt - Date.now();
        if (remaining <= 0) return 'Expired';
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    }

    function ratingStars(rating) {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5 ? 1 : 0;
        const empty = 5 - full - half;
        return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
    }

    function hospitalCard(hospital, onClick) {
        const totalAvail = Object.values(hospital.beds).reduce((s, b) => s + b.available, 0);
        const totalBeds = Object.values(hospital.beds).reduce((s, b) => s + b.total, 0);
        return `<div class="hospital-card" onclick="${onClick || `window.MediJoints.navigateTo('/patient/hospital/${hospital.id}')`}" id="hcard-${hospital.id}">
            <div class="hospital-card-header">
                <div>
                    <div class="hospital-card-name">${hospital.name}</div>
                    <div class="hospital-card-meta">
                        <span>📍 ${hospital.area}</span>
                        <span>📏 ${hospital.distance} km</span>
                        <span>⏱️ ${hospital.eta} min</span>
                        <span>⭐ ${hospital.rating}</span>
                    </div>
                </div>
                <div style="display:flex;gap:var(--space-2);align-items:center">
                    ${hospital.verified ? verifiedBadge() : ''}
                    ${statusBadge(hospital.status)}
                </div>
            </div>
            <div class="hospital-card-beds">${bedChips(hospital.beds)}</div>
            ${availabilityBar(totalAvail, totalBeds)}
            <div class="hospital-card-footer">
                ${freshnessIndicator(hospital.lastUpdated)}
                <div style="display:flex;gap:var(--space-2)">
                    <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); window.MediJoints.navigateTo('/patient/reservation/${hospital.id}')">Reserve</button>
                </div>
            </div>
        </div>`;
    }

    function safetyDisclaimer() {
        return `<div style="display:flex;align-items:flex-start;gap:var(--space-3);padding:var(--space-4);background:rgba(var(--color-accent-rgb),0.06);border-radius:var(--radius-md);margin-top:var(--space-4);border-left:3px solid var(--color-accent)">
            <span style="font-size:var(--font-size-lg)">🛡️</span>
            <div style="font-size:var(--font-size-sm);color:var(--color-text-secondary);line-height:1.6">
                <strong>Safety Notice:</strong> AI assists routing and triage guidance. Medical decisions remain with qualified healthcare professionals. This is not a medical diagnosis.
            </div>
        </div>`;
    }

    function emptyState(icon, title, text) {
        return `<div class="empty-state">
            <div class="empty-state-icon">${icon}</div>
            <div class="empty-state-title">${title}</div>
            <div class="empty-state-text">${text}</div>
        </div>`;
    }

    function sectionCard(title, content, actions) {
        return `<div class="section-card">
            <div class="section-card-header">
                <h4 class="section-card-title">${title}</h4>
                ${actions ? `<div>${actions}</div>` : ''}
            </div>
            <div class="section-card-body">${content}</div>
        </div>`;
    }

    return {
        statusBadge, verifiedBadge, accreditationBadges, freshnessIndicator,
        bedMatrix, bedChips, availabilityBar, kpiCard, timeAgo, countdown,
        ratingStars, hospitalCard, safetyDisclaimer, emptyState, sectionCard,
        counterControl
    };
})();
