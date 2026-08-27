/* ═══════════════════════════════════════════════
   MEDI JOINTS — Patient Arrival (H05)
   ═══════════════════════════════════════════════ */

window.PatientArrival = (function() {
    function render() {
        const hId = MediJointsStore.getState().demoHospitalId;
        const hospital = MediJointsStore.getHospital(hId);
        const reservations = MediJointsStore.getReservations().filter(r => r.hospitalId === hId && (r.status === 'confirmed' || r.status === 'accepted'));
        const sosIncidents = MediJointsStore.getSOSIncidents().filter(s => s.acceptedHospitalId === hId);

        const arrivals = [
            ...reservations.map(r => ({ type: 'reservation', id: r.id, patient: r.patientName, need: r.category, eta: r.eta, status: r.status, time: r.createdAt })),
            ...sosIncidents.map(s => ({ type: 'sos', id: s.id, patient: s.patientName, need: s.condition, eta: hospital?.eta || 15, status: s.status, time: s.createdAt }))
        ].sort((a, b) => b.time - a.time);

        return `<div class="page-container" style="max-width:900px">
            <div class="page-header">
                <div><h2>🚶 Patient Arrivals</h2><p class="page-subtitle">${arrivals.length} expected arrival(s)</p></div>
            </div>
            ${arrivals.length === 0 ?
                `<div class="card">${UI.emptyState('🚶', 'No Expected Arrivals', 'Accept a reservation or SOS to see arrivals here')}</div>` :
                arrivals.map((a, i) => `
                    <div class="card card-elevated animate-fade-in-up stagger-${Math.min(i+1, 5)}" style="margin-bottom:var(--space-4);border-left:4px solid ${a.type === 'sos' ? 'var(--color-critical)' : 'var(--color-accent)'}">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3)">
                            <div style="display:flex;align-items:center;gap:var(--space-2)">
                                <span class="badge badge-${a.type === 'sos' ? 'critical' : 'primary'}">${a.type.toUpperCase()}</span>
                                <span class="font-bold">${a.id}</span>
                            </div>
                            <span class="badge badge-${a.status === 'accepted' ? 'available' : 'warning'} badge-dot">${a.status}</span>
                        </div>
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-bottom:var(--space-4)">
                            <div><div class="text-xs text-muted">Patient</div><div class="font-medium">${a.patient}</div></div>
                            <div><div class="text-xs text-muted">Need</div><div class="font-medium">${a.need}</div></div>
                            <div><div class="text-xs text-muted">ETA</div><div class="font-medium">${a.eta} min</div></div>
                        </div>
                        <div style="display:flex;gap:var(--space-3)">
                            <button class="btn btn-success btn-sm" onclick="Toast.show('✅ Ready', 'Bed marked as ready for patient', 'success')">Mark Ready</button>
                            <button class="btn btn-outline btn-sm" onclick="Toast.show('🛏️ Assigned', 'Bed assigned to patient', 'info')">Assign Bed</button>
                        </div>
                    </div>
                `).join('')
            }
        </div>`;
    }
    return { render };
})();
