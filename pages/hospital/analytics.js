/* ═══════════════════════════════════════════════
   MEDI JOINTS — Hospital Analytics (H06)
   ═══════════════════════════════════════════════ */

window.HospitalAnalytics = (function() {
    function render() {
        const hId = MediJointsStore.getState().demoHospitalId;
        const hospital = MediJointsStore.getHospital(hId);
        if (!hospital) return '';
        const totalBeds = Object.values(hospital.beds).reduce((s, b) => s + b.total, 0);
        const totalOccupied = Object.values(hospital.beds).reduce((s, b) => s + b.occupied, 0);
        const utilization = totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 0;

        return `<div class="page-container">
            <div class="page-header">
                <div><h2>📈 Analytics</h2><p class="page-subtitle">Performance insights for ${hospital.name}</p></div>
                <span class="badge badge-primary">Demo Data</span>
            </div>

            <!-- KPIs -->
            <div class="dashboard-grid-4" style="margin-bottom:var(--space-6)">
                ${UI.kpiCard('Utilization Rate', `${utilization}%`, 'Current occupancy', 'kpi-card-primary')}
                ${UI.kpiCard('Avg Response', '4.2 min', 'SOS response time', 'kpi-card-success')}
                ${UI.kpiCard('Reservations', MediJointsStore.getReservations().filter(r => r.hospitalId === hId).length, 'Total this month', 'kpi-card-accent')}
                ${UI.kpiCard('Rating', hospital.rating, 'Patient rating', 'kpi-card-warning')}
            </div>

            <div class="dashboard-grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-6)">
                <!-- Utilization by Category -->
                ${UI.sectionCard('🛏️ Utilization by Category', `
                    <div class="chart-bar-container" style="height:180px">
                        ${Object.entries(hospital.beds).filter(([,b]) => b.total > 0).map(([cat, b]) => {
                            const pct = b.total > 0 ? Math.round((b.occupied / b.total) * 100) : 0;
                            const color = pct > 80 ? 'var(--color-critical)' : pct > 50 ? 'var(--color-warning)' : 'var(--color-success)';
                            return `<div class="chart-bar">
                                <div class="chart-bar-value">${pct}%</div>
                                <div class="chart-bar-fill progress-animate" style="height:${Math.max(pct, 5)}%;background:${color}"></div>
                                <div class="chart-bar-label">${cat}</div>
                            </div>`;
                        }).join('')}
                    </div>
                `)}

                <!-- Peak Hours -->
                ${UI.sectionCard('⏰ Peak Hours (Sample)', `
                    <div class="chart-bar-container" style="height:180px">
                        ${[
                            {h:'6AM',v:20},{h:'8AM',v:45},{h:'10AM',v:78},{h:'12PM',v:65},
                            {h:'2PM',v:55},{h:'4PM',v:70},{h:'6PM',v:82},{h:'8PM',v:60},
                            {h:'10PM',v:35},{h:'12AM',v:15}
                        ].map(d => `
                            <div class="chart-bar">
                                <div class="chart-bar-value">${d.v}%</div>
                                <div class="chart-bar-fill progress-animate" style="height:${d.v}%;background:${d.v > 70 ? 'var(--color-warning)' : 'var(--color-primary)'}"></div>
                                <div class="chart-bar-label">${d.h}</div>
                            </div>
                        `).join('')}
                    </div>
                `)}
            </div>

            <!-- Reservation Trends -->
            <div style="margin-top:var(--space-6)">
                ${UI.sectionCard('📊 Weekly Trends (Sample)', `
                    <div class="chart-bar-container" style="height:160px">
                        ${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => {
                            const v = [12, 18, 15, 22, 28, 14, 8][i];
                            return `<div class="chart-bar">
                                <div class="chart-bar-value">${v}</div>
                                <div class="chart-bar-fill progress-animate" style="height:${(v/28)*100}%;background:var(--color-accent)"></div>
                                <div class="chart-bar-label">${d}</div>
                            </div>`;
                        }).join('')}
                    </div>
                    <div class="text-sm text-muted" style="text-align:center;margin-top:var(--space-3)">Reservations per day</div>
                `)}
            </div>
        </div>`;
    }
    return { render };
})();
