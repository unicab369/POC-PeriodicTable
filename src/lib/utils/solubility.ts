export type SolubilityCategory =
	| 'soluble'
	| 'reacts'
	| 'insoluble'
	| 'slightly-soluble'
	| 'decomposes'
	| 'unreactive'
	| 'unknown';

export const solubilityColors: Record<SolubilityCategory, string> = {
	soluble: '#3399ff',
	reacts: '#ff6633',
	insoluble: '#888888',
	'slightly-soluble': '#66bbdd',
	decomposes: '#cc6699',
	unreactive: '#555555',
	unknown: '#3a3a3a'
};

export const solubilityLabels: Record<SolubilityCategory, string> = {
	soluble: 'Soluble',
	reacts: 'Reacts with Water',
	insoluble: 'Insoluble',
	'slightly-soluble': 'Slightly Soluble',
	decomposes: 'Decomposes',
	unreactive: 'Unreactive',
	unknown: 'Unknown'
};

// Map of atomic number → solubility category for all 118 elements
export const SOLUBILITY_DATA: Record<number, SolubilityCategory> = {
	// Period 1
	1: 'slightly-soluble', // H - slightly soluble gas
	2: 'unreactive', // He

	// Period 2
	3: 'reacts', // Li
	4: 'insoluble', // Be - doesn't dissolve, reacts slowly only at high temp
	5: 'insoluble', // B
	6: 'insoluble', // C
	7: 'slightly-soluble', // N - slightly soluble gas
	8: 'slightly-soluble', // O - slightly soluble gas
	9: 'reacts', // F - reacts vigorously
	10: 'unreactive', // Ne

	// Period 3
	11: 'reacts', // Na
	12: 'reacts', // Mg - reacts slowly with water
	13: 'insoluble', // Al - protected by oxide layer
	14: 'insoluble', // Si
	15: 'decomposes', // P - white P reacts/decomposes
	16: 'slightly-soluble', // S
	17: 'soluble', // Cl - dissolves well
	18: 'unreactive', // Ar

	// Period 4
	19: 'reacts', // K
	20: 'reacts', // Ca
	21: 'insoluble', // Sc
	22: 'insoluble', // Ti
	23: 'insoluble', // V
	24: 'insoluble', // Cr
	25: 'insoluble', // Mn
	26: 'insoluble', // Fe
	27: 'insoluble', // Co
	28: 'insoluble', // Ni
	29: 'insoluble', // Cu
	30: 'insoluble', // Zn
	31: 'insoluble', // Ga
	32: 'insoluble', // Ge
	33: 'insoluble', // As
	34: 'slightly-soluble', // Se
	35: 'soluble', // Br
	36: 'unreactive', // Kr

	// Period 5
	37: 'reacts', // Rb
	38: 'reacts', // Sr
	39: 'insoluble', // Y
	40: 'insoluble', // Zr
	41: 'insoluble', // Nb
	42: 'insoluble', // Mo
	43: 'insoluble', // Tc
	44: 'insoluble', // Ru
	45: 'insoluble', // Rh
	46: 'insoluble', // Pd
	47: 'insoluble', // Ag
	48: 'insoluble', // Cd
	49: 'insoluble', // In
	50: 'insoluble', // Sn
	51: 'insoluble', // Sb
	52: 'slightly-soluble', // Te
	53: 'soluble', // I
	54: 'unreactive', // Xe

	// Period 6
	55: 'reacts', // Cs
	56: 'reacts', // Ba
	// Lanthanides 57-71
	57: 'insoluble', // La
	58: 'insoluble', // Ce
	59: 'insoluble', // Pr
	60: 'insoluble', // Nd
	61: 'insoluble', // Pm
	62: 'insoluble', // Sm
	63: 'insoluble', // Eu
	64: 'insoluble', // Gd
	65: 'insoluble', // Tb
	66: 'insoluble', // Dy
	67: 'insoluble', // Ho
	68: 'insoluble', // Er
	69: 'insoluble', // Tm
	70: 'insoluble', // Yb
	71: 'insoluble', // Lu
	72: 'insoluble', // Hf
	73: 'insoluble', // Ta
	74: 'insoluble', // W
	75: 'insoluble', // Re
	76: 'insoluble', // Os
	77: 'insoluble', // Ir
	78: 'insoluble', // Pt
	79: 'insoluble', // Au
	80: 'insoluble', // Hg - liquid metal, insoluble
	81: 'insoluble', // Tl
	82: 'insoluble', // Pb
	83: 'insoluble', // Bi
	84: 'decomposes', // Po
	85: 'unknown', // At - very rare, limited data
	86: 'unreactive', // Rn

	// Period 7
	87: 'reacts', // Fr
	88: 'reacts', // Ra
	// Actinides 89-103
	89: 'insoluble', // Ac
	90: 'insoluble', // Th
	91: 'insoluble', // Pa
	92: 'insoluble', // U
	93: 'insoluble', // Np
	94: 'insoluble', // Pu
	95: 'insoluble', // Am
	96: 'insoluble', // Cm
	97: 'unknown', // Bk
	98: 'unknown', // Cf
	99: 'unknown', // Es
	100: 'unknown', // Fm
	101: 'unknown', // Md
	102: 'unknown', // No
	103: 'unknown', // Lr
	104: 'unknown', // Rf
	105: 'unknown', // Db
	106: 'unknown', // Sg
	107: 'unknown', // Bh
	108: 'unknown', // Hs
	109: 'unknown', // Mt
	110: 'unknown', // Ds
	111: 'unknown', // Rg
	112: 'unknown', // Cn
	113: 'unknown', // Nh
	114: 'unknown', // Fl
	115: 'unknown', // Mc
	116: 'unknown', // Lv
	117: 'unknown', // Ts
	118: 'unknown' // Og
};

export function getSolubilityCategory(atomicNumber: number): SolubilityCategory {
	return SOLUBILITY_DATA[atomicNumber] ?? 'unknown';
}

export function getSolubilityColor(atomicNumber: number): string {
	const cat = getSolubilityCategory(atomicNumber);
	return solubilityColors[cat];
}
