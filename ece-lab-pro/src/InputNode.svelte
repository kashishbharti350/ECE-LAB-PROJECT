<script>
    import { Handle, Position } from '@xyflow/svelte';
    export let data; // This receives the 0 or 1 value
</script>

<div class="custom-input {data.value === 1 ? 'state-on' : 'state-off'}">
    <!-- The output connection dot on the right side -->
    <Handle type="source" position={Position.Right} />
    
    <span class="value-text">{data.value}</span>
</div>