<script lang="ts">
	import type { Element, Phase } from '$lib/types/element';
	import type { ElementCategory } from '$lib/types/element';
	import { getPhaseAtTemperature } from '$lib/utils/element-helpers';
	import { PROPERTIES, computeHeatmapFills, computeHeatmapRange } from '$lib/utils/heatmap';
	import PeriodicTable from '$lib/components/PeriodicTable.svelte';
	import SidePanel from '$lib/components/SidePanel.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import TemperatureSlider from '$lib/components/TemperatureSlider.svelte';
	import PropertiesPanel from '$lib/components/PropertiesPanel.svelte';
	import { getCategoryColor, categoryLabels, categoryColors } from '$lib/utils/categories';
	import { getSolubilityColor } from '$lib/utils/solubility';
	import elementsData from '$lib/data/elements.json';

	const elements: Element[] = elementsData as Element[];

	function computeBounds(accessor: (el: Element) => number | null): { min: number; max: number } {
		let min = Infinity;
		let max = -Infinity;
		for (const el of elements) {
			const v = accessor(el);
			if (v != null) {
				if (v < min) min = v;
				if (v > max) max = v;
			}
		}
		return { min, max };
	}

	const massBounds = computeBounds((el) => el.atomic_mass);
	const enBounds = computeBounds((el) => el.electronegativity_pauling);
	const densityBounds = computeBounds((el) => el.density);
	const meltBounds = computeBounds((el) => el.melt);
	const boilBounds = computeBounds((el) => el.boil);

	let temperature = $state(298);
	let yearFilter = $state(2024);
	let selectedElement: Element | null = $state(null);

	// --- Range filter state ---
	let massFilterMin = $state(massBounds.min);
	let massFilterMax = $state(massBounds.max);
	let enFilterMin = $state(enBounds.min);
	let enFilterMax = $state(enBounds.max);
	let densityFilterMin = $state(densityBounds.min);
	let densityFilterMax = $state(densityBounds.max);
	let meltFilterMin = $state(meltBounds.min);
	let meltFilterMax = $state(meltBounds.max);
	let boilFilterMin = $state(boilBounds.min);
	let boilFilterMax = $state(boilBounds.max);

	// --- Toggle filter state ---
	let enabledBlocks = $state(new Set(['s', 'p', 'd', 'f']));
	let enabledCategories = $state(new Set(Object.keys(categoryLabels)));
	let enabledPhases = $state(new Set(['Solid', 'Liquid', 'Gas', 'Unknown']));

	// --- Active filter tracking (only one range filter at a time) ---
	type RangeFilter = 'mass' | 'en' | 'density' | 'melt' | 'boil' | null;
	let activeRangeFilter: RangeFilter = $state(null);

	function selectRangeFilter(filter: RangeFilter) {
		if (activeRangeFilter === filter) return;
		// Reset the previous filter
		if (activeRangeFilter === 'mass') resetMassFilter();
		else if (activeRangeFilter === 'en') resetEnFilter();
		else if (activeRangeFilter === 'density') resetDensityFilter();
		else if (activeRangeFilter === 'melt') resetMeltFilter();
		else if (activeRangeFilter === 'boil') resetBoilFilter();
		activeRangeFilter = filter;
	}

	// --- Derived active flags ---
	let massFilterActive = $derived(massFilterMin > massBounds.min || massFilterMax < massBounds.max);
	let enFilterActive = $derived(enFilterMin > enBounds.min || enFilterMax < enBounds.max);
	let densityFilterActive = $derived(densityFilterMin > densityBounds.min || densityFilterMax < densityBounds.max);
	let meltFilterActive = $derived(meltFilterMin > meltBounds.min || meltFilterMax < meltBounds.max);
	let boilFilterActive = $derived(boilFilterMin > boilBounds.min || boilFilterMax < boilBounds.max);

	// --- Toggle helpers (new Set for Svelte 5 reactivity) ---
	function toggleBlock(b: string) {
		const s = new Set(enabledBlocks);
		if (s.has(b)) s.delete(b); else s.add(b);
		enabledBlocks = s;
	}
	function toggleCategory(c: string) {
		const s = new Set(enabledCategories);
		if (s.has(c)) s.delete(c); else s.add(c);
		enabledCategories = s;
	}
	function togglePhase(p: string) {
		const s = new Set(enabledPhases);
		if (s.has(p)) s.delete(p); else s.add(p);
		enabledPhases = s;
	}

	// --- Reset helpers ---
	function resetMassFilter() { massFilterMin = massBounds.min; massFilterMax = massBounds.max; }
	function resetEnFilter() { enFilterMin = enBounds.min; enFilterMax = enBounds.max; }
	function resetDensityFilter() { densityFilterMin = densityBounds.min; densityFilterMax = densityBounds.max; }
	function resetMeltFilter() { meltFilterMin = meltBounds.min; meltFilterMax = meltBounds.max; }
	function resetBoilFilter() { boilFilterMin = boilBounds.min; boilFilterMax = boilBounds.max; }

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

	// --- Solubility state ---
	let solubilityActive = $state(false);

	let solubilityColorMap = $derived.by(() => {
		if (!solubilityActive) return null;
		const map = new Map<number, string>();
		for (const el of elements) {
			map.set(el.number, getSolubilityColor(el.number));
		}
		return map;
	});

	let phases = $derived.by(() => {
		const map = new Map<number, Phase>();
		for (const el of elements) {
			map.set(el.number, getPhaseAtTemperature(el, temperature));
		}
		return map;
	});

	let dimmedSet = $derived.by(() => {
		const dimmed = new Set<number>();
		for (const el of elements) {
			// Year filter
			if (yearFilter < 2024) {
				const year = el.year_discovered;
				if (year !== 'Ancient' && year !== null && typeof year === 'number' && year > yearFilter) {
					dimmed.add(el.number);
					continue;
				}
			}
			// Atomic mass range
			if (el.atomic_mass < massFilterMin || el.atomic_mass > massFilterMax) {
				dimmed.add(el.number); continue;
			}
			// Electronegativity range (null = pass)
			if (el.electronegativity_pauling != null && (el.electronegativity_pauling < enFilterMin || el.electronegativity_pauling > enFilterMax)) {
				dimmed.add(el.number); continue;
			}
			// Density range (null = pass)
			if (el.density != null && (el.density < densityFilterMin || el.density > densityFilterMax)) {
				dimmed.add(el.number); continue;
			}
			// Melting point range (null = pass)
			if (el.melt != null && (el.melt < meltFilterMin || el.melt > meltFilterMax)) {
				dimmed.add(el.number); continue;
			}
			// Boiling point range (null = pass)
			if (el.boil != null && (el.boil < boilFilterMin || el.boil > boilFilterMax)) {
				dimmed.add(el.number); continue;
			}
			// Block toggle
			if (!enabledBlocks.has(el.block)) {
				dimmed.add(el.number); continue;
			}
			// Category toggle
			if (!enabledCategories.has(el.category)) {
				dimmed.add(el.number); continue;
			}
			// Phase toggle (reacts to temperature)
			const phase = phases.get(el.number) ?? 'Unknown';
			if (!enabledPhases.has(phase)) {
				dimmed.add(el.number); continue;
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

	function handleTemperature(value: number) {
		temperature = value;
	}

	function handleYear(e: Event) {
		yearFilter = Number((e.target as HTMLInputElement).value);
	}

	// --- Menu popup ---
	let menuOpen = $state(false);
	let menuView: 'controls' | 'properties' | 'elements' | 'filters' | 'solubility' = $state('controls');

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
		const style = getComputedStyle(tableAreaEl);
		const areaWidth = tableAreaEl.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
		const areaHeight = tableAreaEl.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
		const savedTransform = zoomContainerEl.style.transform;
		zoomContainerEl.style.transform = 'scale(1)';
		const naturalWidth = zoomContainerEl.scrollWidth;
		const naturalHeight = zoomContainerEl.scrollHeight;
		zoomContainerEl.style.transform = savedTransform;
		if (naturalWidth > 0 && naturalHeight > 0) {
			const fitWidth = areaWidth / naturalWidth;
			const fitHeight = areaHeight / naturalHeight;
			const isPortrait = areaHeight > areaWidth;
			minZoom = isPortrait
				? Math.min(fitHeight, 1)
				: Math.min(fitWidth, fitHeight, 1);
			maxZoom = isPortrait ? Math.max(fitHeight, minZoom) : Math.max(fitWidth * 2, minZoom);

			const orientationChanged = lastIsPortrait !== null && lastIsPortrait !== isPortrait;
			lastIsPortrait = isPortrait;

			if (orientationChanged) {
				if (isPortrait) {
					tableZoom = maxZoom;
					tableAreaEl.scrollLeft = 0;
				} else {
					tableZoom = minZoom;
					tableAreaEl.scrollLeft = 0;
				}
			} else {
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

	$effect(() => {
		// When menu opens/closes in landscape, snap zoom to fit the new available width
		void menuOpen;
		if (tableAreaEl && zoomContainerEl) {
			requestAnimationFrame(() => {
				computeZoomBounds();
				const isPortrait = tableAreaEl!.clientHeight > tableAreaEl!.clientWidth;
				if (!isPortrait) {
					tableZoom = minZoom;
				}
			});
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
<main class="table-area" class:menu-push={menuOpen} bind:this={tableAreaEl} onwheel={handleWheel}>
	<div class="table-zoom-container" bind:this={zoomContainerEl} style:transform="scale({tableZoom})" style:transform-origin="top left">
		<PeriodicTable {elements} {phases} {dimmedSet} onselect={handleSelect} heatmapFills={menuOpen && menuView === 'properties' && !solubilityActive ? heatmapFills : null} heatmapMeta={menuOpen && menuView === 'properties' && !solubilityActive ? heatmapMeta : null} solubilityColors={solubilityColorMap} />
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

<!-- FAB hamburger button -->
{#if !selectedElement}
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
				<button class="menu-close-btn landscape-only" onclick={closeMenu} aria-label="Close menu">
					<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
				<h2>Menu</h2>
				<span class="menu-header-spacer landscape-only"></span>
			</div>
			<div class="menu-body">
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
					<button class="menu-row" onclick={() => menuView = 'filters'}>
						<span>Filters</span>
						<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<polyline points="6,2 12,8 6,14" />
						</svg>
					</button>
					<button class="menu-row" onclick={() => { solubilityActive = !solubilityActive; menuView = 'solubility'; }}>
						<span>Solubility</span>
						{#if solubilityActive}
							<span class="menu-row-badge">Active</span>
						{/if}
						<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<polyline points="6,2 12,8 6,14" />
						</svg>
					</button>
				</div>
			</div>
			<div class="menu-bottom-bar portrait-only">
				<button class="menu-bottom-btn" onclick={closeMenu}>Close</button>
			</div>
		{:else if menuView === 'properties'}
			<div class="menu-panel-header">
				<button class="menu-back-btn landscape-only" onclick={() => menuView = 'controls'} aria-label="Back to controls">
					<svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="10,2 4,8 10,14" />
					</svg>
				</button>
				<h2>Properties</h2>
				<span class="landscape-only"></span>
			</div>
			<PropertiesPanel
				properties={PROPERTIES}
				selectedKey={selectedPropertyKey}
				onselect={handlePropertySelect}
			/>
			<div class="menu-bottom-bar portrait-only">
				<button class="menu-bottom-btn" onclick={() => menuView = 'controls'}>Back</button>
			</div>
		{:else if menuView === 'elements'}
			<div class="menu-panel-header">
				<button class="menu-back-btn landscape-only" onclick={() => { menuView = 'controls'; elementListQuery = ''; }} aria-label="Back to controls">
					<svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="10,2 4,8 10,14" />
					</svg>
				</button>
				<h2>Element List</h2>
				<span class="menu-header-spacer landscape-only"></span>
			</div>
			<div class="element-list-search">
				<SearchBar value={elementListQuery} oninput={(v) => elementListQuery = v} />
			</div>
			<div class="element-list">
				{#each filteredElements as el (el.number)}
					<button class="element-list-item" onclick={() => handleSelect(el)}>
						<span class="element-list-symbol" style:color={getCategoryColor(el.category)}>{el.symbol}</span>
						<span class="element-list-name">{el.name}</span>
						<span class="element-list-number">{el.number}</span>
					</button>
				{/each}
			</div>
			<div class="menu-bottom-bar portrait-only">
				<button class="menu-bottom-btn" onclick={() => { menuView = 'controls'; elementListQuery = ''; }}>Back</button>
			</div>
		{:else if menuView === 'filters'}
			<div class="menu-panel-header">
				<button class="menu-back-btn landscape-only" onclick={() => menuView = 'controls'} aria-label="Back to controls">
					<svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="10,2 4,8 10,14" />
					</svg>
				</button>
				<h2>Filters</h2>
				<span class="menu-header-spacer landscape-only"></span>
			</div>
			<div class="filters-body">
				<div class="slider-group">
					<label for="temp-slider">Temperature</label>
					<TemperatureSlider {temperature} onchange={handleTemperature} />
				</div>

				<hr class="filter-separator" />

				<div class="slider-group">
					<label for="year-slider">Year of Discovery</label>
					<div class="year-slider">
						<input
							id="year-slider"
							type="range"
							min="1500"
							max="2024"
							step="1"
							value={yearFilter}
							oninput={handleYear}
						/>
						<div class="year-display">
							<span class="year-value">{yearFilter}</span>
							{#if yearFilter < 2024}
								<button class="year-reset" onclick={() => yearFilter = 2024}>Reset</button>
							{/if}
						</div>
					</div>
				</div>

				<hr class="filter-separator" />

				<!-- Atomic Mass -->
				<div class="slider-group" class:active-filter={activeRangeFilter === 'mass'}>
					<div class="filter-header">
						<label>Atomic Mass</label>
						{#if massFilterActive}
							<button class="year-reset" onclick={() => { resetMassFilter(); activeRangeFilter = null; }}>Reset</button>
						{/if}
					</div>
					<input type="range" min={massBounds.min} max={massBounds.max} step="0.1" bind:value={massFilterMin} oninput={() => selectRangeFilter('mass')} />
					<input type="range" min={massBounds.min} max={massBounds.max} step="0.1" bind:value={massFilterMax} oninput={() => selectRangeFilter('mass')} />
					<div class="year-display">
						<span class="year-value">{massFilterMin.toFixed(1)}</span>
						<span class="range-separator">&ndash;</span>
						<span class="year-value">{massFilterMax.toFixed(1)}</span>
					</div>
				</div>

				<hr class="filter-separator" />

				<!-- Electronegativity -->
				<div class="slider-group" class:active-filter={activeRangeFilter === 'en'}>
					<div class="filter-header">
						<label>Electronegativity</label>
						{#if enFilterActive}
							<button class="year-reset" onclick={() => { resetEnFilter(); activeRangeFilter = null; }}>Reset</button>
						{/if}
					</div>
					<input type="range" min={enBounds.min} max={enBounds.max} step="0.01" bind:value={enFilterMin} oninput={() => selectRangeFilter('en')} />
					<input type="range" min={enBounds.min} max={enBounds.max} step="0.01" bind:value={enFilterMax} oninput={() => selectRangeFilter('en')} />
					<div class="year-display">
						<span class="year-value">{enFilterMin.toFixed(2)}</span>
						<span class="range-separator">&ndash;</span>
						<span class="year-value">{enFilterMax.toFixed(2)}</span>
					</div>
				</div>

				<hr class="filter-separator" />

				<!-- Density -->
				<div class="slider-group" class:active-filter={activeRangeFilter === 'density'}>
					<div class="filter-header">
						<label>Density (g/cm³)</label>
						{#if densityFilterActive}
							<button class="year-reset" onclick={() => { resetDensityFilter(); activeRangeFilter = null; }}>Reset</button>
						{/if}
					</div>
					<input type="range" min={densityBounds.min} max={densityBounds.max} step="0.01" bind:value={densityFilterMin} oninput={() => selectRangeFilter('density')} />
					<input type="range" min={densityBounds.min} max={densityBounds.max} step="0.01" bind:value={densityFilterMax} oninput={() => selectRangeFilter('density')} />
					<div class="year-display">
						<span class="year-value">{densityFilterMin.toFixed(2)}</span>
						<span class="range-separator">&ndash;</span>
						<span class="year-value">{densityFilterMax.toFixed(2)}</span>
					</div>
				</div>

				<hr class="filter-separator" />

				<!-- Melting Point -->
				<div class="slider-group" class:active-filter={activeRangeFilter === 'melt'}>
					<div class="filter-header">
						<label>Melting Point (K)</label>
						{#if meltFilterActive}
							<button class="year-reset" onclick={() => { resetMeltFilter(); activeRangeFilter = null; }}>Reset</button>
						{/if}
					</div>
					<input type="range" min={meltBounds.min} max={meltBounds.max} step="1" bind:value={meltFilterMin} oninput={() => selectRangeFilter('melt')} />
					<input type="range" min={meltBounds.min} max={meltBounds.max} step="1" bind:value={meltFilterMax} oninput={() => selectRangeFilter('melt')} />
					<div class="year-display">
						<span class="year-value">{Math.round(meltFilterMin)}</span>
						<span class="range-separator">&ndash;</span>
						<span class="year-value">{Math.round(meltFilterMax)}</span>
					</div>
				</div>

				<hr class="filter-separator" />

				<!-- Boiling Point -->
				<div class="slider-group" class:active-filter={activeRangeFilter === 'boil'}>
					<div class="filter-header">
						<label>Boiling Point (K)</label>
						{#if boilFilterActive}
							<button class="year-reset" onclick={() => { resetBoilFilter(); activeRangeFilter = null; }}>Reset</button>
						{/if}
					</div>
					<input type="range" min={boilBounds.min} max={boilBounds.max} step="1" bind:value={boilFilterMin} oninput={() => selectRangeFilter('boil')} />
					<input type="range" min={boilBounds.min} max={boilBounds.max} step="1" bind:value={boilFilterMax} oninput={() => selectRangeFilter('boil')} />
					<div class="year-display">
						<span class="year-value">{Math.round(boilFilterMin)}</span>
						<span class="range-separator">&ndash;</span>
						<span class="year-value">{Math.round(boilFilterMax)}</span>
					</div>
				</div>

				<hr class="filter-separator" />

				<!-- Block toggle -->
				<div class="slider-group">
					<label>Block</label>
					<div class="toggle-group">
						{#each ['s', 'p', 'd', 'f'] as b}
							<button
								class="toggle-btn"
								class:active={enabledBlocks.has(b)}
								onclick={() => toggleBlock(b)}
							>{b}</button>
						{/each}
					</div>
				</div>

				<hr class="filter-separator" />

				<!-- Category toggle -->
				<div class="slider-group">
					<label>Category</label>
					<div class="toggle-group">
						{#each Object.entries(categoryLabels) as [key, label]}
							<button
								class="toggle-btn"
								class:active={enabledCategories.has(key)}
								style:border-color={categoryColors[key as ElementCategory]}
								onclick={() => toggleCategory(key)}
							>{label}</button>
						{/each}
					</div>
				</div>

				<hr class="filter-separator" />

				<!-- Phase toggle -->
				<div class="slider-group">
					<label>Phase</label>
					<div class="toggle-group">
						{#each ['Solid', 'Liquid', 'Gas', 'Unknown'] as p}
							<button
								class="toggle-btn"
								class:active={enabledPhases.has(p)}
								onclick={() => togglePhase(p)}
							>{p}</button>
						{/each}
					</div>
				</div>
			</div>
			<div class="menu-bottom-bar portrait-only">
				<button class="menu-bottom-btn" onclick={() => menuView = 'controls'}>Back</button>
			</div>
		{:else if menuView === 'solubility'}
			<div class="menu-panel-header">
				<button class="menu-back-btn landscape-only" onclick={() => menuView = 'controls'} aria-label="Back to controls">
					<svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="10,2 4,8 10,14" />
					</svg>
				</button>
				<h2>Solubility</h2>
				<span class="menu-header-spacer landscape-only"></span>
			</div>
			<div class="solubility-body">
				<p class="solubility-desc">Elements colored by their water solubility behavior.</p>
				<button class="solubility-toggle" onclick={() => solubilityActive = !solubilityActive}>
					{solubilityActive ? 'Disable' : 'Enable'} Solubility View
				</button>
			</div>
			<div class="menu-bottom-bar portrait-only">
				<button class="menu-bottom-btn" onclick={() => menuView = 'controls'}>Back</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.table-area {
		height: 100vh;
		overflow: auto;
		touch-action: pan-x pan-y;
		transition: width 0.2s ease;
	}

	@media (orientation: landscape) {
		.table-area.menu-push {
			padding-left: 220px;
		}
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

		.menu-panel-header {
			justify-content: center;
			padding: 0.75rem 1rem;
		}

		.menu-panel-header h2 {
			font-size: 1.15rem;
		}

		.menu-bottom-bar {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background: var(--bg-surface);
			z-index: 56;
		}

		.slider-group > label {
			font-size: 1.7rem;
		}

		.filter-header label {
			font-size: 1.7rem;
		}

		.year-value {
			font-size: 1.8rem;
		}

		.year-reset {
			font-size: 1.5rem;
		}

		.solubility-desc {
			font-size: 1.7rem;
		}

		.solubility-toggle {
			font-size: 1.7rem;
		}

		.toggle-btn {
			font-size: 1.4rem;
			padding: 0.5rem 0.75rem;
		}

		.range-separator {
			font-size: 1.5rem;
		}

		.menu-body,
		.filters-body,
		.element-list {
			padding-bottom: 4rem;
		}

		.landscape-only {
			display: none !important;
		}
	}

	@media (orientation: landscape) {
		.portrait-only {
			display: none !important;
		}
	}

	.menu-bottom-bar {
		flex-shrink: 0;
		padding: 0.75rem;
		border-top: 1px solid var(--border-color);
	}

	.menu-bottom-btn {
		width: 100%;
		padding: 0.6rem;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		background: var(--bg-cell);
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 0.85rem;
		font-family: inherit;
		transition: background 0.15s, color 0.15s;
	}

	.menu-bottom-btn:hover {
		background: var(--border-color);
		color: var(--text-primary);
	}

	@media (orientation: portrait) {
		.menu-bottom-btn {
			font-size: 1.1rem;
			padding: 0.75rem;
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

	@media (orientation: portrait) {
		.menu-row {
			font-size: 2.0rem;
			padding: 1.25rem 1rem;
		}

		.menu-row-badge {
			font-size: 1.5rem;
		}
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

	@media (orientation: portrait) {
		.element-list-item {
			font-size: 2.5rem;
			padding: 1.5rem 1.25rem;
		}

		.element-list-symbol {
			font-size: 2.8rem;
			width: 4rem;
		}

		.element-list-number {
			font-size: 2rem;
		}
	}

	.filters-body {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1.25rem;
	}

	.filter-separator {
		border: none;
		border-top: 1px solid var(--border-color);
		margin: 0;
	}

	.filter-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.filter-header label {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.range-separator {
		color: var(--text-secondary);
		font-size: 0.85rem;
	}

	.slider-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.5rem;
		border-radius: 6px;
		border: 1px solid transparent;
		transition: border-color 0.2s, background 0.2s;
	}

	.slider-group.active-filter {
		border-color: #00b4d8;
		background: rgba(0, 180, 216, 0.15);
	}

	.slider-group > label {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.slider-group input[type='range'] {
		width: 100%;
		accent-color: #6eb5ff;
		cursor: pointer;
	}

	.year-slider {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.year-slider input[type='range'] {
		width: 100%;
		accent-color: #6eb5ff;
		cursor: pointer;
	}

	.year-display {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.year-value {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.year-reset {
		background: none;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 0.75rem;
		font-family: inherit;
		text-decoration: underline;
		padding: 0;
	}

	.year-reset:hover {
		color: var(--text-primary);
	}

	.toggle-group {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.toggle-btn {
		padding: 0.3rem 0.6rem;
		border: 1px solid var(--border-color);
		border-radius: 999px;
		background: none;
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 0.75rem;
		font-family: inherit;
		transition: background 0.15s, color 0.15s, opacity 0.15s;
		opacity: 0.5;
	}

	.toggle-btn.active {
		background: var(--bg-cell);
		color: var(--text-primary);
		opacity: 1;
	}

	.toggle-btn:hover {
		background: var(--bg-cell);
	}

	.solubility-body {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.25rem;
	}

	.solubility-desc {
		margin: 0;
		font-size: 0.85rem;
		color: var(--text-secondary);
		line-height: 1.4;
	}

	.solubility-toggle {
		padding: 0.6rem;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		background: var(--bg-cell);
		color: var(--text-primary);
		cursor: pointer;
		font-size: 0.85rem;
		font-family: inherit;
		transition: background 0.15s, color 0.15s;
	}

	.solubility-toggle:hover {
		background: var(--border-color);
	}
</style>
