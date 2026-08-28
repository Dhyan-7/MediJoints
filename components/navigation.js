/* ═══════════════════════════════════════════════
   MEDI JOINTS — Navigation Component
   Sidebar, role switcher, demo controls
   ═══════════════════════════════════════════════ */

window.Navigation = (function() {

    const sidebarConfig = {
        patient: {
            title: 'Patient',
            items: [
                { icon: '🗺️', label: 'Dashboard', path: '/patient/dashboard' },
                { icon: '🏥', label: 'Hospitals', path: '/patient/hospitals' },
                { icon: '🚑', label: 'Book Ambulance', path: '/patient/ambulance' },
                { icon: '🤖', label: 'AI Assistant', path: '/patient/ai-triage' },
                { icon: '📋', label: 'Reservations', path: '/patient/reservations' },
                { icon: '🚨', label: 'SOS Emergency', path: '/patient/sos', critical: true },
                { icon: '👤', label: 'Health Profile', path: '/patient/profile' },
                { icon: '🔔', label: 'Notifications', path: '/patient/notifications', badge: true }
            ]
        },
        hospital: {
            title: 'Hospital',
            items: [
                { icon: '📊', label: 'Overview', path: '/hospital/overview' },
                { icon: '🛏️', label: 'Bed Management', path: '/hospital/beds' },
                { icon: '📋', label: 'Reservations', path: '/hospital/reservations' },
                { icon: '🚨', label: 'SOS Alerts', path: '/hospital/sos', critical: true },
                { icon: '🚶', label: 'Patient Arrivals', path: '/hospital/arrivals' },
                { icon: '📈', label: 'Analytics', path: '/hospital/analytics' },
                { icon: '👥', label: 'Patients Registry', path: '/hospital/patients' },
                { icon: '⚙️', label: 'Facility Profile', path: '/hospital/facility' },
                { icon: '💳', label: 'Billing Settings', path: '/hospital/billing' }
            ]
        },
        authority: {
            title: 'Authority',
            items: [
                { icon: '📊', label: 'Overview', path: '/authority/overview' },
                { icon: '🌐', label: 'Live Network', path: '/authority/network' },
                { icon: '🏥', label: 'Hospitals Directory', path: '/authority/hospitals' },
                { icon: '🚨', label: 'SOS Monitor', path: '/authority/sos' },
                { icon: '📈', label: 'Surge & Crisis', path: '/authority/surge' },
                { icon: '🛡️', label: 'Data Integrity', path: '/authority/integrity' },
                { icon: '📋', label: 'System Reports', path: '/authority/reports' }
            ]
        },
        tourism: {
            title: 'Medical Tourism',
            items: [
                { icon: '🔍', label: 'Find Treatment', path: '/tourism/treatments' },
                { icon: '⚖️', label: 'Compare', path: '/tourism/compare' },
                { icon: '👨‍⚕️', label: 'Specialists Directory', path: '/tourism/hospital-doctor' },
                { icon: '🏡', label: 'Recovery accommodations', path: '/tourism/recovery' },
                { icon: '📅', label: 'Consultation', path: '/tourism/consultation' },
                { icon: '✈️', label: 'Travel Plan', path: '/tourism/travel-plan' }
            ]
        }
    };

    let isSidebarHidden = window.innerWidth <= 1024;

    function toggleSidebar() {
        isSidebarHidden = !isSidebarHidden;
        const sidebar = document.getElementById('sidebar');
        const main = document.getElementById('main-content');
        const backdrop = document.getElementById('sidebar-backdrop');
        const toggleBtn = document.getElementById('sidebar-toggle-btn');
        const isMobile = window.innerWidth <= 1024;

        if (sidebar && main) {
            if (isSidebarHidden) {
                sidebar.classList.add('collapsed');
                main.classList.add('sidebar-collapsed');
                if (backdrop) backdrop.classList.add('hidden');
                if (toggleBtn) {
                    toggleBtn.innerHTML = '☰';
                    toggleBtn.setAttribute('title', 'Show Menu (Expand Sidebar)');
                }
            } else {
                sidebar.classList.remove('collapsed');
                main.classList.remove('sidebar-collapsed');
                if (backdrop && isMobile) backdrop.classList.remove('hidden');
                if (toggleBtn) {
                    toggleBtn.innerHTML = isMobile ? '✕' : '◀';
                    toggleBtn.setAttribute('title', 'Hide Menu (Collapse Sidebar)');
                }
            }
        }
    }

    function handleNavClick(path) {
        if (window.innerWidth <= 1024 && !isSidebarHidden) {
            toggleSidebar();
        }
        window.MediJoints.navigateTo(path);
    }

    function renderNav() {
        const nav = document.getElementById('main-nav');
        const role = MediJointsStore.getCurrentRole();
        if (!role) { nav.classList.add('hidden'); return; }
        nav.classList.remove('hidden');

        const unread = MediJointsStore.getUnreadCount();
        const activeSOSCount = MediJointsStore.getActiveSOSCount();
        const isMobile = window.innerWidth <= 1024;

        nav.innerHTML = `
            <div style="display:flex;align-items:center;gap:var(--space-2)">
                <button id="sidebar-toggle-btn" class="sidebar-toggle-btn" onclick="Navigation.toggleSidebar()" title="${isSidebarHidden ? 'Show Menu (Expand Sidebar)' : 'Hide Menu (Collapse Sidebar)'}">
                    ${isSidebarHidden ? '☰' : (isMobile ? '✕' : '◀')}
                </button>
                <div class="nav-brand" onclick="window.MediJoints.navigateTo('/')">
                    <div class="nav-brand-icon">M</div>
                    <span>Medi Joints</span>
                </div>
            </div>
            <div class="nav-actions">
                <div class="nav-role-switcher">
                    <button class="nav-role-btn ${role === 'patient' ? 'active' : ''}" onclick="window.MediJoints.switchRole('patient')">👤 Patient</button>
                    <button class="nav-role-btn ${role === 'hospital' ? 'active' : ''}" onclick="window.MediJoints.switchRole('hospital')">🏥 Hospital</button>
                    <button class="nav-role-btn ${role === 'authority' ? 'active' : ''}" onclick="window.MediJoints.switchRole('authority')">🏛️ Authority</button>
                    <button class="nav-role-btn ${role === 'tourism' ? 'active' : ''}" onclick="window.MediJoints.switchRole('tourism')">✈️ Tourism</button>
                </div>
                <button class="nav-notification" onclick="window.MediJoints.navigateTo('/patient/notifications')">
                    🔔
                    ${unread > 0 ? `<span class="notification-count">${unread}</span>` : ''}
                </button>
                <button class="nav-reset-btn" onclick="MediJointsStore.resetDemo(); window.MediJoints.refreshPage();">↺ Reset Demo</button>
            </div>
        `;
    }

    function renderSidebar() {
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebar-backdrop');
        const role = MediJointsStore.getCurrentRole();
        if (!role || !sidebarConfig[role]) { 
            sidebar.classList.add('hidden'); 
            if (backdrop) backdrop.classList.add('hidden');
            return; 
        }
        sidebar.classList.remove('hidden');

        const isMobile = window.innerWidth <= 1024;
        if (isSidebarHidden) {
            sidebar.classList.add('collapsed');
            if (backdrop) backdrop.classList.add('hidden');
        } else {
            sidebar.classList.remove('collapsed');
            if (backdrop && isMobile) backdrop.classList.remove('hidden');
        }

        const config = sidebarConfig[role];
        const currentPage = MediJointsStore.getState().currentPage;
        const unread = MediJointsStore.getUnreadCount();
        const activeSOSCount = MediJointsStore.getActiveSOSCount();

        let html = `
        <button class="sidebar-collapse-bar-btn" onclick="Navigation.toggleSidebar()">
            <span>◀ Hide Menu</span>
            <span style="font-size:10px;opacity:0.7">Collapse</span>
        </button>
        <div class="sidebar-section">
            <div class="sidebar-section-title">${config.title}</div>`;

        config.items.forEach(item => {
            const isActive = currentPage === item.path || currentPage.startsWith(item.path + '/');
            const badgeCount = item.badge ? unread : (item.critical ? activeSOSCount : 0);
            html += `<a class="sidebar-link ${isActive ? 'active' : ''}" onclick="Navigation.handleNavClick('${item.path}')">
                <span class="sidebar-link-icon">${item.icon}</span>
                <span>${item.label}</span>
                ${badgeCount > 0 ? `<span class="sidebar-link-badge">${badgeCount}</span>` : ''}
            </a>`;
        });

        html += '</div>';
        sidebar.innerHTML = html;
    }

    function updateLayout() {
        const main = document.getElementById('main-content');
        const role = MediJointsStore.getCurrentRole();
        const sosBtn = document.getElementById('sos-floating-btn');
        const demoBadge = document.getElementById('demo-badge');
        const backdrop = document.getElementById('sidebar-backdrop');
        const isMobile = window.innerWidth <= 1024;

        if (role) {
            main.classList.add('with-nav');
            main.classList.add('with-sidebar');
            if (isSidebarHidden || isMobile) {
                main.classList.add('sidebar-collapsed');
            } else {
                main.classList.remove('sidebar-collapsed');
            }
            demoBadge.classList.remove('hidden');
        } else {
            main.classList.remove('with-nav', 'with-sidebar', 'sidebar-collapsed');
            demoBadge.classList.add('hidden');
            if (backdrop) backdrop.classList.add('hidden');
        }

        if (role === 'patient') {
            sosBtn.classList.remove('hidden');
        } else {
            sosBtn.classList.add('hidden');
        }
    }

    return { renderNav, renderSidebar, updateLayout, toggleSidebar, handleNavClick };
})();
