<script lang="ts">
    import { Handle, Position } from '@xyflow/svelte';
    export let data: any;

    const getPath = (type: string) => {
        switch(type) {
            case 'AND': return '<path d="M 22 6 V 34 H 32 A 14 14 0 0 0 32 6 Z" fill="#16a34a" stroke="#4ade80" stroke-width="1"/>';
            case 'OR': return '<path d="M 20 6 Q 32 6 45 20 Q 32 34 20 34 Q 28 20 20 6 Z" fill="#0ea5e9" stroke="#38bdf8" stroke-width="1"/>';
            case 'NAND': return '<path d="M 22 6 V 34 H 32 A 14 14 0 0 0 32 6 Z" fill="#eab308" stroke="#fde047" stroke-width="1"/><circle cx="49" cy="20" r="3" fill="#0f172a" stroke="#fde047" stroke-width="2"/>';
            case 'XOR': return '<path d="M 17 6 Q 25 20 17 34" fill="none" stroke="#60a5fa" stroke-width="2"/><path d="M 22 6 Q 34 6 47 20 Q 34 34 22 34 Q 30 20 22 6 Z" fill="#3b82f6" stroke="#93c5fd" stroke-width="1"/>';
            case 'NOT': return '<path d="M 24 8 L 40 20 L 24 32 Z" fill="#8b5cf6" stroke="#a78bfa" stroke-width="1"/><circle cx="44" cy="20" r="3" fill="#0f172a" stroke="#a78bfa" stroke-width="2"/>';
            default: return '';
        }
    };
</script>

<div style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));">
    {#if data.label !== 'NOT'}
        <Handle type="target" position={Position.Left} id="in-a" style="top: 30%; background: #94a3b8; border: none; width: 10px; height: 10px; left: -5px;" />
        <Handle type="target" position={Position.Left} id="in-b" style="top: 70%; background: #94a3b8; border: none; width: 10px; height: 10px; left: -5px;" />
    {:else}
        <Handle type="target" position={Position.Left} id="in-a" style="top: 50%; background: #94a3b8; border: none; width: 10px; height: 10px; left: -5px;" />
    {/if}

    <svg width="65" height="40" viewBox="0 0 65 40">
        {#if data.label !== 'NOT'}
            <line x1="0" y1="12" x2={data.label==='XOR'?'20':(data.label==='OR'?'23':'22')} y2="12" stroke="#94a3b8" stroke-width="2"/>
            <line x1="0" y1="28" x2={data.label==='XOR'?'20':(data.label==='OR'?'23':'22')} y2="28" stroke="#94a3b8" stroke-width="2"/>
        {:else}
            <line x1="0" y1="20" x2="24" y2="20" stroke="#94a3b8" stroke-width="2"/>
        {/if}
        <line x1={data.label==='OR'||data.label==='XOR'?'45':(data.label==='NAND'?'52':(data.label==='NOT'?'47':'46'))} y1="20" x2="65" y2="20" stroke="#94a3b8" stroke-width="2"/>
        {@html getPath(data.label)}
        <text x={data.label==='NOT'?'30':'26'} y="23" fill="white" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle" style="pointer-events: none;">{data.label}</text>
    </svg>

    <Handle type="source" position={Position.Right} id="out-y" style="top: 50%; background: #10b981; border: none; width: 10px; height: 10px; right: -5px;" />
</div>