import { render } from 'preact';
import { App } from '@/app';

/* TODO: 
	1. Установить в true свойство computedRequiresReaction в mobx config;
	2. Поменять курсор для каждого действия выбирать новый курсор
	3. Добавить разные звуки для действий
	5. Выровнять ui для игры
*/

// НУЖНО ЛИ ОБОРАЧИВАТЬ В OBSERVER КОМПОНЕНТЫ В КОТОРЫЕ ПЕРЕДАЕШЬ ПРОПСЫ из стора

render(<App />, document.getElementById('app')!);
