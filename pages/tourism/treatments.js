/* ═══════════════════════════════════════════════
   MEDI JOINTS — Treatment Search (M01)
   ═══════════════════════════════════════════════ */

window.TreatmentSearch = (function() {
    function render() {
        const treatments = MediJointsStore.getTreatments();
        return `<div class="page-container">
            <div class="page-header">
                <div>
                    <h2>✈️ Medical Tourism</h2>
                    <p class="page-subtitle">Find world-class treatment at transparent prices</p>
                </div>
            </div>

            <!-- Search -->
            <div class="card card-elevated" style="margin-bottom:var(--space-6);padding:var(--space-5)">
                <div class="search-input" style="margin-bottom:var(--space-4)">
                    <span class="search-icon">🔍</span>
                    <input class="input-field" placeholder="Search treatments: knee replacement, cardiac bypass, IVF...">
                </div>
                <div class="chip-group">
                    <button class="chip active">All</button>
                    <button class="chip">Orthopedics</button>
                    <button class="chip">Cardiology</button>
                    <button class="chip">Oncology</button>
                    <button class="chip">Reproductive</button>
                    <button class="chip">Neurosurgery</button>
                </div>
            </div>

            <!-- Popular Treatments -->
            <h3 style="margin-bottom:var(--space-4)">Popular Procedures</h3>
            <div class="treatment-grid">
                ${treatments.map((t, i) => `
                    <div class="treatment-card animate-fade-in-up stagger-${Math.min(i+1, 6)}" onclick="MediJointsStore.selectTreatment('${t.id}'); window.MediJoints.navigateTo('/tourism/compare')">
                        <div class="treatment-card-image">
                            <span style="font-size:4rem">${t.icon}</span>
                        </div>
                        <div class="treatment-card-body">
                            <h4 style="margin-bottom:var(--space-2)">${t.procedure}</h4>
                            <div class="text-sm text-muted" style="margin-bottom:var(--space-3)">${t.specialty}</div>
                            <div style="display:flex;align-items:center;justify-content:space-between">
                                <span class="text-sm font-medium">${t.hospitals.length} hospital${t.hospitals.length > 1 ? 's' : ''}</span>
                                <span class="text-sm" style="color:var(--color-accent)">${t.hospitals[0]?.cost || ''}</span>
                            </div>
                            <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3)">
                                ${t.hospitals.some(h => h.intlSupport) ? '<span class="badge badge-accent">🌍 Intl. Support</span>' : ''}
                                <span class="badge badge-primary">${t.hospitals.length} options</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Trust Badges -->
            <div style="text-align:center;margin-top:var(--space-10);padding:var(--space-8);background:var(--color-surface);border-radius:var(--radius-xl)">
                <h4 style="margin-bottom:var(--space-4)">Accredited & Verified Hospitals</h4>
                <div style="display:flex;justify-content:center;gap:var(--space-6);flex-wrap:wrap">
                    ${['NABH Accredited', 'JCI Accredited', 'ISO Certified', 'Centre of Excellence', 'Medi Joints Verified'].map(b => `
                        <span class="badge badge-accent" style="font-size:var(--font-size-sm);padding:var(--space-2) var(--space-4)">${b}</span>
                    `).join('')}
                </div>
            </div>
        </div>`;
    }
    return { render };
})();
