<script lang="ts">
    import { Handle, Position } from '@xyflow/svelte';
    export let data: any;
</script>

<div style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));">
    <Handle type="target" position={Position.Left} style="background: #10b981; border: none; width: 10px; height: 10px; left: -5px; top: 50%;" />
    <svg width="50" height="40" viewBox="0 0 50 40">
        <line x1="0" y1="20" x2="15" y2="20" stroke="#94a3b8" stroke-width="2"/>
        <rect x="15" y="5" width="30" height="30" rx="6" 
              fill={data.outValue === 1 ? '#10b981' : '#1e293b'} 
              stroke={data.outValue === 1 ? '#34d399' : '#3b82f6'} 
              stroke-width="2"/>
        <text x="30" y="25" fill={data.outValue === 1 ? 'white' : '#3b82f6'} font-family="monospace" font-weight="bold" font-size="16" text-anchor="middle">{data.outValue !== undefined ? data.outValue : '?'}</text>
    </svg>
</div>