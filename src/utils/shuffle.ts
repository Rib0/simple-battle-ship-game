export const shuffle = <T = string>(array: Array<T>) => {
	const resultArray = [...array];
	let currentIndex = array.length;

	while (currentIndex !== 0) {
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		[resultArray[currentIndex], resultArray[randomIndex]] = [
			resultArray[randomIndex],
			resultArray[currentIndex],
		];
	}

	return resultArray;
};
