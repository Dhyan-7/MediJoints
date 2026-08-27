/* ═══════════════════════════════════════════════
   MEDI JOINTS — Hospital Facility Settings (H07)
   ═══════════════════════════════════════════════ */

window.HospitalFacilitySettings = (function() {
    function render() {
        const hId = MediJointsStore.getState().demoHospitalId;
        const hospital = MediJointsStore.getHospital(hId);

        return `<div class="page-container" style="max-width:800px">
            <div class="page-header">
                <div>
                    <h2>⚙️ Facility Profile</h2>
                    <p class="page-subtitle">Configure public hospital directory details</p>
                </div>
            </div>

            <div class="card card-elevated">
                <div style="display:grid;gap:var(--space-4)">
                    <div class="input-group">
                        <label class="input-label">Hospital Name</label>
                        <input class="input-field" value="${hospital.name}">
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)">
                        <div class="input-group">
                            <label class="input-label">Provider Type</label>
                            <input class="input-field" value="${hospital.type}">
                        </div>
                        <div class="input-group">
                            <label class="input-label">Area / Location</label>
                            <input class="input-field" value="${hospital.area}">
                        </div>
                    </div>
                    <div class="input-group">
                        <label class="input-label">Contact Hotline</label>
                        <input class="input-field" value="${hospital.phone}">
                    </div>
                    <div class="input-group">
                        <label class="input-label">Accreditation Seals</label>
                        <div style="display:flex;gap:var(--space-4);margin-top:var(--space-1)">
                            <label><input type="checkbox" checked> NABH Accredited</label>
                            <label><input type="checkbox" checked> ISO Certified</label>
                            <label><input type="checkbox"> JCI Accredited</label>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-lg" style="margin-top:var(--space-4)" 
                            onclick="Toast.show('✓ Settings Saved', 'Facility settings updated successfully', 'success')">
                        Save Profile Settings
                    </button>
                </div>
            </div>
        </div>`;
    }
    return { render };
})();
