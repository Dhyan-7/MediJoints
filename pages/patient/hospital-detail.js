/* ═══════════════════════════════════════════════
   MEDI JOINTS — Hospital Detail Drawer (P03)
   ═══════════════════════════════════════════════ */

window.HospitalDetail = (function() {

    function render(hospitalId) {
        const hospital = MediJointsStore.getHospital(hospitalId);
        if (!hospital) return `<div class="page-container">${UI.emptyState('🏥', 'Hospital not found', 'Please go back to the dashboard')}</div>`;

        const totalAvail = Object.values(hospital.beds).reduce((s, b) => s + b.available, 0);
        const totalBeds = Object.values(hospital.beds).reduce((s, b) => s + b.total, 0);

        return `<div class="page-container" style="max-width:800px">
            <!-- Back -->
            <button class="btn btn-ghost" onclick="window.MediJoints.navigateTo('/patient/dashboard')" style="margin-bottom:var(--space-4)">
                ← Back to Map
            </button>

            <!-- Hospital Header -->
            <div class="card card-elevated animate-fade-in-up" style="margin-bottom:var(--space-6)">
                <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:var(--space-4)">
                    <div>
                        <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-2)">
                            <h2>${hospital.name}</h2>
                            ${hospital.verified ? UI.verifiedBadge() : ''}
                        </div>
                        <div style="display:flex;align-items:center;gap:var(--space-4);color:var(--color-text-secondary);font-size:var(--font-size-sm)">
                            <span>📍 ${hospital.area}, Bengaluru</span>
                            <span>📏 ${hospital.distance} km away</span>
                            <span>⏱️ ETA: ${hospital.eta} min</span>
                        </div>
                    </div>
                    ${UI.statusBadge(hospital.status)}
                </div>
                <div style="display:flex;align-items:center;gap:var(--space-4);margin-bottom:var(--space-4)">
                    <div style="display:flex;align-items:center;gap:var(--space-2)">
                        <span style="color:var(--color-warning);font-size:var(--font-size-lg)">${UI.ratingStars(hospital.rating)}</span>
                        <span class="font-semibold">${hospital.rating}</span>
                    </div>
                    <span style="color:var(--color-border)">|</span>
                    <span class="text-sm text-muted">${hospital.type}</span>
                    <span style="color:var(--color-border)">|</span>
                    ${UI.freshnessIndicator(hospital.lastUpdated)}
                </div>
                ${hospital.accreditations.length > 0 ? `<div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-4)">${UI.accreditationBadges(hospital.accreditations)}</div>` : ''}
                ${UI.availabilityBar(totalAvail, totalBeds)}
                <div style="text-align:center;margin-top:var(--space-2)">
                    <span class="text-sm text-muted">${totalAvail} of ${totalBeds} beds available</span>
                </div>
            </div>

            <!-- Bed Matrix -->
            <div class="card animate-fade-in-up stagger-2" style="margin-bottom:var(--space-6)">
                <h4 style="margin-bottom:var(--space-4)">🛏️ Bed Availability</h4>
                ${UI.bedMatrix(hospital.beds, false)}
            </div>

            <!-- Specialties -->
            <div class="card animate-fade-in-up stagger-3" style="margin-bottom:var(--space-6)">
                <h4 style="margin-bottom:var(--space-4)">🩺 Specialties & Services</h4>
                <div class="chip-group">
                    ${hospital.specialties.map(s => `<span class="chip">${s}</span>`).join('')}
                </div>
            </div>

            <!-- Contact & Actions -->
            <div class="card animate-fade-in-up stagger-4" style="margin-bottom:var(--space-6)">
                <h4 style="margin-bottom:var(--space-4)">📞 Contact & Directions</h4>
                <div style="display:flex;gap:var(--space-4);margin-bottom:var(--space-4)">
                    <div style="flex:1">
                        <div class="text-sm text-muted">Phone</div>
                        <div class="font-medium">${hospital.phone}</div>
                    </div>
                    <div style="flex:1">
                        <div class="text-sm text-muted">Address</div>
                        <div class="font-medium">${hospital.area}, Bengaluru, Karnataka</div>
                    </div>
                </div>
                <div style="display:flex;gap:var(--space-3)">
                    <button class="btn btn-primary btn-lg" style="flex:1" onclick="window.MediJoints.navigateTo('/patient/reservation/${hospital.id}')">
                        🛏️ Reserve Bed
                    </button>
                    <button class="btn btn-outline btn-lg" onclick="Toast.show('📞 Calling...', '${hospital.phone}', 'info')">
                        📞 Call
                    </button>
                    <button class="btn btn-outline btn-lg" onclick="Toast.show('🗺️ Navigation', 'Opening directions to ${hospital.name}', 'info')">
                        🗺️ Navigate
                    </button>
                </div>
            </div>

            <!-- Reviews -->
            ${hospital.reviews.length > 0 ? `
            <div class="card animate-fade-in-up stagger-5" style="margin-bottom:var(--space-6)">
                <h4 style="margin-bottom:var(--space-4)">⭐ Patient Reviews</h4>
                ${hospital.reviews.map(r => `
                    <div style="padding:var(--space-4);background:var(--color-surface);border-radius:var(--radius-md);margin-bottom:var(--space-3)">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-2)">
                            <span class="font-semibold">${r.name}</span>
                            <span class="text-sm" style="color:var(--color-warning)">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
                        </div>
                        <p class="text-sm text-muted">${r.text}</p>
                        <span class="text-xs text-light">${r.date}</span>
                    </div>
                `).join('')}
            </div>` : ''}
        </div>`;
    }

    return { render };
})();
