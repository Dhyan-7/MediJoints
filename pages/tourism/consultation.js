/* ═══════════════════════════════════════════════
   MEDI JOINTS — Pre-Arrival Consultation Page (M03)
   ═══════════════════════════════════════════════ */

window.PreArrivalConsultation = (function() {
    function render() {
        const treatmentId = MediJointsStore.getState().selectedTreatment || 't1';
        const treatment = MediJointsStore.getTreatment(treatmentId);
        const docName = treatment ? treatment.hospitals[0].doctor : 'Dr. Ramesh Kulkarni';

        return `<div class="page-container" style="max-width:700px">
            <button class="btn btn-ghost" onclick="window.MediJoints.navigateTo('/tourism/compare')" style="margin-bottom:var(--space-4)">← Back</button>
            <div class="page-header">
                <div>
                    <h2>👨‍⚕️ Pre-Arrival Consultation</h2>
                    <p class="page-subtitle">Schedule a video consultation before traveling</p>
                </div>
            </div>

            <div class="card card-elevated animate-fade-in-up">
                <div style="display:flex;align-items:center;gap:var(--space-4);padding-bottom:var(--space-4);border-bottom:1px solid var(--color-border-light);margin-bottom:var(--space-5)">
                    <div style="width:60px;height:60px;border-radius:50%;background:rgba(var(--color-accent-rgb),0.1);display:flex;align-items:center;justify-content:center;font-size:2rem">👨‍⚕️</div>
                    <div>
                        <h3 style="margin-bottom:var(--space-1)">${docName}</h3>
                        <p class="text-sm text-muted">Senior Consultant • Orthopedics</p>
                    </div>
                </div>

                <div style="display:grid;gap:var(--space-4)">
                    <div class="input-group">
                        <label class="input-label">Date</label>
                        <input class="input-field" type="date" value="2026-08-30">
                    </div>
                    <div class="input-group">
                        <label class="input-label">Available Slots</label>
                        <div class="chip-group">
                            <button class="chip active">10:00 AM - 10:30 AM</button>
                            <button class="chip">02:30 PM - 03:00 PM</button>
                            <button class="chip">04:00 PM - 04:30 PM</button>
                        </div>
                    </div>
                    <div class="input-group">
                        <label class="input-label">Sharing Health Records</label>
                        <label style="display:flex;align-items:center;gap:var(--space-2);cursor:pointer">
                            <input type="checkbox" checked>
                            <span class="text-sm text-muted">Share AI Health Record Summary with Doctor</span>
                        </label>
                    </div>
                    <div style="padding:var(--space-4);background:var(--color-surface);border-radius:var(--radius-md);margin-top:var(--space-2)">
                        <div style="display:flex;justify-content:space-between;margin-bottom:2px">
                            <span class="text-muted text-sm">Consultation Fee</span>
                            <span class="font-bold">₹1,500</span>
                        </div>
                        <span class="text-xs text-light">Forex / International cards accepted</span>
                    </div>
                    <button class="btn btn-accent btn-lg w-full" style="margin-top:var(--space-4)"
                            onclick="Toast.show('📅 Booking Confirmed', 'Consultation link sent to email', 'success'); window.MediJoints.navigateTo('/tourism/travel-plan')">
                        Confirm & Pay
                    </button>
                </div>
            </div>
        </div>`;
    }

    return { render };
})();
