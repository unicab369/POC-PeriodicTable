import type { Element, Phase } from '../types/element';

export function getPhaseAtTemperature(element: Element, temperatureK: number): Phase {
	const { melt, boil } = element;

	if (melt === null && boil === null) return 'Unknown';

	if (melt !== null && temperatureK < melt) return 'Solid';
	if (boil !== null && temperatureK >= boil) return 'Gas';
	if (melt !== null && boil !== null && temperatureK >= melt && temperatureK < boil) return 'Liquid';

	// Edge cases: only one boundary known
	if (melt !== null && boil === null && temperatureK >= melt) return 'Liquid';
	if (melt === null && boil !== null && temperatureK < boil) return 'Liquid';

	return 'Unknown';
}

export function kelvinToCelsius(k: number): number {
	return Math.round(k - 273.15);
}

export function phaseBorderStyle(phase: Phase): string {
	switch (phase) {
		case 'Solid':
			return '1px solid';
		case 'Liquid':
			return '1px double';
		case 'Gas':
			return '1px dashed';
		default:
			return '1px dotted';
	}
}
