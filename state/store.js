/* ═══════════════════════════════════════════════
   MEDI JOINTS — Central State Store
   Synthetic Bengaluru dataset, state management,
   event bus, and demo reset
   ═══════════════════════════════════════════════ */

window.MediJointsStore = (function() {

    // ─── Synthetic Hospital Dataset (from spec §8.2) ───
    const INITIAL_HOSPITALS = [
        {
            id: 'h1',
            name: 'Asteria Care Hospital',
            area: 'Koramangala',
            type: 'Multi-Specialty',
            rating: 4.6,
            verified: true,
            accreditations: ['NABH', 'ISO'],
            specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency Medicine', 'General Surgery'],
            phone: '+91 80 4567 1234',
            distance: 2.3,
            eta: 8,
            lat: 35, lng: 55,
            lastUpdated: Date.now() - 180000,  // 3 min ago
            status: 'available',
            beds: {
                General:    { total: 25, available: 18, reserved: 2, occupied: 5 },
                ICU:        { total: 8,  available: 4,  reserved: 1, occupied: 3 },
                Ventilator: { total: 4,  available: 2,  reserved: 0, occupied: 2 },
                Pediatric:  { total: 10, available: 6,  reserved: 1, occupied: 3 },
                Maternity:  { total: 8,  available: 5,  reserved: 0, occupied: 3 },
                Isolation:  { total: 4,  available: 2,  reserved: 0, occupied: 2 },
                Burn:       { total: 2,  available: 1,  reserved: 0, occupied: 1 }
            },
            reviews: [
                { name: 'Priya S.', rating: 5, text: 'Excellent emergency response. Staff was very quick.', date: '2 weeks ago' },
                { name: 'Rahul M.', rating: 4, text: 'Good facilities, clean ICU. Slightly long wait.', date: '1 month ago' }
            ],
            demoPurpose: 'Primary reservation target'
        },
        {
            id: 'h2',
            name: 'Bengaluru Central Medical',
            area: 'Indiranagar',
            type: 'General Hospital',
            rating: 4.2,
            verified: true,
            accreditations: ['NABH'],
            specialties: ['General Medicine', 'Orthopedics', 'Dermatology', 'ENT'],
            phone: '+91 80 4567 5678',
            distance: 3.8,
            eta: 14,
            lat: 28, lng: 62,
            lastUpdated: Date.now() - 900000,  // 15 min ago
            status: 'limited',
            beds: {
                General:    { total: 15, available: 7,  reserved: 1, occupied: 7 },
                ICU:        { total: 4,  available: 1,  reserved: 0, occupied: 3 },
                Ventilator: { total: 2,  available: 0,  reserved: 0, occupied: 2 },
                Pediatric:  { total: 5,  available: 2,  reserved: 0, occupied: 3 },
                Maternity:  { total: 4,  available: 1,  reserved: 0, occupied: 3 },
                Isolation:  { total: 2,  available: 0,  reserved: 0, occupied: 2 },
                Burn:       { total: 0,  available: 0,  reserved: 0, occupied: 0 }
            },
            reviews: [
                { name: 'Anita K.', rating: 4, text: 'Decent care, responsive doctors.', date: '3 weeks ago' }
            ],
            demoPurpose: 'Limited-state visualization'
        },
        {
            id: 'h3',
            name: 'Metro Trauma Institute',
            area: 'Hebbal',
            type: 'Trauma Center',
            rating: 4.8,
            verified: true,
            accreditations: ['NABH', 'JCI', 'ISO'],
            specialties: ['Trauma Surgery', 'Emergency Medicine', 'Neurosurgery', 'Burn Care', 'Critical Care'],
            phone: '+91 80 4567 9012',
            distance: 7.2,
            eta: 22,
            lat: 15, lng: 42,
            lastUpdated: Date.now() - 60000,  // 1 min ago
            status: 'available',
            beds: {
                General:    { total: 20, available: 11, reserved: 1, occupied: 8 },
                ICU:        { total: 12, available: 6,  reserved: 0, occupied: 6 },
                Ventilator: { total: 6,  available: 3,  reserved: 0, occupied: 3 },
                Pediatric:  { total: 4,  available: 2,  reserved: 0, occupied: 2 },
                Maternity:  { total: 0,  available: 0,  reserved: 0, occupied: 0 },
                Isolation:  { total: 6,  available: 3,  reserved: 0, occupied: 3 },
                Burn:       { total: 4,  available: 2,  reserved: 0, occupied: 2 }
            },
            reviews: [
                { name: 'Dr. Venkat R.', rating: 5, text: 'Best trauma care in North Bengaluru.', date: '1 week ago' },
                { name: 'Suresh P.', rating: 5, text: 'Life-saving emergency surgery. Eternally grateful.', date: '2 weeks ago' }
            ],
            demoPurpose: 'SOS/trauma target'
        },
        {
            id: 'h4',
            name: 'Starlight Multi-Specialty',
            area: 'Whitefield',
            type: 'Multi-Specialty',
            rating: 4.1,
            verified: true,
            accreditations: ['ISO'],
            specialties: ['Cardiology', 'Gastroenterology', 'Oncology', 'Pulmonology'],
            phone: '+91 80 4567 3456',
            distance: 12.5,
            eta: 35,
            lat: 40, lng: 82,
            lastUpdated: Date.now() - 2700000,  // 45 min ago
            status: 'critical',
            beds: {
                General:    { total: 12, available: 3,  reserved: 0, occupied: 9 },
                ICU:        { total: 4,  available: 0,  reserved: 0, occupied: 4 },
                Ventilator: { total: 2,  available: 0,  reserved: 0, occupied: 2 },
                Pediatric:  { total: 3,  available: 1,  reserved: 0, occupied: 2 },
                Maternity:  { total: 3,  available: 0,  reserved: 0, occupied: 3 },
                Isolation:  { total: 2,  available: 0,  reserved: 0, occupied: 2 },
                Burn:       { total: 0,  available: 0,  reserved: 0, occupied: 0 }
            },
            reviews: [
                { name: 'Meera J.', rating: 3, text: 'Good doctors but bed availability is always an issue.', date: '1 month ago' }
            ],
            demoPurpose: 'Predictive availability scenario'
        },
        {
            id: 'h5',
            name: 'Greenfield Community Hospital',
            area: 'Jayanagar',
            type: 'Community Hospital',
            rating: 4.4,
            verified: true,
            accreditations: ['NABH'],
            specialties: ['General Medicine', 'Pediatrics', 'Obstetrics', 'General Surgery'],
            phone: '+91 80 4567 7890',
            distance: 4.1,
            eta: 12,
            lat: 55, lng: 35,
            lastUpdated: Date.now() - 300000,  // 5 min ago
            status: 'available',
            beds: {
                General:    { total: 30, available: 22, reserved: 1, occupied: 7 },
                ICU:        { total: 4,  available: 2,  reserved: 0, occupied: 2 },
                Ventilator: { total: 2,  available: 1,  reserved: 0, occupied: 1 },
                Pediatric:  { total: 8,  available: 5,  reserved: 0, occupied: 3 },
                Maternity:  { total: 10, available: 7,  reserved: 0, occupied: 3 },
                Isolation:  { total: 2,  available: 1,  reserved: 0, occupied: 1 },
                Burn:       { total: 0,  available: 0,  reserved: 0, occupied: 0 }
            },
            reviews: [
                { name: 'Lakshmi V.', rating: 5, text: 'Wonderful maternity ward. Very caring staff.', date: '2 weeks ago' },
                { name: 'Karthik N.', rating: 4, text: 'Affordable and reliable. Good for families.', date: '3 weeks ago' }
            ],
            demoPurpose: 'Small-hospital visibility'
        },
        {
            id: 'h6',
            name: 'North City Hospital',
            area: 'Yelahanka',
            type: 'General Hospital',
            rating: 3.5,
            verified: false,
            accreditations: [],
            specialties: ['General Medicine', 'Orthopedics'],
            phone: '+91 80 4567 2345',
            distance: 15.0,
            eta: 42,
            lat: 8, lng: 25,
            lastUpdated: Date.now() - 86400000,  // 24 hours ago
            status: 'offline',
            beds: {
                General:    { total: 10, available: 0, reserved: 0, occupied: 0 },
                ICU:        { total: 2,  available: 0, reserved: 0, occupied: 0 },
                Ventilator: { total: 0,  available: 0, reserved: 0, occupied: 0 },
                Pediatric:  { total: 0,  available: 0, reserved: 0, occupied: 0 },
                Maternity:  { total: 0,  available: 0, reserved: 0, occupied: 0 },
                Isolation:  { total: 0,  available: 0, reserved: 0, occupied: 0 },
                Burn:       { total: 0,  available: 0, reserved: 0, occupied: 0 }
            },
            reviews: [],
            demoPurpose: 'Offline/stale state'
        }
    ];

    // ─── Demo Patient Profile ───
    const INITIAL_PATIENT = {
        id: 'p1',
        name: 'Arjun Sharma',
        phone: '+91 98765 43210',
        email: 'arjun.sharma@demo.com',
        age: 34,
        bloodGroup: 'B+',
        allergies: ['Penicillin', 'Sulfa drugs'],
        conditions: ['Mild asthma'],
        medications: ['Salbutamol inhaler (as needed)'],
        emergencyContact: { name: 'Priya Sharma', relation: 'Spouse', phone: '+91 98765 43211' },
        language: 'English'
    };

    // ─── Medical Tourism Treatments ───
    const TREATMENTS = [
        {
            id: 't1', procedure: 'Knee Replacement', specialty: 'Orthopedics', icon: '🦿',
            hospitals: [
                { hospitalId: 'h1', cost: '₹2,50,000 – ₹4,00,000', doctor: 'Dr. Ramesh Kulkarni', experience: '18 years', procedures: 2400, successRate: '97.5%', intlSupport: true },
                { hospitalId: 'h3', cost: '₹3,00,000 – ₹5,00,000', doctor: 'Dr. Anil Deshmukh', experience: '22 years', procedures: 3100, successRate: '98.2%', intlSupport: true },
                { hospitalId: 'h5', cost: '₹1,80,000 – ₹3,00,000', doctor: 'Dr. Sunita Rao', experience: '12 years', procedures: 950, successRate: '96.8%', intlSupport: false }
            ]
        },
        {
            id: 't2', procedure: 'Cardiac Bypass (CABG)', specialty: 'Cardiology', icon: '❤️',
            hospitals: [
                { hospitalId: 'h1', cost: '₹3,50,000 – ₹6,00,000', doctor: 'Dr. Vikram Patel', experience: '25 years', procedures: 5200, successRate: '99.1%', intlSupport: true },
                { hospitalId: 'h4', cost: '₹3,00,000 – ₹5,50,000', doctor: 'Dr. Meena Iyer', experience: '20 years', procedures: 3800, successRate: '98.5%', intlSupport: true }
            ]
        },
        {
            id: 't3', procedure: 'IVF Treatment', specialty: 'Reproductive Medicine', icon: '👶',
            hospitals: [
                { hospitalId: 'h1', cost: '₹1,50,000 – ₹2,50,000', doctor: 'Dr. Kavita Nair', experience: '15 years', procedures: 1800, successRate: '52%', intlSupport: true },
                { hospitalId: 'h5', cost: '₹1,00,000 – ₹1,80,000', doctor: 'Dr. Deepa Murthy', experience: '10 years', procedures: 620, successRate: '48%', intlSupport: false }
            ]
        },
        {
            id: 't4', procedure: 'Spinal Surgery', specialty: 'Neurosurgery', icon: '🦴',
            hospitals: [
                { hospitalId: 'h3', cost: '₹4,00,000 – ₹8,00,000', doctor: 'Dr. Ashok Reddy', experience: '28 years', procedures: 4500, successRate: '97.8%', intlSupport: true },
                { hospitalId: 'h1', cost: '₹3,50,000 – ₹7,00,000', doctor: 'Dr. Nisha Hegde', experience: '16 years', procedures: 1200, successRate: '96.5%', intlSupport: true }
            ]
        },
        {
            id: 't5', procedure: 'Cancer Treatment', specialty: 'Oncology', icon: '🎗️',
            hospitals: [
                { hospitalId: 'h4', cost: '₹5,00,000 – ₹15,00,000', doctor: 'Dr. Sanjay Gupta', experience: '30 years', procedures: 6000, successRate: '85%', intlSupport: true }
            ]
        },
        {
            id: 't6', procedure: 'Hip Replacement', specialty: 'Orthopedics', icon: '🏥',
            hospitals: [
                { hospitalId: 'h1', cost: '₹2,80,000 – ₹4,50,000', doctor: 'Dr. Ramesh Kulkarni', experience: '18 years', procedures: 1800, successRate: '97%', intlSupport: true },
                { hospitalId: 'h3', cost: '₹3,20,000 – ₹5,50,000', doctor: 'Dr. Anil Deshmukh', experience: '22 years', procedures: 2200, successRate: '98%', intlSupport: true }
            ]
        }
    ];

    // ─── State ───
    let state = {
        currentRole: null,  // 'patient', 'hospital', 'authority', 'tourism', null (landing)
        currentPage: '/',
        hospitals: JSON.parse(JSON.stringify(INITIAL_HOSPITALS)),
        patient: JSON.parse(JSON.stringify(INITIAL_PATIENT)),
        treatments: JSON.parse(JSON.stringify(TREATMENTS)),
        reservations: [],
        sosIncidents: [],
        notifications: [],
        activityFeed: [],
        selectedHospital: null,
        selectedTreatment: null,
        compareList: [],
        filters: {
            bedType: 'All',
            availableOnly: false,
            search: ''
        },
        demoHospitalId: 'h1',  // Currently viewing hospital in hospital role
        activeTriageCall: null, // Cross-role live doctor-in-the-loop screening call
        _idCounter: 1
    };

    // ─── Deep Clone ───
    function deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // ─── Getters ───
    function getState() { return state; }
    function getHospitals() { return state.hospitals; }
    function getHospital(id) { return state.hospitals.find(h => h.id === id); }
    function getPatient() { return state.patient; }
    function getReservations() { return state.reservations; }
    function getSOSIncidents() { return state.sosIncidents; }
    function getNotifications() { return state.notifications; }
    function getActivityFeed() { return state.activityFeed; }
    function getTreatments() { return state.treatments; }
    function getTreatment(id) { return state.treatments.find(t => t.id === id); }
    function getCurrentRole() { return state.currentRole; }

    function getFilteredHospitals() {
        let list = state.hospitals;
        if (state.filters.bedType && state.filters.bedType !== 'All') {
            list = list.filter(h => h.beds[state.filters.bedType] && h.beds[state.filters.bedType].available > 0);
        }
        if (state.filters.availableOnly) {
            list = list.filter(h => h.status !== 'offline' && h.status !== 'critical');
        }
        if (state.filters.search) {
            const s = state.filters.search.toLowerCase();
            list = list.filter(h => h.name.toLowerCase().includes(s) || h.area.toLowerCase().includes(s));
        }
        return list;
    }

    function getTotalBeds(type) {
        return state.hospitals.reduce((sum, h) => {
            if (type && h.beds[type]) return sum + h.beds[type].available;
            if (!type) return sum + Object.values(h.beds).reduce((s, b) => s + b.available, 0);
            return sum;
        }, 0);
    }

    function getActiveSOSCount() {
        return state.sosIncidents.filter(s => s.status !== 'resolved' && s.status !== 'cancelled').length;
    }

    function getStaleHospitals() {
        const threshold = Date.now() - 3600000; // 1 hour
        return state.hospitals.filter(h => h.lastUpdated < threshold);
    }

    // ─── Unique ID ───
    function genId(prefix) {
        return `${prefix}-${Date.now()}-${state._idCounter++}`;
    }

    // ─── Mutations ───
    function setCurrentRole(role) {
        state.currentRole = role;
        EventBus.emit('role.changed', { role });
    }

    function setCurrentPage(page) {
        state.currentPage = page;
    }

    function setFilter(key, value) {
        state.filters[key] = value;
        EventBus.emit('filters.changed', state.filters);
    }

    function updateBedCount(hospitalId, category, field, delta) {
        const hospital = getHospital(hospitalId);
        if (!hospital || !hospital.beds[category]) return;
        const bed = hospital.beds[category];
        const newVal = Math.max(0, Math.min(bed.total, bed[field] + delta));
        bed[field] = newVal;
        // Recalculate
        bed.available = Math.max(0, bed.total - bed.reserved - bed.occupied);
        hospital.lastUpdated = Date.now();
        // Recalculate status
        updateHospitalStatus(hospital);
        EventBus.emit('bed.updated', { hospitalId, category, field, delta, hospital: deepClone(hospital) });
        addActivity('bed_update', `${hospital.name} updated ${category} beds`, hospitalId);
        addNotification('bed_update', `Bed Update: ${hospital.name}`, `${category} availability changed. ${bed.available} now available.`);
    }

    function publishBedUpdate(hospitalId) {
        const hospital = getHospital(hospitalId);
        if (!hospital) return;
        hospital.lastUpdated = Date.now();
        updateHospitalStatus(hospital);
        EventBus.emit('bed.published', { hospitalId, hospital: deepClone(hospital) });
        addActivity('bed_publish', `${hospital.name} published bed update`, hospitalId);
        addNotification('system', 'Bed Data Published', `${hospital.name} capacity data synced across network.`);
    }

    function updateHospitalStatus(hospital) {
        const totalAvailable = Object.values(hospital.beds).reduce((s, b) => s + b.available, 0);
        const totalBeds = Object.values(hospital.beds).reduce((s, b) => s + b.total, 0);
        if (hospital.lastUpdated < Date.now() - 3600000) {
            hospital.status = 'offline';
        } else if (totalAvailable === 0) {
            hospital.status = 'critical';
        } else if (totalAvailable / totalBeds < 0.25) {
            hospital.status = 'limited';
        } else {
            hospital.status = 'available';
        }
    }

    function createReservation(hospitalId, bedCategory) {
        const hospital = getHospital(hospitalId);
        if (!hospital || !hospital.beds[bedCategory] || hospital.beds[bedCategory].available <= 0) return null;
        const bed = hospital.beds[bedCategory];
        bed.available -= 1;
        bed.reserved += 1;
        hospital.lastUpdated = Date.now();
        updateHospitalStatus(hospital);
        const reservation = {
            id: genId('RES'),
            patientId: state.patient.id,
            patientName: state.patient.name,
            hospitalId,
            hospitalName: hospital.name,
            category: bedCategory,
            status: 'confirmed',
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
            eta: hospital.eta
        };
        state.reservations.unshift(reservation);
        EventBus.emit('reservation.created', { reservation: deepClone(reservation), hospital: deepClone(hospital) });
        addActivity('reservation', `Reservation confirmed at ${hospital.name} — ${bedCategory}`, hospitalId);
        addNotification('reservation', 'Reservation Confirmed', `${bedCategory} bed reserved at ${hospital.name}. ID: ${reservation.id}`);
        return reservation;
    }

    function acceptReservation(reservationId) {
        const res = state.reservations.find(r => r.id === reservationId);
        if (!res) return;
        res.status = 'accepted';
        EventBus.emit('reservation.accepted', { reservation: deepClone(res) });
        addActivity('reservation_accepted', `${res.hospitalName} accepted reservation ${res.id}`, res.hospitalId);
        addNotification('reservation', 'Reservation Accepted', `${res.hospitalName} has accepted your reservation.`);
    }

    function createSOS(condition) {
        const ranked = rankHospitalsForSOS(condition);
        const incident = {
            id: genId('SOS'),
            patientId: state.patient.id,
            patientName: state.patient.name,
            location: 'Koramangala, Bengaluru',
            condition: condition || 'Emergency',
            priority: 'critical',
            status: 'dispatching',
            rankedHospitals: ranked,
            acceptedHospitalId: null,
            createdAt: Date.now(),
            timeline: [
                { event: 'SOS Triggered', time: Date.now(), status: 'completed' },
                { event: 'Hospitals Alerted', time: Date.now() + 500, status: 'completed' },
                { event: 'Awaiting Acceptance', time: null, status: 'active' },
                { event: 'Route Active', time: null, status: 'pending' }
            ]
        };
        state.sosIncidents.unshift(incident);
        EventBus.emit('sos.created', { incident: deepClone(incident) });
        addActivity('sos', `Emergency SOS triggered — ${condition || 'Emergency'}`, null);
        addNotification('sos', '🚨 SOS Alert', `Emergency SOS dispatched. ${ranked.length} hospitals alerted.`);
        return incident;
    }

    function acceptSOS(incidentId, hospitalId) {
        const incident = state.sosIncidents.find(s => s.id === incidentId);
        if (!incident) return;
        incident.status = 'accepted';
        incident.acceptedHospitalId = hospitalId;
        const hospital = getHospital(hospitalId);
        incident.timeline[2] = { event: `${hospital.name} Accepted`, time: Date.now(), status: 'completed' };
        incident.timeline[3] = { event: 'Route Active', time: Date.now(), status: 'active' };
        EventBus.emit('sos.accepted', { incident: deepClone(incident), hospital: deepClone(hospital) });
        addActivity('sos_accepted', `${hospital.name} accepted SOS ${incident.id}`, hospitalId);
        addNotification('sos', 'SOS Accepted!', `${hospital.name} is ready. ETA: ${hospital.eta} min.`);
    }

    function rankHospitalsForSOS(condition) {
        const cond = (condition || '').toLowerCase();
        const needsICU = cond.includes('chest') || cond.includes('breathing') || cond.includes('cardiac') || cond.includes('accident') || cond.includes('trauma');
        return state.hospitals
            .filter(h => h.status !== 'offline')
            .map(h => {
                let score = 0;
                const totalAvail = Object.values(h.beds).reduce((s, b) => s + b.available, 0);
                score += totalAvail * 2;
                if (needsICU && h.beds.ICU.available > 0) score += 30;
                if (needsICU && h.beds.Ventilator.available > 0) score += 20;
                if (h.specialties.some(s => s.toLowerCase().includes('trauma') || s.toLowerCase().includes('emergency'))) score += 15;
                score -= h.eta;
                score += h.rating * 3;
                if (h.verified) score += 5;
                const reasons = [];
                if (needsICU && h.beds.ICU.available > 0) reasons.push(`${h.beds.ICU.available} ICU beds available`);
                if (needsICU && h.beds.Ventilator.available > 0) reasons.push(`${h.beds.Ventilator.available} ventilators`);
                if (h.specialties.some(s => s.toLowerCase().includes('trauma'))) reasons.push('Trauma center');
                if (h.specialties.some(s => s.toLowerCase().includes('emergency'))) reasons.push('Emergency medicine');
                reasons.push(`ETA: ${h.eta} min`);
                reasons.push(`Rating: ${h.rating}★`);
                return { hospital: deepClone(h), score, reasons };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
    }

    function addNotification(type, title, body) {
        const notif = {
            id: genId('NOTIF'),
            type,
            title,
            body,
            read: false,
            createdAt: Date.now()
        };
        state.notifications.unshift(notif);
        if (state.notifications.length > 50) state.notifications.pop();
        EventBus.emit('notification.added', notif);
    }

    function markNotificationRead(id) {
        const n = state.notifications.find(n => n.id === id);
        if (n) n.read = true;
    }

    function getUnreadCount() {
        return state.notifications.filter(n => !n.read).length;
    }

    function addActivity(type, message, hospitalId) {
        state.activityFeed.unshift({
            id: genId('ACT'),
            type,
            message,
            hospitalId,
            timestamp: Date.now()
        });
        if (state.activityFeed.length > 100) state.activityFeed.pop();
    }

    function resetDemo() {
        state.hospitals = JSON.parse(JSON.stringify(INITIAL_HOSPITALS));
        state.patient = JSON.parse(JSON.stringify(INITIAL_PATIENT));
        state.reservations = [];
        state.sosIncidents = [];
        state.notifications = [];
        state.activityFeed = [];
        state.selectedHospital = null;
        state.compareList = [];
        state.filters = { bedType: 'All', availableOnly: false, search: '' };
        state._idCounter = 1;
        EventBus.emit('demo.reset');
        addNotification('system', 'Demo Reset', 'All data restored to initial state.');
    }

    function selectHospital(id) {
        state.selectedHospital = id;
    }

    function selectTreatment(id) {
        state.selectedTreatment = id;
    }

    function toggleCompare(hospitalId) {
        const idx = state.compareList.indexOf(hospitalId);
        if (idx >= 0) {
            state.compareList.splice(idx, 1);
        } else if (state.compareList.length < 3) {
            state.compareList.push(hospitalId);
        }
    }

    // ─── AI Triage (deterministic demo) ───
    function triageSymptoms(input) {
        const text = input.toLowerCase();
        if (text.includes('chest pain') || text.includes('breathing') || text.includes('cardiac') || text.includes('unconscious') || text.includes('heart')) {
            return {
                urgency: 'Critical',
                urgencyClass: 'critical',
                rationale: 'Symptoms suggest a potential cardiac or respiratory emergency. Immediate medical attention is required.',
                recommendedCare: 'ICU / Trauma Center / Emergency Room',
                action: 'SOS recommended — Smart Emergency Dispatch',
                matchedHospitals: rankHospitalsForSOS(input).map(r => r.hospital.id)
            };
        }
        if (text.includes('fracture') || text.includes('severe pain') || text.includes('high fever') || text.includes('bleeding') || text.includes('accident')) {
            return {
                urgency: 'Urgent',
                urgencyClass: 'warning',
                rationale: 'Symptoms indicate a condition requiring prompt medical attention. Emergency room visit recommended.',
                recommendedCare: 'Emergency Room / Specialty Ward',
                action: 'Fast-track reservation recommended',
                matchedHospitals: state.hospitals.filter(h => h.status !== 'offline').slice(0, 4).map(h => h.id)
            };
        }
        return {
            urgency: 'Non-Urgent',
            urgencyClass: 'success',
            rationale: 'Symptoms suggest a non-critical condition. A scheduled consultation or OPD visit is appropriate.',
            recommendedCare: 'OPD / General Consultation',
            action: 'View nearby hospitals and book consultation',
            matchedHospitals: state.hospitals.filter(h => h.status !== 'offline').map(h => h.id)
        };
    }

    function getActiveTriageCall() { return state.activeTriageCall; }
    function setActiveTriageCall(call) { state.activeTriageCall = call; }

    return {
        getState, getHospitals, getHospital, getPatient, getReservations, getSOSIncidents,
        getNotifications, getActivityFeed, getTreatments, getTreatment, getCurrentRole,
        getFilteredHospitals, getTotalBeds, getActiveSOSCount, getStaleHospitals, getUnreadCount,
        setCurrentRole, setCurrentPage, setFilter, updateBedCount, publishBedUpdate,
        createReservation, acceptReservation, createSOS, acceptSOS,
        addNotification, markNotificationRead, addActivity, resetDemo,
        selectHospital, selectTreatment, toggleCompare, triageSymptoms, genId, deepClone,
        getActiveTriageCall, setActiveTriageCall
    };
})();
