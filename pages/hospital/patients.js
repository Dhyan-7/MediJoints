/* ═══════════════════════════════════════════════
   MEDI JOINTS — Hospital Patients Registry (H05)
   ═══════════════════════════════════════════════ */

window.HospitalPatientsRegistry = (function() {
    function render() {
        const admitted = [
            { name: 'Rohan Mehta', age: 45, blood: 'A+', date: '25 Aug 2026', bed: 'ICU', status: 'Admitted' },
            { name: 'Savitri Devi', age: 72, blood: 'O-', date: '24 Aug 2026', bed: 'General', status: 'Admitted' },
            { name: 'Vikram Singh', age: 29, blood: 'B+', date: '21 Aug 2026', bed: 'Ventilator', status: 'Discharged' }
        ];

        return `<div class="page-container">
            <div class="page-header">
                <div>
                    <h2>🚶 Patients Registry</h2>
                    <p class="page-subtitle">Historical and current admission records</p>
                </div>
            </div>

            <div class="card card-elevated">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Age / Blood</th>
                            <th>Bed Type</th>
                            <th>Admission Date</th>
                            <th>Status</th>
                            <th>Records</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${admitted.map(p => `
                            <tr>
                                <td><div class="font-medium">${p.name}</div></td>
                                <td>${p.age} yrs • <strong>${p.blood}</strong></td>
                                <td><span class="badge badge-primary">${p.bed}</span></td>
                                <td>${p.date}</td>
                                <td><span class="badge badge-${p.status === 'Admitted' ? 'available' : 'offline'}">${p.status}</span></td>
                                <td><button class="btn btn-ghost btn-sm" onclick="Toast.show('Records', 'Opening records for ${p.name}', 'info')">View File</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    }
    return { render };
})();
