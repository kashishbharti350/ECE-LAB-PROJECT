<script lang="ts">
    // --- 1. Ohm's Law & Power Variables ---
    let v = 5; 
    let r = 1000; 
    $: i = (v / r) * 1000; 
    $: p = (v * v) / r; 

    // --- 2. RC Circuit Variables ---
    let res_k = 10; 
    let cap_u = 100; 
    $: tau = (res_k * 1000) * (cap_u * 0.000001); 
    $: fc = 1 / (2 * Math.PI * (res_k * 1000) * (cap_u * 0.000001)); 

    // --- 3. Resistor Color Code Variables ---
    // Added uniform val/tol to every color to satisfy TypeScript
    const colors = {
        black:  { val: 0, mult: 1, tol: 0, hex: '#000000' },
        brown:  { val: 1, mult: 10, tol: 1, hex: '#8b4513' },
        red:    { val: 2, mult: 100, tol: 2, hex: '#ff0000' },
        orange: { val: 3, mult: 1000, tol: 0, hex: '#ff8c00' },
        yellow: { val: 4, mult: 10000, tol: 0, hex: '#ffd700' },
        green:  { val: 5, mult: 100000, tol: 0.5, hex: '#008000' },
        blue:   { val: 6, mult: 1000000, tol: 0.25, hex: '#0000ff' },
        violet: { val: 7, mult: 10000000, tol: 0.1, hex: '#8a2be2' },
        gray:   { val: 8, mult: 100000000, tol: 0.05, hex: '#808080' },
        white:  { val: 9, mult: 1000000000, tol: 0, hex: '#ffffff' },
        gold:   { val: 0, mult: 0.1, tol: 5, hex: '#d4af37' },
        silver: { val: 0, mult: 0.01, tol: 10, hex: '#c0c0c0' }
    };

    // We explicitly tell TS these variables can ONLY be keys from the colors object
    type ColorKey = keyof typeof colors;
    
    let b1: ColorKey = 'brown';
    let b2: ColorKey = 'black';
    let mult: ColorKey = 'red';
    let tol: ColorKey = 'gold';

    $: rawRes = ((colors[b1].val * 10) + colors[b2].val) * colors[mult].mult;
    $: tolVal = colors[tol].tol;

    $: formattedRes = formatRes(rawRes);
    function formatRes(val: number) {
        if (val >= 1000000) return (val / 1000000).toFixed(2) + ' MΩ';
        if (val >= 1000) return (val / 1000).toFixed(2) + ' kΩ';
        return val.toFixed(1) + ' Ω';
    }
</script>

<div class="module-header">
    <h2>Electronics Toolkit</h2>
    <p>Real-time calculators for lab analysis and circuit design.</p>
</div>

<div class="toolkit-grid">
    <!-- Ohm's Law Card -->
    <div class="calc-card">
        <h3>Ohm's Law & Power</h3>
        <div class="input-group">
            <!-- Linked label and input to fix A11y warnings -->
            <label for="calc-v">Voltage (V)</label>
            <input id="calc-v" type="number" bind:value={v} />
        </div>
        <div class="input-group">
            <label for="calc-r">Resistance (Ω)</label>
            <input id="calc-r" type="number" bind:value={r} />
        </div>
        <div class="results">
            <div class="result-box">Current: <strong>{i.toFixed(2)} mA</strong></div>
            <div class="result-box">Power: <strong>{p.toFixed(3)} W</strong></div>
        </div>
    </div>

    <!-- 4-Band Resistor Card -->
    <div class="calc-card">
        <h3>4-Band Resistor Decoder</h3>
        
        <div class="resistor-visual">
            <div class="wire left"></div>
            <div class="resistor-body">
                <div class="color-band" style="background-color: {colors[b1].hex};"></div>
                <div class="color-band" style="background-color: {colors[b2].hex};"></div>
                <div class="color-band" style="background-color: {colors[mult].hex};"></div>
                <div class="spacer"></div>
                <div class="color-band tol" style="background-color: {colors[tol].hex};"></div>
            </div>
            <div class="wire right"></div>
        </div>

        <div class="band-selectors">
            <div class="input-group">
                <label for="band-1">Band 1</label>
                <select id="band-1" bind:value={b1}>
                    <option value="brown">Brown</option> <option value="red">Red</option>
                    <option value="orange">Orange</option> <option value="yellow">Yellow</option>
                    <option value="green">Green</option> <option value="blue">Blue</option>
                    <option value="violet">Violet</option> <option value="gray">Gray</option>
                    <option value="white">White</option>
                </select>
            </div>
            <div class="input-group">
                <label for="band-2">Band 2</label>
                <select id="band-2" bind:value={b2}>
                    <option value="black">Black</option> <option value="brown">Brown</option>
                    <option value="red">Red</option> <option value="orange">Orange</option>
                    <option value="yellow">Yellow</option> <option value="green">Green</option>
                    <option value="blue">Blue</option> <option value="violet">Violet</option>
                    <option value="gray">Gray</option> <option value="white">White</option>
                </select>
            </div>
            <div class="input-group">
                <label for="band-mult">Multiplier</label>
                <select id="band-mult" bind:value={mult}>
                    <option value="black">Black</option> <option value="brown">Brown</option>
                    <option value="red">Red</option> <option value="orange">Orange</option>
                    <option value="yellow">Yellow</option> <option value="green">Green</option>
                    <option value="blue">Blue</option> <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                </select>
            </div>
            <div class="input-group">
                <label for="band-tol">Tolerance</label>
                <select id="band-tol" bind:value={tol}>
                    <option value="brown">Brown (1%)</option> <option value="red">Red (2%)</option>
                    <option value="gold">Gold (5%)</option> <option value="silver">Silver (10%)</option>
                </select>
            </div>
        </div>
        <div class="results">
            <div class="result-box">Resistance: <strong>{formattedRes} ±{tolVal}%</strong></div>
        </div>
    </div>

    <!-- RC Circuit Card -->
    <div class="calc-card">
        <h3>RC Time Constant & Filter</h3>
        <div class="input-group">
            <label for="calc-resk">Resistance (kΩ)</label>
            <input id="calc-resk" type="number" bind:value={res_k} />
        </div>
        <div class="input-group">
            <label for="calc-capu">Capacitance (µF)</label>
            <input id="calc-capu" type="number" bind:value={cap_u} />
        </div>
        <div class="results">
            <div class="result-box">Time Constant (τ): <strong>{tau.toFixed(4)} s</strong></div>
            <div class="result-box">Cutoff Freq (fc): <strong>{fc.toFixed(2)} Hz</strong></div>
        </div>
    </div>
</div>

<style>
    .toolkit-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; padding: 20px; }
    .calc-card { background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; display: flex; flex-direction: column;}
    .calc-card h3 { color: #38bdf8; margin-top: 0; border-bottom: 1px solid #334155; padding-bottom: 10px; }
    
    .input-group { margin-bottom: 15px; }
    .input-group label { display: block; font-size: 0.9rem; color: #94a3b8; margin-bottom: 5px; }
    .input-group input, .input-group select { width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: white; }
    
    .results { margin-top: auto; display: flex; flex-direction: column; gap: 10px; padding-top: 10px; }
    .result-box { background: #0f172a; padding: 10px; border-radius: 6px; border-left: 4px solid #10b981; }

    /* --- 3D Resistor CSS --- */
    .resistor-visual {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 25px 0 35px 0;
        height: 50px;
    }
    .resistor-body {
        width: 140px;
        height: 40px;
        background: linear-gradient(180deg, #dfc09f 0%, #b89063 50%, #896033 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        box-shadow: 0 8px 15px rgba(0,0,0,0.4), inset 0 3px 6px rgba(255,255,255,0.2);
        z-index: 2;
    }
    .color-band {
        width: 10px;
        height: 100%;
        margin-right: 12px;
        box-shadow: inset 0 4px 6px rgba(255,255,255,0.3), inset 0 -4px 6px rgba(0,0,0,0.5);
    }
    .spacer { flex-grow: 1; }
    .color-band.tol { margin-right: 5px; }
    
    .wire {
        position: absolute;
        width: 50px;
        height: 6px;
        background: linear-gradient(180deg, #e2e8f0 0%, #94a3b8 50%, #475569 100%);
        z-index: 1;
    }
    .wire.left { left: 10%; }
    .wire.right { right: 10%; }

    .band-selectors { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
</style>