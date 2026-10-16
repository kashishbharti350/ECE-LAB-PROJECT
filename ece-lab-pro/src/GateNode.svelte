<script>
    import { Handle, Position } from '@xyflow/svelte';
    export let data; // This receives the label and color
</script>

<div class="custom-gate" style="--gate-color: {data.color};">
    <!-- Two input connection dots on the left side -->
    <Handle type="target" position={Position.Left} id="in-a" style="top: 25%;" />
    <Handle type="target" position={Position.Left} id="in-b" style="top: 75%;" />
    
    <span class="gate-label">{data.label}</span>
    
    <!-- One output connection dot on the right side -->
    <Handle type="source" position={Position.Right} id="out-y" />
</div>