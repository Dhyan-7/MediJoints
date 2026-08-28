/* ═══════════════════════════════════════════════
   MEDI JOINTS — Application Orchestration
   Client-side routing, role switching, wireups
   ═══════════════════════════════════════════════ */

window.MediJoints = (function() {

    const routes = {
        // Landing
        '/': () => LandingPage.render(),

        // Patient Role
        '/patient/dashboard': () => PatientDashboard.render(),
        '/patient/hospitals': () => PatientHospitalsPage.render(),
        '/patient/hospital/:id': (id) => HospitalDetail.render(id),
        '/patient/ambulance': () => AmbulancePage.render(),
        '/patient/ai-triage': () => AITriagePage.render(),
        '/patient/reservation/:id': (id) => ReservationPage.render(id),
        '/patient/reservations': () => {
            // Render active list or history
            const res = MediJointsStore.getReservations();
            return `<div class="page-container" style="max-width:700px">
                <div class="page-header">
                    <h2>📋 My Reservations</h2>
                </div>
                ${res.length === 0 ? UI.emptyState('📋', 'No active reservations', 'Go to the Dashboard to reserve a bed.') :
                  res.map(r => `
                    <div class="card card-elevated" style="margin-bottom:var(--space-4)">
                        <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-2)">
                            <div class="font-bold">${r.hospitalName}</div>
                            <span class="badge badge-primary">${r.category}</span>
                        </div>
                        <div class="text-sm text-muted">ID: ${r.id}</div>
                        <div class="text-sm text-muted">ETA: ${r.eta} min • Hold: ${UI.countdown(r.expiresAt)}</div>
                    </div>
                  `).join('')}
            </div>`;
        },
        '/patient/sos': () => SOSPage.render(),
        '/patient/profile': () => PatientProfile.render(),
        '/patient/notifications': () => NotificationsPage.render(),

        // Hospital Role
        '/hospital/overview': () => HospitalOverview.render(),
        '/hospital/beds': () => BedManagement.render(),
        '/hospital/reservations': () => HospitalReservations.render(),
        '/hospital/sos': () => HospitalSOSAlerts.render(),
        '/hospital/arrivals': () => PatientArrival.render(),
        '/hospital/analytics': () => HospitalAnalytics.render(),
        '/hospital/patients': () => HospitalPatientsRegistry.render(),
        '/hospital/facility': () => HospitalFacilitySettings.render(),
        '/hospital/billing': () => HospitalBillingSettings.render(),

        // Authority Role
        '/authority/overview': () => AuthorityOverview.render(),
        '/authority/network': () => LiveNetwork.render(),
        '/authority/hospitals': () => AuthorityHospitalsDirectory.render(),
        '/authority/sos': () => SOSMonitor.render(),
        '/authority/surge': () => SurgeCrisis.render(),
        '/authority/integrity': () => DataIntegrity.render(),
        '/authority/reports': () => AuthorityReportsPage.render(),

        // Medical Tourism
        '/tourism/treatments': () => TreatmentSearch.render(),
        '/tourism/compare': () => TreatmentCompare.render(),
        '/tourism/hospital-doctor': () => TourismHospitalDoctorDirectory.render(),
        '/tourism/recovery': () => TourismRecoveryPage.render(),
        '/tourism/consultation': () => PreArrivalConsultation.render(),
        '/tourism/travel-plan': () => TravelPlan.render()
    };

    function navigateTo(path) {
        // Handle routes with path parameters (e.g. /patient/hospital/h1)
        MediJointsStore.setCurrentPage(path);
        history.pushState(null, null, '#' + path);
        resolveRoute();
    }

    function switchRole(role) {
        MediJointsStore.setCurrentRole(role);
        // Direct to home of that role
        const roleHome = {
            patient: '/patient/dashboard',
            hospital: '/hospital/overview',
            authority: '/authority/overview',
            tourism: '/tourism/treatments'
        };
        navigateTo(role ? roleHome[role] : '/');
    }

    function resolveRoute() {
        const hash = window.location.hash.slice(1) || '/';
        let renderFn = routes[hash];
        let params = [];

        // Simple path parameter matching for SPA router
        if (!renderFn) {
            for (const route in routes) {
                const routeParts = route.split('/');
                const hashParts = hash.split('/');
                if (routeParts.length === hashParts.length) {
                    let match = true;
                    params = [];
                    for (let i = 0; i < routeParts.length; i++) {
                        if (routeParts[i].startsWith(':')) {
                            params.push(hashParts[i]);
                        } else if (routeParts[i] !== hashParts[i]) {
                            match = false;
                            break;
                        }
                    }
                    if (match) {
                        renderFn = routes[route];
                        break;
                    }
                }
            }
        }

        const mainContent = document.getElementById('main-content');
        if (renderFn) {
            mainContent.innerHTML = renderFn(...params);
        } else {
            mainContent.innerHTML = `<div class="page-container">${UI.emptyState('🕵️', '404 Page Not Found', 'This page does not exist.')}</div>`;
        }

        Navigation.renderNav();
        Navigation.renderSidebar();
        Navigation.updateLayout();
        window.scrollTo(0, 0);
    }

    function refreshPage() {
        resolveRoute();
    }

    // Initialize application
    function init() {
        window.addEventListener('hashchange', resolveRoute);
        
        // Listen to global store reset to force page updates
        EventBus.on('demo.reset', () => {
            AITriagePage.reset();
            ReservationPage.reset();
            SOSPage.reset();
            AmbulancePage.reset();
            refreshPage();
        });

        // Set role based on route initially
        const hash = window.location.hash.slice(1) || '/';
        if (hash.startsWith('/patient')) {
            MediJointsStore.setCurrentRole('patient');
        } else if (hash.startsWith('/hospital')) {
            MediJointsStore.setCurrentRole('hospital');
        } else if (hash.startsWith('/authority')) {
            MediJointsStore.setCurrentRole('authority');
        } else if (hash.startsWith('/tourism')) {
            MediJointsStore.setCurrentRole('tourism');
        } else {
            MediJointsStore.setCurrentRole(null);
        }

        MediJointsStore.setCurrentPage(hash);
        resolveRoute();
    }

    // Run initialization when DOM loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return { navigateTo, switchRole, refreshPage };
})();
