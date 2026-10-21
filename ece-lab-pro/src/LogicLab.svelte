<script lang="ts">
    import { SvelteFlow, Controls, Background, BackgroundVariant, MiniMap, addEdge } from '@xyflow/svelte';
    import type { Node, Edge, Connection } from '@xyflow/svelte';
    import '@xyflow/svelte/dist/style.css'; 

    import InputNode from './InputNode.svelte';
    import GateNode from './GateNode.svelte';
    import OutputNode from './OutputNode.svelte';

    const nodeTypes = {
        customInput: InputNode,
        customGate: GateNode,
        customOutput: OutputNode
    };

    let nodes: Node[] = [];
    let edges: Edge[] = [];

   

    const toggleNode = (id: string) => {
        nodes = nodes.map(n => n.id === id ? { ...n, data: { ...n.data, value: n.data.value === 1 ? 0 : 1 } } : n) as Node[];
    };

    const onDragStart = (event: DragEvent, type: string, label: string, color: string) => {
        if (event.dataTransfer) {
            event.dataTransfer.setData('application/svelteflow', JSON.stringify({ type, label, color }));
            event.dataTransfer.effectAllowed = 'move';
        }
    };

    const onDragOver = (event: DragEvent) => {
        event.preventDefault();
    };

    const onDrop = (event: DragEvent) => {
        event.preventDefault();
        const dataStr = event.dataTransfer?.getData('application/svelteflow');
        if (!dataStr) return;

        const { type, label, color } = JSON.parse(dataStr);
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        
        const newNodeId = `node-${Math.random().toString(36).substring(2, 9)}`;
        const newNode: Node = {
            id: newNodeId, 
            type,
            position: { x: event.clientX - rect.left - 40, y: event.clientY - rect.top - 40 },
            data: type === 'customInput' 
                  ? { value: label === 'INPUT 1' ? 1 : 0, toggle: () => toggleNode(newNodeId) } 
                  : { label, color, outValue: 0 }
        };
        nodes = [...nodes, newNode];
    };

    const evaluateLogic = (currentNodes: Node[], currentEdges: Edge[]) => {
        let state: Record<string, number> = {};
        currentNodes.forEach(n => { if (n.type === 'customInput') state[n.id] = n.data.value as number; });

        let changed = true; let iters = 0;
        while (changed && iters < 50) { 
            changed = false; iters++;
            currentNodes.forEach(n => {
                if (n.type === 'customGate' || n.type === 'customOutput') {
                    let edgeA = currentEdges.find(e => e.target === n.id && e.targetHandle === 'in-a') || currentEdges.find(e => e.target === n.id);
                    let edgeB = currentEdges.find(e => e.target === n.id && e.targetHandle === 'in-b');
                    
                    let valA = edgeA ? state[edgeA.source] : undefined;
                    let valB = edgeB ? state[edgeB.source] : undefined;

                    let out = 0;
                    if (n.type === 'customOutput') {
                        out = valA !== undefined ? valA : 0;
                    } else {
                        const lbl = n.data.label as string;
                        if (lbl === 'NOT') out = valA === 1 ? 0 : 1;
                        else if (lbl === 'AND') out = (valA === 1 && valB === 1) ? 1 : 0;
                        else if (lbl === 'OR') out = (valA === 1 || valB === 1) ? 1 : 0;
                        else if (lbl === 'NAND') out = (valA === 1 && valB === 1) ? 0 : 1;
                        else if (lbl === 'XOR') out = (valA !== valB && valA !== undefined && valB !== undefined) ? 1 : 0;
                    }

                    if (state[n.id] !== out) { state[n.id] = out; changed = true; }
                }
            });
        }
        return state;
    };

    const buildEquation = (nodeId: string): string => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return '';
        if (node.type === 'customInput') {
            const idx = nodes.filter(n => n.type === 'customInput').sort((a,b) => a.position.y - b.position.y).findIndex(n => n.id === nodeId);
            return String.fromCharCode(65 + (idx >= 0 ? idx : 0)); 
        }
        let inA = edges.find(e => e.target === nodeId && e.targetHandle === 'in-a') || edges.find(e => e.target === nodeId);
        let inB = edges.find(e => e.target === nodeId && e.targetHandle === 'in-b');
        
        let expA = inA ? buildEquation(inA.source) : '?';
        let expB = inB ? buildEquation(inB.source) : '?';
        
        if (node.type === 'customOutput') return expA;
        
        const lbl = node.data.label as string;
        if (lbl === 'NOT') return `~${expA}`;
        if (lbl === 'AND') return `(${expA} · ${expB})`;
        if (lbl === 'OR') return `(${expA} + ${expB})`;
        if (lbl === 'NAND') return `~(${expA} · ${expB})`;
        if (lbl === 'XOR') return `(${expA} ⊕ ${expB})`;
        return '?';
    };

    let truthTable: { ins: number[], outs: number[] }[] = [];
    let equationStr = 'Connect inputs to an output';
    let currentInputs: string[] = [];

    $: {
        if (nodes && edges) {
            const newState = evaluateLogic(nodes, edges);
            nodes = nodes.map(n => n.data.outValue !== newState[n.id] ? { ...n, data: { ...n.data, outValue: newState[n.id] || 0 } } : n) as Node[];
            
            edges = edges.map(e => {
                let color = newState[e.source] === 1 ? '#10b981' : '#3b82f6';
                let style = `stroke: ${color}; stroke-width: 2;`;
                return e.style !== style ? { ...e, style, animated: true } : e;
            }) as Edge[];

            const ins = nodes.filter(n => n.type === 'customInput').sort((a,b) => a.position.y - b.position.y);
            const outs = nodes.filter(n => n.type === 'customOutput');
            
            if (outs.length > 0) equationStr = `OUT = ${buildEquation(outs[0].id)}`;
            currentInputs = ins.map((_, i) => String.fromCharCode(65+i));

            if (ins.length > 0 && ins.length <= 4 && outs.length > 0) {
                let table = [];
                for(let i=0; i < (1 << ins.length); i++) {
                    let mockNodes = nodes.map(n => {
                        if (n.type === 'customInput') {
                            let idx = ins.findIndex(x => x.id === n.id);
                            return {...n, data: {...n.data, value: (i >> (ins.length - 1 - idx)) & 1}};
                        }
                        return n;
                    });
                    let testState = evaluateLogic(mockNodes, edges);
                    table.push({
                        ins: ins.map((_, idx) => (i >> (ins.length - 1 - idx)) & 1),
                        outs: outs.map(n => testState[n.id] || 0)
                    });
                }
                truthTable = table;
            } else { truthTable = []; }
        }
    }
</script>

<div class="simulator-layout">
    <aside class="sidebar-panel palette-panel">
        <div class="panel-header"><h3>GATE PALETTE</h3><p>Drag gates to the canvas</p></div>
        <div class="palette-items">
            <div class="palette-btn" draggable="true" on:dragstart={(e) => onDragStart(e, 'customInput', 'INPUT 1', '#10b981')}>
                <div class="mini-icon input-icon" style="background:#10b981;">1</div><span>INPUT 1</span>
            </div>
            <div class="palette-btn" draggable="true" on:dragstart={(e) => onDragStart(e, 'customInput', 'INPUT 0', '#1e293b')}>
                <div class="mini-icon input-icon" style="background:#1e293b; border-color:#3b82f6; color:#3b82f6;">0</div><span>INPUT 0</span>
            </div>
            <div class="palette-btn" draggable="true" on:dragstart={(e) => onDragStart(e, 'customGate', 'AND', '#16a34a')}>
                <div class="mini-icon gate-icon" style="background-color: #16a34a; border-radius: 20px 8px 8px 20px;"></div><span>AND</span>
            </div>
            <div class="palette-btn" draggable="true" on:dragstart={(e) => onDragStart(e, 'customGate', 'OR', '#0ea5e9')}>
                <div class="mini-icon gate-icon" style="background-color: #0ea5e9; border-radius: 20px 8px 8px 20px;"></div><span>OR</span>
            </div>
            <div class="palette-btn" draggable="true" on:dragstart={(e) => onDragStart(e, 'customGate', 'NOT', '#8b5cf6')}>
                <div class="mini-icon gate-icon" style="background-color: #8b5cf6; border-radius: 20px 8px 8px 20px;"></div><span>NOT</span>
            </div>
            <div class="palette-btn" draggable="true" on:dragstart={(e) => onDragStart(e, 'customGate', 'NAND', '#eab308')}>
                <div class="mini-icon gate-icon" style="background-color: #eab308; border-radius: 20px 8px 8px 20px;"></div><span>NAND</span>
            </div>
            <div class="palette-btn" draggable="true" on:dragstart={(e) => onDragStart(e, 'customGate', 'XOR', '#3b82f6')}>
                <div class="mini-icon gate-icon" style="background-color: #3b82f6; border-radius: 20px 8px 8px 20px;"></div><span>XOR</span>
            </div>
            <div class="palette-btn" draggable="true" style="margin-top:20px; border-color:#10b981;" on:dragstart={(e) => onDragStart(e, 'customOutput', 'OUTPUT', '#10b981')}>
                <div class="mini-icon input-icon" style="background:#10b981;">?</div><span>OUTPUT</span>
            </div>
        </div>
    </aside>

    <main class="canvas-area">
        <div class="svelte-flow-wrapper" on:drop={onDrop} on:dragover={onDragOver} role="application">
<SvelteFlow {nodes} {edges} {nodeTypes} on:connect={(e) => edges = addEdge(e.detail.connection, edges)} fitView colorMode="dark">                <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
                <Controls />
                <MiniMap />
            </SvelteFlow>
        </div>
    </main>

    <aside class="sidebar-panel analytics-panel">
        <div class="panel-section">
            <h3>TRUTH TABLE</h3>
            <table class="truth-table">
                <thead>
                    <tr>
                        {#each currentInputs as input}<th>{input}</th>{/each}
                        <th class="out">OUT</th>
                    </tr>
                </thead>
                <tbody>
                    {#if truthTable.length > 0}
                        {#each truthTable as row}
                            <tr>
                                {#each row.ins as val}<td>{val}</td>{/each}
                                <td class="out-val">{row.outs[0]}</td>
                            </tr>
                        {/each}
                    {:else}
                        <tr><td colspan="5" style="color:#64748b; font-size: 0.8rem;">Build a circuit and add an OUTPUT node to see logic combinations.</td></tr>
                    {/if}
                </tbody>
            </table>
        </div>

        <div class="panel-section">
            <h3>EXPLANATION</h3>
            <p class="desc-text">The circuit evaluates combinations dynamically. Live formula:</p>
            <div class="formula-box" style="font-size: 1.1rem; padding: 15px;">
                {equationStr}
            </div>
        </div>
    </aside>
</div>

<style>
    .simulator-layout { display: grid; grid-template-columns: 240px minmax(400px, 1fr) 260px; height: calc(100vh - 40px); min-height: 600px; gap: 1px; background: #0f172a; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b; }
    .sidebar-panel { background: #151e2e; padding: 20px; display: flex; flex-direction: column; gap: 25px; overflow-y: auto; z-index: 10; }
    .panel-header h3, .panel-section h3 { color: #94a3b8; font-size: 0.85rem; letter-spacing: 1px; margin: 0 0 5px 0; }
    .panel-header p { color: #64748b; font-size: 0.8rem; margin: 0; }
    .palette-items { display: flex; flex-direction: column; gap: 10px; }
    .palette-btn { display: flex; align-items: center; gap: 10px; background: #1e293b; padding: 8px 12px; border-radius: 8px; cursor: grab; border: 1px solid #334155; transition: all 0.2s ease; color: #e2e8f0; font-weight: bold; font-size: 0.9rem; }
    .palette-btn:hover { border-color: #475569; background: #233147; transform: translateX(5px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    .mini-icon { display: flex; justify-content: center; align-items: center; font-size: 0.7rem; color: white; font-weight: bold; box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.2), 0 4px 6px rgba(0, 0, 0, 0.5); }
    .input-icon { width: 28px; height: 28px; border-radius: 6px; border: 1px solid #34d399; }
    .gate-icon { width: 40px; height: 24px; border: 1px solid rgba(255,255,255,0.3); background-image: linear-gradient(145deg, rgba(255,255,255,0.1), rgba(0,0,0,0.2)); }
    .canvas-area { background: #0b1120; position: relative; height: 100%; width: 100%; }
    .svelte-flow-wrapper { position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; min-height: 500px; }
    .truth-table { width: 100%; border-collapse: collapse; font-family: monospace; font-size: 0.9rem; background: #0b1120; border-radius: 8px; overflow: hidden; border: 1px solid #1e293b; }
    .truth-table th, .truth-table td { padding: 10px; text-align: center; border-bottom: 1px solid #1e293b; color: #94a3b8; }
    .truth-table th { background: #1e293b; color: #e2e8f0; }
    .truth-table .out { color: #10b981; }
    .truth-table .out-val { color: #10b981; font-weight: bold; }
    .desc-text { color: #94a3b8; font-size: 0.85rem; line-height: 1.5; }
    .formula-box { background: #0b1120; border: 1px solid #16a34a; color: #10b981; padding: 12px; border-radius: 8px; text-align: center; font-family: monospace; font-weight: bold; margin-top: 10px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5); }
</style>