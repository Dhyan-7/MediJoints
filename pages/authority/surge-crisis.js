/* ═══════════════════════════════════════════════
   MEDI JOINTS — Surge & Crisis (A04)
   ═══════════════════════════════════════════════ */

window.SurgeCrisis = (function() {
    function render() {
        return `<div class="page-container" style="max-width:900px">
            <div class="page-header">
                <div><h2>📈 Surge & Crisis AI</h2><p class="page-subtitle">Early warning system for capacity crunches</p></div>
                <span class="badge badge-warning badge-dot animate-pulse">Monitoring Active</span>
            </div>

            <!-- Active Warning -->
            <div class="card card-elevated animate-fade-in-up" style="border-left:4px solid var(--color-warning);margin-bottom:var(--space-6)">
                <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4)">
                    <div style="width:48px;height:48px;border-radius:var(--radius-lg);background:var(--color-warning-light);display:flex;align-items:center;justify-content:center;font-size:var(--font-size-2xl)">⚠️</div>
                    <div>
                        <h3 style="color:var(--color-warning)">Medium Surge Risk Detected</h3>
                        <p class="text-sm text-muted">Whitefield Area • Detected 15 minutes ago</p>
                    </div>
                    <span class="badge badge-warning" style="margin-left:auto">Confidence: 72%</span>
                </div>

                <h5 style="margin-bottom:var(--space-3)">Contributing Signals</h5>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--space-3);margin-bottom:var(--space-4)">
                    ${[
                        { icon: '🛏️', signal: 'ICU at 100% — Starlight Multi-Specialty', severity: 'high' },
                        { icon: '📈', signal: 'General ward at 75% occupancy', severity: 'medium' },
                        { icon: '🚨', signal: 'Elevated SOS activity in zone', severity: 'medium' },
                        { icon: '📅', signal: 'Seasonal pattern: post-monsoon respiratory admissions', severity: 'low' }
                    ].map(s => `
                        <div style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-3);background:var(--color-surface);border-radius:var(--radius-md)">
                            <span>${s.icon}</span>
                            <div>
                                <div class="text-sm">${s.signal}</div>
                                <div class="text-xs"><span class="badge badge-${s.severity === 'high' ? 'critical' : s.severity === 'medium' ? 'warning' : 'primary'}">${s.severity}</span></div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <h5 style="margin-bottom:var(--space-3)">Recommended Actions</h5>
                <div style="display:grid;gap:var(--space-2)">
                    ${[
                        'Pre-position additional ambulances in Whitefield zone',
                        'Alert nearby hospitals (Indiranagar, Koramangala) to prepare overflow capacity',
                        'Issue public health advisory for the area',
                        'Coordinate potential inter-hospital transfers from Starlight'
                    ].map((a, i) => `
                        <div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3);border-radius:var(--radius-md);background:var(--color-surface)">
                            <span class="badge badge-primary" style="min-width:24px;justify-content:center">${i+1}</span>
                            <span class="text-sm">${a}</span>
                            <button class="btn btn-ghost btn-sm" style="margin-left:auto" onclick="Toast.show('Action', 'Action initiated', 'success')">Execute</button>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Historical Signals -->
            ${UI.sectionCard('📊 Signal History (Sample)', `
                <div class="timeline">
                    ${[
                        { event: 'Medium surge risk — Whitefield ICU capacity', time: '15 min ago', status: 'active' },
                        { event: 'Low risk cleared — Hebbal zone normalized', time: '2 hours ago', status: 'completed' },
                        { event: 'High surge — COVID ward spike (resolved)', time: '3 days ago', status: 'completed' },
                        { event: 'Seasonal alert — Dengue admissions increase', time: '1 week ago', status: 'completed' }
                    ].map(t => `
                        <div class="timeline-item ${t.status}">
                            <div class="timeline-dot"></div>
                            <div class="timeline-title" style="font-size:var(--font-size-sm)">${t.event}</div>
                            <div class="timeline-time">${t.time}</div>
                        </div>
                    `).join('')}
                </div>
            `)}

            ${UI.safetyDisclaimer()}
        </div>`;
    }
    return { render };
})();
