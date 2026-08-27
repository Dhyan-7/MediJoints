/* ═══════════════════════════════════════════════
   MEDI JOINTS — Tourism Hospital & Doctor Directory (M05)
   ═══════════════════════════════════════════════ */

window.TourismHospitalDoctorDirectory = (function() {
    function render() {
        const treatments = MediJointsStore.getTreatments();
        return `<div class="page-container">
            <div class="page-header">
                <div>
                    <h2>👨‍⚕️ Specialists Directory</h2>
                    <p class="page-subtitle">Leading medical experts matching specialized travel procedures</p>
                </div>
            </div>

            <div class="card card-elevated" style="margin-bottom:var(--space-6);padding:var(--space-5)">
                <div class="search-input">
                    <span class="search-icon">🔍</span>
                    <input class="input-field" placeholder="Search doctors: Dr. Ramesh Kulkarni, Cardology...">
                </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:var(--space-4)">
                ${treatments.flatMap(t => t.hospitals.map(th => {
                    const hospital = MediJointsStore.getHospital(th.hospitalId);
                    if (!hospital) return '';
                    return `
                        <div class="card card-elevated animate-fade-in-up">
                            <div style="display:flex;gap:var(--space-3);align-items:center;margin-bottom:var(--space-4)">
                                <div style="width:48px;height:48px;border-radius:50%;background:rgba(var(--color-accent-rgb),0.1);display:flex;align-items:center;justify-content:center;font-size:var(--font-size-xl)">👨‍⚕️</div>
                                <div>
                                    <div class="font-bold text-sm">${th.doctor}</div>
                                    <div class="text-xs text-muted">${t.specialty} Specialist</div>
                                </div>
                            </div>
                            <div style="display:grid;gap:var(--space-2);font-size:var(--font-size-sm);margin-bottom:var(--space-4)">
                                <div style="display:flex;justify-content:space-between"><span class="text-muted">Hospital</span><span class="font-medium">${hospital.name}</span></div>
                                <div style="display:flex;justify-content:space-between"><span class="text-muted">Experience</span><span class="font-medium">${th.experience}</span></div>
                                <div style="display:flex;justify-content:space-between"><span class="text-muted">Procedures</span><span class="font-medium">${th.procedures}+ cases</span></div>
                                <div style="display:flex;justify-content:space-between"><span class="text-muted">Success Rate</span><span class="font-semibold text-success">${th.successRate}</span></div>
                            </div>
                            <button class="btn btn-accent btn-sm w-full" onclick="MediJointsStore.selectTreatment('${t.id}'); window.MediJoints.navigateTo('/tourism/consultation')">Book Consultation</button>
                        </div>
                    `;
                })).join('')}
            </div>
        </div>`;
    }
    return { render };
})();
