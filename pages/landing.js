/* ═══════════════════════════════════════════════
   MEDI JOINTS — Landing Page (P01)
   Hero, stakeholder cards, how it works, demo entry
   ═══════════════════════════════════════════════ */

window.LandingPage = (function() {

    function render() {
        const totalBeds = MediJointsStore.getTotalBeds();
        const hospitals = MediJointsStore.getHospitals();
        const onlineCount = hospitals.filter(h => h.status !== 'offline').length;

        return `
        <!-- Hero -->
        <section class="landing-hero">
            <div class="landing-hero-bg"></div>
            <!-- Floating particles -->
            <div style="position:absolute;inset:0;overflow:hidden;z-index:0">
                ${Array.from({length: 15}, (_, i) => `
                    <div style="position:absolute;width:${3+Math.random()*6}px;height:${3+Math.random()*6}px;background:rgba(255,255,255,${0.03+Math.random()*0.08});border-radius:50%;top:${Math.random()*100}%;left:${Math.random()*100}%;animation:float ${3+Math.random()*4}s ease-in-out infinite;animation-delay:${Math.random()*3}s"></div>
                `).join('')}
            </div>

            <!-- Left Grid Content -->
            <div class="landing-hero-left animate-fade-in-up">
                <div class="landing-hero-badge">
                    <span style="width:8px;height:8px;border-radius:50%;background:#22b3ac;animation:pulse 2s ease infinite"></span>
                    ELEVATE 2026 — Network Hub
                </div>
                <h1>No patient should<br>lose time searching<br>for a <span class="highlight">hospital bed</span></h1>
                <p class="landing-hero-sub">
                    AI-powered network monitoring that tracks real-time bed inventories, automates emergency routing, and streamlines medical tourism.
                </p>
                <div class="landing-hero-actions">
                    <button class="landing-hero-btn landing-hero-btn-primary" onclick="window.MediJoints.switchRole('patient')">
                        Start Patient Demo →
                    </button>
                    <button class="landing-hero-btn landing-hero-btn-outline" onclick="window.MediJoints.switchRole('hospital')">
                        🏥 Hospital
                    </button>
                    <button class="landing-hero-btn landing-hero-btn-outline" onclick="window.MediJoints.switchRole('authority')">
                        🏛️ Authority
                    </button>
                </div>
                <div class="landing-hero-stats">
                    <div class="landing-stat">
                        <div class="landing-stat-value" id="stat-hospitals">${onlineCount}</div>
                        <div class="landing-stat-label">Providers</div>
                    </div>
                    <div class="landing-stat">
                        <div class="landing-stat-value" id="stat-beds">${totalBeds}</div>
                        <div class="landing-stat-label">Beds Free</div>
                    </div>
                    <div class="landing-stat">
                        <div class="landing-stat-value">24/7</div>
                        <div class="landing-stat-label">Sync Rate</div>
                    </div>
                    <div class="landing-stat">
                        <div class="landing-stat-value">&lt;3s</div>
                        <div class="landing-stat-label">Match Time</div>
                    </div>
                </div>
            </div>

            <!-- Right Grid Showcase -->
            <div class="landing-hero-right animate-fade-in-up stagger-2">
                <div class="landing-hero-showcase">
                    <div class="showcase-card showcase-card-1">
                        <img src="assets/icu-bed.jpg" alt="Premium Connected ICU bed facility">
                    </div>
                    <div class="showcase-card showcase-card-2">
                        <img src="assets/hero-ui.jpg" alt="Medi Joints Cloud Triage & Bed Sync Dashboard">
                    </div>
                </div>
            </div>
        </section>

        <!-- Problem -->
        <section class="landing-section">
            <div class="landing-section-title">The Problem Is Information Delay</div>
            <p class="landing-section-sub">Families in crisis shouldn't have to call 10 hospitals to find one bed. Medi Joints eliminates the information gap.</p>
            <div class="landing-grid-3">
                <div class="card card-elevated animate-fade-in-up stagger-1" style="text-align:center;padding:var(--space-8)">
                    <div style="font-size:3rem;margin-bottom:var(--space-4)">📞</div>
                    <h4 style="color:var(--color-critical);margin-bottom:var(--space-2)">Today</h4>
                    <p class="text-muted">Emergency → Panic → Google → Call hospitals one by one → Bed taken → Rush to next hospital → Repeat</p>
                    <div style="margin-top:var(--space-4);font-size:var(--font-size-3xl);font-weight:800;color:var(--color-critical)">45+ min</div>
                    <div class="text-sm text-muted">Average time wasted</div>
                </div>
                <div style="display:flex;align-items:center;justify-content:center">
                    <div style="font-size:4rem;color:var(--color-accent);animation:heartbeat 2s ease-in-out infinite">→</div>
                </div>
                <div class="card card-elevated animate-fade-in-up stagger-3" style="text-align:center;padding:var(--space-8);border:2px solid rgba(var(--color-success-rgb),0.3)">
                    <div style="font-size:3rem;margin-bottom:var(--space-4)">⚡</div>
                    <h4 style="color:var(--color-success);margin-bottom:var(--space-2)">With Medi Joints</h4>
                    <p class="text-muted">Emergency → Open app → See live beds → AI triage → Reserve/SOS → Navigate directly → Arrive</p>
                    <div style="margin-top:var(--space-4);font-size:var(--font-size-3xl);font-weight:800;color:var(--color-success)">&lt;3 min</div>
                    <div class="text-sm text-muted">From search to action</div>
                </div>
            </div>
        </section>

        <!-- Three Stakeholders -->
        <section class="landing-section" style="background:var(--color-surface);margin:0;max-width:100%;padding:var(--space-20) var(--space-8)">
            <div style="max-width:1200px;margin:0 auto">
                <div class="landing-section-title">One Platform. Three Perspectives.</div>
                <p class="landing-section-sub">Same real-time data seen by patients, hospitals, and authorities. Zero information gap.</p>
                <div class="landing-grid-3">
                    <div class="stakeholder-card animate-fade-in-up stagger-1" onclick="window.MediJoints.switchRole('patient')">
                        <div class="stakeholder-icon">👤</div>
                        <h3 style="margin-bottom:var(--space-3)">Patient Dashboard</h3>
                        <p class="text-muted" style="margin-bottom:var(--space-4)">Live map with color-coded hospital pins, bed availability by category, AI triage, emergency SOS, and instant reservation.</p>
                        <ul style="text-align:left;font-size:var(--font-size-sm);color:var(--color-text-secondary);display:flex;flex-direction:column;gap:var(--space-2)">
                            <li>🗺️ GPS-based hospital discovery</li>
                            <li>🤖 AI Symptom Triage</li>
                            <li>🚨 One-touch Emergency SOS</li>
                            <li>📋 Bed Reservation with auto-lock</li>
                        </ul>
                        <button class="btn btn-accent btn-sm" style="margin-top:var(--space-5);width:100%">Enter Patient Demo →</button>
                    </div>
                    <div class="stakeholder-card animate-fade-in-up stagger-2" onclick="window.MediJoints.switchRole('hospital')">
                        <div class="stakeholder-icon">🏥</div>
                        <h3 style="margin-bottom:var(--space-3)">Hospital Dashboard</h3>
                        <p class="text-muted" style="margin-bottom:var(--space-4)">Manage bed capacity in real-time, receive reservation requests, handle SOS alerts, and track patient arrivals.</p>
                        <ul style="text-align:left;font-size:var(--font-size-sm);color:var(--color-text-secondary);display:flex;flex-direction:column;gap:var(--space-2)">
                            <li>🛏️ Live bed count management</li>
                            <li>📋 Incoming reservation queue</li>
                            <li>🚨 SOS alert notifications</li>
                            <li>📈 Analytics & utilization</li>
                        </ul>
                        <button class="btn btn-primary btn-sm" style="margin-top:var(--space-5);width:100%">Enter Hospital Demo →</button>
                    </div>
                    <div class="stakeholder-card animate-fade-in-up stagger-3" onclick="window.MediJoints.switchRole('authority')">
                        <div class="stakeholder-icon">🏛️</div>
                        <h3 style="margin-bottom:var(--space-3)">Authority Dashboard</h3>
                        <p class="text-muted" style="margin-bottom:var(--space-4)">Network-wide monitoring with real-time KPIs, SOS tracking, surge prediction, and data integrity oversight.</p>
                        <ul style="text-align:left;font-size:var(--font-size-sm);color:var(--color-text-secondary);display:flex;flex-direction:column;gap:var(--space-2)">
                            <li>🌐 Network capacity heatmap</li>
                            <li>🚨 SOS incident monitoring</li>
                            <li>📈 Surge & crisis AI prediction</li>
                            <li>🛡️ Fraud & data integrity</li>
                        </ul>
                        <button class="btn btn-success btn-sm" style="margin-top:var(--space-5);width:100%">Enter Authority Demo →</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- How It Works -->
        <section class="landing-section">
            <div class="landing-section-title">How Medi Joints Works</div>
            <p class="landing-section-sub">From discovery to arrival — a seamless, life-saving journey</p>
            <div class="how-it-works-grid">
                <div class="hiw-step animate-fade-in-up stagger-1">
                    <div class="hiw-number">1</div>
                    <h4 style="margin-bottom:var(--space-2)">Discover</h4>
                    <p class="text-sm text-muted">Open the map and see real-time bed availability at every hospital near you</p>
                </div>
                <div class="hiw-step animate-fade-in-up stagger-2">
                    <div class="hiw-number">2</div>
                    <h4 style="margin-bottom:var(--space-2)">AI Triage</h4>
                    <p class="text-sm text-muted">Describe symptoms — AI classifies urgency and recommends the right facility</p>
                </div>
                <div class="hiw-step animate-fade-in-up stagger-3">
                    <div class="hiw-number">3</div>
                    <h4 style="margin-bottom:var(--space-2)">Reserve / SOS</h4>
                    <p class="text-sm text-muted">Lock a bed instantly or trigger Smart SOS for emergency dispatch</p>
                </div>
                <div class="hiw-step animate-fade-in-up stagger-4">
                    <div class="hiw-number">4</div>
                    <h4 style="margin-bottom:var(--space-2)">Arrive</h4>
                    <p class="text-sm text-muted">Navigate directly. Hospital is prepared. Bed is ready. Time saved.</p>
                </div>
            </div>
        </section>

        <!-- AI Features -->
        <section class="landing-section" style="background:var(--color-surface);margin:0;max-width:100%;padding:var(--space-20) var(--space-8)">
            <div style="max-width:1200px;margin:0 auto">
                <div class="landing-section-title">Intelligence Built Into Every Layer</div>
                <p class="landing-section-sub">8 AI capabilities that make Medi Joints faster, smarter, and safer</p>
                <div class="landing-grid-4">
                    ${[
                        { icon: '🤖', title: 'AI Symptom Triage', desc: 'Describe symptoms, get urgency classification and care recommendations' },
                        { icon: '🏥', title: 'Smart Hospital Ranking', desc: 'Multi-factor AI ranks the best hospital for your specific condition' },
                        { icon: '🔮', title: 'Predictive Availability', desc: 'ML forecasts when full hospitals will likely have beds open' },
                        { icon: '🚨', title: 'Smart SOS Dispatcher', desc: 'Finds the RIGHT hospital, not just the nearest one' },
                        { icon: '📄', title: 'Health Record Summarizer', desc: 'AI structures your medical history for instant hospital sharing' },
                        { icon: '🌐', title: 'Multilingual Chatbot', desc: '8+ Indian languages supported for accessible guidance' },
                        { icon: '📈', title: 'Surge & Crisis AI', desc: 'Early warning system for capacity crunches before they happen' },
                        { icon: '🛡️', title: 'Fraud Detection', desc: 'Monitors data integrity to protect network trust' }
                    ].map((f, i) => `
                        <div class="card card-elevated animate-fade-in-up stagger-${i+1}" style="text-align:center;padding:var(--space-6)">
                            <div style="font-size:2rem;margin-bottom:var(--space-3)">${f.icon}</div>
                            <h5 style="margin-bottom:var(--space-2)">${f.title}</h5>
                            <p class="text-sm text-muted">${f.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- Medical Tourism CTA -->
        <section class="landing-section">
            <div class="landing-grid-2-1" style="display:grid;grid-template-columns:1.5fr 1fr;gap:var(--space-8);align-items:center">
                <div>
                    <div class="badge badge-accent" style="margin-bottom:var(--space-4)">New Module</div>
                    <h2 style="margin-bottom:var(--space-4)">Complete Medical Tourism Ecosystem</h2>
                    <p class="text-muted" style="margin-bottom:var(--space-6);font-size:var(--font-size-md);line-height:1.7">
                        From treatment discovery to post-recovery — one platform for patients traveling across cities, states, and borders.
                        Compare hospitals, consult doctors, book flights, arrange accommodation, and manage insurance — all in Medi Joints.
                    </p>
                    <div style="display:flex;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-6)">
                        ${['Treatment Discovery', 'Cost Comparison', 'Pre-Arrival Consultation', 'Flight & Hotel', 'Medical Visa', 'Insurance Support', 'Recovery Care'].map(s =>
                            `<span class="chip active">${s}</span>`
                        ).join('')}
                    </div>
                    <button class="btn btn-accent btn-lg" onclick="window.MediJoints.switchRole('tourism')">Explore Medical Tourism →</button>
                </div>
                <div class="card card-elevated" style="padding:var(--space-8);text-align:center;background:linear-gradient(135deg, rgba(var(--color-accent-rgb),0.05), rgba(var(--color-primary-rgb),0.05))">
                    <div style="font-size:4rem;margin-bottom:var(--space-4)">🌍</div>
                    <h3 style="margin-bottom:var(--space-2)">End-to-End Service</h3>
                    <p class="text-muted">Consultation → Treatment Plan → Visa → Flight → Hotel → Treatment → Recovery</p>
                    <div style="margin-top:var(--space-4);display:flex;justify-content:center;gap:var(--space-2)">
                        <span class="badge badge-accent">NABH</span>
                        <span class="badge badge-accent">JCI</span>
                        <span class="badge badge-accent">ISO</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer style="background:var(--color-primary-dark);color:white;padding:var(--space-12) var(--space-8);text-align:center">
            <div style="max-width:800px;margin:0 auto">
                <div style="font-size:var(--font-size-2xl);font-weight:700;margin-bottom:var(--space-4)">Medi Joints</div>
                <p style="color:rgba(255,255,255,0.7);margin-bottom:var(--space-2)">Real-Time · AI-Powered · End-to-End</p>
                <p style="color:rgba(255,255,255,0.5);font-size:var(--font-size-sm)">Connecting Patients. Saving Lives. Transforming Healthcare Travel.</p>
                <p style="color:rgba(255,255,255,0.3);font-size:var(--font-size-xs);margin-top:var(--space-6)">
                    AIKSHETRA TECH SOLUTION PVT LTD — ELEVATE 2026 Demo Showcase<br>
                    This is a demonstration prototype with synthetic data. Not a production medical system.
                </p>
            </div>
        </footer>`;
    }

    return { render };
})();
