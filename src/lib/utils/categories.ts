import type { ElementCategory } from '../types/element';

export const categoryColors: Record<ElementCategory, string> = {
	'alkali-metal': '#c9423a',
	'alkaline-earth-metal': '#2e9e5a',
	'transition-metal': '#4a80cc',
	'post-transition-metal': '#8B4513',
	'metalloid': '#224f88',
	'nonmetal': '#9060cc',
	'halogen': '#c49a1a',
	'noble-gas': '#c45a8a',
	'lanthanide': '#148099',
	'actinide': '#c46a3a',
	unknown: '#6b7280'
};

export const categoryLabels: Record<ElementCategory, string> = {
	'alkali-metal': 'Alkali Metal',
	'alkaline-earth-metal': 'Alkaline Earth Metal',
	'transition-metal': 'Transition Metal',
	'post-transition-metal': 'Post-Transition Metal',
	'metalloid': 'Metalloid',
	'nonmetal': 'Nonmetal',
	'halogen': 'Halogen',
	'noble-gas': 'Noble Gas',
	'lanthanide': 'Lanthanide',
	'actinide': 'Actinide',
	unknown: 'Unknown'
};

export function getCategoryColor(category: ElementCategory): string {
	return categoryColors[category] ?? categoryColors.unknown;
}
