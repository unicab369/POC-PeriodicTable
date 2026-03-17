import type { Element } from '../types/element';

export interface PropertyDef {
	key: string;
	label: string;
	unit: string;
	accessor: (el: Element) => number | null;
}

export const PROPERTIES: PropertyDef[] = [
	{
		key: 'atomic_radius',
		label: 'Atomic Radius',
		unit: 'pm',
		accessor: (el) => el.radius_covalent
	},
	{ key: 'atomic_mass', label: 'Atomic Weight', unit: 'u', accessor: (el) => el.atomic_mass },
	{
		key: 'covalent_radius',
		label: 'Covalent Radius',
		unit: 'pm',
		accessor: (el) => el.radius_covalent
	},
	{ key: 'density', label: 'Density', unit: 'g/cm³', accessor: (el) => el.density },
	{ key: 'electrons', label: 'Electrons', unit: '', accessor: (el) => el.number },
	{
		key: 'electronegativity',
		label: 'Electronegativity',
		unit: '',
		accessor: (el) => el.electronegativity_pauling
	},
	{
		key: 'molar_volume',
		label: 'Molar Volume',
		unit: 'cm³/mol',
		accessor: (el) => el.molar_volume
	},
	{
		key: 'neutrons',
		label: 'Neutrons',
		unit: '',
		accessor: (el) => Math.round(el.atomic_mass) - el.number
	},
	{ key: 'protons', label: 'Protons', unit: '', accessor: (el) => el.number },
	{
		key: 'thermal_conductivity',
		label: 'Thermal Conductivity',
		unit: 'W/(m·K)',
		accessor: (el) => el.thermal_conductivity
	},
	{
		key: 'vdw_radius',
		label: 'Van der Waals Radius',
		unit: 'pm',
		accessor: (el) => el.radius_van_der_waals
	}
];

export function computeHeatmapRange(
	elements: Element[],
	property: PropertyDef
): { min: number; max: number } {
	let min = Infinity;
	let max = -Infinity;

	for (const el of elements) {
		const val = property.accessor(el);
		if (val !== null && val !== undefined) {
			if (val < min) min = val;
			if (val > max) max = val;
		}
	}

	return { min, max };
}

export function computeHeatmapFills(
	elements: Element[],
	property: PropertyDef
): Map<number, number | null> {
	const { min, max } = computeHeatmapRange(elements, property);
	const range = max - min;
	const fills = new Map<number, number | null>();

	for (const el of elements) {
		const val = property.accessor(el);
		if (val === null || val === undefined) {
			fills.set(el.number, null);
		} else {
			fills.set(el.number, range === 0 ? 0.5 : (val - min) / range);
		}
	}

	return fills;
}
