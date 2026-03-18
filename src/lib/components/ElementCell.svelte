<script lang="ts">
	import type { Element, Phase } from '../types/element';
	import { getCategoryColor } from '../utils/categories';
	import { phaseBorderStyle } from '../utils/element-helpers';

	interface Props {
		element: Element;
		phase: Phase;
		dimmed: boolean;
		onclick: (element: Element) => void;
		fillLevel?: number | null;
		colorOverride?: string | null;
	}

	let { element, phase, dimmed, onclick, fillLevel, colorOverride }: Props = $props();

	let categoryColor = $derived(colorOverride ?? getCategoryColor(element.category));
	let noData = $derived(fillLevel === null);
	let hasFill = $derived(fillLevel !== undefined && fillLevel !== null);
	let border = $derived(phaseBorderStyle(phase));
	let isLiquid = $derived(phase === 'Liquid');
</script>

<button
	class="element-cell"
	class:dimmed
	class:no-data={noData}
	class:has-fill={hasFill}
	class:liquid={isLiquid}
	style:grid-column={element.xpos}
	style:grid-row={element.ypos}
	style:--category-color={categoryColor}
	style:border={border}
	onclick={() => onclick(element)}
	title="{element.name} ({element.symbol})"
>
	{#if hasFill}
		<div class="fill-bar" style:height="{(fillLevel ?? 0) * 100}%"></div>
	{/if}
	<div class="cell-inner">
		<span class="number">{element.number}</span>
		<span class="symbol">{element.symbol}</span>
		<div class="bottom-info">
			<span class="name">{element.name}</span>
			<span class="mass">{element.atomic_mass.toFixed(element.atomic_mass < 10 ? 3 : 2)}</span>
		</div>
	</div>
</button>

<style>
	.element-cell {
		position: relative;
		padding: 0;
		min-width: 0;
		min-height: 0;
		background: var(--category-color);
		border-radius: 0;
		cursor: pointer;
		transition:
			opacity 0.2s,
			transform 0.15s,
			background 0.2s;
		font-family: inherit;
		color: var(--text-primary);
		aspect-ratio: 1;
		overflow: hidden;
		text-align: left;
	}

	.has-fill {
		background: var(--bg-cell, #1a1a2e);
	}

	.fill-bar {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--category-color);
		transition: height 0.3s ease-out;
		pointer-events: none;
	}

	.cell-inner {
		position: absolute;
		inset: 2px;
		container-type: inline-size;
	}

	.element-cell:hover {
		background: var(--category-color);
		filter: brightness(1.2);
		transform: scale(1.15);
		z-index: 10;
	}

	.element-cell:focus-visible {
		outline: 1px solid var(--category-color);
		outline-offset: 1px;
	}

	.dimmed {
		opacity: 0.15;
	}

	.no-data {
		opacity: 0.25;
		filter: grayscale(1);
	}

	.liquid::after {
		content: '';
		position: absolute;
		bottom: 0;
		right: 0;
		width: 15%;
		height: 15%;
		background: rgba(255, 255, 255, 0.8);
		clip-path: polygon(100% 0, 100% 100%, 0 100%);
		z-index: 2;
		pointer-events: none;
	}

	.number {
		font-size: 20cqi;
		opacity: 0.7;
		line-height: 1;
		position: absolute;
		top: 0;
		right: 0;
	}

	.symbol {
		font-size: 52cqi;
		font-weight: 700;
		line-height: 1.1;
		position: absolute;
		left: 0;
		top: calc(50% - 4px);
		transform: translateY(-50%);
	}

	.bottom-info {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
	}

	.name {
		font-size: 16cqi;
		opacity: 0.8;
		line-height: 1.1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mass {
		font-size: 16cqi;
		opacity: 0.6;
		line-height: 1.1;
	}

</style>
