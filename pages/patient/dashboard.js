/* ═══════════════════════════════════════════════
   MEDI JOINTS — Patient Dashboard (P02)
   Live map + hospital list + filters
   ═══════════════════════════════════════════════ */

window.PatientDashboard = (function() {

    function render() {
        const hospitals = MediJointsStore.getFilteredHospitals();
        const filters = MediJointsStore.getState().filters;
        const bedTypes = ['All', 'General', 'ICU', 'Ventilator', 'Pediatric', 'Maternity', 'Isolation', 'Burn'];

        return `<div class="patient-dashboard">
            <!-- Map Area -->
            <div class="patient-map-area">
                <div class="map-container" id="patient-map">
                    <!-- Road network simulation -->
                    <div class="map-roads">
                        <div class="map-road" style="top:25%;left:5%;width:90%;height:3px"></div>
                        <div class="map-road" style="top:50%;left:10%;width:80%;height:2px"></div>
                        <div class="map-road" style="top:75%;left:5%;width:85%;height:2px"></div>
                        <div class="map-road" style="top:10%;left:20%;width:2px;height:85%"></div>
                        <div class="map-road" style="top:5%;left:45%;width:2px;height:90%"></div>
                        <div class="map-road" style="top:15%;left:70%;width:2px;height:75%"></div>
                        <div class="map-road" style="top:35%;left:30%;width:50%;height:2px;transform:rotate(-15deg)"></div>
                        <div class="map-road" style="top:60%;left:15%;width:40%;height:2px;transform:rotate(10deg)"></div>
                        <!-- Area labels -->
                        <div style="position:absolute;top:12%;left:18%;font-size:10px;color:rgba(0,0,0,0.2);font-weight:600;letter-spacing:0.1em">YELAHANKA</div>
                        <div style="position:absolute;top:20%;left:55%;font-size:10px;color:rgba(0,0,0,0.2);font-weight:600;letter-spacing:0.1em">HEBBAL</div>
                        <div style="position:absolute;top:35%;left:70%;font-size:10px;color:rgba(0,0,0,0.2);font-weight:600;letter-spacing:0.1em">INDIRANAGAR</div>
                        <div style="position:absolute;top:45%;left:25%;font-size:10px;color:rgba(0,0,0,0.2);font-weight:600;letter-spacing:0.1em">JAYANAGAR</div>
                        <div style="position:absolute;top:40%;left:48%;font-size:10px;color:rgba(0,0,0,0.2);font-weight:600;letter-spacing:0.1em">KORAMANGALA</div>
                        <div style="position:absolute;top:50%;left:78%;font-size:10px;color:rgba(0,0,0,0.2);font-weight:600;letter-spacing:0.1em">WHITEFIELD</div>
                    </div>

                    <!-- Hospital Pins -->
                    ${MediJointsStore.getHospitals().map(h => {
                        const pinClass = h.status === 'available' ? 'map-pin-available' :
                                         h.status === 'limited' ? 'map-pin-limited' :
                                         h.status === 'critical' ? 'map-pin-full' : 'map-pin-offline';
                        return `<div class="map-pin ${pinClass} map-pin-animate" style="top:${h.lat}%;left:${h.lng}%" 
                                     onclick="window.MediJoints.navigateTo('/patient/hospital/${h.id}')">
                            <div class="map-pin-marker">
                                <div class="map-pin-body"><span>🏥</span></div>
                            </div>
                            <div class="map-pin-label">${h.name.split(' ')[0]}</div>
                        </div>`;
                    }).join('')}

                    <!-- User location -->
                    <div style="position:absolute;top:42%;left:50%;transform:translate(-50%,-50%);z-index:3">
                        <div style="width:16px;height:16px;background:var(--color-primary);border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(var(--color-primary-rgb),0.3),var(--shadow-md)"></div>
                        <div style="position:absolute;top:-24px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:10px;font-weight:600;color:var(--color-primary);background:white;padding:2px 8px;border-radius:4px;box-shadow:var(--shadow-sm)">You</div>
                    </div>
                </div>

                <!-- Map Overlays -->
                <div class="map-location-badge">
                    <span>📍</span> Koramangala, Bengaluru
                </div>

                <button class="map-ai-btn" onclick="window.MediJoints.navigateTo('/patient/ai-triage')">
                    <span>🤖</span> AI Assist
                </button>

                <div class="map-legend">
                    <div class="map-legend-item"><div class="map-legend-dot" style="background:var(--pin-available)"></div> Available</div>
                    <div class="map-legend-item"><div class="map-legend-dot" style="background:var(--pin-limited)"></div> Limited</div>
                    <div class="map-legend-item"><div class="map-legend-dot" style="background:var(--pin-full)"></div> Full</div>
                    <div class="map-legend-item"><div class="map-legend-dot" style="background:var(--pin-offline)"></div> Offline</div>
                </div>
            </div>

            <!-- Hospital List -->
            <div class="patient-list-area">
                <div class="patient-filters">
                    <div class="search-input">
                        <span class="search-icon">🔍</span>
                        <input class="input-field" placeholder="Search hospitals or areas..." 
                               value="${filters.search}" 
                               oninput="MediJointsStore.setFilter('search', this.value); window.MediJoints.refreshPage()">
                    </div>
                    <div class="chip-group">
                        ${bedTypes.map(t => `
                            <button class="chip ${filters.bedType === t ? 'active' : ''}" 
                                    onclick="MediJointsStore.setFilter('bedType','${t}'); window.MediJoints.refreshPage()">
                                ${t}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div class="patient-list-header">
                    <span class="text-sm font-semibold">${hospitals.length} hospitals found</span>
                    <label style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--font-size-sm);cursor:pointer;color:var(--color-text-secondary)">
                        <input type="checkbox" ${filters.availableOnly ? 'checked' : ''} 
                               onchange="MediJointsStore.setFilter('availableOnly', this.checked); window.MediJoints.refreshPage()">
                        Available only
                    </label>
                </div>
                <div class="patient-list">
                    ${hospitals.length > 0 ? hospitals.map(h => UI.hospitalCard(h)).join('') :
                      UI.emptyState('🔍', 'No hospitals found', 'Try adjusting your filters')}
                </div>
            </div>
        </div>`;
    }

    return { render };
})();
