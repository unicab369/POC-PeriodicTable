<script lang="ts">
	import type { Element, Phase } from '$lib/types/element';
	import { getPhaseAtTemperature } from '$lib/utils/element-helpers';
	import PeriodicTable from '$lib/components/PeriodicTable.svelte';
	import SidePanel from '$lib/components/SidePanel.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import TemperatureSlider from '$lib/components/TemperatureSlider.svelte';
	import elementsData from '$lib/data/elements.json';

	const elements: Element[] = elementsData as Element[];

	let searchQuery = $state('');
	let temperature = $state(298);
	let selectedElement: Element | null = $state(null);

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

	function handleSearch(value: string) {
		searchQuery = value;
	}

	function handleTemperature(value: number) {
		temperature = value;
	}

	// --- Menu popup ---
	let menuOpen = $state(false);

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
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
			maxZoom = isPortrait ? Math.max(fitHeight, minZoom) : 3;

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
		<PeriodicTable {elements} {phases} {dimmedSet} onselect={handleSelect} />
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

<!-- Controls popup -->
{#if menuOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="menu-backdrop" onclick={closeMenu}></div>
	<div class="menu-popup">
		<h2>Controls</h2>
		<div class="menu-section">
			<SearchBar value={searchQuery} oninput={handleSearch} />
		</div>
		<div class="menu-section">
			<TemperatureSlider {temperature} onchange={handleTemperature} />
		</div>
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

	.menu-backdrop {
		position: fixed;
		inset: 0;
		z-index: 40;
		background: rgba(0, 0, 0, 0.4);
	}

	.menu-popup {
		position: fixed;
		bottom: 5rem;
		left: 1.25rem;
		z-index: 55;
		background: var(--bg-surface);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		padding: 1.25rem;
		min-width: 280px;
		max-width: 360px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.menu-popup h2 {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.menu-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
