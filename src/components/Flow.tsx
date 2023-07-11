import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
	Background,
	Connection,
	Controls,
	Edge,
	EdgeChange,
	NodeChange,
	ReactFlowInstance,
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
	const reactFlowWrapper = useRef<HTMLDivElement>(null);
	const [nodes, setNodes] = useNodesState([]);
	const [edges, setEdges] = useEdgesState([]);
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

	const onNodesChange = useCallback(
		(changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
		[setNodes]
	);
	const onEdgesChange = useCallback(
		(changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
		[setEdges]
	);

	const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
	const onDragOver = useCallback((event: { preventDefault: () => void; dataTransfer: { dropEffect: string } }) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);

	const onDrop = useCallback(
		(event: {
			preventDefault: () => void;
			dataTransfer: { getData: (arg0: string) => any };
			clientX: number;
			clientY: number;
		}) => {
			event.preventDefault();

			if (!reactFlowWrapper.current) {
				return;
			}

			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
			const type = event.dataTransfer.getData('application/reactflow');

			// Check if the dropped element is valid
			if (typeof type === 'undefined' || !type) {
				return;
			}

			if (reactFlowInstance === null) {
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
		[reactFlowInstance, setNodes]
	);
	return (
		<div className='flex flex-row flex-grow h-full gap-2 p-2 bg-slate-300'>
			{/* Sidebar */}
			<Sidebar
				reactFlowInstance={reactFlowInstance}
				setNodes={setNodes}
				setEdges={setEdges}
			/>
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
