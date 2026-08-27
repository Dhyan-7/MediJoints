/* ═══════════════════════════════════════════════
   MEDI JOINTS — Post-Treatment Recovery Settings (M06)
   ═══════════════════════════════════════════════ */

window.TourismRecoveryPage = (function() {
    function render() {
        const centers = [
            { name: 'Koramangala Wellness Suites', type: 'Recovery Hotel', distance: '1.2 km from Asteria Care', price: '₹4,500/night', rating: 4.8 },
            { name: 'Indiranagar Rehabilitation Center', type: 'Rehab / Physio Clinic', distance: '0.8 km from Central Medical', price: '₹6,000/session', rating: 4.9 },
            { name: 'Hebbal Med-Resort', type: 'Recovery Villa', distance: '2.5 km from Metro Trauma', price: '₹8,000/night', rating: 4.7 }
        ];

        return `<div class="page-container">
            <div class="page-header">
                <div>
                    <h2>🏡 Recovery accommodations</h2>
                    <p class="page-subtitle">Post-treatment recovery hotels and rehabilitation suites</p>
                </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:var(--space-4)">
                ${centers.map(c => `
                    <div class="card card-elevated animate-fade-in-up">
                        <div style="font-size:2.5rem;margin-bottom:var(--space-3)">🏡</div>
                        <h4 style="margin-bottom:var(--space-1)">${c.name}</h4>
                        <p class="text-xs text-muted" style="margin-bottom:var(--space-3)">${c.type} • ⭐ ${c.rating}</p>
                        <div style="display:grid;gap:var(--space-2);font-size:var(--font-size-sm);margin-bottom:var(--space-4)">
                            <div style="display:flex;justify-content:space-between"><span class="text-muted">Proximity</span><span class="font-medium">${c.distance}</span></div>
                            <div style="display:flex;justify-content:space-between"><span class="text-muted">Price Rate</span><span class="font-bold text-accent">${c.price}</span></div>
                        </div>
                        <button class="btn btn-outline btn-sm w-full" onclick="Toast.show('Booking Request', 'Simulating booking request for ${c.name}', 'success')">
                            Request Booking Info
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>`;
    }
    return { render };
})();
