/* ═══════════════════════════════════════════════
   MEDI JOINTS — Patient Profile (P09)
   ═══════════════════════════════════════════════ */

window.PatientProfile = (function() {
    function render() {
        const patient = MediJointsStore.getPatient();
        return `<div class="page-container" style="max-width:800px">
            <div class="page-header">
                <div><h2>Health Profile</h2><p class="page-subtitle">Your medical summary for hospital sharing</p></div>
            </div>
            <div class="dashboard-grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-6)">
                <div class="card animate-fade-in-up">
                    <h4 style="margin-bottom:var(--space-4)">👤 Personal Information</h4>
                    <div style="display:grid;gap:var(--space-3)">
                        ${[['Name', patient.name], ['Age', patient.age], ['Phone', patient.phone], ['Email', patient.email], ['Blood Group', patient.bloodGroup], ['Language', patient.language]].map(([l,v]) => `
                            <div style="display:flex;justify-content:space-between;padding:var(--space-2) 0;border-bottom:1px solid var(--color-border-light)"><span class="text-muted text-sm">${l}</span><span class="font-medium">${v}</span></div>
                        `).join('')}
                    </div>
                </div>
                <div class="card animate-fade-in-up stagger-1">
                    <h4 style="margin-bottom:var(--space-4)">🚨 Emergency Contact</h4>
                    <div style="display:grid;gap:var(--space-3)">
                        ${[['Name', patient.emergencyContact.name], ['Relation', patient.emergencyContact.relation], ['Phone', patient.emergencyContact.phone]].map(([l,v]) => `
                            <div style="display:flex;justify-content:space-between;padding:var(--space-2) 0;border-bottom:1px solid var(--color-border-light)"><span class="text-muted text-sm">${l}</span><span class="font-medium">${v}</span></div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- AI Medical Summary -->
            <div class="card card-elevated animate-fade-in-up stagger-2" style="margin-top:var(--space-6)">
                <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-5)">
                    <div style="width:44px;height:44px;border-radius:var(--radius-md);background:linear-gradient(135deg,rgba(var(--color-accent-rgb),0.1),rgba(var(--color-primary-rgb),0.1));display:flex;align-items:center;justify-content:center;font-size:var(--font-size-xl)">🤖</div>
                    <div>
                        <h4>AI Health Record Summary</h4>
                        <p class="text-sm text-muted">Auto-generated from uploaded medical records</p>
                    </div>
                    <span class="badge badge-accent" style="margin-left:auto">AI Generated</span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--space-4)">
                    <div style="padding:var(--space-4);background:var(--color-surface);border-radius:var(--radius-md)">
                        <div class="text-sm font-semibold" style="margin-bottom:var(--space-2)">🩸 Blood Group</div>
                        <div class="font-bold text-lg">${patient.bloodGroup}</div>
                    </div>
                    <div style="padding:var(--space-4);background:var(--color-surface);border-radius:var(--radius-md)">
                        <div class="text-sm font-semibold" style="margin-bottom:var(--space-2)">⚠️ Allergies</div>
                        <div>${patient.allergies.map(a => `<span class="badge badge-critical" style="margin-right:4px">${a}</span>`).join('')}</div>
                    </div>
                    <div style="padding:var(--space-4);background:var(--color-surface);border-radius:var(--radius-md)">
                        <div class="text-sm font-semibold" style="margin-bottom:var(--space-2)">📋 Conditions</div>
                        <div>${patient.conditions.map(c => `<span class="badge badge-primary" style="margin-right:4px">${c}</span>`).join('')}</div>
                    </div>
                    <div style="padding:var(--space-4);background:var(--color-surface);border-radius:var(--radius-md)">
                        <div class="text-sm font-semibold" style="margin-bottom:var(--space-2)">💊 Medications</div>
                        <div class="text-sm">${patient.medications.join(', ')}</div>
                    </div>
                </div>
                <div style="display:flex;gap:var(--space-3);margin-top:var(--space-5)">
                    <button class="btn btn-accent" onclick="Toast.show('📤 Shared', 'Medical summary shared with hospital', 'success')">📤 Share with Hospital</button>
                    <button class="btn btn-outline" onclick="Toast.show('📄 Upload', 'Document upload simulated', 'info')">📄 Upload Records</button>
                </div>
            </div>
            ${UI.safetyDisclaimer()}
        </div>`;
    }
    return { render };
})();
