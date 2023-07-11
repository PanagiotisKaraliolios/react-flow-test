'use client';
import Flow from '@/components/Flow';
import { ReactFlowProvider } from 'reactflow';

const Home = () => {
	return (
		<main className='h-screen'>
			<ReactFlowProvider>
				<Flow />
			</ReactFlowProvider>
		</main>
	);
};

export default Home;
