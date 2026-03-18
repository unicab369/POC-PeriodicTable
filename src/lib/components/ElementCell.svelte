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
	}

	let { element, phase, dimmed, onclick, fillLevel }: Props = $props();

	let categoryColor = $derived(getCategoryColor(element.category));
	let noData = $derived(fillLevel === null);
	let hasFill = $derived(fillLevel !== undefined && fillLevel !== null);
	let border = $derived(phaseBorderStyle(phase));
</script>

<button
	class="element-cell"
	class:dimmed
	class:no-data={noData}
	class:has-fill={hasFill}
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
	<span class="number">{element.number}</span>
	<span class="symbol">{element.symbol}</span>
	<span class="name">{element.name}</span>
	<span class="mass">{element.atomic_mass.toFixed(element.atomic_mass < 10 ? 3 : 2)}</span>
</button>

<style>
	.element-cell {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 2px;
		min-width: 0;
		min-height: 0;
		background: var(--category-color);
		border-radius: 2px;
		cursor: pointer;
		transition:
			opacity 0.2s,
			transform 0.15s,
			background 0.2s;
		font-family: inherit;
		color: var(--text-primary);
		gap: 0px;
		aspect-ratio: 1;
		overflow: hidden;
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

	.number {
		font-size: 0.55em;
		opacity: 0.7;
		line-height: 1;
		align-self: flex-end;
		position: relative;
		z-index: 1;
	}

	.symbol {
		font-size: 1.1em;
		font-weight: 700;
		line-height: 1.1;
		position: relative;
		z-index: 1;
	}

	.name {
		font-size: 0.45em;
		opacity: 0.8;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 100%;
		position: relative;
		z-index: 1;
	}

	.mass {
		font-size: 0.45em;
		opacity: 0.6;
		line-height: 1;
		position: relative;
		z-index: 1;
	}

</style>
