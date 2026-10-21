<script lang="ts">
    import { Handle, Position } from '@xyflow/svelte';
    export let data: any;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={data.toggle} style="cursor: pointer; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));" title="Click to toggle 0/1">
    <svg width="50" height="40" viewBox="0 0 50 40">
        <rect x="5" y="5" width="30" height="30" rx="6" 
              fill={data.value === 1 ? '#10b981' : '#1e293b'} 
              stroke={data.value === 1 ? '#34d399' : '#3b82f6'} 
              stroke-width="2"/>
        <text x="20" y="25" fill={data.value === 1 ? 'white' : '#3b82f6'} font-family="monospace" font-weight="bold" font-size="16" text-anchor="middle">{data.value}</text>
        <line x1="35" y1="20" x2="50" y2="20" stroke="#94a3b8" stroke-width="2"/>
    </svg>
    <Handle type="source" position={Position.Right} style="background: #10b981; border: none; width: 10px; height: 10px; right: -5px; top: 50%;" />
</div>