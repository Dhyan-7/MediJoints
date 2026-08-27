/* ═══════════════════════════════════════════════
   MEDI JOINTS — AI Triage Page (P04)
   Chat-like symptom input with AI responses
   ═══════════════════════════════════════════════ */

window.AITriagePage = (function() {

    let messages = [
        { role: 'bot', content: "Hello! I'm your AI Health Assistant. I can help assess your symptoms and recommend the right hospital and care type.\n\nPlease describe your symptoms. Try: <em>\"chest pain and difficulty breathing\"</em>" }
    ];
    let triageResult = null;

    function reset() {
        messages = [
            { role: 'bot', content: "Hello! I'm your AI Health Assistant. I can help assess your symptoms and recommend the right hospital and care type.\n\nPlease describe your symptoms. Try: <em>\"chest pain and difficulty breathing\"</em>" }
        ];
        triageResult = null;
    }

    function handleSubmit() {
        const input = document.getElementById('ai-input');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;

        messages.push({ role: 'user', content: text });
        input.value = '';

        // AI triage
        triageResult = MediJointsStore.triageSymptoms(text);

        const urgencyColors = { critical: 'var(--color-critical)', warning: 'var(--color-warning)', success: 'var(--color-success)' };
        const urgencyBg = { critical: 'var(--color-critical-light)', warning: 'var(--color-warning-light)', success: 'var(--color-success-light)' };

        let responseHtml = `<div style="margin-bottom:var(--space-4)">
            <div style="display:inline-flex;align-items:center;gap:var(--space-2);padding:var(--space-2) var(--space-4);border-radius:var(--radius-full);background:${urgencyBg[triageResult.urgencyClass]};color:${urgencyColors[triageResult.urgencyClass]};font-weight:700;font-size:var(--font-size-sm);margin-bottom:var(--space-3)">
                ${triageResult.urgency === 'Critical' ? '🚨' : triageResult.urgency === 'Urgent' ? '⚠️' : '✅'} ${triageResult.urgency}
            </div>
            <p style="margin-bottom:var(--space-3)">${triageResult.rationale}</p>
            <div style="background:var(--color-surface);padding:var(--space-3);border-radius:var(--radius-md);margin-bottom:var(--space-3)">
                <div class="text-sm font-semibold" style="margin-bottom:var(--space-1)">Recommended Care</div>
                <div class="text-sm text-muted">${triageResult.recommendedCare}</div>
            </div>
            <div style="background:var(--color-surface);padding:var(--space-3);border-radius:var(--radius-md);margin-bottom:var(--space-3)">
                <div class="text-sm font-semibold" style="margin-bottom:var(--space-1)">Suggested Action</div>
                <div class="text-sm text-muted">${triageResult.action}</div>
            </div>
        </div>`;

        if (triageResult.urgency === 'Critical') {
            responseHtml += `<div style="display:flex;gap:var(--space-3)">
                <button class="btn btn-critical" onclick="window.MediJoints.navigateTo('/patient/sos')">🚨 Start Smart SOS</button>
                <button class="btn btn-outline" onclick="window.MediJoints.navigateTo('/patient/dashboard')">View Matched Hospitals</button>
            </div>`;
        } else {
            responseHtml += `<button class="btn btn-primary" onclick="window.MediJoints.navigateTo('/patient/dashboard')">View Matched Hospitals →</button>`;
        }

        messages.push({ role: 'bot', content: responseHtml, isHtml: true });
        window.MediJoints.refreshPage();
    }

    function render() {
        return `<div class="ai-chat">
            <div style="text-align:center;margin-bottom:var(--space-6)">
                <div style="width:64px;height:64px;border-radius:var(--radius-xl);background:linear-gradient(135deg, rgba(var(--color-accent-rgb),0.1), rgba(var(--color-primary-rgb),0.1));display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto var(--space-3)">🤖</div>
                <h2>AI Symptom Triage</h2>
                <p class="text-muted">Describe your symptoms for urgency assessment and hospital recommendations</p>
            </div>

            <!-- Quick Suggestions -->
            <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);justify-content:center;margin-bottom:var(--space-6)">
                ${['chest pain and difficulty breathing', 'high fever and severe headache', 'mild stomach ache', 'fracture from fall', 'pregnancy checkup'].map(s => `
                    <button class="chip" onclick="document.getElementById('ai-input').value='${s}'; AITriagePage.handleSubmit()">${s}</button>
                `).join('')}
            </div>

            <!-- Messages -->
            <div class="ai-chat-messages" id="ai-messages">
                ${messages.map(m => `
                    <div class="ai-message ai-message-${m.role}">
                        <div class="ai-message-avatar">${m.role === 'bot' ? '🤖' : '👤'}</div>
                        <div class="ai-message-content">${m.isHtml ? m.content : m.content}</div>
                    </div>
                `).join('')}
            </div>

            <!-- Input -->
            <div class="ai-chat-input">
                <input type="text" id="ai-input" placeholder="Describe your symptoms..." 
                       onkeypress="if(event.key==='Enter') AITriagePage.handleSubmit()">
                <button class="btn btn-accent btn-sm" onclick="AITriagePage.handleSubmit()">Send →</button>
            </div>

            ${UI.safetyDisclaimer()}
        </div>`;
    }

    return { render, handleSubmit, reset };
})();
