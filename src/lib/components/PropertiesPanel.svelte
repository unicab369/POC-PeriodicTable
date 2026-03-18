<script lang="ts">
	import type { PropertyDef } from '../utils/heatmap';

	interface Props {
		properties: PropertyDef[];
		selectedKey: string | null;
		onselect: (key: string | null) => void;
	}

	let { properties, selectedKey, onselect }: Props = $props();

	function handleClick(key: string) {
		if (key === selectedKey) {
			onselect(null);
		} else {
			onselect(key);
		}
	}
</script>

<div class="properties-panel">
	<div class="property-list">
		{#each properties as prop (prop.key)}
			<button
				class="property-chip"
				class:active={prop.key === selectedKey}
				onclick={() => handleClick(prop.key)}
			>
				{prop.label}
			</button>
		{/each}
	</div>
</div>

<style>
	.properties-panel {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0 0.75rem 0.75rem;
		overflow: hidden;
		flex: 1;
		box-sizing: border-box;
	}

.property-list {
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		flex: 1;
	}

	.property-chip {
		padding: 0.75rem 0.5rem;
		border: none;
		border-bottom: 1px solid var(--border-color);
		border-radius: 0;
		background: none;
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 0.9rem;
		text-align: left;
		white-space: nowrap;
		transition: background 0.15s, color 0.15s;
		font-family: inherit;
		flex-shrink: 0;
	}

	.property-chip:hover {
		background: var(--bg-cell);
		color: var(--text-primary);
	}

	.property-chip.active {
		background: rgba(0, 180, 216, 0.1);
		color: #00b4d8;
	}

	/* Portrait: scrollable column at bottom */
	@media (orientation: portrait) {
		.properties-panel {
			max-height: 100%;
		}

		.property-list {
			overflow-y: auto;
		}
	}
</style>
