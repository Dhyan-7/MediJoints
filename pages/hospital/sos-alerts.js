/* ═══════════════════════════════════════════════
   MEDI JOINTS — Hospital SOS Alerts (H04)
   ═══════════════════════════════════════════════ */

window.HospitalSOSAlerts = (function() {
    function render() {
        const hId = MediJointsStore.getState().demoHospitalId;
        const sosAlerts = MediJointsStore.getSOSIncidents().filter(s =>
            s.rankedHospitals.some(r => r.hospital.id === hId)
        );

        return `<div class="page-container" style="max-width:900px">
            <div class="page-header">
                <div><h2>🚨 SOS Alerts</h2><p class="page-subtitle">${sosAlerts.length} alert(s)</p></div>
            </div>
            ${sosAlerts.length === 0 ?
                `<div class="card">${UI.emptyState('🚨', 'No SOS Alerts', 'Switch to Patient view and trigger an SOS to see it appear here')}</div>` :
                sosAlerts.map((s, i) => `
                    <div class="card card-elevated animate-fade-in-up stagger-${Math.min(i+1, 5)}" style="margin-bottom:var(--space-4);border-left:4px solid var(--color-critical)">
                        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:var(--space-4)">
                            <div>
                                <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-1)">
                                    <span class="font-bold">${s.id}</span>
                                    <span class="badge badge-critical badge-dot animate-pulse">${s.priority.toUpperCase()}</span>
                                </div>
                                <div class="text-sm text-muted">${UI.timeAgo(s.createdAt)}</div>
                            </div>
                            <span class="badge badge-${s.status === 'accepted' ? 'available' : 'critical'} badge-dot">${s.status}</span>
                        </div>
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-bottom:var(--space-4)">
                            <div><div class="text-xs text-muted">Patient</div><div class="font-medium text-sm">${s.patientName}</div></div>
                            <div><div class="text-xs text-muted">Condition</div><div class="font-medium text-sm">${s.condition}</div></div>
                            <div><div class="text-xs text-muted">Location</div><div class="font-medium text-sm">${s.location}</div></div>
                        </div>
                        ${s.status !== 'accepted' ? `
                            <div style="display:flex;gap:var(--space-3)">
                                <button class="btn btn-success" onclick="MediJointsStore.acceptSOS('${s.id}','${hId}'); window.MediJoints.refreshPage()">✓ Accept SOS</button>
                                <button class="btn btn-outline" onclick="Toast.show('Declined', 'SOS declined', 'warning')">Decline</button>
                            </div>
                        ` : `
                            <div style="padding:var(--space-3);background:var(--color-success-light);border-radius:var(--radius-md);font-size:var(--font-size-sm);color:var(--color-success);font-weight:600">
                                ✓ Accepted — Patient has been notified. Prepare for arrival.
                            </div>
                        `}
                    </div>
                `).join('')
            }
        </div>`;
    }
    return { render };
})();
