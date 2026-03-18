<script lang="ts">
	import type { Element } from '../types/element';
	import { categoryLabels } from '../utils/categories';

	interface Props {
		elements: Element[];
		onclose: () => void;
	}

	let { elements, onclose }: Props = $props();

	type SortDir = 'asc' | 'desc';
	let sortKey: string = $state('number');
	let sortDir: SortDir = $state('asc');

	interface Column {
		key: string;
		label: string;
		get: (el: Element) => string | number | null;
		numeric: boolean;
	}

	const columns: Column[] = [
		{ key: 'number', label: '#', get: (el) => el.number, numeric: true },
		{ key: 'symbol', label: 'Symbol', get: (el) => el.symbol, numeric: false },
		{ key: 'name', label: 'Name', get: (el) => el.name, numeric: false },
		{ key: 'atomic_mass', label: 'Atomic Mass (u)', get: (el) => el.atomic_mass, numeric: true },
		{ key: 'category', label: 'Category', get: (el) => categoryLabels[el.category] ?? el.category, numeric: false },
		{ key: 'block', label: 'Block', get: (el) => el.block, numeric: false },
		{ key: 'group', label: 'Group', get: (el) => el.xpos, numeric: true },
		{ key: 'period', label: 'Period', get: (el) => el.ypos <= 7 ? el.ypos : el.ypos === 9 ? 6 : 7, numeric: true },
		{ key: 'phase', label: 'Phase (STP)', get: (el) => el.phase, numeric: false },
		{ key: 'density', label: 'Density (g/cm³)', get: (el) => el.density, numeric: true },
		{ key: 'melt', label: 'Melting Pt (K)', get: (el) => el.melt, numeric: true },
		{ key: 'boil', label: 'Boiling Pt (K)', get: (el) => el.boil, numeric: true },
		{ key: 'electronegativity_pauling', label: 'Electronegativity', get: (el) => el.electronegativity_pauling, numeric: true },
		{ key: 'electron_affinity', label: 'Electron Affinity (kJ/mol)', get: (el) => el.electron_affinity, numeric: true },
		{ key: 'ionization_1', label: '1st Ionization (kJ/mol)', get: (el) => el.ionization_energies?.[0] ?? null, numeric: true },
		{ key: 'molar_heat', label: 'Molar Heat (J/mol·K)', get: (el) => el.molar_heat, numeric: true },
		{ key: 'molar_volume', label: 'Molar Volume (cm³/mol)', get: (el) => el.molar_volume, numeric: true },
		{ key: 'thermal_conductivity', label: 'Thermal Cond. (W/m·K)', get: (el) => el.thermal_conductivity, numeric: true },
		{ key: 'radius_covalent', label: 'Covalent Radius (pm)', get: (el) => el.radius_covalent, numeric: true },
		{ key: 'radius_van_der_waals', label: 'Van der Waals (pm)', get: (el) => el.radius_van_der_waals, numeric: true },
		{ key: 'shells', label: 'Electron Shells', get: (el) => el.shells.join(', '), numeric: false },
		{ key: 'electron_configuration_semantic', label: 'Config (Semantic)', get: (el) => el.electron_configuration_semantic, numeric: false },
		{ key: 'year_discovered', label: 'Year Discovered', get: (el) => el.year_discovered, numeric: false },
		{ key: 'discovered_by', label: 'Discovered By', get: (el) => el.discovered_by, numeric: false },
	];

	function toggleSort(key: string) {
		if (sortKey === key) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDir = 'asc';
		}
	}

	let sorted = $derived.by(() => {
		const col = columns.find((c) => c.key === sortKey);
		if (!col) return elements;
		const arr = [...elements];
		const dir = sortDir === 'asc' ? 1 : -1;
		arr.sort((a, b) => {
			const va = col.get(a);
			const vb = col.get(b);
			if (va == null && vb == null) return 0;
			if (va == null) return 1;
			if (vb == null) return -1;
			if (col.numeric) return ((va as number) - (vb as number)) * dir;
			return String(va).localeCompare(String(vb)) * dir;
		});
		return arr;
	});

	function fmt(v: string | number | null): string {
		if (v == null) return '—';
		if (typeof v === 'number') {
			if (Number.isInteger(v)) return String(v);
			return v.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
		}
		return String(v);
	}

	// --- Drag to scroll ---
	let scrollEl: HTMLElement | undefined = $state();
	let dragging = $state(false);
	let dragStartX = 0;
	let dragStartY = 0;
	let scrollStartX = 0;
	let scrollStartY = 0;

	function onPointerDown(e: PointerEvent) {
		// Only drag on middle-click or when clicking on the scroll area (not header buttons)
		if ((e.target as HTMLElement).closest('th')) return;
		dragging = true;
		dragStartX = e.clientX;
		dragStartY = e.clientY;
		scrollStartX = scrollEl?.scrollLeft ?? 0;
		scrollStartY = scrollEl?.scrollTop ?? 0;
		scrollEl?.setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging || !scrollEl) return;
		const dx = e.clientX - dragStartX;
		const dy = e.clientY - dragStartY;
		scrollEl.scrollLeft = scrollStartX - dx;
		scrollEl.scrollTop = scrollStartY - dy;
	}

	function onPointerUp(e: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		scrollEl?.releasePointerCapture(e.pointerId);
	}
</script>

<div class="rt-overlay">
	<div class="rt-header">
		<button class="rt-close" onclick={onclose}>
			<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>
		<h2>Elements Data Table</h2>
		<span class="rt-header-spacer"></span>
	</div>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="rt-scroll"
		class:rt-dragging={dragging}
		bind:this={scrollEl}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
	>
		<table class="rt-table">
			<thead>
				<tr>
					{#each columns as col}
						<th class="rt-th" class:sorted={sortKey === col.key} onclick={() => toggleSort(col.key)}>
							<span class="rt-th-label">{col.label}</span>
							{#if sortKey === col.key}
								<span class="rt-sort-arrow">{sortDir === 'asc' ? '▲' : '▼'}</span>
							{/if}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each sorted as el (el.number)}
					<tr class="rt-row">
						{#each columns as col}
							<td class="rt-td">{fmt(col.get(el))}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="rt-close-bar portrait-only">
		<button class="rt-close-btn" onclick={onclose}>Close</button>
	</div>
</div>

<style>
	.rt-overlay {
		position: fixed;
		inset: 0;
		z-index: 80;
		background: var(--bg-surface);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.rt-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.35rem 0.75rem;
		border-bottom: 1px solid var(--border-color);
		flex-shrink: 0;
	}

	.rt-header h2 {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.rt-header-spacer {
		width: 18px;
	}

	.rt-close {
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

	.rt-close:hover {
		color: var(--text-primary);
		background: var(--bg-cell);
	}

	.rt-scroll {
		flex: 1;
		overflow: auto;
		cursor: grab;
	}

	.rt-scroll.rt-dragging {
		cursor: grabbing;
		user-select: none;
	}

	.rt-table {
		border-collapse: collapse;
		width: auto;
		min-width: 100%;
		text-align: center;
	}

	.rt-th {
		position: sticky;
		top: 0;
		z-index: 2;
		background: var(--bg-surface);
		padding: 0.45rem 0.5rem;
		font-size: 0.6rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-align: center;
		white-space: nowrap;
		border-bottom: 2px solid var(--border-color);
		cursor: pointer;
		user-select: none;
		transition: color 0.15s;
	}

	.rt-th:hover {
		color: var(--text-primary);
	}

	.rt-th.sorted {
		color: #4dabf7;
	}

	.rt-th-label {
		margin-right: 0.2rem;
	}

	.rt-sort-arrow {
		font-size: 0.5rem;
	}

	.rt-row {
		transition: background 0.1s;
	}

	.rt-row:hover {
		background: var(--bg-cell);
	}

	.rt-row:nth-child(even) {
		background: rgba(255, 255, 255, 0.02);
	}

	.rt-row:nth-child(even):hover {
		background: var(--bg-cell);
	}

	.rt-td {
		padding: 0.3rem 0.5rem;
		font-size: 0.85rem;
		color: var(--text-primary);
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
		white-space: nowrap;
		text-align: center;
		font-variant-numeric: tabular-nums;
	}

	.rt-close-bar {
		flex-shrink: 0;
		padding: 0.75rem;
		border-top: 1px solid var(--border-color);
		background: var(--bg-surface);
	}

	.rt-close-btn {
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

	.rt-close-btn:hover {
		background: var(--border-color);
		color: var(--text-primary);
	}

	@media (orientation: landscape) {
		.portrait-only {
			display: none !important;
		}
	}

	@media (orientation: portrait) {
		.rt-header h2 {
			font-size: 1.2rem;
		}

		.rt-header .rt-close {
			display: none;
		}

		.rt-header-spacer {
			display: none;
		}

		.rt-header {
			justify-content: center;
		}

		.rt-scroll {
			padding-bottom: 4.5rem;
		}

		.rt-th {
			font-size: 0.8rem;
			padding: 0.55rem;
		}

		.rt-td {
			font-size: 1.1rem;
			padding: 0.45rem 0.55rem;
		}
	}
</style>
