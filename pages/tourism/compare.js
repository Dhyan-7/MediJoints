/* ═══════════════════════════════════════════════
   MEDI JOINTS — Treatment Compare Page (M02)
   ═══════════════════════════════════════════════ */

window.TreatmentCompare = (function() {
    function render() {
        const treatmentId = MediJointsStore.getState().selectedTreatment || 't1';
        const treatment = MediJointsStore.getTreatment(treatmentId);
        if (!treatment) {
            return `<div class="page-container">${UI.emptyState('⚖️', 'Treatment not found', 'Please go back and select a treatment.')}</div>`;
        }

        return `<div class="page-container">
            <button class="btn btn-ghost" onclick="window.MediJoints.navigateTo('/tourism/treatments')" style="margin-bottom:var(--space-4)">← Back to Treatments</button>
            <div class="page-header">
                <div>
                    <h2>⚖️ Compare Hospitals</h2>
                    <p class="page-subtitle">Comparing options for: <strong>${treatment.procedure}</strong></p>
                </div>
            </div>

            <div class="compare-grid">
                ${treatment.hospitals.map((th, idx) => {
                    const hospital = MediJointsStore.getHospital(th.hospitalId);
                    if (!hospital) return '';
                    const isRecommended = idx === 1; // Mark the middle/best success rate as recommended for demo
                    return `
                    <div class="compare-card ${isRecommended ? 'recommended' : ''} animate-fade-in-up stagger-${idx+1}">
                        <div class="compare-card-header">
                            ${isRecommended ? '<span class="badge badge-accent" style="margin-bottom:var(--space-2)">★ AI Recommended</span>' : ''}
                            <h3>${hospital.name}</h3>
                            <p class="text-sm text-muted">📍 ${hospital.area}</p>
                        </div>
                        <div class="compare-card-body">
                            <div class="compare-row">
                                <span class="text-muted">Indicative Cost</span>
                                <span class="font-bold text-accent">${th.cost}</span>
                            </div>
                            <div class="compare-row">
                                <span class="text-muted">Lead Specialist</span>
                                <span class="font-medium">${th.doctor}</span>
                            </div>
                            <div class="compare-row">
                                <span class="text-muted">Experience</span>
                                <span class="font-medium">${th.experience}</span>
                            </div>
                            <div class="compare-row">
                                <span class="text-muted">Procedures Performed</span>
                                <span class="font-medium">${th.procedures}+</span>
                            </div>
                            <div class="compare-row">
                                <span class="text-muted">Success Rate</span>
                                <span class="font-bold" style="color:var(--color-success)">${th.successRate}</span>
                            </div>
                            <div class="compare-row">
                                <span class="text-muted">Accreditation</span>
                                <div>${UI.accreditationBadges(hospital.accreditations)}</div>
                            </div>
                            <div class="compare-row">
                                <span class="text-muted">Intl. Support</span>
                                <span class="font-medium">${th.intlSupport ? '🌍 Full IPD Suite' : '❌ Basic'}</span>
                            </div>
                            <div style="margin-top:var(--space-6)">
                                <button class="btn ${isRecommended ? 'btn-accent' : 'btn-primary'} w-full" 
                                        onclick="window.MediJoints.navigateTo('/tourism/consultation')">
                                    Book Consultation
                                </button>
                            </div>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>`;
    }

    return { render };
})();
