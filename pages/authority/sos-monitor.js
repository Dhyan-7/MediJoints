/* ═══════════════════════════════════════════════
   MEDI JOINTS — SOS Monitor (A03)
   ═══════════════════════════════════════════════ */

window.SOSMonitor = (function() {
    function render() {
        const incidents = MediJointsStore.getSOSIncidents();
        return `<div class="page-container" style="max-width:900px">
            <div class="page-header">
                <div><h2>🚨 SOS Monitor</h2><p class="page-subtitle">${incidents.length} incident(s) recorded</p></div>
            </div>
            ${incidents.length === 0 ?
                `<div class="card">${UI.emptyState('🚨', 'No SOS Incidents', 'Trigger an SOS from the Patient view to see incidents here')}</div>` :
                incidents.map((s, i) => `
                    <div class="card card-elevated animate-fade-in-up stagger-${Math.min(i+1, 5)}" style="margin-bottom:var(--space-4)">
                        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:var(--space-4)">
                            <div>
                                <div style="display:flex;align-items:center;gap:var(--space-2)">
                                    <span class="font-bold">${s.id}</span>
                                    <span class="badge badge-critical badge-dot">${s.priority.toUpperCase()}</span>
                                </div>
                                <div class="text-sm text-muted">${UI.timeAgo(s.createdAt)}</div>
                            </div>
                            <span class="badge badge-${s.status === 'accepted' ? 'available' : s.status === 'dispatching' ? 'warning' : 'critical'} badge-dot">${s.status}</span>
                        </div>
                        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-4);margin-bottom:var(--space-4)">
                            <div><div class="text-xs text-muted">Patient</div><div class="font-medium text-sm">${s.patientName}</div></div>
                            <div><div class="text-xs text-muted">Condition</div><div class="font-medium text-sm">${s.condition}</div></div>
                            <div><div class="text-xs text-muted">Location</div><div class="font-medium text-sm">${s.location}</div></div>
                            <div><div class="text-xs text-muted">Accepting Hospital</div><div class="font-medium text-sm">${s.acceptedHospitalId ? MediJointsStore.getHospital(s.acceptedHospitalId)?.name || 'Unknown' : 'Pending'}</div></div>
                        </div>
                        <!-- Timeline -->
                        <div class="timeline" style="margin-top:var(--space-3)">
                            ${s.timeline.map(t => `
                                <div class="timeline-item ${t.status}">
                                    <div class="timeline-dot"></div>
                                    <div class="timeline-title" style="font-size:var(--font-size-sm)">${t.event}</div>
                                    <div class="timeline-time">${t.time ? UI.timeAgo(t.time) : '—'}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')
            }
        </div>`;
    }
    return { render };
})();
