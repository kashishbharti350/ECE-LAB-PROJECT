<script>
    import { SvelteFlow, Controls, Background, BackgroundVariant, MiniMap } from '@xyflow/svelte';
    import '@xyflow/svelte/dist/style.css'; 

    // Import our beautiful new custom designs
    import InputNode from './InputNode.svelte';
    import GateNode from './GateNode.svelte';

    // Register them with the engine
    const nodeTypes = {
        customInput: InputNode,
        customGate: GateNode
    };

    // Update the nodes to use our custom types and colors
    let nodes = [
        { id: 'in-a', type: 'customInput', position: { x: 50, y: 100 }, data: { value: 1 } },
        { id: 'in-b', type: 'customInput', position: { x: 50, y: 250 }, data: { value: 0 } },
        
        { id: 'gate-and', type: 'customGate', position: { x: 300, y: 100 }, data: { label: 'AND', color: '#16a34a' } }, // Green
        { id: 'gate-nand', type: 'customGate', position: { x: 300, y: 250 }, data: { label: 'NAND', color: '#eab308' } }, // Yellow
        { id: 'gate-or', type: 'customGate', position: { x: 550, y: 175 }, data: { label: 'OR', color: '#0ea5e9' } } // Blue
    ];

    let edges = [
        { id: 'e1', source: 'in-a', target: 'gate-and', targetHandle: 'in-a', animated: true },
        { id: 'e2', source: 'in-b', target: 'gate-nand', targetHandle: 'in-b', animated: true }
    ];
</script>

<div class="module-header">
    <h2>LogicLab Pro Simulator</h2>
    <p>Drag, drop, and connect nodes to build complex logic circuits.</p>
</div>

<div class="svelte-flow-wrapper">
    <!-- We add {nodeTypes} here so the canvas knows how to draw them -->
    <SvelteFlow {nodes} {edges} {nodeTypes} fitView colorMode="dark">
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
        <MiniMap />
    </SvelteFlow>
</div>