/* ═══════════════════════════════════════════════
   MEDI JOINTS — Travel Coordination Page (M04)
   ═══════════════════════════════════════════════ */

window.TravelPlan = (function() {
    function render() {
        return `<div class="page-container" style="max-width:800px">
            <div class="page-header">
                <div>
                    <h2>✈️ Travel Coordination</h2>
                    <p class="page-subtitle">Your end-to-end medical travel timeline</p>
                </div>
            </div>

            <div class="travel-timeline">
                <div class="travel-step animate-fade-in-up stagger-1">
                    <div class="travel-step-icon" style="background:var(--color-success-light);color:var(--color-success)">✓</div>
                    <div style="flex:1">
                        <h4 style="margin-bottom:var(--space-1)">Pre-Arrival Consultation</h4>
                        <p class="text-sm text-muted">Completed on 27th Aug with Dr. Ramesh Kulkarni</p>
                    </div>
                </div>

                <div class="travel-step animate-fade-in-up stagger-2">
                    <div class="travel-step-icon" style="background:rgba(var(--color-accent-rgb),0.1);color:var(--color-accent)">✈️</div>
                    <div style="flex:1">
                        <h4 style="margin-bottom:var(--space-1)">Flight Booking</h4>
                        <p class="text-sm text-muted">Select medical-friendly flight options with assistance requests.</p>
                        <button class="btn btn-outline btn-sm" style="margin-top:var(--space-2)" onclick="Toast.show('Flight Search', 'Simulating flight booking...', 'info')">Book Flight</button>
                    </div>
                </div>

                <div class="travel-step animate-fade-in-up stagger-3">
                    <div class="travel-step-icon" style="background:rgba(var(--color-accent-rgb),0.1);color:var(--color-accent)">🏨</div>
                    <div style="flex:1">
                        <h4 style="margin-bottom:var(--space-1)">Accommodation Near Hospital</h4>
                        <p class="text-sm text-muted">Curated hotels and guest houses with recovery amenities.</p>
                        <button class="btn btn-outline btn-sm" style="margin-top:var(--space-2)" onclick="Toast.show('Hotel Booking', 'Simulating hotel booking...', 'info')">Book Stay</button>
                    </div>
                </div>

                <div class="travel-step animate-fade-in-up stagger-4">
                    <div class="travel-step-icon" style="background:rgba(var(--color-accent-rgb),0.1);color:var(--color-accent)">📄</div>
                    <div style="flex:1">
                        <h4 style="margin-bottom:var(--space-1)">Medical Visa Invitation</h4>
                        <p class="text-sm text-muted">Hospital generated invitation letter for priority processing.</p>
                        <button class="btn btn-outline btn-sm" style="margin-top:var(--space-2)" onclick="Toast.show('Visa', 'Invitation letter generated', 'success')">Get Letter</button>
                    </div>
                </div>

                <div class="travel-step animate-fade-in-up stagger-5">
                    <div class="travel-step-icon" style="background:rgba(var(--color-primary-rgb),0.1);color:var(--color-primary)">🚗</div>
                    <div style="flex:1">
                        <h4 style="margin-bottom:var(--space-1)">Airport Transfer</h4>
                        <p class="text-sm text-muted">Pre-arranged medical transfer directly to hospital or hotel.</p>
                    </div>
                </div>

                <div class="travel-step animate-fade-in-up stagger-6">
                    <div class="travel-step-icon" style="background:rgba(var(--color-primary-rgb),0.1);color:var(--color-primary)">🏥</div>
                    <div style="flex:1">
                        <h4 style="margin-bottom:var(--space-1)">Hospital Treatment</h4>
                        <p class="text-sm text-muted">Admission scheduled at Asteria Care Hospital.</p>
                    </div>
                </div>

                <div class="travel-step animate-fade-in-up stagger-7">
                    <div class="travel-step-icon" style="background:rgba(var(--color-primary-rgb),0.1);color:var(--color-primary)">🛡️</div>
                    <div style="flex:1">
                        <h4 style="margin-bottom:var(--space-1)">Post-Treatment Recovery</h4>
                        <p class="text-sm text-muted">Local rehabilitation and teleconsultation follow-up scheduling.</p>
                    </div>
                </div>
            </div>
        </div>`;
    }

    return { render };
})();
