type VarKeys = 'table-border-width' | 'table-cell-size' | 'ship-cell-size';

export const getRootCssVariable = (varKey: VarKeys) =>
	getComputedStyle(document.documentElement).getPropertyValue(`--${varKey}`).replace('px', '');
