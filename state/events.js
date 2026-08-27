/* ═══════════════════════════════════════════════
   MEDI JOINTS — Event Bus
   Cross-role event propagation and toast system
   ═══════════════════════════════════════════════ */

window.EventBus = (function() {
    const listeners = {};

    function on(event, callback) {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(callback);
        return () => off(event, callback);
    }

    function off(event, callback) {
        if (!listeners[event]) return;
        listeners[event] = listeners[event].filter(cb => cb !== callback);
    }

    function emit(event, data) {
        if (!listeners[event]) return;
        listeners[event].forEach(cb => {
            try { cb(data); } catch(e) { console.error(`EventBus error on ${event}:`, e); }
        });
    }

    function once(event, callback) {
        const wrapper = (data) => {
            callback(data);
            off(event, wrapper);
        };
        on(event, wrapper);
    }

    return { on, off, emit, once };
})();

// ─── Toast System ───
window.Toast = (function() {
    function show(title, message, type = 'info', duration = 4000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const icons = {
            success: '✅', warning: '⚠️', critical: '🚨', info: 'ℹ️', sos: '🚨', reservation: '🏥', bed_update: '🛏️', system: '⚙️'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                ${message ? `<div class="toast-message">${message}</div>` : ''}
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastOut 300ms ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    return { show };
})();

// ─── Wire up cross-role event toasts ───
EventBus.on('bed.updated', (data) => {
    Toast.show('Bed Update', `${data.hospital.name} capacity changed`, 'info');
});

EventBus.on('bed.published', (data) => {
    Toast.show('📡 Data Synced', `${data.hospital.name} bed data published across network`, 'success');
});

EventBus.on('reservation.created', (data) => {
    Toast.show('🏥 Reservation Confirmed', `${data.reservation.category} bed at ${data.reservation.hospitalName}`, 'success', 5000);
});

EventBus.on('reservation.accepted', (data) => {
    Toast.show('✅ Reservation Accepted', `${data.reservation.hospitalName} has accepted your reservation`, 'success', 5000);
});

EventBus.on('sos.created', (data) => {
    Toast.show('🚨 SOS Dispatched', `Emergency alert sent to ${data.incident.rankedHospitals.length} hospitals`, 'critical', 6000);
});

EventBus.on('sos.accepted', (data) => {
    Toast.show('🏥 SOS Accepted!', `${data.hospital.name} is ready. ETA: ${data.hospital.eta} min`, 'success', 8000);
});

EventBus.on('demo.reset', () => {
    Toast.show('🔄 Demo Reset', 'All data restored to initial state', 'info');
});
