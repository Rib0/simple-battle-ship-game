import { render } from 'preact';

import { App } from '@/app';

/* TODO: 
	1. Поменять курсор для каждого действия выбирать новый курсор
	2. Добавить разные звуки для действий
	3. добавить красивый шрифт
	4. Сделать анимацию летящей ракеты, с рандомно разной траекторией
*/

render(<App />, document.getElementById('app')!);
