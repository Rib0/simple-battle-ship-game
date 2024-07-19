import { render } from 'preact';

import { Root } from '@/root';

const container = document.getElementById('app');

if (container) {
	render(<Root />, container);
}
