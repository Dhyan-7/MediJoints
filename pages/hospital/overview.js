/* ═══════════════════════════════════════════════
   MEDI JOINTS — Hospital Overview (H01)
   ═══════════════════════════════════════════════ */

window.HospitalOverview = (function() {

    // Listen to triage request alerts
    EventBus.on('triage.requested', () => {
        if (MediJointsStore.getCurrentRole() === 'hospital') {
            Toast.show('🚨 Incoming Call', 'Admittance Triage Screening Request from patient', 'critical');
            window.MediJoints.refreshPage();
        }
    });

    function joinTriageCall() {
        const call = MediJointsStore.getActiveTriageCall();
        if (call) {
            call.status = 'approved';
        }
        EventBus.emit('triage.approved');
        Toast.show('✓ Approved', 'Admission approved for patient', 'success');
        window.MediJoints.refreshPage();
    }

    function render() {
        const hId = MediJointsStore.getState().demoHospitalId;
        const hospital = MediJointsStore.getHospital(hId);
        if (!hospital) return '';
        const totalAvail = Object.values(hospital.beds).reduce((s, b) => s + b.available, 0);
        const totalReserved = Object.values(hospital.beds).reduce((s, b) => s + b.reserved, 0);
        const totalOccupied = Object.values(hospital.beds).reduce((s, b) => s + b.occupied, 0);
        const totalBeds = Object.values(hospital.beds).reduce((s, b) => s + b.total, 0);
        const reservations = MediJointsStore.getReservations().filter(r => r.hospitalId === hId);
        const sosAlerts = MediJointsStore.getSOSIncidents().filter(s => s.rankedHospitals.some(r => r.hospital.id === hId));

        const triageCall = MediJointsStore.getActiveTriageCall();
        let triageCallSection = '';
        if (triageCall && triageCall.hospitalId === hId && triageCall.status === 'requested') {
            triageCallSection = `
                <div class="card card-elevated animate-pulse" style="border: 2px solid var(--color-critical); background: rgba(var(--color-critical-rgb), 0.02); margin-bottom: var(--space-6); padding: var(--space-4)">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-4)">
                        <div style="display:flex; align-items:center; gap:var(--space-3)">
                            <span style="font-size:2.5rem">📞</span>
                            <div>
                                <h4 style="color:var(--color-critical); margin-bottom:2px">Incoming Triage Admittance Call</h4>
                                <p class="text-sm text-muted">Patient: <strong>${triageCall.patientName}</strong> requesting ICU admittance check</p>
                            </div>
                        </div>
                        <button class="btn btn-critical btn-md animate-heartbeat" onclick="window.HospitalOverview.joinTriageCall()">
                            Join & Approve Admission
                        </button>
                    </div>
                </div>
            `;
        }

        return `<div class="page-container">
            ${triageCallSection}
            <div class="page-header">
                <div>
                    <h2>🏥 ${hospital.name}</h2>
                    <p class="page-subtitle">${hospital.area}, Bengaluru • ${hospital.type}</p>
                </div>
                <div style="display:flex;align-items:center;gap:var(--space-3)">
                    ${UI.freshnessIndicator(hospital.lastUpdated)}
                    ${UI.statusBadge(hospital.status)}
                </div>
            </div>

            <!-- KPIs -->
            <div class="dashboard-grid-5" style="margin-bottom:var(--space-6)">
                ${UI.kpiCard('Total Beds', totalBeds, 'Across all categories', 'kpi-card-primary')}
                ${UI.kpiCard('Available', totalAvail, `${Math.round(totalAvail/totalBeds*100)}% capacity`, 'kpi-card-success')}
                ${UI.kpiCard('Reserved', totalReserved, 'Active reservations', 'kpi-card-accent')}
                ${UI.kpiCard('Occupied', totalOccupied, 'Currently in use', 'kpi-card-warning')}
                ${UI.kpiCard('SOS Alerts', sosAlerts.filter(s => s.status !== 'resolved').length, 'Pending response', 'kpi-card-critical')}
            </div>

            <div class="dashboard-grid-2-1" style="display:grid;grid-template-columns:2fr 1fr;gap:var(--space-6)">
                <!-- Left: Bed Status -->
                <div>
                    ${UI.sectionCard('🛏️ Live Bed Status', `
                        ${UI.bedMatrix(hospital.beds, false)}
                        ${UI.availabilityBar(totalAvail, totalBeds)}
                        <div style="text-align:center;margin-top:var(--space-3)">
                            <button class="btn btn-primary" onclick="window.MediJoints.navigateTo('/hospital/beds')">Update Beds →</button>
                        </div>
                    `)}
                </div>

                <!-- Right: Activity -->
                <div style="display:flex;flex-direction:column;gap:var(--space-6)">
                    <!-- Incoming Reservations -->
                    ${UI.sectionCard('📋 Incoming Reservations', 
                        reservations.length > 0 ? reservations.slice(0, 3).map(r => `
                            <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) 0;border-bottom:1px solid var(--color-border-light)">
                                <div>
                                    <div class="font-medium text-sm">${r.patientName}</div>
                                    <div class="text-xs text-muted">${r.category} • ETA: ${r.eta} min</div>
                                </div>
                                <span class="badge badge-${r.status === 'confirmed' ? 'available' : 'primary'} badge-dot">${r.status}</span>
                            </div>
                        `).join('') : '<div class="text-sm text-muted" style="padding:var(--space-4);text-align:center">No incoming reservations. Create one from the Patient view.</div>',
                        `<button class="btn btn-ghost btn-sm" onclick="window.MediJoints.navigateTo('/hospital/reservations')">View All</button>`
                    )}

                    <!-- SOS Alerts -->
                    ${UI.sectionCard('🚨 SOS Alerts',
                        sosAlerts.length > 0 ? sosAlerts.slice(0, 2).map(s => `
                            <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) 0;border-bottom:1px solid var(--color-border-light)">
                                <div>
                                    <div class="font-medium text-sm">${s.condition}</div>
                                    <div class="text-xs text-muted">${s.location} • ${UI.timeAgo(s.createdAt)}</div>
                                </div>
                                <span class="badge badge-critical badge-dot">${s.status}</span>
                            </div>
                        `).join('') : '<div class="text-sm text-muted" style="padding:var(--space-4);text-align:center">No active SOS alerts.</div>',
                        `<button class="btn btn-ghost btn-sm" onclick="window.MediJoints.navigateTo('/hospital/sos')">View All</button>`
                    )}
                </div>
            </div>
        </div>`;
    }
    return { render, joinTriageCall };
})();
