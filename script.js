// ==========================================
// 1. INITIALIZATION & NAVIGATION
// ==========================================
lucide.createIcons();

const navLinks = document.querySelectorAll('.nav-links a');
const navCards = document.querySelectorAll('.nav-card');
const views = document.querySelectorAll('.module-view');
const pageTitle = document.getElementById('page-title');

function navigateTo(targetId) {
    views.forEach(view => view.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));

    const targetView = document.getElementById(targetId);
    if (targetView) targetView.classList.add('active');

    const activeLink = document.querySelector(`.nav-links a[data-target="${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        pageTitle.textContent = activeLink.textContent.trim();
    }
}

navLinks.forEach(link => { link.addEventListener('click', (e) => { e.preventDefault(); navigateTo(link.getAttribute('data-target')); }); });
navCards.forEach(card => { card.addEventListener('click', () => { navigateTo(card.getAttribute('data-target')); }); });

const themeToggleBtn = document.getElementById('theme-toggle');
themeToggleBtn.addEventListener('click', () => {
    const body = document.documentElement;
    if (body.getAttribute('data-theme') === 'light') {
        body.removeAttribute('data-theme');
        themeToggleBtn.innerHTML = '<i data-lucide="sun"></i>';
    } else {
        body.setAttribute('data-theme', 'light');
        themeToggleBtn.innerHTML = '<i data-lucide="moon"></i>';
    }
    lucide.createIcons(); 
});

// ==========================================
// 2, 3 & 4. ELECTRONICS TOOLKIT (Ohm, Resistor, RC)
// ==========================================
// Ohm's Law
const ohmInputs = { v: document.getElementById('ohm-v'), i: document.getElementById('ohm-i'), r: document.getElementById('ohm-r'), p: document.getElementById('ohm-p') };
const btnCalcOhm = document.getElementById('btn-calc-ohm'), btnResetOhm = document.getElementById('btn-reset-ohm'), ohmErrorMsg = document.getElementById('ohm-error'), ohmResultBox = document.getElementById('ohm-result');

function calculateOhmsLaw() {
    let v = parseFloat(ohmInputs.v.value), i = parseFloat(ohmInputs.i.value), r = parseFloat(ohmInputs.r.value), p = parseFloat(ohmInputs.p.value);
    let providedCount = (!isNaN(v)?1:0) + (!isNaN(i)?1:0) + (!isNaN(r)?1:0) + (!isNaN(p)?1:0);

    if (providedCount !== 2) { ohmErrorMsg.textContent = "Please enter exactly two values."; ohmErrorMsg.style.display = 'block'; ohmResultBox.style.display = 'none'; return; }
    if (r === 0) { ohmErrorMsg.textContent = "Resistance cannot be 0."; ohmErrorMsg.style.display = 'block'; ohmResultBox.style.display = 'none'; return; }

    ohmErrorMsg.style.display = 'none';
    let f = [];
    if (!isNaN(v) && !isNaN(i)) { r = v / i; p = v * i; f.push('R=V/I', 'P=V×I'); } 
    else if (!isNaN(v) && !isNaN(r)) { i = v / r; p = (v*v) / r; f.push('I=V/R', 'P=V²/R'); } 
    else if (!isNaN(v) && !isNaN(p)) { i = p / v; r = (v*v) / p; f.push('I=P/V', 'R=V²/P'); } 
    else if (!isNaN(i) && !isNaN(r)) { v = i * r; p = (i*i) * r; f.push('V=I×R', 'P=I²×R'); } 
    else if (!isNaN(i) && !isNaN(p)) { v = p / i; r = p / (i*i); f.push('V=P/I', 'R=P/I²'); } 
    else if (!isNaN(r) && !isNaN(p)) { v = Math.sqrt(p*r); i = Math.sqrt(p/r); f.push('V=√(P×R)', 'I=√(P/R)'); }

    const formatStr = (num) => parseFloat(num.toFixed(4)).toString();
    ohmResultBox.innerHTML = `<h4>Results</h4><div class="result-item"><span>Voltage:</span> <strong>${formatStr(v)} V</strong></div><div class="result-item"><span>Current:</span> <strong>${formatStr(i)} A</strong></div><div class="result-item"><span>Resistance:</span> <strong>${formatStr(r)} Ω</strong></div><div class="result-item"><span>Power:</span> <strong>${formatStr(p)} W</strong></div>`;
    ohmResultBox.style.display = 'block';
    ohmInputs.v.value = formatStr(v); ohmInputs.i.value = formatStr(i); ohmInputs.r.value = formatStr(r); ohmInputs.p.value = formatStr(p);
}
btnCalcOhm.addEventListener('click', calculateOhmsLaw);
btnResetOhm.addEventListener('click', () => { ohmInputs.v.value=''; ohmInputs.i.value=''; ohmInputs.r.value=''; ohmInputs.p.value=''; ohmErrorMsg.style.display='none'; ohmResultBox.style.display='none'; });

// RC Calculator
const rcInputs = { r: document.getElementById('rc-r'), rUnit: document.getElementById('rc-r-unit'), c: document.getElementById('rc-c'), cUnit: document.getElementById('rc-c-unit') };
const btnCalcRc = document.getElementById('btn-calc-rc'), btnResetRc = document.getElementById('btn-reset-rc'), rcErrorMsg = document.getElementById('rc-error'), rcResultBox = document.getElementById('rc-result');

function calculateRC() {
    let rVal = parseFloat(rcInputs.r.value), cVal = parseFloat(rcInputs.c.value);
    if (isNaN(rVal) || isNaN(cVal) || rVal <= 0 || cVal <= 0) { rcErrorMsg.style.display = 'block'; rcResultBox.style.display = 'none'; return; }
    rcErrorMsg.style.display = 'none';

    let tau = (rVal * parseFloat(rcInputs.rUnit.value)) * (cVal * parseFloat(rcInputs.cUnit.value));
    let fc = 1 / (2 * Math.PI * tau);

    rcResultBox.innerHTML = `<h4>Results</h4><div class="result-item"><span>Time Constant (τ):</span> <strong>${(tau < 1e-3 ? (tau*1e6).toFixed(2)+' µs' : (tau < 1 ? (tau*1e3).toFixed(2)+' ms' : tau.toFixed(4)+' s'))}</strong></div><div class="result-item"><span>Cutoff Freq (f<sub>c</sub>):</span> <strong>${(fc >= 1e6 ? (fc/1e6).toFixed(2)+' MHz' : (fc >= 1e3 ? (fc/1e3).toFixed(2)+' kHz' : fc.toFixed(2)+' Hz'))}</strong></div>`;
    rcResultBox.style.display = 'block';
}
btnCalcRc.addEventListener('click', calculateRC);
btnResetRc.addEventListener('click', () => { rcInputs.r.value=''; rcInputs.c.value=''; rcErrorMsg.style.display='none'; rcResultBox.style.display='none'; });

// ==========================================
// 5. LOGICLAB: DIGITAL LOGIC SIMULATOR
// ==========================================
const logicGates = {
    AND:  { expr: "Y = A · B", inputs: 2, fn: (a, b) => a & b },
    OR:   { expr: "Y = A + B", inputs: 2, fn: (a, b) => a | b },
    NOT:  { expr: "Y = A'",    inputs: 1, fn: (a) => a === 1 ? 0 : 1 },
    NAND: { expr: "Y = (A · B)'", inputs: 2, fn: (a, b) => !(a & b) ? 1 : 0 },
    NOR:  { expr: "Y = (A + B)'", inputs: 2, fn: (a, b) => !(a | b) ? 1 : 0 },
    XOR:  { expr: "Y = A ⊕ B", inputs: 2, fn: (a, b) => a ^ b }
};

const gateSelector = document.getElementById('gate-selector');
const btnInA = document.getElementById('logic-in-a');
const btnInB = document.getElementById('logic-in-b');
const nodeInB = document.getElementById('node-in-b');
const outY = document.getElementById('logic-out-y');
const gateShapeName = document.getElementById('gate-shape-name');
const gateExprText = document.getElementById('gate-expr-text');
const truthTable = document.getElementById('logic-truth-table');

function toggleInputState(e) {
    const btn = e.target;
    const newState = parseInt(btn.getAttribute('data-state')) === 0 ? 1 : 0;
    btn.setAttribute('data-state', newState);
    btn.textContent = newState;
    btn.className = `logic-btn state-${newState}`;
    evaluateCircuit();
}

function evaluateCircuit() {
    const gate = logicGates[gateSelector.value];
    const valA = parseInt(btnInA.getAttribute('data-state'));
    const valB = parseInt(btnInB.getAttribute('data-state'));
    const result = gate.inputs === 1 ? gate.fn(valA) : gate.fn(valA, valB);
    
    outY.textContent = result;
    outY.className = `logic-out-display state-${result}`;
}

function buildTruthTable() {
    const gate = logicGates[gateSelector.value];
    let html = `<thead><tr><th>Input A</th>${gate.inputs === 2 ? '<th>Input B</th>' : ''}<th class="tt-out">Output Y</th></tr></thead><tbody>`;

    for (let a = 0; a <= 1; a++) {
        if (gate.inputs === 1) {
            html += `<tr><td>${a}</td><td class="tt-out">${gate.fn(a)}</td></tr>`;
        } else {
            for (let b = 0; b <= 1; b++) {
                html += `<tr><td>${a}</td><td>${b}</td><td class="tt-out">${gate.fn(a, b)}</td></tr>`;
            }
        }
    }
    truthTable.innerHTML = html + `</tbody>`;
}

function updateGateUI() {
    const gateKey = gateSelector.value;
    const gate = logicGates[gateKey];
    gateShapeName.textContent = gateKey;
    gateExprText.textContent = gate.expr;
    nodeInB.style.display = gate.inputs === 1 ? 'none' : 'flex';
    evaluateCircuit();
    buildTruthTable();
}

btnInA.addEventListener('click', toggleInputState);
btnInB.addEventListener('click', toggleInputState);
gateSelector.addEventListener('change', updateGateUI);

// Start LogicLab
updateGateUI();