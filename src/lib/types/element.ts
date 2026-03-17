export type ElementCategory =
	| 'alkali-metal'
	| 'alkaline-earth-metal'
	| 'transition-metal'
	| 'post-transition-metal'
	| 'metalloid'
	| 'nonmetal'
	| 'halogen'
	| 'noble-gas'
	| 'lanthanide'
	| 'actinide'
	| 'unknown';

export type Phase = 'Solid' | 'Liquid' | 'Gas' | 'Unknown';

export interface Element {
	number: number;
	symbol: string;
	name: string;
	atomic_mass: number;
	category: ElementCategory;
	xpos: number;
	ypos: number;
	phase: Phase;
	boil: number | null;
	melt: number | null;
	density: number | null;
	electron_configuration: string;
	electron_configuration_semantic: string;
	discovered_by: string | null;
	named_by: string | null;
	year_discovered: number | string | null;
	summary: string;
	appearance: string | null;
	block: string;
	shells: number[];
	electronegativity_pauling: number | null;
	electron_affinity: number | null;
	ionization_energies: number[] | null;
	molar_heat: number | null;
	radius_van_der_waals: number | null;
	radius_covalent: number | null;
	spectral_lines: number[] | null;
}
