import { useEdgesState, useNodesState } from 'reactflow';
import { create } from 'zustand';

const useStore = create((set) => ({
	nodes: useNodesState([]),
	edges: useEdgesState([]),
	setNodes: (nodes) => set({ nodes }),
	setEdges: (edges) => set({ edges })
}));
