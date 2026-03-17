<script lang="ts">
	import { categoryColors, categoryLabels } from '../utils/categories';
	import type { ElementCategory } from '../types/element';

	const categories = Object.keys(categoryColors) as ElementCategory[];
</script>

<div class="legend">
	{#each categories as cat}
		<div class="legend-item">
			<span class="swatch" style:--cat-color={categoryColors[cat]}></span>
			<span class="label">{categoryLabels[cat]}</span>
		</div>
	{/each}
	<div class="phase-legend">
		<span class="phase-item"><span class="phase-sample solid"></span> Solid</span>
		<span class="phase-item"><span class="phase-sample liquid"></span> Liquid</span>
		<span class="phase-item"><span class="phase-sample gas"></span> Gas</span>
		<span class="phase-item"><span class="phase-sample unknown"></span> Unknown</span>
	</div>
</div>

<style>
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		padding: 0.5rem 1rem;
		align-items: center;
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
		background: var(--cat-color);
	}

	.label {
		font-size: 0.7rem;
		color: var(--text-secondary);
		white-space: nowrap;
	}

	.phase-legend {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		margin-left: 0.5rem;
		padding-left: 0.75rem;
		border-left: 1px solid var(--border-color);
	}

	.phase-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.7rem;
		color: var(--text-secondary);
	}

	.phase-sample {
		display: inline-block;
		width: 14px;
		height: 14px;
		border-radius: 2px;
		background: var(--bg-cell);
	}

	.phase-sample.solid {
		border: 2px solid var(--text-secondary);
	}

	.phase-sample.liquid {
		border: 2px double var(--text-secondary);
	}

	.phase-sample.gas {
		border: 2px dashed var(--text-secondary);
	}

	.phase-sample.unknown {
		border: 2px dotted var(--text-secondary);
	}
</style>
