import { DragEvent, useCallback } from 'react';
import { Panel, useReactFlow } from 'reactflow';
import { Button } from './ui/button';

const flowKey = 'example-flow';

interface SidebarProps {
	reactFlowInstance: any;
	setNodes: any;
	setEdges: any;
}

const Sidebar = ({ reactFlowInstance, setNodes, setEdges }: SidebarProps) => {
	const { setViewport } = useReactFlow();

	const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
		event.dataTransfer.setData('application/reactflow', nodeType);
		event.dataTransfer.effectAllowed = 'move';
	};

	const onSave = useCallback(() => {
		console.log('====================================');
		console.log('onSave');
		console.log('====================================');
		if (reactFlowInstance) {
			console.log('🚀 --------------------------------------------------------------------------🚀');
			console.log('🚀 ~ file: Sidebar.tsx:21 ~ onSave ~ reactFlowInstance:', reactFlowInstance);
			console.log('🚀 --------------------------------------------------------------------------🚀');

			const flow = reactFlowInstance.toObject();
			localStorage.setItem(flowKey, JSON.stringify(flow));
		}
	}, [reactFlowInstance]);

	const onRestore = useCallback(() => {
		const restoreFlow = async () => {
			const flow = JSON.parse(localStorage.getItem(flowKey) || 'null');

			if (flow && flow !== 'null') {
				const { x = 0, y = 0, zoom = 1 } = flow.viewport;
				console.log('flow:', flow);
				setNodes(flow.nodes || []);
				setEdges(flow.edges || []);
				setViewport({ x, y, zoom });
			}
		};

		restoreFlow();
	}, [setEdges, setNodes, setViewport]);

	return (
		<aside className='w-1/4 h-full space-y-5'>
			<div className=''>You can drag these nodes to the pane on the right.</div>
			<div
				className='text-center border rounded-md border-slate-900'
				onDragStart={(event) => onDragStart(event, 'input')}
				draggable>
				Input Node
			</div>
			<div
				className='text-center border rounded-md border-slate-900'
				onDragStart={(event) => onDragStart(event, 'default')}
				draggable>
				Default Node
			</div>
			<div
				className='text-center border rounded-md border-slate-900'
				onDragStart={(event) => onDragStart(event, 'output')}
				draggable>
				Output Node
			</div>
			<Panel
				position='bottom-left'
				className='flex gap-2 pb-2'>
				<Button onClick={onSave}>save</Button>
				<Button
					variant='secondary'
					onClick={onRestore}>
					restore
				</Button>
			</Panel>
		</aside>
	);
};

export default Sidebar;
