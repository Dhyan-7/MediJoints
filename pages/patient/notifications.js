/* ═══════════════════════════════════════════════
   MEDI JOINTS — Notifications Page (P10)
   ═══════════════════════════════════════════════ */

window.NotificationsPage = (function() {
    function render() {
        const notifications = MediJointsStore.getNotifications();
        return `<div class="page-container" style="max-width:700px">
            <div class="page-header">
                <div><h2>Notifications</h2><p class="page-subtitle">${notifications.length} notifications</p></div>
                <button class="btn btn-ghost btn-sm" onclick="MediJointsStore.getNotifications().forEach(n => MediJointsStore.markNotificationRead(n.id)); window.MediJoints.refreshPage()">Mark all read</button>
            </div>
            ${notifications.length === 0 ? UI.emptyState('🔔', 'No notifications', 'Interact with the demo to see notifications appear here') :
              notifications.map((n, i) => `
                <div class="card animate-fade-in-up stagger-${Math.min(i+1, 8)}" style="margin-bottom:var(--space-3);${!n.read ? 'border-left:3px solid var(--color-primary)' : ''}" onclick="MediJointsStore.markNotificationRead('${n.id}'); window.MediJoints.refreshPage()">
                    <div style="display:flex;align-items:flex-start;gap:var(--space-3)">
                        <span style="font-size:var(--font-size-xl)">${
                            n.type === 'sos' ? '🚨' : n.type === 'reservation' ? '🏥' : n.type === 'bed_update' ? '🛏️' : 'ℹ️'
                        }</span>
                        <div style="flex:1">
                            <div class="font-semibold">${n.title}</div>
                            <div class="text-sm text-muted" style="margin-top:2px">${n.body}</div>
                            <div class="text-xs text-light" style="margin-top:var(--space-2)">${UI.timeAgo(n.createdAt)}</div>
                        </div>
                        ${!n.read ? '<span style="width:8px;height:8px;border-radius:50%;background:var(--color-primary);flex-shrink:0;margin-top:6px"></span>' : ''}
                    </div>
                </div>
              `).join('')}
        </div>`;
    }
    return { render };
})();
