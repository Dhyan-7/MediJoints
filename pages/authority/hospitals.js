/* ═══════════════════════════════════════════════
   MEDI JOINTS — Authority Hospitals Directory (A06)
   ═══════════════════════════════════════════════ */

window.AuthorityHospitalsDirectory = (function() {
    function render() {
        const hospitals = MediJointsStore.getHospitals();
        return `<div class="page-container">
            <div class="page-header">
                <div>
                    <h2>🏥 Hospitals Directory</h2>
                    <p class="page-subtitle">Verify, audit, or flag network healthcare providers</p>
                </div>
            </div>

            <div class="card card-elevated">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Hospital Provider</th>
                            <th>Verification</th>
                            <th>Status Badge</th>
                            <th>Data Sync Quality</th>
                            <th>Compliance Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${hospitals.map(h => `
                            <tr>
                                <td>
                                    <div class="font-semibold text-sm">${h.name}</div>
                                    <div class="text-xs text-muted">📍 ${h.area} • Rating: ${h.rating}★</div>
                                </td>
                                <td>${h.verified ? UI.verifiedBadge() : '<span class="badge badge-offline">Unverified</span>'}</td>
                                <td>${UI.statusBadge(h.status)}</td>
                                <td>${UI.freshnessIndicator(h.lastUpdated)}</td>
                                <td>
                                    <div style="display:flex;gap:var(--space-2)">
                                        <button class="btn btn-primary btn-sm" onclick="Toast.show('Verify', 'Hospital status approved', 'success')">Verify</button>
                                        <button class="btn btn-ghost btn-sm" style="color:var(--color-critical)" onclick="Toast.show('Compliance Flag', 'Alert notification sent to hospital admin', 'warning')">Flag Provider</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    }
    return { render };
})();
