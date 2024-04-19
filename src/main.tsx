import { render } from 'preact';

import { App } from '@/app';

/* TODO: 
	1. Поменять курсор для каждого действия выбирать новый курсор
	2. Добавить разные звуки для действий
*/

render(<App />, document.getElementById('app')!);
