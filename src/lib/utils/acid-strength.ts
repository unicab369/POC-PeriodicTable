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
