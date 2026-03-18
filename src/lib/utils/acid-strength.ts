export type AcidBaseCategory =
	| 'strong-acid'
	| 'weak-acid'
	| 'amphoteric'
	| 'weak-base'
	| 'strong-base'
	| 'neutral'
	| 'unknown';

export const acidBaseColors: Record<AcidBaseCategory, string> = {
	'strong-acid': '#e63946',
	'weak-acid': '#f4a261',
	amphoteric: '#a78bfa',
	'weak-base': '#2a9d8f',
	'strong-base': '#3399ff',
	neutral: '#6b7280',
	unknown: '#3a3a3a'
};

export const acidBaseLabels: Record<AcidBaseCategory, string> = {
	'strong-acid': 'Strongly Acidic Oxide',
	'weak-acid': 'Weakly Acidic Oxide',
	amphoteric: 'Amphoteric Oxide',
	'weak-base': 'Weakly Basic Oxide',
	'strong-base': 'Strongly Basic Oxide',
	neutral: 'Neutral / No Oxide',
	unknown: 'Unknown'
};

// Map of atomic number → oxide acid/base behavior for all 118 elements
export const ACID_BASE_DATA: Record<number, AcidBaseCategory> = {
	// Period 1
	1: 'neutral',        // H - water is neutral
	2: 'neutral',        // He - noble gas

	// Period 2
	3: 'strong-base',    // Li - Li₂O strongly basic
	4: 'amphoteric',     // Be - BeO amphoteric
	5: 'weak-acid',      // B - B₂O₃ weakly acidic
	6: 'weak-acid',      // C - CO₂ weakly acidic
	7: 'strong-acid',    // N - N₂O₅ strongly acidic
	8: 'neutral',        // O
	9: 'strong-acid',    // F - forms acidic compounds
	10: 'neutral',       // Ne - noble gas

	// Period 3
	11: 'strong-base',   // Na - Na₂O strongly basic
	12: 'strong-base',   // Mg - MgO basic
	13: 'amphoteric',    // Al - Al₂O₃ amphoteric
	14: 'weak-acid',     // Si - SiO₂ weakly acidic
	15: 'strong-acid',   // P - P₂O₅ strongly acidic
	16: 'strong-acid',   // S - SO₃ strongly acidic
	17: 'strong-acid',   // Cl - Cl₂O₇ strongly acidic
	18: 'neutral',       // Ar - noble gas

	// Period 4
	19: 'strong-base',   // K - K₂O strongly basic
	20: 'strong-base',   // Ca - CaO strongly basic
	21: 'weak-base',     // Sc - Sc₂O₃ weakly basic
	22: 'amphoteric',    // Ti - TiO₂ amphoteric
	23: 'amphoteric',    // V - V₂O₅ amphoteric
	24: 'amphoteric',    // Cr - Cr₂O₃ amphoteric / CrO₃ acidic
	25: 'amphoteric',    // Mn - MnO basic, MnO₂ amphoteric
	26: 'amphoteric',    // Fe - Fe₂O₃ weakly amphoteric
	27: 'weak-base',     // Co - CoO weakly basic
	28: 'weak-base',     // Ni - NiO weakly basic
	29: 'weak-base',     // Cu - CuO weakly basic
	30: 'amphoteric',    // Zn - ZnO amphoteric
	31: 'amphoteric',    // Ga - Ga₂O₃ amphoteric
	32: 'amphoteric',    // Ge - GeO₂ amphoteric
	33: 'weak-acid',     // As - As₂O₅ weakly acidic
	34: 'strong-acid',   // Se - SeO₃ strongly acidic
	35: 'strong-acid',   // Br - acidic oxides
	36: 'neutral',       // Kr - noble gas

	// Period 5
	37: 'strong-base',   // Rb - Rb₂O strongly basic
	38: 'strong-base',   // Sr - SrO strongly basic
	39: 'weak-base',     // Y - Y₂O₃ weakly basic
	40: 'amphoteric',    // Zr - ZrO₂ amphoteric
	41: 'weak-acid',     // Nb - Nb₂O₅ weakly acidic
	42: 'weak-acid',     // Mo - MoO₃ weakly acidic
	43: 'weak-acid',     // Tc - Tc₂O₇ acidic
	44: 'weak-acid',     // Ru - RuO₄ acidic
	45: 'amphoteric',    // Rh - amphoteric
	46: 'weak-base',     // Pd - PdO weakly basic
	47: 'weak-base',     // Ag - Ag₂O weakly basic
	48: 'weak-base',     // Cd - CdO weakly basic
	49: 'amphoteric',    // In - In₂O₃ amphoteric
	50: 'amphoteric',    // Sn - SnO₂ amphoteric
	51: 'amphoteric',    // Sb - Sb₂O₃ amphoteric
	52: 'weak-acid',     // Te - TeO₃ weakly acidic
	53: 'strong-acid',   // I - I₂O₅ acidic
	54: 'neutral',       // Xe - noble gas

	// Period 6
	55: 'strong-base',   // Cs - Cs₂O strongly basic
	56: 'strong-base',   // Ba - BaO strongly basic
	// Lanthanides 57-71
	57: 'weak-base',     // La - La₂O₃ basic
	58: 'weak-base',     // Ce - CeO₂ weakly basic
	59: 'weak-base',     // Pr
	60: 'weak-base',     // Nd
	61: 'weak-base',     // Pm
	62: 'weak-base',     // Sm
	63: 'weak-base',     // Eu
	64: 'weak-base',     // Gd
	65: 'weak-base',     // Tb
	66: 'weak-base',     // Dy
	67: 'weak-base',     // Ho
	68: 'weak-base',     // Er
	69: 'weak-base',     // Tm
	70: 'weak-base',     // Yb
	71: 'weak-base',     // Lu
	72: 'amphoteric',    // Hf - HfO₂ amphoteric
	73: 'weak-acid',     // Ta - Ta₂O₅ weakly acidic
	74: 'weak-acid',     // W - WO₃ weakly acidic
	75: 'weak-acid',     // Re - Re₂O₇ acidic
	76: 'weak-acid',     // Os - OsO₄ acidic
	77: 'weak-base',     // Ir - IrO₂ weakly basic
	78: 'weak-base',     // Pt - PtO₂ weakly basic
	79: 'weak-base',     // Au - Au₂O₃ weakly basic
	80: 'weak-base',     // Hg - HgO weakly basic
	81: 'weak-base',     // Tl - Tl₂O weakly basic
	82: 'amphoteric',    // Pb - PbO amphoteric
	83: 'weak-base',     // Bi - Bi₂O₃ weakly basic
	84: 'amphoteric',    // Po - PoO₂ amphoteric
	85: 'unknown',       // At - limited data
	86: 'neutral',       // Rn - noble gas

	// Period 7
	87: 'strong-base',   // Fr - strongly basic
	88: 'strong-base',   // Ra - RaO strongly basic
	// Actinides 89-103
	89: 'weak-base',     // Ac
	90: 'amphoteric',    // Th - ThO₂ amphoteric
	91: 'amphoteric',    // Pa
	92: 'amphoteric',    // U - UO₃ amphoteric
	93: 'amphoteric',    // Np
	94: 'amphoteric',    // Pu
	95: 'weak-base',     // Am
	96: 'weak-base',     // Cm
	97: 'unknown',       // Bk
	98: 'unknown',       // Cf
	99: 'unknown',       // Es
	100: 'unknown',      // Fm
	101: 'unknown',      // Md
	102: 'unknown',      // No
	103: 'unknown',      // Lr
	104: 'unknown',      // Rf
	105: 'unknown',      // Db
	106: 'unknown',      // Sg
	107: 'unknown',      // Bh
	108: 'unknown',      // Hs
	109: 'unknown',      // Mt
	110: 'unknown',      // Ds
	111: 'unknown',      // Rg
	112: 'unknown',      // Cn
	113: 'unknown',      // Nh
	114: 'unknown',      // Fl
	115: 'unknown',      // Mc
	116: 'unknown',      // Lv
	117: 'unknown',      // Ts
	118: 'unknown'       // Og
};

export function getAcidBaseCategory(atomicNumber: number): AcidBaseCategory {
	return ACID_BASE_DATA[atomicNumber] ?? 'unknown';
}

export function getAcidBaseColor(atomicNumber: number): string {
	const cat = getAcidBaseCategory(atomicNumber);
	return acidBaseColors[cat];
}

export interface CommonAcid {
	name: string;
	formula: string;
	pKa: number | string;
	strength: 'Strong' | 'Weak';
}

export const COMMON_ACIDS: CommonAcid[] = [
	{ name: 'Hydroiodic acid', formula: 'HI', pKa: -10, strength: 'Strong' },
	{ name: 'Hydrobromic acid', formula: 'HBr', pKa: -9, strength: 'Strong' },
	{ name: 'Perchloric acid', formula: 'HClO₄', pKa: -8, strength: 'Strong' },
	{ name: 'Hydrochloric acid', formula: 'HCl', pKa: -7, strength: 'Strong' },
	{ name: 'Sulfuric acid', formula: 'H₂SO₄', pKa: -3, strength: 'Strong' },
	{ name: 'Nitric acid', formula: 'HNO₃', pKa: -1.4, strength: 'Strong' },
	{ name: 'Hydronium ion', formula: 'H₃O⁺', pKa: 0, strength: 'Strong' },
	{ name: 'Oxalic acid', formula: 'H₂C₂O₄', pKa: 1.25, strength: 'Weak' },
	{ name: 'Sulfurous acid', formula: 'H₂SO₃', pKa: 1.81, strength: 'Weak' },
	{ name: 'Phosphoric acid', formula: 'H₃PO₄', pKa: 2.15, strength: 'Weak' },
	{ name: 'Hydrofluoric acid', formula: 'HF', pKa: 3.17, strength: 'Weak' },
	{ name: 'Nitrous acid', formula: 'HNO₂', pKa: 3.35, strength: 'Weak' },
	{ name: 'Formic acid', formula: 'HCOOH', pKa: 3.75, strength: 'Weak' },
	{ name: 'Acetic acid', formula: 'CH₃COOH', pKa: 4.76, strength: 'Weak' },
	{ name: 'Carbonic acid', formula: 'H₂CO₃', pKa: 6.35, strength: 'Weak' },
	{ name: 'Hydrogen sulfide', formula: 'H₂S', pKa: 7.0, strength: 'Weak' },
	{ name: 'Hypochlorous acid', formula: 'HClO', pKa: 7.54, strength: 'Weak' },
	{ name: 'Boric acid', formula: 'H₃BO₃', pKa: 9.24, strength: 'Weak' },
];

export interface CommonBase {
	name: string;
	formula: string;
	pKb: number | string;
	strength: 'Strong' | 'Weak';
	conjugateAcid: string;
}

export const COMMON_BASES: CommonBase[] = [
	{ name: 'Sodium hydroxide', formula: 'NaOH', pKb: -0.56, strength: 'Strong', conjugateAcid: 'H₂O' },
	{ name: 'Potassium hydroxide', formula: 'KOH', pKb: -0.7, strength: 'Strong', conjugateAcid: 'H₂O' },
	{ name: 'Lithium hydroxide', formula: 'LiOH', pKb: -0.04, strength: 'Strong', conjugateAcid: 'H₂O' },
	{ name: 'Barium hydroxide', formula: 'Ba(OH)₂', pKb: -0.4, strength: 'Strong', conjugateAcid: 'H₂O' },
	{ name: 'Calcium hydroxide', formula: 'Ca(OH)₂', pKb: 1.37, strength: 'Strong', conjugateAcid: 'H₂O' },
	{ name: 'Strontium hydroxide', formula: 'Sr(OH)₂', pKb: 0.3, strength: 'Strong', conjugateAcid: 'H₂O' },
	{ name: 'Rubidium hydroxide', formula: 'RbOH', pKb: -1.0, strength: 'Strong', conjugateAcid: 'H₂O' },
	{ name: 'Cesium hydroxide', formula: 'CsOH', pKb: -1.2, strength: 'Strong', conjugateAcid: 'H₂O' },
	{ name: 'Methylamine', formula: 'CH₃NH₂', pKb: 3.36, strength: 'Weak', conjugateAcid: 'CH₃NH₃⁺' },
	{ name: 'Ethylamine', formula: 'C₂H₅NH₂', pKb: 3.29, strength: 'Weak', conjugateAcid: 'C₂H₅NH₃⁺' },
	{ name: 'Ammonia', formula: 'NH₃', pKb: 4.74, strength: 'Weak', conjugateAcid: 'NH₄⁺' },
	{ name: 'Hydrazine', formula: 'N₂H₄', pKb: 5.89, strength: 'Weak', conjugateAcid: 'N₂H₅⁺' },
	{ name: 'Pyridine', formula: 'C₅H₅N', pKb: 8.77, strength: 'Weak', conjugateAcid: 'C₅H₅NH⁺' },
	{ name: 'Aniline', formula: 'C₆H₅NH₂', pKb: 9.4, strength: 'Weak', conjugateAcid: 'C₆H₅NH₃⁺' },
	{ name: 'Sodium carbonate', formula: 'Na₂CO₃', pKb: 3.67, strength: 'Weak', conjugateAcid: 'NaHCO₃' },
	{ name: 'Sodium bicarbonate', formula: 'NaHCO₃', pKb: 7.65, strength: 'Weak', conjugateAcid: 'H₂CO₃' },
	{ name: 'Magnesium hydroxide', formula: 'Mg(OH)₂', pKb: 2.58, strength: 'Weak', conjugateAcid: 'H₂O' },
	{ name: 'Aluminum hydroxide', formula: 'Al(OH)₃', pKb: 9.0, strength: 'Weak', conjugateAcid: 'H₂O' },
];
