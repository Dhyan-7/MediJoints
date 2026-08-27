/* ═══════════════════════════════════════════════
   MEDI JOINTS — Hospital Reservations (H03)
   ═══════════════════════════════════════════════ */

window.HospitalReservations = (function() {
    function render() {
        const hId = MediJointsStore.getState().demoHospitalId;
        const reservations = MediJointsStore.getReservations().filter(r => r.hospitalId === hId);

        return `<div class="page-container" style="max-width:900px">
            <div class="page-header">
                <div><h2>📋 Reservations</h2><p class="page-subtitle">${reservations.length} reservation(s)</p></div>
            </div>
            ${reservations.length === 0 ?
                `<div class="card">${UI.emptyState('📋', 'No Reservations Yet', 'Switch to Patient view and make a reservation to see it appear here')}</div>` :
                reservations.map((r, i) => `
                    <div class="card card-elevated animate-fade-in-up stagger-${Math.min(i+1, 5)}" style="margin-bottom:var(--space-4)">
                        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:var(--space-4)">
                            <div>
                                <div style="display:flex;align-items:center;gap:var(--space-2)">
                                    <span class="font-bold">${r.id}</span>
                                    <span class="badge badge-${r.status === 'confirmed' ? 'available' : r.status === 'accepted' ? 'primary' : 'warning'} badge-dot">${r.status}</span>
                                </div>
                                <div class="text-sm text-muted" style="margin-top:var(--space-1)">${UI.timeAgo(r.createdAt)}</div>
                            </div>
                        </div>
                        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:var(--space-4);margin-bottom:var(--space-4)">
                            <div><div class="text-xs text-muted">Patient</div><div class="font-medium text-sm">${r.patientName}</div></div>
                            <div><div class="text-xs text-muted">Bed Type</div><div class="font-medium text-sm">${r.category}</div></div>
                            <div><div class="text-xs text-muted">ETA</div><div class="font-medium text-sm">${r.eta} min</div></div>
                            <div><div class="text-xs text-muted">Hold Timer</div><div class="font-medium text-sm" style="color:var(--color-warning)">${UI.countdown(r.expiresAt)}</div></div>
                            <div><div class="text-xs text-muted">Screening Approval</div><div class="font-medium text-sm"><span class="badge badge-available">✓ Doctor Approved</span></div></div>
                        </div>
                        <div style="display:flex;gap:var(--space-3)">
                            ${r.status === 'confirmed' ? `
                                <button class="btn btn-success btn-sm" onclick="MediJointsStore.acceptReservation('${r.id}'); window.MediJoints.refreshPage()">✓ Accept</button>
                                <button class="btn btn-outline btn-sm" onclick="Toast.show('Preparation', 'Marking bed as preparing', 'info')">Prepare Bed</button>
                            ` : `
                                <button class="btn btn-outline btn-sm" onclick="Toast.show('Ready', 'Bed marked as ready', 'success')">Mark Ready</button>
                            `}
                        </div>
                    </div>
                `).join('')
            }
        </div>`;
    }
    return { render };
})();
