// Compound solubility table: cation × anion → solubility
// S = Soluble, I = Insoluble, sS = Slightly Soluble, D = Decomposes, R = Reacts

export type CompoundSolubility = 'S' | 'I' | 'sS' | 'D' | 'R' | '-';

export const compoundSolubilityColors: Record<CompoundSolubility, string> = {
	S: '#3399ff',
	I: '#888888',
	sS: '#66bbdd',
	D: '#cc6699',
	R: '#ff6633',
	'-': '#3a3a3a'
};

export const compoundSolubilityLabels: Record<CompoundSolubility, string> = {
	S: 'Soluble',
	I: 'Insoluble',
	sS: 'Slightly Soluble',
	D: 'Decomposes',
	R: 'Reacts',
	'-': 'N/A'
};

export const ANIONS = [
	'OH⁻',
	'F⁻',
	'Cl⁻',
	'Br⁻',
	'I⁻',
	'S²⁻',
	'SO₄²⁻',
	'CO₃²⁻',
	'PO₄³⁻',
	'NO₃⁻',
	'CH₃COO⁻',
	'CrO₄²⁻'
] as const;

export const CATIONS = [
	'Li⁺',
	'Na⁺',
	'K⁺',
	'NH₄⁺',
	'Mg²⁺',
	'Ca²⁺',
	'Sr²⁺',
	'Ba²⁺',
	'Fe²⁺',
	'Fe³⁺',
	'Cu²⁺',
	'Zn²⁺',
	'Ag⁺',
	'Pb²⁺',
	'Al³⁺',
	'Hg₂²⁺'
] as const;

// Row = cation index, Col = anion index
// Anion order: OH⁻  F⁻  Cl⁻  Br⁻  I⁻  S²⁻  SO₄²⁻  CO₃²⁻  PO₄³⁻  NO₃⁻  CH₃COO⁻  CrO₄²⁻
export const SOLUBILITY_MATRIX: CompoundSolubility[][] = [
	// Li⁺
	['S', 'sS', 'S', 'S', 'S', 'S', 'S', 'S', 'sS', 'S', 'S', 'S'],
	// Na⁺
	['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
	// K⁺
	['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
	// NH₄⁺
	['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
	// Mg²⁺
	['I', 'sS', 'S', 'S', 'S', 'D', 'S', 'I', 'I', 'S', 'S', 'S'],
	// Ca²⁺
	['sS', 'I', 'S', 'S', 'S', 'D', 'sS', 'I', 'I', 'S', 'S', 'S'],
	// Sr²⁺
	['sS', 'sS', 'S', 'S', 'S', 'S', 'I', 'I', 'I', 'S', 'S', 'sS'],
	// Ba²⁺
	['S', 'sS', 'S', 'S', 'S', 'D', 'I', 'I', 'I', 'S', 'S', 'I'],
	// Fe²⁺
	['I', 'sS', 'S', 'S', 'S', 'I', 'S', 'I', 'I', 'S', 'S', 'I'],
	// Fe³⁺
	['I', 'sS', 'S', 'S', 'S', 'D', 'S', '-', 'I', 'S', 'S', 'I'],
	// Cu²⁺
	['I', 'sS', 'S', 'S', '-', 'I', 'S', 'I', 'I', 'S', 'S', 'I'],
	// Zn²⁺
	['I', 'sS', 'S', 'S', 'S', 'I', 'S', 'I', 'I', 'S', 'S', 'I'],
	// Ag⁺
	['D', 'S', 'I', 'I', 'I', 'I', 'sS', 'I', 'I', 'S', 'S', 'I'],
	// Pb²⁺
	['sS', 'I', 'sS', 'sS', 'I', 'I', 'I', 'I', 'I', 'S', 'S', 'I'],
	// Al³⁺
	['I', 'sS', 'S', 'S', 'S', 'D', 'S', '-', 'I', 'S', 'S', '-'],
	// Hg₂²⁺
	['D', 'sS', 'I', 'I', 'I', 'I', 'sS', 'I', 'I', 'S', 'sS', 'I'],
];
