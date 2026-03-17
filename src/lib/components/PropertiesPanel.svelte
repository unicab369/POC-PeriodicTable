<script lang="ts">
	import type { PropertyDef } from '../utils/heatmap';

	interface Props {
		properties: PropertyDef[];
		selectedKey: string | null;
		onselect: (key: string | null) => void;
		onclose: () => void;
	}

	let { properties, selectedKey, onselect, onclose }: Props = $props();

	function handleClick(key: string) {
		if (key === selectedKey) {
			onselect(null);
		} else {
			onselect(key);
		}
	}
</script>

<div class="properties-panel">
	<div class="panel-header">
		<span class="panel-title">Properties</span>
	</div>
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
	<button class="close-btn" onclick={onclose} aria-label="Close properties panel">
		Close
	</button>
</div>

<style>
	.properties-panel {
		background: var(--bg-surface);
		border: 1px solid var(--border-color);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem;
		overflow: hidden;
		height: 100%;
		box-sizing: border-box;
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.panel-title {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.close-btn {
		background: var(--bg-cell);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		color: var(--text-secondary);
		cursor: pointer;
		padding: 0.5rem;
		flex-shrink: 0;
		font-size: 0.8rem;
		font-family: inherit;
		margin-top: 0.25rem;
		transition: background 0.15s, color 0.15s;
	}

	.close-btn:hover {
		color: var(--text-primary);
		background: var(--border-color);
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
