import type { Element } from '../types/element';

export const TRAIT_LABELS: Record<string, string> = {
	metal: 'Metals',
	'light-metal': 'Light Metals',
	'heavy-metal': 'Heavy Metals',
	'noble-metal': 'Noble Metals',
	natural: 'Natural',
	gaseous: 'Gaseous',
	liquid: 'Liquid',
	solid: 'Solid',
	anisotropic: 'Anisotropic',
	isotopic: 'Isotopic',
	radioactive: 'Radioactive',
	artificial: 'Artificial',
};

export const ALL_TRAITS = Object.keys(TRAIT_LABELS);

// Metal categories
const METAL_CATEGORIES = new Set([
	'alkali-metal', 'alkaline-earth-metal', 'transition-metal',
	'post-transition-metal', 'lanthanide', 'actinide'
]);

// Light metals: density < 5 g/cm³
const LIGHT_METAL_NUMBERS = new Set([
	3, 4, 11, 12, 13, 19, 20, 21, 22, 37, 38, 39, 55, 56, 87, 88
]);

// Heavy metals: density ≥ 5 g/cm³, typically atomic number > 20
const HEAVY_METAL_NUMBERS = new Set([
	23, 24, 25, 26, 27, 28, 29, 30, 31, 40, 41, 42, 43, 44, 45, 46, 47, 48,
	49, 50, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
	72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84,
	89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103
]);

// Noble metals: resistant to corrosion/oxidation
const NOBLE_METAL_NUMBERS = new Set([44, 45, 46, 47, 76, 77, 78, 79]);

// Radioactive elements (no stable isotopes)
const RADIOACTIVE_NUMBERS = new Set([
	43, 61, 84, 85, 86, 87, 88,
	89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103,
	104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118
]);

// Artificial / synthetic elements
const ARTIFICIAL_NUMBERS = new Set([
	43, 61, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103,
	104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118
]);

// Anisotropic elements (crystal structure dependent on direction)
const ANISOTROPIC_NUMBERS = new Set([
	5, 6, 14, 15, 16, 33, 34, 51, 52, // metalloids/nonmetals with directional bonding
	22, 27, 30, 40, 44, 48, 58, 64, 65, 67, 68, 72, 75, 76 // hcp/other anisotropic metals
]);

// Isotopic: elements with only one stable naturally occurring isotope
const MONOISOTOPIC_NUMBERS = new Set([
	4, 9, 11, 13, 15, 21, 23, 25, 27, 31, 33, 39, 41, 45, 53, 55, 59, 65, 67, 69, 79, 83
]);

// Liquid at STP
const LIQUID_NUMBERS = new Set([35, 80]); // Br, Hg

// Gas at STP
const GAS_NUMBERS = new Set([1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86]);

export function getElementTraits(el: Element): Set<string> {
	const traits = new Set<string>();
	const n = el.number;

	if (METAL_CATEGORIES.has(el.category)) traits.add('metal');
	if (LIGHT_METAL_NUMBERS.has(n)) traits.add('light-metal');
	if (HEAVY_METAL_NUMBERS.has(n)) traits.add('heavy-metal');
	if (NOBLE_METAL_NUMBERS.has(n)) traits.add('noble-metal');
	if (!ARTIFICIAL_NUMBERS.has(n)) traits.add('natural');
	if (GAS_NUMBERS.has(n)) traits.add('gaseous');
	if (LIQUID_NUMBERS.has(n)) traits.add('liquid');
	if (!GAS_NUMBERS.has(n) && !LIQUID_NUMBERS.has(n)) traits.add('solid');
	if (ANISOTROPIC_NUMBERS.has(n)) traits.add('anisotropic');
	if (MONOISOTOPIC_NUMBERS.has(n)) traits.add('isotopic');
	if (RADIOACTIVE_NUMBERS.has(n)) traits.add('radioactive');
	if (ARTIFICIAL_NUMBERS.has(n)) traits.add('artificial');

	return traits;
}
