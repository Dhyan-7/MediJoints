/* ═══════════════════════════════════════════════
   MEDI JOINTS — Hospital Billing Panel (H08)
   ═══════════════════════════════════════════════ */

window.HospitalBillingSettings = (function() {
    function render() {
        const invoices = [
            { id: 'INV-2026-08', date: '01 Aug 2026', amount: '₹12,500', status: 'Paid' },
            { id: 'INV-2026-07', date: '01 Jul 2026', amount: '₹12,500', status: 'Paid' },
            { id: 'INV-2026-06', date: '01 Jun 2026', amount: '₹10,000', status: 'Paid' }
        ];

        return `<div class="page-container" style="max-width:800px">
            <div class="page-header">
                <div>
                    <h2>💳 Subscription & Billing</h2>
                    <p class="page-subtitle">Manage SaaS listing plans and invoices</p>
                </div>
            </div>

            <!-- Current Tier Card -->
            <div class="card card-elevated" style="margin-bottom:var(--space-6);border-left:4px solid var(--color-accent);background:linear-gradient(135deg, rgba(var(--color-accent-rgb),0.02), rgba(var(--color-primary-rgb),0.02))">
                <div style="display:flex;justify-content:space-between;align-items:flex-start">
                    <div>
                        <span class="badge badge-accent" style="margin-bottom:var(--space-2)">Active Premium Plan</span>
                        <h3>Premium Tier List</h3>
                        <p class="text-sm text-muted">Next charge of ₹12,500 due on 1st Sep 2026</p>
                    </div>
                    <div style="text-align:right">
                        <div class="font-bold text-lg">₹12,500 / mo</div>
                        <button class="btn btn-outline btn-sm" style="margin-top:var(--space-2)">Change Plan</button>
                    </div>
                </div>
            </div>

            <!-- Invoices List -->
            <h3>Invoice History</h3>
            <div class="card card-elevated" style="margin-top:var(--space-4)">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Invoice ID</th>
                            <th>Billing Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Document</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoices.map(inv => `
                            <tr>
                                <td><strong>${inv.id}</strong></td>
                                <td>${inv.date}</td>
                                <td>${inv.amount}</td>
                                <td><span class="badge badge-available">${inv.status}</span></td>
                                <td><button class="btn btn-ghost btn-sm" onclick="Toast.show('PDF Download', 'Simulating invoice download...', 'success')">Download PDF</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    }
    return { render };
})();
