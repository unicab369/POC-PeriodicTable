<script lang="ts">
	import type { Element, Phase } from '$lib/types/element';
	import { getPhaseAtTemperature } from '$lib/utils/element-helpers';
	import { PROPERTIES, computeHeatmapFills, computeHeatmapRange } from '$lib/utils/heatmap';
	import PeriodicTable from '$lib/components/PeriodicTable.svelte';
	import SidePanel from '$lib/components/SidePanel.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import TemperatureSlider from '$lib/components/TemperatureSlider.svelte';
	import PropertiesPanel from '$lib/components/PropertiesPanel.svelte';
	import { getCategoryColor } from '$lib/utils/categories';
	import elementsData from '$lib/data/elements.json';

	const elements: Element[] = elementsData as Element[];

	let searchQuery = $state('');
	let temperature = $state(298);
	let selectedElement: Element | null = $state(null);

	// --- Properties heatmap state ---
	let selectedPropertyKey: string | null = $state('atomic_radius');

	let selectedProperty = $derived(
		selectedPropertyKey ? PROPERTIES.find((p) => p.key === selectedPropertyKey) ?? null : null
	);

	let heatmapFills = $derived.by(() => {
		if (!selectedProperty) return null;
		return computeHeatmapFills(elements, selectedProperty);
	});

	let heatmapMeta = $derived.by(() => {
		if (!selectedProperty) return null;
		const range = computeHeatmapRange(elements, selectedProperty);
		return { label: selectedProperty.label, unit: selectedProperty.unit, min: range.min, max: range.max };
	});

	let phases = $derived.by(() => {
		const map = new Map<number, Phase>();
		for (const el of elements) {
			map.set(el.number, getPhaseAtTemperature(el, temperature));
		}
		return map;
	});

	let dimmedSet = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return new Set<number>();

		const matched = new Set<number>();
		for (const el of elements) {
			if (
				el.name.toLowerCase().includes(q) ||
				el.symbol.toLowerCase().includes(q) ||
				String(el.number) === q
			) {
				matched.add(el.number);
			}
		}

		// Return set of elements that should be dimmed (NOT matching)
		const dimmed = new Set<number>();
		for (const el of elements) {
			if (!matched.has(el.number)) {
				dimmed.add(el.number);
			}
		}
		return dimmed;
	});

	let selectedPhase: Phase = $derived.by(() => {
		if (!selectedElement) return 'Unknown';
		return phases.get(selectedElement.number) ?? 'Unknown';
	});

	function handleSelect(element: Element) {
		selectedElement = element;
	}

	function handleCloseDetail() {
		selectedElement = null;
	}

	function handlePropertySelect(key: string | null) {
		selectedPropertyKey = key;
	}

function handleSearch(value: string) {
		searchQuery = value;
	}

	function handleTemperature(value: number) {
		temperature = value;
	}

	// --- Menu popup ---
	let menuOpen = $state(false);
	let menuView: 'controls' | 'properties' | 'elements' = $state('controls');

	// --- Element list state ---
	let elementListQuery = $state('');

	let filteredElements = $derived.by(() => {
		const q = elementListQuery.trim().toLowerCase();
		if (!q) return elements;
		return elements.filter(
			(el) =>
				el.name.toLowerCase().includes(q) ||
				el.symbol.toLowerCase().includes(q) ||
				String(el.number).includes(q)
		);
	});

	function toggleMenu() {
		menuOpen = !menuOpen;
		if (menuOpen) menuView = 'controls';
	}

	function closeMenu() {
		menuOpen = false;
		menuView = 'controls';
		elementListQuery = '';
	}

	// --- Zoom logic: only zoom the periodic table ---
	let tableZoom = $state(1);
	let minZoom = $state(0.3);
	let maxZoom = $state(3);
	let tableAreaEl: HTMLElement | undefined = $state();
	let zoomContainerEl: HTMLElement | undefined = $state();
	let lastIsPortrait: boolean | null = $state(null);

	function computeZoomBounds() {
		if (!tableAreaEl || !zoomContainerEl) return;
		const areaWidth = tableAreaEl.clientWidth;
		const areaHeight = tableAreaEl.clientHeight;
		// Measure the table's natural size at scale=1
		const savedTransform = zoomContainerEl.style.transform;
		zoomContainerEl.style.transform = 'scale(1)';
		const naturalWidth = zoomContainerEl.scrollWidth;
		const naturalHeight = zoomContainerEl.scrollHeight;
		zoomContainerEl.style.transform = savedTransform;
		if (naturalWidth > 0 && naturalHeight > 0) {
			const fitWidth = areaWidth / naturalWidth;
			const fitHeight = areaHeight / naturalHeight;
			const isPortrait = areaHeight > areaWidth;
			// Min zoom: in portrait, fit table height (allow horizontal scroll);
			// in landscape, fit the most constraining axis
			minZoom = isPortrait
				? Math.min(fitHeight, 1)
				: Math.min(fitWidth, fitHeight, 1);
			// Max zoom: in portrait, cap so table height fills area.
			// In landscape, cap at half the table width fitting the viewport.
			maxZoom = isPortrait ? Math.max(fitHeight, minZoom) : Math.max(fitWidth * 2, minZoom);

			// Detect orientation change
			const orientationChanged = lastIsPortrait !== null && lastIsPortrait !== isPortrait;
			lastIsPortrait = isPortrait;

			if (orientationChanged) {
				if (isPortrait) {
					// Switching to vertical: max zoom, scroll to left
					tableZoom = maxZoom;
					tableAreaEl.scrollLeft = 0;
				} else {
					// Switching to horizontal: min zoom (fit everything)
					tableZoom = minZoom;
					tableAreaEl.scrollLeft = 0;
				}
			} else {
				// Normal clamp
				tableZoom = Math.min(Math.max(tableZoom, minZoom), maxZoom);
			}
		}
	}

	$effect(() => {
		if (!tableAreaEl) return;
		const ro = new ResizeObserver(() => computeZoomBounds());
		ro.observe(tableAreaEl);
		return () => ro.disconnect();
	});

	$effect(() => {
		if (zoomContainerEl && tableAreaEl) {
			requestAnimationFrame(() => computeZoomBounds());
		}
	});

	function clampZoom(z: number): number {
		return Math.min(Math.max(z, minZoom), maxZoom);
	}

	function handleWheel(e: WheelEvent) {
		if (e.ctrlKey || e.metaKey) {
			e.preventDefault();
			const delta = -e.deltaY * 0.005;
			tableZoom = clampZoom(tableZoom + delta);
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+' || e.key === '-' || e.key === '0')) {
			e.preventDefault();
			if (e.key === '=' || e.key === '+') {
				tableZoom = clampZoom(tableZoom + 0.1);
			} else if (e.key === '-') {
				tableZoom = clampZoom(tableZoom - 0.1);
			} else if (e.key === '0') {
				tableZoom = 1;
			}
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<main class="table-area" bind:this={tableAreaEl} onwheel={handleWheel}>
	<div class="table-zoom-container" bind:this={zoomContainerEl} style:transform="scale({tableZoom})" style:transform-origin="top left">
		<PeriodicTable {elements} {phases} {dimmedSet} onselect={handleSelect} heatmapFills={menuOpen && menuView === 'properties' ? heatmapFills : null} heatmapMeta={menuOpen && menuView === 'properties' ? heatmapMeta : null} />
	</div>
</main>

<SidePanel
	element={selectedElement}
	{elements}
	phase={selectedPhase}
	{temperature}
	onclose={handleCloseDetail}
	onnavigate={handleSelect}
/>

{#if selectedElement}
	<!-- FAB close button for detail view -->
	<button class="fab" onclick={handleCloseDetail} aria-label="Close element details">
		<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</svg>
	</button>
{:else}
	<!-- FAB hamburger button -->
	<button class="fab" onclick={toggleMenu} aria-label="Open controls menu">
		<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
			{#if menuOpen}
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			{:else}
				<line x1="3" y1="7" x2="21" y2="7" />
				<line x1="3" y1="12" x2="21" y2="12" />
				<line x1="3" y1="17" x2="21" y2="17" />
			{/if}
		</svg>
	</button>
{/if}

<!-- Controls panel -->
{#if menuOpen}
	<div class="menu-panel">
		{#if menuView === 'controls'}
			<div class="menu-panel-header">
				<button class="menu-close-btn" onclick={closeMenu} aria-label="Close menu">
					<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
				<h2>Menu</h2>
				<span class="menu-header-spacer"></span>
			</div>
			<div class="menu-body">
				<div class="menu-section">
					<SearchBar value={searchQuery} oninput={handleSearch} />
				</div>
				<div class="menu-section">
					<TemperatureSlider {temperature} onchange={handleTemperature} />
				</div>
				<div class="menu-section">
					<button class="menu-row" onclick={() => menuView = 'elements'}>
						<span>Element List</span>
						<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<polyline points="6,2 12,8 6,14" />
						</svg>
					</button>
					<button class="menu-row" onclick={() => menuView = 'properties'}>
						<span>Properties</span>
						<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<polyline points="6,2 12,8 6,14" />
						</svg>
					</button>
				</div>
			</div>
		{:else if menuView === 'properties'}
			<div class="menu-panel-header">
				<button class="menu-back-btn" onclick={() => menuView = 'controls'} aria-label="Back to controls">
					<svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="10,2 4,8 10,14" />
					</svg>
				</button>
				<h2>Properties</h2>
				<span></span>
			</div>
			<PropertiesPanel
				properties={PROPERTIES}
				selectedKey={selectedPropertyKey}
				onselect={handlePropertySelect}
			/>
		{:else if menuView === 'elements'}
			<div class="menu-panel-header">
				<button class="menu-back-btn" onclick={() => { menuView = 'controls'; elementListQuery = ''; }} aria-label="Back to controls">
					<svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="10,2 4,8 10,14" />
					</svg>
				</button>
				<h2>Element List</h2>
				<span class="menu-header-spacer"></span>
			</div>
			<div class="element-list-search">
				<SearchBar value={elementListQuery} oninput={(v) => elementListQuery = v} />
			</div>
			<div class="element-list">
				{#each filteredElements as el (el.number)}
					<button class="element-list-item" onclick={() => { handleSelect(el); closeMenu(); }}>
						<span class="element-list-symbol" style:color={getCategoryColor(el.category)}>{el.symbol}</span>
						<span class="element-list-name">{el.name}</span>
						<span class="element-list-number">{el.number}</span>
					</button>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.table-area {
		height: 100vh;
		overflow: auto;
		touch-action: pan-x pan-y;
	}

	.table-zoom-container {
		will-change: transform;
		transition: transform 0.05s ease-out;
	}

	.fab {
		position: fixed;
		bottom: 1.25rem;
		left: 1.25rem;
		z-index: 50;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		border: 2px solid var(--text-secondary);
		background: var(--bg-cell);
		color: #fff;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
		transition: background 0.15s, border-color 0.15s;
	}

	.fab:hover {
		background: var(--border-color);
		border-color: var(--text-primary);
	}

	.menu-panel {
		position: fixed;
		z-index: 55;
		background: var(--bg-surface);
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	}

	.menu-panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid var(--border-color);
		flex-shrink: 0;
	}

	.menu-panel-header h2 {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.menu-close-btn {
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

	.menu-close-btn:hover {
		color: var(--text-primary);
		background: var(--bg-cell);
	}

	.menu-header-spacer {
		width: 28px;
	}

	.menu-body {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.25rem;
	}

	.menu-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	@media (orientation: landscape) {
		.menu-panel {
			top: 0;
			left: 0;
			bottom: 0;
			width: 220px;
			border-right: 1px solid var(--border-color);
		}
	}

	@media (orientation: portrait) {
		.menu-panel {
			inset: 0;
		}
	}

	.menu-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.75rem 0.5rem;
		border: none;
		border-bottom: 1px solid var(--border-color);
		background: none;
		color: var(--text-primary);
		cursor: pointer;
		font-size: 0.9rem;
		font-family: inherit;
		text-align: left;
		transition: background 0.15s;
	}

	.menu-row:hover {
		background: var(--bg-cell);
	}

	.menu-row svg {
		margin-left: auto;
		color: var(--text-secondary);
		flex-shrink: 0;
	}

	.menu-row-badge {
		margin-left: auto;
		font-size: 0.75rem;
		color: #00b4d8;
		opacity: 0.8;
	}

	.menu-back-btn {
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

	.menu-back-btn:hover {
		color: var(--text-primary);
		background: var(--bg-cell);
	}

	.element-list-search {
		padding: 0.75rem;
		border-bottom: 1px solid var(--border-color);
		flex-shrink: 0;
	}

	.element-list-search :global(.search-bar) {
		max-width: 100%;
	}

	.element-list {
		flex: 1;
		overflow-y: auto;
		padding: 0.25rem 0;
	}

	.element-list-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 1rem 1rem;
		border: none;
		border-bottom: 1px solid var(--border-color);
		background: none;
		color: var(--text-primary);
		cursor: pointer;
		font-size: 1rem;
		font-family: inherit;
		text-align: left;
		transition: background 0.15s;
	}

	.element-list-item:hover {
		background: var(--bg-cell);
	}

	.element-list-symbol {
		width: 2.5rem;
		font-weight: 700;
		font-size: 1.15rem;
		flex-shrink: 0;
	}

	.element-list-name {
		color: var(--text-primary);
		flex: 1;
	}

	.element-list-number {
		text-align: right;
		color: var(--text-secondary);
		font-size: 0.8rem;
		flex-shrink: 0;
	}

</style>
