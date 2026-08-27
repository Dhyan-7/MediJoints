/* ═══════════════════════════════════════════════
   MEDI JOINTS — Patient Hospitals Directory
   ═══════════════════════════════════════════════ */

window.PatientHospitalsPage = (function() {
    function render() {
        const hospitals = MediJointsStore.getHospitals();
        return `<div class="page-container">
            <div class="page-header">
                <div>
                    <h2>🏥 Hospitals Directory</h2>
                    <p class="page-subtitle">Complete list of registered healthcare providers</p>
                </div>
            </div>
            
            <div class="card card-elevated" style="margin-bottom:var(--space-6);padding:var(--space-5)">
                <div class="search-input">
                    <span class="search-icon">🔍</span>
                    <input class="input-field" placeholder="Search by name, specialty, area..." 
                           oninput="MediJointsStore.setFilter('search', this.value); window.MediJoints.refreshPage()">
                </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:var(--space-4)">
                ${hospitals.map(h => UI.hospitalCard(h)).join('')}
            </div>
        </div>`;
    }
    return { render };
})();
