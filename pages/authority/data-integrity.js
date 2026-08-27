/* ═══════════════════════════════════════════════
   MEDI JOINTS — Data Integrity (A05)
   ═══════════════════════════════════════════════ */

window.DataIntegrity = (function() {
    function render() {
        const hospitals = MediJointsStore.getHospitals();
        const flags = [
            { hospitalId: 'h6', hospitalName: 'North City Hospital', area: 'Yelahanka', type: 'stale_data', severity: 'high', reason: 'No data update in 24+ hours. Hospital may be offline or unresponsive.', detectedAt: Date.now() - 86400000 },
            { hospitalId: 'h4', hospitalName: 'Starlight Multi-Specialty', area: 'Whitefield', type: 'capacity_anomaly', severity: 'medium', reason: 'ICU at 0% availability for 6+ hours without corresponding admissions record. Possible reporting error.', detectedAt: Date.now() - 21600000 },
            { hospitalId: 'h2', hospitalName: 'Bengaluru Central Medical', area: 'Indiranagar', type: 'stale_data', severity: 'low', reason: 'Last update 15 minutes ago. Approaching stale threshold.', detectedAt: Date.now() - 900000 }
        ];

        return `<div class="page-container" style="max-width:900px">
            <div class="page-header">
                <div><h2>🛡️ Data Integrity</h2><p class="page-subtitle">Monitor data quality and detect anomalies</p></div>
                <span class="badge badge-warning">${flags.length} flags</span>
            </div>

            <!-- Summary -->
            <div class="dashboard-grid-3" style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-bottom:var(--space-6)">
                ${UI.kpiCard('High Severity', flags.filter(f => f.severity === 'high').length, 'Require immediate attention', 'kpi-card-critical')}
                ${UI.kpiCard('Medium Severity', flags.filter(f => f.severity === 'medium').length, 'Monitor closely', 'kpi-card-warning')}
                ${UI.kpiCard('Low Severity', flags.filter(f => f.severity === 'low').length, 'Informational', 'kpi-card-primary')}
            </div>

            ${flags.map((f, i) => `
                <div class="card card-elevated animate-fade-in-up stagger-${i+1}" style="margin-bottom:var(--space-4);border-left:4px solid ${f.severity === 'high' ? 'var(--color-critical)' : f.severity === 'medium' ? 'var(--color-warning)' : 'var(--color-primary)'}">
                    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:var(--space-3)">
                        <div>
                            <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-1)">
                                <span class="font-bold">${f.hospitalName}</span>
                                <span class="text-sm text-muted">${f.area}</span>
                            </div>
                            <span class="badge badge-${f.severity === 'high' ? 'critical' : f.severity === 'medium' ? 'warning' : 'primary'}">${f.severity} severity</span>
                        </div>
                        <span class="badge badge-${f.type === 'stale_data' ? 'warning' : 'critical'}">${f.type.replace('_', ' ')}</span>
                    </div>
                    <p class="text-sm text-muted" style="margin-bottom:var(--space-3)">${f.reason}</p>
                    <div style="display:flex;align-items:center;justify-content:space-between">
                        <span class="text-xs text-light">Detected: ${UI.timeAgo(f.detectedAt)}</span>
                        <div style="display:flex;gap:var(--space-2)">
                            <button class="btn btn-outline btn-sm" onclick="Toast.show('Review', 'Reviewing flag for ${f.hospitalName}', 'info')">Review</button>
                            <button class="btn btn-ghost btn-sm" onclick="Toast.show('Contacted', 'Notification sent to ${f.hospitalName}', 'success')">Contact Hospital</button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>`;
    }
    return { render };
})();
