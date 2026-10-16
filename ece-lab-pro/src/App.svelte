<script lang="ts">
    import { Cpu, LayoutDashboard, GitMerge, Sun, Moon } from 'lucide-svelte';
    import LogicLab from './LogicLab.svelte';

    let activeTab = 'logiclab'; // Set default view
    let isLightMode = false;

    function toggleTheme() {
        isLightMode = !isLightMode;
        if (isLightMode) {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }
</script>

<div class="app-container">
    <!-- Sidebar Navigation -->
    <nav class="sidebar">
        <div class="logo">
            <Cpu size={28} />
            <h2>ECE Lab</h2>
        </div>
        <ul class="nav-links">
            <li>
                <button class={activeTab === 'home' ? 'active' : ''} on:click={() => activeTab = 'home'}>
                    <LayoutDashboard size={20} /> Dashboard
                </button>
            </li>
            <li>
                <button class={activeTab === 'logiclab' ? 'active' : ''} on:click={() => activeTab = 'logiclab'}>
                    <GitMerge size={20} /> LogicLab Pro
                </button>
            </li>
        </ul>
    </nav>

    <!-- Main Content Area -->
    <main class="main-content">
        <header class="top-bar">
            <h1>{activeTab === 'home' ? 'Dashboard' : 'LogicLab Pro'}</h1>
            <button class="icon-btn" on:click={toggleTheme}>
                {#if isLightMode}
                    <Moon size={20} />
                {:else}
                    <Sun size={20} />
                {/if}
            </button>
        </header>

        <!-- Dynamic Module Routing -->
        <section class="module-view">
            {#if activeTab === 'home'}
                <div class="welcome-banner">
                    <h2>Welcome to the Pro Workbench</h2>
                    <p>Powered by Svelte, TypeScript, and SvelteFlow.</p>
                </div>
            {:else if activeTab === 'logiclab'}
                <!-- This injects your new drag-and-drop component! -->
                <LogicLab />
            {/if}
        </section>
    </main>
</div>