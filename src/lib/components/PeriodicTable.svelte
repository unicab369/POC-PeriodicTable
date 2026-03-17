<script lang="ts">
	import type { Element, Phase } from '../types/element';
	import type { ElementCategory } from '../types/element';
	import { categoryColors, categoryLabels } from '../utils/categories';
	import ElementCell from './ElementCell.svelte';
	import HeatmapLegend from './HeatmapLegend.svelte';

	interface Props {
		elements: Element[];
		phases: Map<number, Phase>;
		dimmedSet: Set<number>;
		onselect: (element: Element) => void;
		heatmapFills: Map<number, number | null> | null;
		heatmapMeta: { label: string; unit: string; min: number; max: number } | null;
	}

	let { elements, phases, dimmedSet, onselect, heatmapFills, heatmapMeta }: Props = $props();

	const categories: ElementCategory[] = [
		// Col 1: Metals       Col 2:                Col 3:
		'alkali-metal',        'metalloid',          'halogen',
		'alkaline-earth-metal','nonmetal',           'noble-gas',
		'transition-metal',    'lanthanide',         'unknown',
		'post-transition-metal','actinide',
	];
</script>

<div class="table-wrapper">
	<div class="periodic-table">
		{#each elements as element (element.number)}
			<ElementCell
				{element}
				phase={phases.get(element.number) ?? 'Unknown'}
				dimmed={dimmedSet.size > 0 && dimmedSet.has(element.number)}
				onclick={onselect}
				fillLevel={heatmapFills?.get(element.number)}
			/>
		{/each}

		<!-- Legend in the hollow area (cols 3-12, rows 1-3) -->
		<div class="legend-inset">
			{#if heatmapMeta}
				<HeatmapLegend
					label={heatmapMeta.label}
					unit={heatmapMeta.unit}
					minValue={heatmapMeta.min}
					maxValue={heatmapMeta.max}
				/>
			{:else}
				<div class="legend-categories">
					{#each categories as cat}
						<div class="legend-item">
							<span class="swatch" style:background={categoryColors[cat]}></span>
							<span class="legend-label">{categoryLabels[cat]}</span>
						</div>
					{/each}
				</div>
				<div class="phase-legend">
					<span class="phase-item"><span class="phase-sample solid"></span> Solid</span>
					<span class="phase-item"><span class="phase-sample liquid"></span> Liquid</span>
					<span class="phase-item"><span class="phase-sample gas"></span> Gas</span>
					<span class="phase-item"><span class="phase-sample unknown"></span> Unknown</span>
				</div>
			{/if}
		</div>

		<!-- Lanthanide/Actinide labels -->
		<div class="series-label" style:grid-column="1 / 3" style:grid-row="9">
			Lanthanides
		</div>
		<div class="series-label" style:grid-column="1 / 3" style:grid-row="10">
			Actinides
		</div>

		<!-- Gap indicator in main table -->
		<div class="series-indicator" style:grid-column="3" style:grid-row="6">
			*
		</div>
		<div class="series-indicator" style:grid-column="3" style:grid-row="7">
			**
		</div>
	</div>
</div>

<style>
	.table-wrapper {
		padding: 0 1rem 1rem;
	}

	.periodic-table {
		display: grid;
		grid-template-columns: repeat(18, minmax(3.2rem, 1fr));
		grid-template-rows: repeat(7, minmax(3.2rem, 1fr)) 1.5rem repeat(2, minmax(3.2rem, 1fr));
		gap: 1px;
		min-width: 700px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.legend-inset {
		grid-column: 3 / 13;
		grid-row: 1 / 4;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.25rem;
	}

	.legend-categories {
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

	.phase-legend {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		margin-top: 0.5rem;
	}

	.phase-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.8em;
		color: var(--text-secondary);
	}

	.phase-sample {
		display: inline-block;
		width: 12px;
		height: 12px;
		border-radius: 2px;
		background: var(--bg-cell);
	}

	.phase-sample.solid {
		border: 1px solid var(--text-secondary);
	}

	.phase-sample.liquid {
		border: 1px double var(--text-secondary);
	}

	.phase-sample.gas {
		border: 1px dashed var(--text-secondary);
	}

	.phase-sample.unknown {
		border: 1px dotted var(--text-secondary);
	}

	.series-label {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-right: 0.5rem;
		font-size: 0.65em;
		opacity: 0.6;
		white-space: nowrap;
	}

	.series-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8em;
		opacity: 0.4;
	}
</style>
