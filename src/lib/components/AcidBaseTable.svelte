<script lang="ts">
	import { COMMON_ACIDS, COMMON_BASES, type CommonAcid, type CommonBase } from '../utils/acid-strength';

	interface Props {
		onclose: () => void;
	}

	let { onclose }: Props = $props();

	type AcidSort = 'pKa-asc' | 'pKa-desc' | 'name' | 'strength';
	type BaseSort = 'pKb-asc' | 'pKb-desc' | 'name' | 'strength';

	let acidSort: AcidSort = $state('pKa-asc');
	let baseSort: BaseSort = $state('pKb-asc');

	let sortedAcids = $derived.by(() => {
		const arr = [...COMMON_ACIDS];
		if (acidSort === 'pKa-asc') arr.sort((a, b) => Number(a.pKa) - Number(b.pKa));
		else if (acidSort === 'pKa-desc') arr.sort((a, b) => Number(b.pKa) - Number(a.pKa));
		else if (acidSort === 'name') arr.sort((a, b) => a.name.localeCompare(b.name));
		else if (acidSort === 'strength') arr.sort((a, b) => (a.strength === 'Strong' ? -1 : 1) - (b.strength === 'Strong' ? -1 : 1));
		return arr;
	});

	let sortedBases = $derived.by(() => {
		const arr = [...COMMON_BASES];
		if (baseSort === 'pKb-asc') arr.sort((a, b) => Number(a.pKb) - Number(b.pKb));
		else if (baseSort === 'pKb-desc') arr.sort((a, b) => Number(b.pKb) - Number(a.pKb));
		else if (baseSort === 'name') arr.sort((a, b) => a.name.localeCompare(b.name));
		else if (baseSort === 'strength') arr.sort((a, b) => (a.strength === 'Strong' ? -1 : 1) - (b.strength === 'Strong' ? -1 : 1));
		return arr;
	});

	function cycleAcidSort(col: string) {
		if (col === 'pKa') acidSort = acidSort === 'pKa-asc' ? 'pKa-desc' : 'pKa-asc';
		else if (col === 'name') acidSort = 'name';
		else if (col === 'strength') acidSort = 'strength';
	}

	function cycleBaseSort(col: string) {
		if (col === 'pKb') baseSort = baseSort === 'pKb-asc' ? 'pKb-desc' : 'pKb-asc';
		else if (col === 'name') baseSort = 'name';
		else if (col === 'strength') baseSort = 'strength';
	}
</script>

<div class="ab-overlay">
	<div class="ab-header">
		<button class="ab-close" onclick={onclose}>
			<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>
		<h2>Acids & Bases</h2>
		<span class="ab-header-spacer"></span>
	</div>

	<div class="ab-content">
		<!-- Acids table -->
		<h3 class="ab-panel-title acid-title">Common Acids</h3>
		<table class="ab-table">
			<thead>
				<tr>
					<th class="ab-th" onclick={() => cycleAcidSort('name')}>Name</th>
					<th class="ab-th">Formula</th>
					<th class="ab-th ab-th-sortable" onclick={() => cycleAcidSort('pKa')}>
						pKa {acidSort === 'pKa-asc' ? '▲' : acidSort === 'pKa-desc' ? '▼' : ''}
					</th>
					<th class="ab-th" onclick={() => cycleAcidSort('strength')}>Strength</th>
				</tr>
			</thead>
			<tbody>
				{#each sortedAcids as acid}
					<tr class="ab-row">
						<td class="ab-td">{acid.name}</td>
						<td class="ab-td ab-formula">{acid.formula}</td>
						<td class="ab-td ab-num">{acid.pKa}</td>
						<td class="ab-td">
							<span class="ab-badge" class:strong={acid.strength === 'Strong'} class:weak={acid.strength === 'Weak'}>{acid.strength}</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<!-- Bases table -->
		<h3 class="ab-panel-title base-title">Common Bases</h3>
		<table class="ab-table">
			<thead>
				<tr>
					<th class="ab-th" onclick={() => cycleBaseSort('name')}>Name</th>
					<th class="ab-th">Formula</th>
					<th class="ab-th ab-th-sortable" onclick={() => cycleBaseSort('pKb')}>
						pKb {baseSort === 'pKb-asc' ? '▲' : baseSort === 'pKb-desc' ? '▼' : ''}
					</th>
					<th class="ab-th" onclick={() => cycleBaseSort('strength')}>Strength</th>
					<th class="ab-th">Conjugate Acid</th>
				</tr>
			</thead>
			<tbody>
				{#each sortedBases as base}
					<tr class="ab-row">
						<td class="ab-td">{base.name}</td>
						<td class="ab-td ab-formula">{base.formula}</td>
						<td class="ab-td ab-num">{base.pKb}</td>
						<td class="ab-td">
							<span class="ab-badge base" class:strong={base.strength === 'Strong'} class:weak={base.strength === 'Weak'}>{base.strength}</span>
						</td>
						<td class="ab-td ab-formula">{base.conjugateAcid}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="ab-close-bar portrait-only">
		<button class="ab-close-btn" onclick={onclose}>Close</button>
	</div>
</div>

<style>
	.ab-overlay {
		position: fixed;
		inset: 0;
		z-index: 80;
		background: var(--bg-surface);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.ab-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.35rem 0.75rem;
		border-bottom: 1px solid var(--border-color);
		flex-shrink: 0;
	}

	.ab-header h2 {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.ab-header-spacer {
		width: 18px;
	}

	.ab-close {
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

	.ab-close:hover {
		color: var(--text-primary);
		background: var(--bg-cell);
	}

	.ab-content {
		flex: 1;
		overflow: auto;
		display: flex;
		flex-direction: column;
	}

	.ab-panel-title {
		margin: 0;
		padding: 0.5rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		border-bottom: 1px solid var(--border-color);
		position: sticky;
		top: 0;
		z-index: 2;
		background: var(--bg-surface);
	}

	.acid-title {
		color: #e63946;
	}

	.base-title {
		color: #4dabf7;
	}

	.ab-table {
		border-collapse: collapse;
		width: 100%;
	}

	.ab-th {
		position: sticky;
		top: 0;
		z-index: 1;
		background: var(--bg-surface);
		padding: 0.3rem 0.4rem;
		font-size: 0.65rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-align: left;
		white-space: nowrap;
		border-bottom: 2px solid var(--border-color);
		cursor: pointer;
		user-select: none;
	}

	.ab-th:hover {
		color: var(--text-primary);
	}

	.ab-row {
		transition: background 0.1s;
	}

	.ab-row:hover {
		background: var(--bg-cell);
	}

	.ab-row:nth-child(even) {
		background: rgba(255, 255, 255, 0.02);
	}

	.ab-row:nth-child(even):hover {
		background: var(--bg-cell);
	}

	.ab-td {
		padding: 0.3rem 0.4rem;
		font-size: 0.8rem;
		color: var(--text-primary);
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
		white-space: nowrap;
	}

	.ab-formula {
		font-weight: 600;
		color: var(--text-primary);
	}

	.ab-num {
		font-variant-numeric: tabular-nums;
		text-align: right;
	}

	.ab-badge {
		display: inline-block;
		padding: 0.1rem 0.4rem;
		border-radius: 999px;
		font-size: 0.65rem;
		font-weight: 600;
	}

	.ab-badge.strong {
		background: rgba(230, 57, 70, 0.2);
		color: #e63946;
	}

	.ab-badge.base.strong {
		background: rgba(51, 153, 255, 0.2);
		color: #3399ff;
	}

	.ab-badge.weak {
		background: rgba(244, 162, 97, 0.2);
		color: #f4a261;
	}

	.ab-close-bar {
		flex-shrink: 0;
		padding: 0.75rem;
		border-top: 1px solid var(--border-color);
		background: var(--bg-surface);
	}

	.ab-close-btn {
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

	.ab-close-btn:hover {
		background: var(--border-color);
		color: var(--text-primary);
	}

	@media (orientation: landscape) {
		.portrait-only {
			display: none !important;
		}
	}

	@media (orientation: portrait) {
		.ab-header h2 {
			font-size: 1.2rem;
		}

		.ab-header .ab-close {
			display: none;
		}

		.ab-header-spacer {
			display: none;
		}

		.ab-header {
			justify-content: center;
		}

		.ab-content {
			padding-bottom: 4.5rem;
		}

		.ab-panel-title {
			font-size: 1rem;
			padding: 0.6rem 1rem;
		}

		.ab-th {
			font-size: 0.85rem;
			padding: 0.4rem 0.5rem;
		}

		.ab-td {
			font-size: 1.05rem;
			padding: 0.4rem 0.5rem;
		}

		.ab-badge {
			font-size: 0.85rem;
		}
	}
</style>
