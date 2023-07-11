import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
	Background,
	Controls,
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	useEdgesState,
	useNodesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './Sidebar';

let id = 0;
const getId = () => `dndnode_${id++}`;

const Flow = () => {
	const reactFlowWrapper = useRef(null);
	const [nodes, setNodes] = useNodesState([]);
	const [edges, setEdges] = useEdgesState([]);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);

	const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
	const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

	const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
	const onDragOver = useCallback((event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);

	const onDrop = useCallback(
		(event) => {
			event.preventDefault();

			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
			const type = event.dataTransfer.getData('application/reactflow');

			// Check if the dropped element is valid
			if (typeof type === 'undefined' || !type) {
				return;
			}

			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top
			});
			const newNode = {
				id: getId(),
				type,
				position,
				data: { label: `${type} node` }
			};

			setNodes((nds) => nds.concat(newNode));
		},
		[reactFlowInstance]
	);
	return (
		<div className='flex flex-row flex-grow h-full p-2 bg-slate-500'>
			{/* Sidebar */}
			<Sidebar reactFlowInstance={reactFlowInstance} />
			{/* Flow */}
			<div
				className='flex-grow h-full rounded-xl bg-slate-100'
				ref={reactFlowWrapper}>
				<ReactFlow
					nodes={nodes}
					onNodesChange={onNodesChange}
					edges={edges}
					onDrop={onDrop}
					onDragOver={onDragOver}
					onInit={setReactFlowInstance}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					fitView>
					<Background />
					<Controls />
				</ReactFlow>
			</div>
		</div>
	);
};

export default Flow;
