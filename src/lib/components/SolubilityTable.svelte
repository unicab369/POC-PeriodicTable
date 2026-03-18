<script lang="ts">
	import {
		ANIONS,
		CATIONS,
		SOLUBILITY_MATRIX,
		compoundSolubilityColors,
		compoundSolubilityLabels,
		type CompoundSolubility
	} from '../data/compound-solubility';

	interface Props {
		onclose: () => void;
	}

	let { onclose }: Props = $props();
</script>

<div class="sol-overlay">
	<div class="sol-header">
		<button class="sol-close" onclick={onclose}>
			<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>
		<h2>Compound Solubility Table</h2>
		<span class="sol-header-spacer"></span>
	</div>

	<div class="sol-legend">
		{#each Object.entries(compoundSolubilityLabels) as [key, label]}
			{#if key !== '-'}
				<div class="sol-legend-item">
					<span class="sol-legend-swatch" style:background={compoundSolubilityColors[key as CompoundSolubility]}></span>
					<span class="sol-legend-label">{key} = {label}</span>
				</div>
			{/if}
		{/each}
	</div>

	<div class="sol-scroll">
		<table class="sol-table">
			<thead>
				<tr>
					<th class="sol-corner"></th>
					{#each ANIONS as anion}
						<th class="sol-anion">{anion}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each CATIONS as cation, i}
					<tr>
						<th class="sol-cation">{cation}</th>
						{#each SOLUBILITY_MATRIX[i] as val}
							<td
								class="sol-cell"
								style:background={compoundSolubilityColors[val]}
								style:color={val === 'I' || val === '-' ? 'var(--text-secondary)' : '#fff'}
							>{val}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="sol-close-bar portrait-only">
		<button class="sol-close-btn" onclick={onclose}>Close</button>
	</div>
</div>

<style>
	.sol-overlay {
		position: fixed;
		inset: 0;
		z-index: 80;
		background: var(--bg-surface);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.sol-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.35rem 0.75rem;
		border-bottom: 1px solid var(--border-color);
		flex-shrink: 0;
	}

	.sol-header h2 {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.sol-header-spacer {
		width: 18px;
	}

	.sol-close {
		background: none;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
	}

	.sol-close:hover {
		color: var(--text-primary);
		background: var(--bg-cell);
	}

	.sol-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		padding: 0.6rem 1.25rem;
		border-bottom: 1px solid var(--border-color);
		flex-shrink: 0;
	}

	.sol-legend-item {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.sol-legend-swatch {
		width: 14px;
		height: 14px;
		border-radius: 3px;
		flex-shrink: 0;
	}

	.sol-legend-label {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.sol-scroll {
		flex: 1;
		overflow: auto;
		padding: 1rem 1.25rem 2rem;
	}

	.sol-table {
		border-collapse: collapse;
		width: auto;
		min-width: 100%;
	}

	.sol-corner {
		position: sticky;
		top: 0;
		left: 0;
		z-index: 3;
		background: var(--bg-surface);
	}

	.sol-anion {
		position: sticky;
		top: 0;
		z-index: 2;
		background: var(--bg-surface);
		padding: 0.5rem 0.4rem;
		font-size: 0.8rem;
		font-weight: 600;
		color: #4dabf7;
		text-align: center;
		white-space: nowrap;
		border-bottom: 2px solid var(--border-color);
	}

	.sol-cation {
		position: sticky;
		left: 0;
		z-index: 1;
		background: var(--bg-surface);
		padding: 0.45rem 0.6rem;
		font-size: 0.8rem;
		font-weight: 600;
		color: #ff8a65;
		text-align: right;
		white-space: nowrap;
		border-right: 2px solid var(--border-color);
	}

	.sol-cell {
		text-align: center;
		padding: 0.4rem 0.5rem;
		font-size: 0.8rem;
		font-weight: 700;
		border: 1px solid rgba(255, 255, 255, 0.06);
		min-width: 2.5rem;
		transition: outline 0.1s;
	}

	.sol-cell:hover {
		outline: 2px solid var(--text-primary);
		outline-offset: -2px;
		z-index: 1;
		position: relative;
	}

	.sol-close-bar {
		flex-shrink: 0;
		padding: 0.75rem;
		border-top: 1px solid var(--border-color);
		background: var(--bg-surface);
	}

	.sol-close-btn {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		background: var(--bg-cell);
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 1.1rem;
		font-family: inherit;
		transition: background 0.15s, color 0.15s;
	}

	.sol-close-btn:hover {
		background: var(--border-color);
		color: var(--text-primary);
	}

	@media (orientation: landscape) {
		.portrait-only {
			display: none !important;
		}
	}

	@media (orientation: portrait) {
		.sol-header h2 {
			font-size: 1.2rem;
		}

		.sol-header .sol-close {
			display: none;
		}

		.sol-header-spacer {
			display: none;
		}

		.sol-header {
			justify-content: center;
		}

		.sol-scroll {
			padding-bottom: 4.5rem;
		}

		.sol-legend-label {
			font-size: 1rem;
		}

		.sol-legend-swatch {
			width: 18px;
			height: 18px;
		}

		.sol-anion,
		.sol-cation {
			font-size: 1.1rem;
			padding: 0.6rem;
		}

		.sol-cell {
			font-size: 1.1rem;
			padding: 0.55rem 0.6rem;
			min-width: 3.5rem;
		}
	}
</style>
