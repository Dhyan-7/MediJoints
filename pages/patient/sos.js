/* ═══════════════════════════════════════════════
   MEDI JOINTS — SOS Page (P06/P08)
   SOS Dispatch + Active SOS tracking
   ═══════════════════════════════════════════════ */

window.SOSPage = (function() {

    let phase = 'confirm'; // confirm, dispatching, active
    let currentSOS = null;
    let dispatchStep = 0;

    function reset() {
        phase = 'confirm';
        currentSOS = null;
        dispatchStep = 0;
    }

    function triggerSOS() {
        phase = 'dispatching';
        currentSOS = MediJointsStore.createSOS('chest pain and difficulty breathing');
        window.MediJoints.refreshPage();

        // Simulate dispatch animation
        setTimeout(() => {
            dispatchStep = 1;
            window.MediJoints.refreshPage();
        }, 1000);
        setTimeout(() => {
            dispatchStep = 2;
            window.MediJoints.refreshPage();
        }, 2000);
        setTimeout(() => {
            // Auto-accept by top hospital
            if (currentSOS && currentSOS.rankedHospitals.length > 0) {
                MediJointsStore.acceptSOS(currentSOS.id, currentSOS.rankedHospitals[0].hospital.id);
                currentSOS = MediJointsStore.getSOSIncidents().find(s => s.id === currentSOS.id);
                phase = 'active';
                window.MediJoints.refreshPage();
            }
        }, 4000);
    }

    function render() {
        // Check for existing active SOS
        const activeSOS = MediJointsStore.getSOSIncidents().find(s => s.status === 'accepted' || s.status === 'dispatching');
        if (activeSOS && phase === 'confirm') {
            currentSOS = activeSOS;
            phase = activeSOS.status === 'accepted' ? 'active' : 'dispatching';
        }

        if (phase === 'confirm') return renderConfirm();
        if (phase === 'dispatching') return renderDispatching();
        if (phase === 'active') return renderActive();
        return '';
    }

    function renderConfirm() {
        return `<div class="sos-page animate-fade-in-up">
            <div style="margin-bottom:var(--space-6)">
                <h1 style="color:var(--color-critical);margin-bottom:var(--space-3)">🚨 Emergency SOS</h1>
                <p class="text-muted text-lg">Smart Emergency Dispatch will alert the best hospitals near you based on condition, capacity, and ETA.</p>
            </div>

            <button class="sos-big-btn" onclick="SOSPage.triggerSOS()">
                <div class="sos-ring sos-ring-1"></div>
                <div class="sos-ring sos-ring-2"></div>
                <div class="sos-ring sos-ring-3"></div>
                <span class="sos-big-btn-icon">🚨</span>
                <span>SEND SOS</span>
            </button>

            <div style="margin-bottom:var(--space-6)">
                <div style="display:flex;align-items:center;gap:var(--space-3);justify-content:center;margin-bottom:var(--space-3)">
                    <span>📍</span>
                    <span class="font-medium">Location: Koramangala, Bengaluru</span>
                    <span class="badge badge-available badge-dot">GPS Active</span>
                </div>
                <p class="text-sm text-muted">Your location will be shared with alerted hospitals</p>
            </div>

            <div style="text-align:left;max-width:400px;margin:0 auto">
                <h5 style="margin-bottom:var(--space-3)">What happens when you press SOS:</h5>
                <div class="timeline">
                    <div class="timeline-item">
                        <div class="timeline-dot" style="background:var(--color-critical)"></div>
                        <div class="timeline-title">GPS location captured</div>
                        <div class="timeline-content">Your exact location is shared</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot" style="background:var(--color-warning)"></div>
                        <div class="timeline-title">AI ranks top 3 hospitals</div>
                        <div class="timeline-content">Based on condition, capacity, ETA, and specialization</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot" style="background:var(--color-accent)"></div>
                        <div class="timeline-title">Hospitals alerted</div>
                        <div class="timeline-content">Priority alerts sent to ranked hospitals</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot" style="background:var(--color-success)"></div>
                        <div class="timeline-title">Hospital accepts → Navigate</div>
                        <div class="timeline-content">Instant routing and direct call</div>
                    </div>
                </div>
            </div>

            ${UI.safetyDisclaimer()}
            <button class="btn btn-ghost" style="margin-top:var(--space-4)" onclick="window.MediJoints.navigateTo('/patient/dashboard')">← Cancel</button>
        </div>`;
    }

    function renderDispatching() {
        if (!currentSOS) return '';
        return `<div class="sos-page animate-fade-in-up">
            <div style="margin-bottom:var(--space-6)">
                <div class="animate-spin" style="width:64px;height:64px;border:4px solid var(--color-border-light);border-top-color:var(--color-critical);border-radius:50%;margin:0 auto var(--space-4)"></div>
                <h2 style="color:var(--color-critical)">Dispatching Emergency</h2>
                <p class="text-muted">Alerting nearby hospitals with available capacity...</p>
            </div>

            <div style="text-align:left;max-width:500px;margin:0 auto">
                <h4 style="margin-bottom:var(--space-4)">AI-Ranked Hospitals</h4>
                ${currentSOS.rankedHospitals.map((r, i) => `
                    <div class="card animate-fade-in-up stagger-${i+1}" style="margin-bottom:var(--space-3);border-left:4px solid ${i === 0 ? 'var(--color-success)' : 'var(--color-border)'};${dispatchStep > i ? 'opacity:1' : 'opacity:0.4'}">
                        <div style="display:flex;align-items:center;justify-content:space-between">
                            <div>
                                <div style="display:flex;align-items:center;gap:var(--space-2)">
                                    <span class="badge badge-primary">#${i+1}</span>
                                    <span class="font-semibold">${r.hospital.name}</span>
                                </div>
                                <div class="text-sm text-muted" style="margin-top:var(--space-1)">${r.reasons.join(' • ')}</div>
                            </div>
                            <div style="text-align:right">
                                ${dispatchStep > i ?
                                    (i === 0 && dispatchStep >= 2 ? '<span class="badge badge-available badge-dot animate-pulse">Alerting...</span>' :
                                    '<span class="badge badge-offline">Standby</span>') :
                                    '<span class="text-sm text-light">Waiting...</span>'
                                }
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    }

    let showingCall = false;
    let callStatus = 'idle';
    let callTimer = null;

    function startDoctorCall() {
        showingCall = true;
        callStatus = 'calling';
        window.MediJoints.refreshPage();

        callTimer = setTimeout(() => {
            callStatus = 'connected';
            window.MediJoints.refreshPage();
        }, 2000);
    }

    function endDoctorCall() {
        showingCall = false;
        callStatus = 'idle';
        if (callTimer) clearTimeout(callTimer);
        window.MediJoints.refreshPage();
    }

    function renderActive() {
        if (!currentSOS) return '';
        const accepted = currentSOS.rankedHospitals[0]?.hospital;
        if (!accepted) return '';

        return `<div class="sos-page animate-fade-in-up">
            <div style="width:80px;height:80px;border-radius:50%;background:var(--color-success-light);display:flex;align-items:center;justify-content:center;font-size:2.5rem;margin:0 auto var(--space-4);animation:fadeInUp 500ms ease">🏥</div>
            <h2 style="color:var(--color-success);margin-bottom:var(--space-2)">Hospital Accepted!</h2>
            <p class="text-muted text-lg" style="margin-bottom:var(--space-6)">${accepted.name} is ready to receive you</p>

            <div class="card card-elevated" style="text-align:left;max-width:500px;margin:0 auto var(--space-6)">
                <div style="display:flex;align-items:center;gap:var(--space-4);margin-bottom:var(--space-4)">
                    <div style="width:56px;height:56px;border-radius:var(--radius-lg);background:rgba(var(--color-success-rgb),0.1);display:flex;align-items:center;justify-content:center;font-size:var(--font-size-2xl)">🏥</div>
                    <div>
                        <div class="font-semibold text-lg">${accepted.name}</div>
                        <div class="text-sm text-muted">${accepted.area}, Bengaluru</div>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);margin-bottom:var(--space-4)">
                    <div style="background:var(--color-surface);padding:var(--space-3);border-radius:var(--radius-md);text-align:center">
                        <div class="text-sm text-muted">ETA</div>
                        <div class="font-bold text-lg">${accepted.eta} min</div>
                    </div>
                    <div style="background:var(--color-surface);padding:var(--space-3);border-radius:var(--radius-md);text-align:center">
                        <div class="text-sm text-muted">Distance</div>
                        <div class="font-bold text-lg">${accepted.distance} km</div>
                    </div>
                </div>
                <div style="display:flex;gap:var(--space-3)">
                    <button class="btn btn-primary btn-lg" style="flex:1" onclick="Toast.show('🗺️ Navigation', 'Opening route to ${accepted.name}', 'info')">🗺️ Navigate</button>
                    <button class="btn btn-outline btn-lg" onclick="Toast.show('📞 Calling...', '${accepted.phone}', 'info')">📞 Call</button>
                </div>
            </div>

            <!-- Optional Doctor Call -->
            <div class="card" style="border:1.5px dashed var(--color-critical);background:rgba(var(--color-critical-rgb),0.02);max-width:500px;margin:0 auto var(--space-6);text-align:left">
                <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3)">
                    <span style="font-size:var(--font-size-xl)">🩺</span>
                    <div>
                        <div class="font-semibold text-sm">Emergency Dispatch Screening</div>
                        <div class="text-xs text-muted">Consult with the dispatch doctor on duty</div>
                    </div>
                </div>
                <p class="text-sm text-muted" style="margin-bottom:var(--space-4)">
                    Optional: Connect directly with the duty emergency screening physician for triage checks and fast-track admission coordination while in transit.
                </p>
                <button class="btn btn-critical btn-sm w-full" onclick="SOSPage.startDoctorCall()">
                    📹 Video Call Dispatch Doctor (Optional)
                </button>
            </div>

            <!-- Simulated Video Call Popup Overlay -->
            ${showingCall ? `
                <div style="position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:var(--z-modal);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px)">
                    <div style="background:#111;width:90%;max-width:480px;border-radius:var(--radius-xl);overflow:hidden;border:1px solid #333;box-shadow:var(--shadow-xl)">
                        <div style="padding:var(--space-4);background:#222;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333">
                            <span class="badge badge-critical badge-dot animate-pulse">Emergency Video</span>
                            <span style="color:#fff;font-size:var(--font-size-xs)">${callStatus === 'connected' ? '00:14' : 'Connecting...'}</span>
                        </div>
                        <div style="padding:var(--space-8);text-align:center;min-height:240px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff">
                            ${callStatus === 'calling' ? `
                                <div class="animate-spin" style="width:48px;height:48px;border:3px solid #444;border-top-color:var(--color-critical);border-radius:50%;margin-bottom:var(--space-4)"></div>
                                <div class="font-semibold">Calling Dispatch Doctor...</div>
                                <div class="text-xs text-muted" style="margin-top:var(--space-2)">Securing medical line</div>
                            ` : `
                                <div style="width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:2.5rem;margin-bottom:var(--space-4)">👨‍⚕️</div>
                                <div class="font-bold">Dr. Ajay Verma</div>
                                <div class="text-xs text-muted" style="margin-bottom:var(--space-4)">On-Duty Emergency Medical Officer</div>
                                <p style="font-size:var(--font-size-sm);font-style:italic;background:#222;padding:var(--space-3);border-radius:var(--radius-md);max-width:360px;line-height:1.6">
                                    "Arjun, I see you are reporting chest pain. We have dispatched an ambulance. Please sit upright, take slow deep breaths, and avoid physical movement."
                                </p>
                            `}
                        </div>
                        <div style="padding:var(--space-4);background:#222;text-align:center">
                            <button class="btn btn-critical btn-lg w-full" style="background:#e11d48" onclick="SOSPage.endDoctorCall()">
                                📴 Disconnect Call
                            </button>
                        </div>
                    </div>
                </div>
            ` : ''}

            <!-- Status Timeline -->
            <div style="text-align:left;max-width:500px;margin:0 auto">
                <h4 style="margin-bottom:var(--space-4)">Status Timeline</h4>
                <div class="timeline">
                    ${currentSOS.timeline.map(t => `
                        <div class="timeline-item ${t.status}">
                            <div class="timeline-dot"></div>
                            <div class="timeline-title">${t.event}</div>
                            <div class="timeline-time">${t.time ? UI.timeAgo(t.time) : 'Pending'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            ${UI.safetyDisclaimer()}
            <button class="btn btn-ghost" style="margin-top:var(--space-4)" onclick="window.MediJoints.navigateTo('/patient/dashboard')">← Back to Dashboard</button>
        </div>`;
    }

    return { render, triggerSOS, reset, startDoctorCall, endDoctorCall };
})();
