/* ═══════════════════════════════════════════════
   MEDI JOINTS — Live Network (A02)
   ═══════════════════════════════════════════════ */

window.LiveNetwork = (function() {
    function render() {
        const hospitals = MediJointsStore.getHospitals();
        return `<div class="page-container">
            <div class="page-header">
                <div><h2>🌐 Live Network</h2><p class="page-subtitle">All hospitals in the Bengaluru network</p></div>
                <div class="chip-group">
                    <button class="chip active">All Areas</button>
                    <button class="chip">Koramangala</button>
                    <button class="chip">Indiranagar</button>
                    <button class="chip">Hebbal</button>
                    <button class="chip">Whitefield</button>
                </div>
            </div>
            <div class="card card-elevated">
                <table class="data-table">
                    <thead><tr>
                        <th>Hospital</th><th>Area</th><th>Status</th><th>General</th><th>ICU</th><th>Ventilator</th><th>Total Avail</th><th>Last Updated</th><th>Action</th>
                    </tr></thead>
                    <tbody>
                        ${hospitals.map(h => {
                            const totalA = Object.values(h.beds).reduce((s, b) => s + b.available, 0);
                            return `<tr>
                                <td><div class="font-medium">${h.name}</div><div class="text-xs text-muted">${h.type}</div></td>
                                <td>${h.area}</td>
                                <td>${UI.statusBadge(h.status)}</td>
                                <td class="font-semibold" style="color:${h.beds.General.available > 0 ? 'var(--color-success)' : 'var(--color-critical)'}">${h.beds.General.available}/${h.beds.General.total}</td>
                                <td class="font-semibold" style="color:${h.beds.ICU.available > 0 ? 'var(--color-success)' : 'var(--color-critical)'}">${h.beds.ICU.available}/${h.beds.ICU.total}</td>
                                <td class="font-semibold" style="color:${h.beds.Ventilator.available > 0 ? 'var(--color-success)' : 'var(--color-critical)'}">${h.beds.Ventilator.available}/${h.beds.Ventilator.total}</td>
                                <td class="font-bold">${totalA}</td>
                                <td>${UI.freshnessIndicator(h.lastUpdated)}</td>
                                <td><button class="btn btn-ghost btn-sm" onclick="Toast.show('Hospital', 'Inspecting ${h.name}', 'info')">Inspect</button></td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    }
    return { render };
})();
