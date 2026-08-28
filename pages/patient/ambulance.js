/* ═══════════════════════════════════════════════
   MEDI JOINTS — On-Demand Ambulance Booking (Ola/Uber Style)
   Tiers: 5G Smart, Ventilator (ALS), BLS, Normal (PTS), NICU
   ═══════════════════════════════════════════════ */

window.AmbulancePage = (function() {

    let phase = 'select'; // 'select', 'matching', 'live_tracking', 'receipt'
    let selectedTierId = '5g_smart';
    let pickupLocation = 'Koramangala 5th Block, Bengaluru';
    let selectedHospitalId = 'h1';
    let customDestination = '';
    let isCustomDestination = false;
    let matchingTimer = null;
    let trackingInterval = null;
    let showingVideoCall = false;

    function reset() {
        phase = 'select';
        selectedTierId = '5g_smart';
        pickupLocation = 'Koramangala 5th Block, Bengaluru';
        selectedHospitalId = 'h1';
        customDestination = '';
        isCustomDestination = false;
        if (matchingTimer) clearTimeout(matchingTimer);
        if (trackingInterval) clearInterval(trackingInterval);
        showingVideoCall = false;
    }

    function setTier(tierId) {
        selectedTierId = tierId;
        window.MediJoints.refreshPage();
    }

    function setDestinationHospital(hospitalId) {
        selectedHospitalId = hospitalId;
        isCustomDestination = false;
        window.MediJoints.refreshPage();
    }

    function setPickup(location) {
        pickupLocation = location;
    }

    function getSelectedDistance() {
        if (isCustomDestination) return 7.5;
        const h = MediJointsStore.getHospital(selectedHospitalId);
        return h ? h.distance : 5.2;
    }

    function requestAmbulance() {
        phase = 'matching';
        window.MediJoints.refreshPage();

        matchingTimer = setTimeout(() => {
            const booking = MediJointsStore.bookAmbulance(
                selectedTierId,
                pickupLocation,
                isCustomDestination ? null : selectedHospitalId,
                customDestination
            );
            if (booking) {
                phase = 'live_tracking';
                Toast.show('🚑 Ambulance Dispatched!', `${booking.vehicle.driverName} (${booking.vehicle.vehicleNo}) accepted your booking.`, 'success');
            } else {
                phase = 'select';
                Toast.show('⚠️ Booking Failed', 'No drivers available. Please try another tier.', 'warning');
            }
            window.MediJoints.refreshPage();
        }, 3200);
    }

    function cancelCurrentRide() {
        const booking = MediJointsStore.getActiveAmbulanceBooking();
        if (booking) {
            MediJointsStore.cancelAmbulance(booking.id);
            Toast.show('Ride Cancelled', 'Your ambulance request was cancelled.', 'info');
        }
        phase = 'select';
        window.MediJoints.refreshPage();
    }

    function completeCurrentRide() {
        const booking = MediJointsStore.getActiveAmbulanceBooking();
        if (booking) {
            MediJointsStore.completeAmbulanceRide(booking.id);
            phase = 'receipt';
            Toast.show('✅ Destination Reached', 'Ambulance successfully arrived at hospital emergency department.', 'success');
        }
        window.MediJoints.refreshPage();
    }

    function toggleVideoCall(state) {
        showingVideoCall = state;
        window.MediJoints.refreshPage();
    }

    function render() {
        const activeBooking = MediJointsStore.getActiveAmbulanceBooking();
        if (activeBooking && phase === 'select') {
            phase = 'live_tracking';
        }

        if (phase === 'matching') return renderMatching();
        if (phase === 'live_tracking') return renderLiveTracking(activeBooking);
        if (phase === 'receipt') return renderReceipt();
        return renderSelection();
    }

    // ─── Phase 1: Tier Selection & Location Input ───
    function renderSelection() {
        const tiers = MediJointsStore.getAmbulanceTiers();
        const hospitals = MediJointsStore.getHospitals().filter(h => h.status !== 'offline');
        const distance = getSelectedDistance();
        const selectedTier = MediJointsStore.getAmbulanceTier(selectedTierId) || tiers[0];
        const fare = MediJointsStore.calculateAmbulanceFare(selectedTierId, distance);

        return `
        <div class="page-container" style="max-width: 960px">
            <div class="page-header" style="margin-bottom:var(--space-6)">
                <div>
                    <h2>🚑 Book On-Demand Ambulance</h2>
                    <p class="page-subtitle">Instant hospital-grade ambulance booking with standardized, regulated pricing</p>
                </div>
                <div style="display:flex;gap:var(--space-2);align-items:center">
                    <span class="badge badge-available badge-dot">6 Units Active in Bengaluru</span>
                    <span class="badge badge-primary">Standard Regulated Fares</span>
                </div>
            </div>

            <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:var(--space-6)" class="ambulance-booking-grid">
                
                <!-- Left: Tier Selector (Uber/Ola Style) -->
                <div>
                    <div class="card card-elevated" style="margin-bottom:var(--space-6)">
                        <h4 style="margin-bottom:var(--space-4);display:flex;justify-content:space-between;align-items:center">
                            <span>Select Ambulance Category</span>
                            <span class="text-xs text-muted">Govt Regulated Fares</span>
                        </h4>

                        <div style="display:flex;flex-direction:column;gap:var(--space-3)">
                            ${tiers.map(t => {
                                const isSelected = t.id === selectedTierId;
                                const tierFare = MediJointsStore.calculateAmbulanceFare(t.id, distance);
                                return `
                                <div class="ambulance-tier-card ${isSelected ? 'selected' : ''}" onclick="AmbulancePage.setTier('${t.id}')">
                                    <div style="display:flex;align-items:flex-start;gap:var(--space-4);flex:1">
                                        <div class="ambulance-tier-icon-wrap ${isSelected ? 'glow' : ''}">
                                            <span style="font-size:1.8rem">${t.icon}</span>
                                        </div>
                                        <div style="flex:1">
                                            <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-1);flex-wrap:wrap">
                                                <strong style="font-size:var(--font-size-md)">${t.name}</strong>
                                                ${t.badge ? `<span class="badge ${t.badgeClass}">${t.badge}</span>` : ''}
                                            </div>
                                            <p class="text-xs text-muted" style="margin-bottom:var(--space-2)">${t.tagline}</p>
                                            <div style="display:flex;flex-wrap:wrap;gap:var(--space-1)">
                                                ${t.equipment.slice(0, 3).map(eq => `
                                                    <span style="font-size:10px;padding:2px 6px;background:var(--color-surface);border-radius:var(--radius-sm);color:var(--color-text-secondary);border:1px solid var(--color-border-light)">
                                                        ✓ ${eq}
                                                    </span>
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                    <div style="text-align:right;min-width:110px">
                                        <div style="font-size:var(--font-size-xl);font-weight:800;color:var(--color-primary)">
                                            ₹${tierFare.totalFare.toLocaleString()}
                                        </div>
                                        <div class="text-xs text-muted" style="margin-top:2px">
                                            ETA: <strong>${t.etaMin} mins</strong>
                                        </div>
                                        <div style="font-size:10px;color:var(--color-text-light);margin-top:2px">
                                            Base: ₹${t.baseFare} (5km)
                                        </div>
                                    </div>
                                </div>`;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Staffing & Equipment Highlight for Selected Tier -->
                    <div class="card" style="border:1px dashed var(--color-border);background:var(--color-surface)">
                        <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3)">
                            <span style="font-size:1.5rem">🩺</span>
                            <div>
                                <div class="font-bold text-sm">Medical Team & Equipment Included in ${selectedTier.name}</div>
                                <div class="text-xs text-muted">Staff on board: <strong>${selectedTier.staff}</strong></div>
                            </div>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2);font-size:var(--font-size-xs);color:var(--color-text-secondary)">
                            ${selectedTier.equipment.map(eq => `
                                <div style="display:flex;align-items:center;gap:var(--space-2)">
                                    <span style="color:var(--color-success)">✓</span>
                                    <span>${eq}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Right: Pickup/Drop Selector & Fare Summary -->
                <div>
                    <div class="card card-elevated" style="margin-bottom:var(--space-6)">
                        <h4 style="margin-bottom:var(--space-4)">📍 Route & Destination</h4>

                        <!-- Pickup Input -->
                        <div class="input-group" style="margin-bottom:var(--space-4)">
                            <label class="input-label" style="display:flex;align-items:center;gap:var(--space-2)">
                                <span style="color:var(--color-success)">●</span> Pickup Location (Patient)
                            </label>
                            <div style="position:relative">
                                <input type="text" class="input-field" value="${pickupLocation}" onchange="AmbulancePage.setPickup(this.value)" style="padding-left:36px">
                                <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%)">📍</span>
                            </div>
                            <span class="text-xs text-muted" style="margin-top:4px">GPS Auto-detected: Koramangala 5th block</span>
                        </div>

                        <!-- Drop-off Hospital Selector -->
                        <div class="input-group" style="margin-bottom:var(--space-5)">
                            <label class="input-label" style="display:flex;align-items:center;gap:var(--space-2)">
                                <span style="color:var(--color-critical)">●</span> Destination Emergency Room
                            </label>
                            <select class="input-field" onchange="AmbulancePage.setDestinationHospital(this.value)">
                                ${hospitals.map(h => `
                                    <option value="${h.id}" ${h.id === selectedHospitalId ? 'selected' : ''}>
                                        ${h.name} — ${h.area} (${h.distance} km • ETA ${h.eta} min)
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <!-- Trip Distance & Duration Metrics -->
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);padding:var(--space-3);background:var(--color-surface);border-radius:var(--radius-md);margin-bottom:var(--space-5)">
                            <div style="text-align:center">
                                <div class="text-xs text-muted">Est. Distance</div>
                                <div class="font-bold text-md">${distance} km</div>
                            </div>
                            <div style="text-align:center">
                                <div class="text-xs text-muted">Pickup ETA</div>
                                <div class="font-bold text-md" style="color:var(--color-success)">${selectedTier.etaMin} mins</div>
                            </div>
                        </div>

                        <!-- Transparent Standard Fare Breakdown -->
                        <div style="border-top:1px solid var(--color-border-light);padding-top:var(--space-4);margin-bottom:var(--space-6)">
                            <h5 style="margin-bottom:var(--space-3)">Transparent Fare Breakdown</h5>
                            <div style="display:flex;justify-content:space-between;font-size:var(--font-size-sm);margin-bottom:var(--space-2)">
                                <span class="text-muted">Base Fare (First 5 km incl. EMT)</span>
                                <span>₹${fare.baseFare.toLocaleString()}</span>
                            </div>
                            ${fare.extraKm > 0 ? `
                                <div style="display:flex;justify-content:space-between;font-size:var(--font-size-sm);margin-bottom:var(--space-2)">
                                    <span class="text-muted">Distance Charge (${fare.extraKm} km × ₹${fare.perKmRate}/km)</span>
                                    <span>₹${fare.distanceCharge.toLocaleString()}</span>
                                </div>
                            ` : ''}
                            <div style="display:flex;justify-content:space-between;font-size:var(--font-size-sm);margin-bottom:var(--space-2)">
                                <span class="text-muted">Govt Health & Emergency GST (5%)</span>
                                <span>₹${fare.gstTax.toLocaleString()}</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;font-size:var(--font-size-lg);font-weight:800;border-top:1px dashed var(--color-border);padding-top:var(--space-3);margin-top:var(--space-2);color:var(--color-primary)">
                                <span>Estimated Total Fare</span>
                                <span>₹${fare.totalFare.toLocaleString()}</span>
                            </div>
                            <div class="text-xs text-muted" style="margin-top:4px">
                                🛡️ Fixed regulated price • Zero surge pricing on medical emergencies • Insurance cashless eligible
                            </div>
                        </div>

                        <!-- Booking Action CTA -->
                        <button class="btn btn-primary btn-lg w-full" style="padding:var(--space-4);font-size:var(--font-size-lg);display:flex;align-items:center;justify-content:center;gap:var(--space-2)" onclick="AmbulancePage.requestAmbulance()">
                            <span>🚑</span>
                            <span>Confirm & Dispatch ${selectedTier.name.split(' ')[0]}</span>
                        </button>
                    </div>

                    <!-- Safety & Insurance Notice -->
                    <div style="padding:var(--space-4);background:rgba(var(--color-success-rgb),0.06);border-radius:var(--radius-md);border-left:3px solid var(--color-success);font-size:var(--font-size-xs);color:var(--color-text-secondary)">
                        <strong>🏥 Hospital-Direct Integration:</strong> Dispatching alerts the destination hospital ER team automatically so doctors and trauma beds are prepped before arrival.
                    </div>
                </div>
            </div>
        </div>`;
    }

    // ─── Phase 2: Radar Matching Screen (Ola/Uber Style) ───
    function renderMatching() {
        const tier = MediJointsStore.getAmbulanceTier(selectedTierId);
        return `
        <div class="page-container animate-fade-in-up" style="max-width:600px;text-align:center;padding-top:var(--space-12)">
            <div class="radar-container" style="position:relative;width:240px;height:240px;margin:0 auto var(--space-8)">
                <div class="radar-circle radar-circle-1"></div>
                <div class="radar-circle radar-circle-2"></div>
                <div class="radar-circle radar-circle-3"></div>
                <div class="radar-scan-line"></div>
                <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:3.5rem">
                    ${tier ? tier.icon : '🚑'}
                </div>
            </div>

            <h2 style="color:var(--color-primary);margin-bottom:var(--space-2)">Connecting with Nearest Driver...</h2>
            <p class="text-muted text-lg" style="margin-bottom:var(--space-6)">
                Broadcasting emergency transit dispatch to certified ${tier ? tier.name : 'Ambulance'} units in Bengaluru
            </p>

            <div class="card card-elevated" style="text-align:left;margin-bottom:var(--space-6)">
                <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-2) 0;border-bottom:1px solid var(--color-border-light)">
                    <span class="text-muted">Selected Tier</span>
                    <strong>${tier ? tier.name : 'Ambulance'}</strong>
                </div>
                <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-2) 0;border-bottom:1px solid var(--color-border-light)">
                    <span class="text-muted">Pickup Location</span>
                    <span>${pickupLocation}</span>
                </div>
                <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-2) 0">
                    <span class="text-muted">Available Fleet Nearby</span>
                    <span class="badge badge-available">3 Units in 3 km Radius</span>
                </div>
            </div>

            <button class="btn btn-ghost" onclick="AmbulancePage.reset(); window.MediJoints.refreshPage();">
                Cancel Request
            </button>
        </div>`;
    }

    // ─── Phase 3: Live In-Transit Tracking & 5G Telemetry ───
    function renderLiveTracking(booking) {
        if (!booking) return renderSelection();
        const v = booking.vehicle;
        const tier = booking.tier;

        return `
        <div class="page-container animate-fade-in-up" style="max-width: 1000px">
            
            <!-- In-Transit Status Bar -->
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-6);background:var(--color-card);padding:var(--space-4) var(--space-6);border-radius:var(--radius-xl);border:1px solid var(--color-border-light);box-shadow:var(--shadow-sm)">
                <div>
                    <div style="display:flex;align-items:center;gap:var(--space-2)">
                        <span class="badge badge-critical badge-dot animate-pulse">Live Ambulance In-Transit</span>
                        <span class="badge badge-accent">📶 5G Telemetry Active</span>
                    </div>
                    <h3 style="margin-top:var(--space-1);margin-bottom:0">En Route to Emergency Room</h3>
                </div>
                <div style="text-align:right">
                    <div class="text-xs text-muted">Estimated Arrival</div>
                    <div style="font-size:var(--font-size-2xl);font-weight:900;color:var(--color-primary)">${booking.etaMin} mins</div>
                </div>
            </div>

            <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:var(--space-6)" class="ambulance-tracking-grid">
                
                <!-- Left: Interactive GPS Route Map & 5G Telemetry HUD -->
                <div>
                    <!-- Simulated Live SVG Map -->
                    <div class="card card-elevated" style="padding:0;overflow:hidden;margin-bottom:var(--space-6);position:relative;background:#0d1b2a">
                        <div style="padding:var(--space-3) var(--space-4);background:rgba(0,0,0,0.6);position:absolute;top:12px;left:12px;border-radius:var(--radius-md);color:white;z-index:2;font-size:var(--font-size-xs);backdrop-filter:blur(10px);display:flex;gap:var(--space-3)">
                            <span>📍 Koramangala ➔ ${booking.destination.split('(')[0]}</span>
                            <span style="color:#4fd1c5">Speed: ${booking.speedKmH} km/h</span>
                        </div>

                        <!-- Interactive Map Canvas -->
                        <svg viewBox="0 0 500 300" style="width:100%;height:300px;display:block">
                            <!-- Map Roads Grid -->
                            <rect width="500" height="300" fill="#0b192c" />
                            <line x1="0" y1="80" x2="500" y2="80" stroke="#1b2a41" stroke-width="6" />
                            <line x1="0" y1="180" x2="500" y2="180" stroke="#1b2a41" stroke-width="8" />
                            <line x1="0" y1="240" x2="500" y2="240" stroke="#1b2a41" stroke-width="4" />
                            <line x1="120" y1="0" x2="120" y2="300" stroke="#1b2a41" stroke-width="6" />
                            <line x1="260" y1="0" x2="260" y2="300" stroke="#1b2a41" stroke-width="8" />
                            <line x1="390" y1="0" x2="390" y2="300" stroke="#1b2a41" stroke-width="6" />

                            <!-- Route Path -->
                            <path d="M 120 180 Q 260 180 260 80 T 390 80" fill="none" stroke="#22b3ac" stroke-width="5" stroke-linecap="round" stroke-dasharray="8 4" class="route-path-animated" />

                            <!-- Pickup Pin -->
                            <g transform="translate(120, 180)">
                                <circle r="12" fill="rgba(34, 179, 172, 0.2)" class="animate-pulse" />
                                <circle r="6" fill="#22b3ac" />
                                <text x="-20" y="-14" fill="#ffffff" font-size="11" font-weight="bold">Patient Pickup</text>
                            </g>

                            <!-- Destination Hospital Pin -->
                            <g transform="translate(390, 80)">
                                <circle r="16" fill="rgba(225, 29, 72, 0.2)" class="animate-pulse" />
                                <rect x="-10" y="-10" width="20" height="20" rx="4" fill="#e11d48" />
                                <text x="-6" y="5" fill="#ffffff" font-size="14" font-weight="bold">🏥</text>
                                <text x="-35" y="-16" fill="#ffffff" font-size="11" font-weight="bold">${booking.destination.split('(')[0]}</text>
                            </g>

                            <!-- Moving Ambulance Marker -->
                            <g transform="translate(230, 130)">
                                <circle r="20" fill="rgba(34, 197, 94, 0.3)" class="animate-pulse" />
                                <circle r="14" fill="#123B63" stroke="#22b3ac" stroke-width="2" />
                                <text x="-7" y="5" font-size="14">🚑</text>
                            </g>
                        </svg>

                        <!-- Live Traffic Status Footer -->
                        <div style="padding:var(--space-2) var(--space-4);background:rgba(0,0,0,0.8);color:#fff;font-size:var(--font-size-xs);display:flex;justify-content:space-between;align-items:center">
                            <span>🟢 Emergency Green Corridor Activated</span>
                            <span>Signal Override: Active</span>
                        </div>
                    </div>

                    <!-- 5G Real-Time Vitals & Telemetry HUD -->
                    <div class="card card-elevated" style="margin-bottom:var(--space-6);background:linear-gradient(135deg, #0a1f33, #123B63);color:white">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4)">
                            <div style="display:flex;align-items:center;gap:var(--space-2)">
                                <span style="font-size:1.4rem">📶</span>
                                <div>
                                    <strong style="font-size:var(--font-size-sm)">5G Patient Telemetry Stream</strong>
                                    <div style="font-size:10px;color:#4fd1c5">Directly Synced with Hospital ER Doctors</div>
                                </div>
                            </div>
                            <span class="badge" style="background:rgba(79,209,197,0.2);color:#4fd1c5;border:1px solid #4fd1c5">12ms Latency</span>
                        </div>

                        <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:var(--space-3);text-align:center">
                            <div style="background:rgba(255,255,255,0.06);padding:var(--space-3);border-radius:var(--radius-md);border:1px solid rgba(255,255,255,0.1)">
                                <div style="font-size:10px;color:rgba(255,255,255,0.6)">Blood Oxygen</div>
                                <div style="font-size:var(--font-size-xl);font-weight:800;color:#4fd1c5">${booking.vitals.spo2}%</div>
                                <div style="font-size:9px;color:rgba(255,255,255,0.5)">SpO2 Normal</div>
                            </div>
                            <div style="background:rgba(255,255,255,0.06);padding:var(--space-3);border-radius:var(--radius-md);border:1px solid rgba(255,255,255,0.1)">
                                <div style="font-size:10px;color:rgba(255,255,255,0.6)">Heart Rate</div>
                                <div style="font-size:var(--font-size-xl);font-weight:800;color:#f87171">${booking.vitals.pulse} bpm</div>
                                <div style="font-size:9px;color:rgba(255,255,255,0.5)">Sinus Rhythm</div>
                            </div>
                            <div style="background:rgba(255,255,255,0.06);padding:var(--space-3);border-radius:var(--radius-md);border:1px solid rgba(255,255,255,0.1)">
                                <div style="font-size:10px;color:rgba(255,255,255,0.6)">Blood Pressure</div>
                                <div style="font-size:var(--font-size-lg);font-weight:800;color:white;margin-top:2px">${booking.vitals.bp}</div>
                                <div style="font-size:9px;color:rgba(255,255,255,0.5)">mmHg</div>
                            </div>
                            <div style="background:rgba(255,255,255,0.06);padding:var(--space-3);border-radius:var(--radius-md);border:1px solid rgba(255,255,255,0.1)">
                                <div style="font-size:10px;color:rgba(255,255,255,0.6)">O2 Cylinder</div>
                                <div style="font-size:var(--font-size-xl);font-weight:800;color:#34d399">${booking.vitals.oxygenLevel}%</div>
                                <div style="font-size:9px;color:rgba(255,255,255,0.5)">Pressure Full</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right: Driver Details, Paramedic Video & Step Controls -->
                <div>
                    <!-- Driver & Vehicle Profile (Uber Card) -->
                    <div class="card card-elevated" style="margin-bottom:var(--space-6)">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">
                            <div style="display:flex;align-items:center;gap:var(--space-3)">
                                <div style="width:56px;height:56px;border-radius:50%;background:var(--color-surface);display:flex;align-items:center;justify-content:center;font-size:2rem;border:2px solid var(--color-primary)">
                                    ${v.driverPhoto}
                                </div>
                                <div>
                                    <h4 style="margin-bottom:2px">${v.driverName}</h4>
                                    <div style="display:flex;align-items:center;gap:var(--space-2)">
                                        <span class="badge badge-warning">★ ${v.rating}</span>
                                        <span class="text-xs text-muted">${v.totalTrips} emergency runs</span>
                                    </div>
                                </div>
                            </div>
                            <div style="text-align:right">
                                <span class="badge badge-primary" style="font-family:monospace;font-size:var(--font-size-sm);letter-spacing:1px">
                                    ${v.vehicleNo}
                                </span>
                                <div class="text-xs text-muted" style="margin-top:2px">${tier.name.split('(')[0]}</div>
                            </div>
                        </div>

                        <!-- Onboard Medical Officer -->
                        <div style="padding:var(--space-3);background:var(--color-surface);border-radius:var(--radius-md);margin-bottom:var(--space-4);display:flex;align-items:center;justify-content:space-between">
                            <div style="display:flex;align-items:center;gap:var(--space-2)">
                                <span>👨‍⚕️</span>
                                <div>
                                    <div class="font-bold text-xs">Onboard Medical Specialist</div>
                                    <div class="text-xs text-muted">${v.medicName}</div>
                                </div>
                            </div>
                            <span class="badge badge-available badge-dot">Live on Comms</span>
                        </div>

                        <!-- Call & Video Actions -->
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);margin-bottom:var(--space-4)">
                            <button class="btn btn-outline btn-md" onclick="Toast.show('📞 Calling Driver...', '${v.driverPhone}', 'info')">
                                📞 Call Driver
                            </button>
                            <button class="btn btn-accent btn-md" onclick="AmbulancePage.toggleVideoCall(true)">
                                📹 5G Video Call
                            </button>
                        </div>
                    </div>

                    <!-- Dispatch Timeline -->
                    <div class="card" style="margin-bottom:var(--space-6)">
                        <h5 style="margin-bottom:var(--space-3)">Live Dispatch Timeline</h5>
                        <div class="timeline">
                            ${booking.timeline.map(t => `
                                <div class="timeline-item ${t.status}">
                                    <div class="timeline-dot"></div>
                                    <div class="timeline-title">${t.event}</div>
                                    <div class="timeline-time">${t.time ? UI.timeAgo(t.time) : 'In Progress'}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Simulation / Demo Triggers -->
                    <div style="display:flex;flex-direction:column;gap:var(--space-3)">
                        <button class="btn btn-success btn-lg w-full" onclick="AmbulancePage.completeCurrentRide()">
                            ✅ Complete Trip & Show Invoice
                        </button>
                        <button class="btn btn-ghost btn-sm text-critical" onclick="AmbulancePage.cancelCurrentRide()">
                            Cancel Ambulance Request
                        </button>
                    </div>
                </div>
            </div>

            <!-- Video Call Modal Overlay -->
            ${showingVideoCall ? `
                <div style="position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:var(--z-modal);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px)">
                    <div style="background:#111;width:90%;max-width:480px;border-radius:var(--radius-xl);overflow:hidden;border:1px solid #333;box-shadow:var(--shadow-xl)">
                        <div style="padding:var(--space-4);background:#1a1a1a;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333">
                            <span class="badge badge-accent badge-dot animate-pulse">5G Ultra-HD Call • 60 FPS</span>
                            <span style="color:#fff;font-size:var(--font-size-xs)">00:24</span>
                        </div>
                        <div style="padding:var(--space-8);text-align:center;min-height:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff">
                            <div style="width:80px;height:80px;border-radius:50%;background:rgba(79,209,197,0.15);display:flex;align-items:center;justify-content:center;font-size:2.5rem;margin-bottom:var(--space-4);border:2px solid #4fd1c5">👨‍⚕️</div>
                            <div class="font-bold text-lg">${v.medicName}</div>
                            <div class="text-xs text-muted" style="margin-bottom:var(--space-4)">On-Board Medical Emergency Officer</div>
                            <p style="font-size:var(--font-size-sm);font-style:italic;background:#222;padding:var(--space-3);border-radius:var(--radius-md);max-width:360px;line-height:1.6">
                                "We are 4 minutes away at Koramangala 4th Block signal. Keep the patient in a resting position. Our mobile ICU and ventilator systems are online and pre-warmed."
                            </p>
                        </div>
                        <div style="padding:var(--space-4);background:#1a1a1a;text-align:center">
                            <button class="btn btn-critical btn-lg w-full" onclick="AmbulancePage.toggleVideoCall(false)">
                                📴 End Video Feed
                            </button>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>`;
    }

    // ─── Phase 4: Digital Receipt & Regulated Invoice ───
    function renderReceipt() {
        const bookings = MediJointsStore.getAmbulanceBookings();
        const b = bookings[0];
        if (!b) return renderSelection();
        const fare = b.fare;

        return `
        <div class="page-container animate-fade-in-up" style="max-width:650px;text-align:center">
            <div style="width:72px;height:72px;border-radius:50%;background:var(--color-success-light);display:flex;align-items:center;justify-content:center;font-size:2.2rem;margin:0 auto var(--space-4)">
                ✓
            </div>
            <h2 style="color:var(--color-success);margin-bottom:var(--space-1)">Ride Completed & ER Handover Done</h2>
            <p class="text-muted" style="margin-bottom:var(--space-6)">Patient safely admitted to ${b.destination.split('(')[0]}</p>

            <div class="card card-elevated" style="text-align:left;margin-bottom:var(--space-6)">
                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--color-border-light);padding-bottom:var(--space-3);margin-bottom:var(--space-4)">
                    <div>
                        <strong style="font-size:var(--font-size-lg)">${b.tier.name}</strong>
                        <div class="text-xs text-muted">Booking ID: ${b.id} • ${new Date(b.createdAt).toLocaleTimeString()}</div>
                    </div>
                    <span class="badge badge-available">Paid / Cashless</span>
                </div>

                <!-- Driver Details -->
                <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4);padding:var(--space-3);background:var(--color-surface);border-radius:var(--radius-md)">
                    <span style="font-size:1.8rem">${b.vehicle.driverPhoto}</span>
                    <div style="flex:1">
                        <div class="font-bold text-sm">${b.vehicle.driverName}</div>
                        <div class="text-xs text-muted">Vehicle: ${b.vehicle.vehicleNo}</div>
                    </div>
                    <div style="display:flex;gap:2px;color:#f59e0b">★★★★★</div>
                </div>

                <!-- Itemized Transparent Billing Breakdown -->
                <h5 style="margin-bottom:var(--space-3)">Itemized Invoice</h5>
                <div style="display:flex;justify-content:space-between;font-size:var(--font-size-sm);margin-bottom:var(--space-2)">
                    <span class="text-muted">Base Fare (First 5 km + Equipment)</span>
                    <span>₹${fare.baseFare.toLocaleString()}</span>
                </div>
                ${fare.extraKm > 0 ? `
                    <div style="display:flex;justify-content:space-between;font-size:var(--font-size-sm);margin-bottom:var(--space-2)">
                        <span class="text-muted">Distance Charge (${fare.extraKm} km × ₹${fare.perKmRate})</span>
                        <span>₹${fare.distanceCharge.toLocaleString()}</span>
                    </div>
                ` : ''}
                <div style="display:flex;justify-content:space-between;font-size:var(--font-size-sm);margin-bottom:var(--space-2)">
                    <span class="text-muted">Emergency Medical GST (5%)</span>
                    <span>₹${fare.gstTax.toLocaleString()}</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:var(--font-size-xl);font-weight:800;border-top:1px dashed var(--color-border);padding-top:var(--space-3);margin-top:var(--space-2);color:var(--color-primary)">
                    <span>Total Regulated Fare</span>
                    <span>₹${fare.totalFare.toLocaleString()}</span>
                </div>

                <!-- Cashless & Insurance Claim Box -->
                <div style="margin-top:var(--space-4);padding:var(--space-3);background:rgba(var(--color-primary-rgb),0.04);border-radius:var(--radius-md);font-size:var(--font-size-xs);border:1px solid rgba(var(--color-primary-rgb),0.12)">
                    <strong>🛡️ Cashless Insurance / Ayushman Bharat:</strong>
                    <div>This trip receipt has been digitally linked to patient health ID <code>${b.patient.id}</code> for automated 100% claim settlement.</div>
                </div>
            </div>

            <div style="display:flex;gap:var(--space-3);justify-content:center">
                <button class="btn btn-primary btn-lg" onclick="AmbulancePage.reset(); window.MediJoints.navigateTo('/patient/dashboard');">
                    ← Back to Dashboard
                </button>
                <button class="btn btn-outline btn-lg" onclick="AmbulancePage.reset(); window.MediJoints.refreshPage();">
                    Book Another Ambulance
                </button>
            </div>
        </div>`;
    }

    return {
        render,
        setTier,
        setDestinationHospital,
        setPickup,
        requestAmbulance,
        cancelCurrentRide,
        completeCurrentRide,
        toggleVideoCall,
        reset
    };
})();
