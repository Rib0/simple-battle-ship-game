type Keys = 'player_id_battle_ship_game' | 'room_id_battle_ship_game';

export class LocaleStorage {
	static get<T = string>(key: Keys) {
		const value = localStorage.getItem(key);

		try {
			return value ? (JSON.parse(value) as T) : null;
		} catch (e) {
			return value as T;
		}
	}

	static set(key: Keys, value: string | number | boolean | object) {
		const item = value instanceof Object ? JSON.stringify(value) : String(value);

		localStorage.setItem(key, item);
	}

	static remove(key: Keys) {
		localStorage.removeItem(key);
	}
}
