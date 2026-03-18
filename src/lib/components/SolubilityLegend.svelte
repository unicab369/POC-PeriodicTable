<script lang="ts">
	import { solubilityColors, solubilityLabels, type SolubilityCategory } from '../utils/solubility';

	const categories: SolubilityCategory[] = [
		'soluble',
		'reacts',
		'insoluble',
		'slightly-soluble',
		'decomposes',
		'unreactive',
		'unknown'
	];
</script>

<div class="solubility-legend">
	<h3>Water Solubility</h3>
	<div class="legend-grid">
		{#each categories as cat}
			<div class="legend-item">
				<span class="swatch" style:background={solubilityColors[cat]}></span>
				<span class="legend-label">{solubilityLabels[cat]}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.solubility-legend {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
	}

	h3 {
		margin: 0;
		font-size: 0.85em;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.legend-grid {
		display: grid;
		grid-template-columns: repeat(3, auto);
		gap: 0.25rem 1.25rem;
		justify-content: center;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.swatch {
		display: inline-block;
		width: 12px;
		height: 12px;
		border-radius: 2px;
		flex-shrink: 0;
	}

	.legend-label {
		font-size: 0.85em;
		color: var(--text-secondary);
		white-space: nowrap;
	}
</style>
