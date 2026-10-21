<script>
    import { Settings, LayoutDashboard, Cpu, Calculator } from 'lucide-svelte';
    import LogicLab from './LogicLab.svelte';
    import ElectronicsToolkit from './ElectronicsToolkit.svelte';

    let activeTab = 'dashboard';
</script>

<div class="app-container">
    <!-- SIDEBAR NAVIGATION -->
    <nav class="sidebar">
        <div class="brand">
            <Cpu size={28} color="#38bdf8" />
            <h1>ECE Lab Pro</h1>
        </div>
        
        <div class="nav-links">
            <button class:active={activeTab === 'dashboard'} on:click={() => activeTab = 'dashboard'}>
                <LayoutDashboard size={20} /> Dashboard
            </button>
            <button class:active={activeTab === 'toolkit'} on:click={() => activeTab = 'toolkit'}>
                <Calculator size={20} /> Electronics Toolkit
            </button>
            <button class:active={activeTab === 'logiclab'} on:click={() => activeTab = 'logiclab'}>
                <Cpu size={20} /> LogicLab Pro
            </button>
        </div>
    </nav>

    <!-- MAIN CONTENT AREA -->
    <main class="content">
        {#if activeTab === 'dashboard'}
            <div class="module-header">
                <h2>Welcome to the Workbench</h2>
                <p>Your digital engineering environment is ready.</p>
            </div>
            
            <!-- Dashboard Welcome Cards -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 20px;">
                <div style="background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155;">
                    <h3 style="color: #38bdf8; margin-top:0;">⚡ Rapid Calculations</h3>
                    <p style="color: #cbd5e1; line-height: 1.6;">Jump into the Electronics Toolkit to solve Ohm's Law, calculate Power dissipation, and tune RC filters instantly without hunting for formulas.</p>
                    <button style="margin-top: 15px; padding: 8px 16px; background: #38bdf8; color: #0f172a; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;" on:click={() => activeTab = 'toolkit'}>Open Toolkit</button>
                </div>
                <div style="background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155;">
                    <h3 style="color: #10b981; margin-top:0;">🧩 Logic Prototyping</h3>
                    <p style="color: #cbd5e1; line-height: 1.6;">Use LogicLab Pro to visually drag, drop, and connect logic gates. Prototype your digital circuits in a modern SvelteFlow engine before wiring physical ICs.</p>
                    <button style="margin-top: 15px; padding: 8px 16px; background: #10b981; color: #0f172a; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;" on:click={() => activeTab = 'logiclab'}>Open LogicLab</button>
                </div>
            </div>

        {:else if activeTab === 'toolkit'}
            <ElectronicsToolkit />
            
        {:else if activeTab === 'logiclab'}
            <LogicLab />
        {/if}
    </main>
</div>