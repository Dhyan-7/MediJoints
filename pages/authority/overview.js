/* ═══════════════════════════════════════════════
   MEDI JOINTS — Authority Overview (A01)
   ═══════════════════════════════════════════════ */

window.AuthorityOverview = (function() {
    function render() {
        const hospitals = MediJointsStore.getHospitals();
        const onlineCount = hospitals.filter(h => h.status !== 'offline').length;
        const totalAvail = MediJointsStore.getTotalBeds();
        const icuAvail = MediJointsStore.getTotalBeds('ICU');
        const activeSOSCount = MediJointsStore.getActiveSOSCount();
        const staleCount = MediJointsStore.getStaleHospitals().length;
        const activity = MediJointsStore.getActivityFeed();

        return `<div class="page-container">
            <div class="page-header">
                <div>
                    <h2>🏛️ Authority Dashboard</h2>
                    <p class="page-subtitle">Bengaluru Healthcare Network — Real-time Overview</p>
                </div>
                <div style="display:flex;gap:var(--space-2)">
                    <span class="badge badge-available badge-dot">Live</span>
                    <span class="badge badge-primary">${hospitals.length} Hospitals</span>
                </div>
            </div>

            <!-- KPIs -->
            <div class="dashboard-grid-5" style="margin-bottom:var(--space-6)">
                ${UI.kpiCard('Hospitals Online', onlineCount, `of ${hospitals.length} registered`, 'kpi-card-primary')}
                ${UI.kpiCard('Beds Available', totalAvail, 'Across all hospitals', 'kpi-card-success')}
                ${UI.kpiCard('ICU Available', icuAvail, 'Critical care capacity', 'kpi-card-accent')}
                ${UI.kpiCard('Active SOS', activeSOSCount, activeSOSCount > 0 ? 'Requires attention' : 'No active incidents', 'kpi-card-critical')}
                ${UI.kpiCard('Stale Data', staleCount, staleCount > 0 ? 'Hospitals need update' : 'All data fresh', 'kpi-card-warning')}
            </div>

            <div class="dashboard-grid-2-1" style="display:grid;grid-template-columns:2fr 1fr;gap:var(--space-6)">
                <div style="display:flex;flex-direction:column;gap:var(--space-6)">
                    <!-- Network Map Preview -->
                    ${UI.sectionCard('🌐 Network Capacity Map', `
                        <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:var(--space-3)">
                            ${hospitals.map(h => {
                                const totalA = Object.values(h.beds).reduce((s, b) => s + b.available, 0);
                                const totalT = Object.values(h.beds).reduce((s, b) => s + b.total, 0);
                                const pct = totalT > 0 ? Math.round((totalA / totalT) * 100) : 0;
                                const bgColor = h.status === 'available' ? 'var(--color-success-light)' :
                                               h.status === 'limited' ? 'var(--color-warning-light)' :
                                               h.status === 'critical' ? 'var(--color-critical-light)' : '#f1f5f9';
                                return `<div style="padding:var(--space-3);background:${bgColor};border-radius:var(--radius-md);cursor:pointer" onclick="window.MediJoints.navigateTo('/authority/network')">
                                    <div class="font-medium text-sm">${h.name.split(' ').slice(0,2).join(' ')}</div>
                                    <div class="text-xs text-muted">${h.area}</div>
                                    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:var(--space-2)">
                                        <span class="font-bold">${totalA}/${totalT}</span>
                                        ${UI.statusBadge(h.status)}
                                    </div>
                                </div>`;
                            }).join('')}
                        </div>
                    `, `<button class="btn btn-ghost btn-sm" onclick="window.MediJoints.navigateTo('/authority/network')">Open Full Map →</button>`)}

                    <!-- Surge Signal -->
                    ${UI.sectionCard('📈 Surge & Crisis Signal', `
                        <div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-4);background:var(--color-warning-light);border-radius:var(--radius-md);margin-bottom:var(--space-4)">
                            <span style="font-size:var(--font-size-xl)">⚠️</span>
                            <div>
                                <div class="font-semibold" style="color:var(--color-warning)">Medium Surge Risk — Whitefield</div>
                                <div class="text-sm text-muted">ICU capacity at 0% at Starlight Multi-Specialty. General ward at 75% occupancy.</div>
                            </div>
                        </div>
                        <div class="text-sm text-muted">Contributing signals: Hospital at capacity, elevated admission rate in the area</div>
                    `, `<button class="btn btn-ghost btn-sm" onclick="window.MediJoints.navigateTo('/authority/surge')">View Details →</button>`)}
                </div>

                <!-- Activity Feed -->
                <div>
                    ${UI.sectionCard('📊 Activity Feed', `
                        ${activity.length > 0 ? activity.slice(0, 10).map(a => `
                            <div style="display:flex;align-items:flex-start;gap:var(--space-2);padding:var(--space-2) 0;border-bottom:1px solid var(--color-border-light)">
                                <span style="font-size:var(--font-size-sm)">${
                                    a.type.includes('sos') ? '🚨' : a.type.includes('reservation') ? '📋' : a.type.includes('bed') ? '🛏️' : '📊'
                                }</span>
                                <div>
                                    <div class="text-sm">${a.message}</div>
                                    <div class="text-xs text-light">${UI.timeAgo(a.timestamp)}</div>
                                </div>
                            </div>
                        `).join('') : '<div class="text-sm text-muted" style="padding:var(--space-4);text-align:center">No activity yet. Interact with the demo to see events here.</div>'}
                    `)}
                </div>
            </div>
        </div>`;
    }
    return { render };
})();
