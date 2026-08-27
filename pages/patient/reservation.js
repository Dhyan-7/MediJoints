/* ═══════════════════════════════════════════════
   MEDI JOINTS — Reservation Page (P05/P07)
   Step wizard: Bed Type → Patient Details → Doctor Screening → Review → Confirmed
   ═══════════════════════════════════════════════ */

window.ReservationPage = (function() {

    let step = 1;
    let selectedCategory = 'ICU';
    let currentReservation = null;
    let countdownInterval = null;
    let callStatus = 'idle'; // idle, calling, connected, approved
    let callTimer = null;
    let lastHospitalId = null;

    function reset() {
        step = 1;
        selectedCategory = 'ICU';
        currentReservation = null;
        callStatus = 'idle';
        if (countdownInterval) clearInterval(countdownInterval);
        if (callTimer) clearTimeout(callTimer);
    }

    function setCategory(cat) {
        selectedCategory = cat;
        window.MediJoints.refreshPage();
    }

    // Wire up event listener for hospital approval
    EventBus.on('triage.approved', (data) => {
        if (callStatus === 'connected' || callStatus === 'calling' || callStatus === 'waiting_approval') {
            callStatus = 'approved';
            Toast.show('✓ Admittance Approved', 'Doctor approved your bed admission!', 'success');
            window.MediJoints.refreshPage();
        }
    });

    function startScreeningCall() {
        callStatus = 'calling';
        const hospitalId = MediJointsStore.getState().selectedHospital || 'h1';
        
        // Push triage call to global state
        MediJointsStore.setActiveTriageCall({
            patientName: MediJointsStore.getPatient().name,
            hospitalId: hospitalId,
            category: selectedCategory,
            status: 'requested',
            createdAt: Date.now()
        });

        // Notify hospital workspace
        EventBus.emit('triage.requested', { hospitalId });
        window.MediJoints.refreshPage();
        
        callTimer = setTimeout(() => {
            callStatus = 'waiting_approval';
            window.MediJoints.refreshPage();
        }, 2000);
    }

    function nextStep() {
        if (step === 3 && callStatus !== 'approved') {
            Toast.show('⚠️ Screening Required', 'Please complete the doctor screening call first.', 'warning');
            return;
        }

        step++;
        if (step === 5) {
            // Confirm reservation
            const hospitalId = MediJointsStore.getState().selectedHospital || 'h1';
            currentReservation = MediJointsStore.createReservation(hospitalId, selectedCategory);
            if (!currentReservation) {
                Toast.show('⚠️ Reservation Failed', 'No beds available for this category', 'warning');
                step = 1;
            } else {
                // Start countdown refresh
                countdownInterval = setInterval(() => {
                    const el = document.getElementById('countdown-timer');
                    if (el && currentReservation) {
                        el.textContent = UI.countdown(currentReservation.expiresAt);
                    }
                }, 1000);
            }
        }
        window.MediJoints.refreshPage();
    }

    function prevStep() {
        if (step > 1) step--;
        window.MediJoints.refreshPage();
    }

    function render(hospitalId) {
        const hId = hospitalId || MediJointsStore.getState().selectedHospital || 'h1';
        if (hId !== lastHospitalId) {
            reset();
            lastHospitalId = hId;
        }
        MediJointsStore.selectHospital(hId);
        const hospital = MediJointsStore.getHospital(hId);
        const patient = MediJointsStore.getPatient();
        if (!hospital) return `<div class="page-container">${UI.emptyState('🏥', 'Hospital not found', '')}</div>`;

        const categories = Object.keys(hospital.beds).filter(c => hospital.beds[c].total > 0);

        return `<div class="page-container" style="max-width:700px">
            <button class="btn btn-ghost" onclick="window.MediJoints.navigateTo('/patient/hospital/${hId}')" style="margin-bottom:var(--space-4)">← Back</button>

            <!-- Stepper -->
            <div style="display:flex;align-items:center;justify-content:center;gap:var(--space-2);margin-bottom:var(--space-8)">
                ${[{n:1,l:'Bed Type'},{n:2,l:'Details'},{n:3,l:'Screening'},{n:4,l:'Review'},{n:5,l:'Confirmed'}].map((s, i) => `
                    <div class="stepper-step ${step > s.n ? 'completed' : step === s.n ? 'active' : ''}">
                        <div class="stepper-circle">${step > s.n ? '✓' : s.n}</div>
                    </div>
                    ${i < 4 ? `<div class="stepper-line ${step > s.n ? 'completed' : ''}"></div>` : ''}
                `).join('')}
            </div>

            <div class="card card-elevated animate-fade-in-up">
                <!-- Hospital Mini Header -->
                <div style="display:flex;align-items:center;gap:var(--space-3);padding-bottom:var(--space-4);border-bottom:1px solid var(--color-border-light);margin-bottom:var(--space-5)">
                    <div style="width:44px;height:44px;border-radius:var(--radius-md);background:rgba(var(--color-primary-rgb),0.1);display:flex;align-items:center;justify-content:center;font-size:var(--font-size-xl)">🏥</div>
                    <div>
                        <div class="font-semibold">${hospital.name}</div>
                        <div class="text-sm text-muted">${hospital.area} • ETA: ${hospital.eta} min</div>
                    </div>
                    ${UI.statusBadge(hospital.status)}
                </div>

                ${step === 1 ? renderStep1(categories, hospital) : ''}
                ${step === 2 ? renderStep2(patient) : ''}
                ${step === 3 ? renderStep3DoctorScreening(hospital, patient) : ''}
                ${step === 4 ? renderStep4Review(hospital, patient) : ''}
                ${step === 5 ? renderStep5Confirmed(hospital) : ''}
            </div>
        </div>`;
    }

    function renderStep1(categories, hospital) {
        return `<h3 style="margin-bottom:var(--space-4)">Select Bed Category</h3>
            <div style="display:grid;gap:var(--space-3)">
                ${categories.map(cat => {
                    const b = hospital.beds[cat];
                    const icons = { General: '🛏️', ICU: '🫀', Ventilator: '💨', Pediatric: '👶', Maternity: '🤰', Isolation: '🔬', Burn: '🔥' };
                    const isSelected = selectedCategory === cat;
                    const isAvailable = b.available > 0;
                    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-4);border-radius:var(--radius-md);border:2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border-light)'};cursor:${isAvailable ? 'pointer' : 'not-allowed'};opacity:${isAvailable ? 1 : 0.5};background:${isSelected ? 'rgba(var(--color-primary-rgb),0.04)' : 'transparent'};transition:all var(--transition-fast)" 
                            onclick="${isAvailable ? `ReservationPage.setCategory('${cat}')` : ''}">
                        <div style="display:flex;align-items:center;gap:var(--space-3)">
                            <span style="font-size:var(--font-size-xl)">${icons[cat]}</span>
                            <div>
                                <div class="font-semibold">${cat}</div>
                                <div class="text-sm text-muted">${b.available} available of ${b.total}</div>
                            </div>
                        </div>
                        <div style="font-weight:700;color:${b.available > 2 ? 'var(--color-success)' : b.available > 0 ? 'var(--color-warning)' : 'var(--color-critical)'}">
                            ${b.available}
                        </div>
                    </div>`;
                }).join('')}
            </div>
            <div style="display:flex;justify-content:flex-end;margin-top:var(--space-6)">
                <button class="btn btn-primary btn-lg" onclick="ReservationPage.nextStep()">Continue →</button>
            </div>`;
    }

    function renderStep2(patient) {
        return `<h3 style="margin-bottom:var(--space-4)">Patient Details</h3>
            <div style="display:grid;gap:var(--space-4)">
                <div class="input-group">
                    <label class="input-label">Full Name</label>
                    <input class="input-field" value="${patient.name}" readonly style="background:var(--color-surface)">
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)">
                    <div class="input-group">
                        <label class="input-label">Phone</label>
                        <input class="input-field" value="${patient.phone}" readonly style="background:var(--color-surface)">
                    </div>
                    <div class="input-group">
                        <label class="input-label">Blood Group</label>
                        <input class="input-field" value="${patient.bloodGroup}" readonly style="background:var(--color-surface)">
                    </div>
                </div>
                <div class="input-group">
                    <label class="input-label">Known Allergies</label>
                    <input class="input-field" value="${patient.allergies.join(', ')}" readonly style="background:var(--color-surface)">
                </div>
                <div style="padding:var(--space-3);background:rgba(var(--color-accent-rgb),0.06);border-radius:var(--radius-md);font-size:var(--font-size-sm);color:var(--color-accent)">
                    ℹ️ Demo data — pre-filled patient profile. In production, patients manage their own health profile.
                </div>
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:var(--space-6)">
                <button class="btn btn-ghost" onclick="ReservationPage.prevStep()">← Back</button>
                <button class="btn btn-primary btn-lg" onclick="ReservationPage.nextStep()">Continue →</button>
            </div>`;
    }

    function renderStep3DoctorScreening(hospital, patient) {
        let screeningContent = '';

        if (callStatus === 'idle') {
            screeningContent = `
                <div style="text-align:center;padding:var(--space-6)">
                    <div style="font-size:3.5rem;margin-bottom:var(--space-4);animation:float 3s infinite">🩺</div>
                    <h4 style="margin-bottom:var(--space-2)">Doctor Consultation & Screening</h4>
                    <p class="text-sm text-muted" style="margin-bottom:var(--space-6)">
                        To confirm this planned bed reservation, you must complete a quick video screening call with the on-duty hospital triage doctor to evaluate admission necessity.
                    </p>
                    <button class="btn btn-accent btn-lg" onclick="ReservationPage.startScreeningCall()">
                        📞 Start Screening Call (1-Min)
                    </button>
                </div>
            `;
        } else if (callStatus === 'calling') {
            screeningContent = `
                <div style="text-align:center;padding:var(--space-6)">
                    <div class="animate-spin" style="width:50px;height:50px;border:3px solid var(--color-border);border-top-color:var(--color-accent);border-radius:50%;margin:0 auto var(--space-4)"></div>
                    <h4 style="margin-bottom:var(--space-1)">Dialing Hospital Triage Doctor...</h4>
                    <p class="text-xs text-muted">Establishing secure video/audio channel</p>
                </div>
            `;
        } else if (callStatus === 'waiting_approval') {
            screeningContent = `
                <div style="text-align:center;padding:var(--space-6)">
                    <div class="animate-pulse" style="font-size:3rem;margin-bottom:var(--space-4)">🔔</div>
                    <h4 style="margin-bottom:var(--space-2)">Waiting for Doctor to Join Call...</h4>
                    <p class="text-sm text-muted" style="margin-bottom:var(--space-5)">
                        Your admittance screening call is ringing on the triage doctor's panel.
                    </p>
                    <div style="padding:var(--space-4);background:rgba(var(--color-primary-rgb),0.04);border-radius:var(--radius-md);font-size:var(--font-size-xs);color:var(--color-text-secondary);text-align:left;border-left:3px solid var(--color-primary);margin-bottom:var(--space-4)">
                        💡 <strong>Cross-Role Action Required:</strong> Switch to the <strong>Hospital</strong> Workspace (using the switcher in the top right), view the dashboard Overview, and click <strong>Join & Approve Call</strong>.
                    </div>
                    <button class="btn btn-ghost btn-sm" onclick="EventBus.emit('triage.approved');">
                        (Simulate Doctor Accept Client-Side)
                    </button>
                </div>
            `;
        } else if (callStatus === 'connected') {
            screeningContent = `
                <div style="padding:var(--space-4);background:#000;color:#fff;border-radius:var(--radius-lg);margin-bottom:var(--space-4)">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">
                        <span class="badge badge-critical badge-dot animate-pulse">Live Screening Call</span>
                        <span style="font-size:var(--font-size-xs);color:rgba(255,255,255,0.6)">00:08</span>
                    </div>
                    <div style="display:flex;gap:var(--space-4);align-items:center">
                        <div style="width:70px;height:70px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:2rem">👨‍⚕️</div>
                        <div>
                            <div class="font-bold">Dr. Sarah Paul</div>
                            <div style="font-size:var(--font-size-xs);color:rgba(255,255,255,0.6)">On-Duty Triage Officer • ${hospital.name}</div>
                            <p style="margin-top:var(--space-2);font-size:var(--font-size-sm);font-style:italic">"Reviewing symptoms. Please stay on the line..."</p>
                        </div>
                    </div>
                </div>
                <div style="text-align:center">
                    <span class="text-xs text-muted animate-pulse">Evaluating patient file for admittance approval...</span>
                </div>
            `;
        } else if (callStatus === 'approved') {
            screeningContent = `
                <div style="text-align:center;padding:var(--space-6)">
                    <div style="width:60px;height:60px;border-radius:50%;background:var(--color-success-light);color:var(--color-success);display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto var(--space-4)">✓</div>
                    <h4 style="color:var(--color-success);margin-bottom:var(--space-2)">Admission Approved</h4>
                    <p class="text-sm text-muted" style="margin-bottom:var(--space-4)">
                        Dr. Sarah Paul has verified the case symptoms and approved the ${selectedCategory} bed reservation.
                    </p>
                    <div style="padding:var(--space-3);background:var(--color-surface);border-radius:var(--radius-md);text-align:left;font-size:var(--font-size-sm);margin-bottom:var(--space-4)">
                        <strong>Clinical Assessment:</strong> Patient requires immediate monitoring and ${selectedCategory} care.
                    </div>
                </div>
            `;
        }

        return `<h3 style="margin-bottom:var(--space-4)">Hospital Admittance Approval</h3>
            <div class="card" style="border:1px dashed var(--color-border);background:var(--color-surface);margin-bottom:var(--space-5)">
                ${screeningContent}
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:var(--space-6)">
                <button class="btn btn-ghost" onclick="ReservationPage.prevStep()">← Back</button>
                <button class="btn btn-primary btn-lg" onclick="ReservationPage.nextStep()" ${callStatus !== 'approved' ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>Continue to Review →</button>
            </div>`;
    }

    function renderStep4Review(hospital, patient) {
        return `<h3 style="margin-bottom:var(--space-4)">Review & Confirm</h3>
            <div style="display:grid;gap:var(--space-3)">
                <div style="display:flex;justify-content:space-between;padding:var(--space-3) 0;border-bottom:1px solid var(--color-border-light)">
                    <span class="text-muted">Hospital</span>
                    <span class="font-semibold">${hospital.name}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:var(--space-3) 0;border-bottom:1px solid var(--color-border-light)">
                    <span class="text-muted">Bed Category</span>
                    <span class="font-semibold">${selectedCategory}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:var(--space-3) 0;border-bottom:1px solid var(--color-border-light)">
                    <span class="text-muted">Admittance Screening</span>
                    <span class="badge badge-available badge-dot">Approved by Dr. Sarah Paul</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:var(--space-3) 0;border-bottom:1px solid var(--color-border-light)">
                    <span class="text-muted">Patient</span>
                    <span class="font-semibold">${patient.name}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:var(--space-3) 0;border-bottom:1px solid var(--color-border-light)">
                    <span class="text-muted">ETA</span>
                    <span class="font-semibold">${hospital.eta} minutes</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:var(--space-3) 0">
                    <span class="text-muted">Hold Duration</span>
                    <span class="font-semibold">60 minutes</span>
                </div>
            </div>
            <div style="padding:var(--space-4);background:var(--color-surface);border-radius:var(--radius-md);margin-top:var(--space-4);font-size:var(--font-size-sm);color:var(--color-text-secondary)">
                ⚠️ By confirming, the selected bed will be temporarily held for 60 minutes. If you do not arrive within this window, the reservation will expire and the bed will be released.
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:var(--space-6)">
                <button class="btn btn-ghost" onclick="ReservationPage.prevStep()">← Back</button>
                <button class="btn btn-success btn-lg" onclick="ReservationPage.nextStep()">✓ Confirm Reservation</button>
            </div>`;
    }

    function renderStep5Confirmed(hospital) {
        if (!currentReservation) return '';
        return `<div style="text-align:center">
            <div style="width:80px;height:80px;border-radius:50%;background:var(--color-success-light);display:flex;align-items:center;justify-content:center;font-size:2.5rem;margin:0 auto var(--space-4);animation:fadeInUp 500ms ease">✅</div>
            <h2 style="color:var(--color-success);margin-bottom:var(--space-2)">Reservation Confirmed!</h2>
            <p class="text-muted" style="margin-bottom:var(--space-6)">Your bed has been temporarily locked</p>

            <div style="background:var(--color-surface);padding:var(--space-5);border-radius:var(--radius-lg);margin-bottom:var(--space-4);text-align:left">
                <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-3)">
                    <span class="text-muted">Reservation ID</span>
                    <span class="font-bold" style="color:var(--color-primary)">${currentReservation.id}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-3)">
                    <span class="text-muted">Status</span>
                    <span class="badge badge-available badge-dot">Confirmed</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-3)">
                    <span class="text-muted">Admittance Status</span>
                    <span class="badge badge-available">Approved by Triage Officer</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-3)">
                    <span class="text-muted">Bed Hold Timer</span>
                    <span class="font-bold" style="font-size:var(--font-size-xl);color:var(--color-warning)" id="countdown-timer">${UI.countdown(currentReservation.expiresAt)}</span>
                </div>
                <div style="display:flex;justify-content:space-between">
                    <span class="text-muted">Hospital Notified</span>
                    <span class="badge badge-available badge-dot">Hospital Notified</span>
                </div>
            </div>

            <div style="display:flex;gap:var(--space-3);justify-content:center">
                <button class="btn btn-primary btn-lg" onclick="Toast.show('🗺️ Navigation', 'Opening directions to ${hospital.name}', 'info')">🗺️ Navigate</button>
                <button class="btn btn-outline btn-lg" onclick="Toast.show('📞 Calling...', '${hospital.phone}', 'info')">📞 Call Hospital</button>
            </div>
            <button class="btn btn-ghost" style="margin-top:var(--space-4)" onclick="window.MediJoints.navigateTo('/patient/dashboard')">← Back to Dashboard</button>
        </div>`;
    }

    return { render, setCategory, nextStep, prevStep, reset, startScreeningCall };
})();

