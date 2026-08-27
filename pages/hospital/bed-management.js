/* ═══════════════════════════════════════════════
   MEDI JOINTS — Bed Management (H02)
   ═══════════════════════════════════════════════ */

window.BedManagement = (function() {
    function render() {
        const hId = MediJointsStore.getState().demoHospitalId;
        const hospital = MediJointsStore.getHospital(hId);
        if (!hospital) return '';

        return `<div class="page-container" style="max-width:900px">
            <div class="page-header">
                <div>
                    <h2>🛏️ Bed Management</h2>
                    <p class="page-subtitle">Update bed availability for ${hospital.name}</p>
                </div>
                <div style="display:flex;align-items:center;gap:var(--space-3)">
                    ${UI.freshnessIndicator(hospital.lastUpdated)}
                    <button class="btn btn-success btn-lg" onclick="MediJointsStore.publishBedUpdate('${hId}'); window.MediJoints.refreshPage()">
                        📡 Publish Update
                    </button>
                </div>
            </div>

            <div class="card card-elevated animate-fade-in-up">
                <div style="padding:var(--space-3);background:rgba(var(--color-accent-rgb),0.06);border-radius:var(--radius-md);margin-bottom:var(--space-5);display:flex;align-items:center;gap:var(--space-3)">
                    <span>💡</span>
                    <span class="text-sm text-muted">Use the + / − controls to adjust available and occupied counts. Click <strong>Publish Update</strong> to sync changes across the network.</span>
                </div>
                ${UI.bedMatrix(hospital.beds, true, hId)}
            </div>

            <div class="card animate-fade-in-up stagger-2" style="margin-top:var(--space-6)">
                <h4 style="margin-bottom:var(--space-4)">📊 Capacity Overview</h4>
                <div class="chart-bar-container">
                    ${Object.entries(hospital.beds).filter(([,b]) => b.total > 0).map(([cat, b]) => {
                        const pct = b.total > 0 ? Math.round((b.available / b.total) * 100) : 0;
                        const color = pct > 50 ? 'var(--color-success)' : pct > 20 ? 'var(--color-warning)' : 'var(--color-critical)';
                        return `<div class="chart-bar">
                            <div class="chart-bar-value">${pct}%</div>
                            <div class="chart-bar-fill progress-animate" style="height:${Math.max(pct, 5)}%;background:${color};width:100%"></div>
                            <div class="chart-bar-label">${cat}</div>
                        </div>`;
                    }).join('')}
                </div>
            </div>

            <div style="margin-top:var(--space-6);padding:var(--space-4);background:rgba(var(--color-primary-rgb),0.04);border-radius:var(--radius-lg);border-left:3px solid var(--color-primary)">
                <h5 style="margin-bottom:var(--space-2)">🔄 Cross-Role Update</h5>
                <p class="text-sm text-muted">When you publish a bed update, the change propagates instantly to:<br>
                • <strong>Patient Map</strong> — hospital pin color and bed counts change<br>
                • <strong>Authority Dashboard</strong> — network KPIs and capacity table update<br>
                • <strong>Notifications</strong> — all connected stakeholders receive an alert</p>
            </div>
        </div>`;
    }
    return { render };
})();
