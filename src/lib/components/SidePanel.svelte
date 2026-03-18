<script lang="ts">
	import type { Element, Phase } from '../types/element';
	import { getCategoryColor, categoryLabels } from '../utils/categories';

	interface Props {
		element: Element | null;
		elements: Element[];
		phase: Phase;
		temperature: number;
		onclose: () => void;
		onnavigate: (element: Element) => void;
	}

	let { element, elements, phase, temperature, onclose, onnavigate }: Props = $props();

	// Build a grid lookup for navigation: [xpos][ypos] -> Element
	let gridMap = $derived.by(() => {
		const map = new Map<string, Element>();
		for (const el of elements) {
			map.set(`${el.xpos},${el.ypos}`, el);
		}
		return map;
	});

	// Collect all unique xpos and ypos values, sorted
	let allXpos = $derived([...new Set(elements.map(el => el.xpos))].sort((a, b) => a - b));
	let allYpos = $derived([...new Set(elements.map(el => el.ypos))].sort((a, b) => a - b));

	let sortedByNumber = $derived([...elements].sort((a, b) => a.number - b.number));

	function navigate(dx: number, dy: number) {
		if (!element) return;

		// Horizontal: navigate by atomic number
		if (dx !== 0) {
			const idx = sortedByNumber.findIndex((el) => el.number === element!.number);
			const next = sortedByNumber[(idx + dx + sortedByNumber.length) % sortedByNumber.length];
			if (next) {
				onnavigate(next);
				return;
			}
		}

		// Vertical: navigate by grid position
		let x = element.xpos;
		let y = element.ypos;
		const maxAttempts = elements.length;
		for (let i = 0; i < maxAttempts; i++) {
			const yi = allYpos.indexOf(y);
			y = allYpos[(yi + dy + allYpos.length) % allYpos.length];
			const found = gridMap.get(`${x},${y}`);
			if (found) {
				onnavigate(found);
				return;
			}
		}
	}

	let activeTab: 'general' | 'details' = $state('general');
	let prevElementNumber: number | null = $state(null);

	$effect(() => {
		if (element && element.number !== prevElementNumber) {
			activeTab = 'general';
			prevElementNumber = element.number;
		}
		if (!element) {
			prevElementNumber = null;
		}
	});

	function formatMass(mass: number): string {
		return mass < 10 ? mass.toFixed(4) : mass.toFixed(3);
	}

	function wavelengthToColor(wl: number): string {
		let r = 0, g = 0, b = 0;
		if (wl >= 380 && wl < 440) { r = -(wl - 440) / 60; b = 1; }
		else if (wl >= 440 && wl < 490) { g = (wl - 440) / 50; b = 1; }
		else if (wl >= 490 && wl < 510) { g = 1; b = -(wl - 510) / 20; }
		else if (wl >= 510 && wl < 580) { r = (wl - 510) / 70; g = 1; }
		else if (wl >= 580 && wl < 645) { r = 1; g = -(wl - 645) / 65; }
		else if (wl >= 645 && wl <= 780) { r = 1; }
		let f = 1;
		if (wl >= 380 && wl < 420) f = 0.3 + 0.7 * (wl - 380) / 40;
		else if (wl >= 700 && wl <= 780) f = 0.3 + 0.7 * (780 - wl) / 80;
		return `rgb(${Math.round(255 * r * f)},${Math.round(255 * g * f)},${Math.round(255 * b * f)})`;
	}
</script>

{#if element}
	{@const color = getCategoryColor(element.category)}
	<div class="overlay" style:--accent={color}>
		<!-- Left nav strip -->
		<nav class="nav-strip">
			<div class="nav-header">
				<div class="nav-row-top">
					<span class="nav-symbol" style:color={color}>{element.symbol}</span>
					<span class="nav-name">{element.name}</span>
				</div>
				<div class="nav-row-bottom">
					<span class="nav-atomic-number">#{element.number}</span>
					<span class="nav-atomic-mass">{formatMass(element.atomic_mass)}</span>
				</div>
			</div>

			<div class="mini-map-nav">
				<div class="mini-map">
					{#each elements as el (el.number)}
						<div
							class="mini-cell"
							class:selected={el.number === element.number}
							style:grid-column={el.xpos}
							style:grid-row={el.ypos}
							style:background={getCategoryColor(el.category)}
						></div>
					{/each}
					<div class="mini-map-info">
						<div class="mini-info-row">
							<span class="mini-info-symbol" style:color={color}>{element.symbol}</span>
							<span class="mini-info-name">{element.name}</span>
						</div>
						<div class="mini-info-row">
							<span class="mini-info-number">#{element.number}</span>
							<span class="mini-info-mass">{formatMass(element.atomic_mass)} u</span>
						</div>
					</div>
				</div>
				<button class="chevron chevron-up" onclick={() => navigate(0, -1)} aria-label="Navigate up">
					<svg viewBox="0 0 16 16" width="18" height="18"><polyline points="2,10 8,4 14,10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</button>
				<button class="chevron chevron-down" onclick={() => navigate(0, 1)} aria-label="Navigate down">
					<svg viewBox="0 0 16 16" width="18" height="18"><polyline points="2,6 8,12 14,6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</button>
				<button class="chevron chevron-left" onclick={() => navigate(-1, 0)} aria-label="Navigate left">
					<svg viewBox="0 0 16 16" width="18" height="18"><polyline points="10,2 4,8 10,14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</button>
				<button class="chevron chevron-right" onclick={() => navigate(1, 0)} aria-label="Navigate right">
					<svg viewBox="0 0 16 16" width="18" height="18"><polyline points="6,2 12,8 6,14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</button>
			</div>

			<div class="tabs">
				<button
					class="tab-btn"
					class:active={activeTab === 'general'}
					onclick={() => (activeTab = 'general')}
				>
					General
				</button>
				<button
					class="tab-btn"
					class:active={activeTab === 'details'}
					onclick={() => (activeTab = 'details')}
				>
					Details
				</button>
			</div>
		</nav>

		<!-- Content area -->
		<div class="content">
			{#if activeTab === 'general'}
				<div class="particle-row">
					<div class="particle"><span class="particle-count">{element.number}</span><span class="particle-label">Protons</span></div>
					<div class="particle"><span class="particle-count">{element.number}</span><span class="particle-label">Electrons</span></div>
					<div class="particle"><span class="particle-count">{Math.round(element.atomic_mass) - element.number}</span><span class="particle-label">Neutrons</span></div>
				</div>

				<div class="info-row">
					<span class="info-label">Type</span>
					<span class="info-value">{categoryLabels[element.category]}</span>
				</div>

				<div class="info-row">
					<span class="info-label">Group / Period</span>
					<span class="info-value">{element.xpos} / {element.ypos <= 7 ? element.ypos : element.ypos === 9 ? 6 : 7}</span>
				</div>

				<div class="info-row">
					<span class="info-label">Atomic Mass</span>
					<span class="info-value">{formatMass(element.atomic_mass)} u</span>
				</div>

				<div class="info-row">
					<span class="info-label">Phase (STP)</span>
					<span class="info-value">{element.phase}</span>
				</div>

				{#if element.appearance}
					<div class="info-row">
						<span class="info-label">Appearance</span>
						<span class="info-value">{element.appearance}</span>
					</div>
				{/if}

				<div class="section">
					<h3>Summary</h3>
					<p class="summary">{element.summary}</p>
				</div>

				{#if element.discovered_by || element.year_discovered}
					<div class="info-row">
						<span class="info-label">Discovered by</span>
						<span class="info-value">{element.discovered_by ?? '—'}</span>
					</div>
				{/if}

				{#if element.year_discovered}
					<div class="info-row">
						<span class="info-label">Year</span>
						<span class="info-value">{element.year_discovered}</span>
					</div>
				{/if}

			{:else}
				<div class="section">
					<h3>Physical Properties</h3>
					<div class="prop-grid">
						<div class="prop">
							<span class="prop-label">Block</span>
							<span class="prop-value">{element.block}</span>
						</div>
						<div class="prop">
							<span class="prop-label">Density</span>
							<span class="prop-value">
								{element.density != null ? `${element.density} g/cm³` : '—'}
							</span>
						</div>
						<div class="prop">
							<span class="prop-label">Melting Point</span>
							<span class="prop-value">
								{element.melt != null ? `${element.melt} K` : '—'}
							</span>
						</div>
						<div class="prop">
							<span class="prop-label">Boiling Point</span>
							<span class="prop-value">
								{element.boil != null ? `${element.boil} K` : '—'}
							</span>
						</div>
						<div class="prop">
							<span class="prop-label">Phase ({temperature} K)</span>
							<span class="prop-value">{phase}</span>
						</div>
						<div class="prop">
							<span class="prop-label">Molar Heat</span>
							<span class="prop-value">
								{element.molar_heat != null ? `${element.molar_heat} J/(mol·K)` : '—'}
							</span>
						</div>
					</div>
				</div>

				<hr class="divider" />

				<div class="section">
					<h3>Atomic Properties</h3>
					<div class="prop-grid">
						<div class="prop">
							<span class="prop-label">Electronegativity</span>
							<span class="prop-value">
								{element.electronegativity_pauling != null ? element.electronegativity_pauling : '—'}
							</span>
						</div>
						<div class="prop">
							<span class="prop-label">Electron Affinity</span>
							<span class="prop-value">
								{element.electron_affinity != null ? `${element.electron_affinity} kJ/mol` : '—'}
							</span>
						</div>
						<div class="prop">
							<span class="prop-label">1st Ionization Energy</span>
							<span class="prop-value">
								{element.ionization_energies?.length ? `${element.ionization_energies[0]} kJ/mol` : '—'}
							</span>
						</div>
					</div>
				</div>

				<hr class="divider" />

				<div class="section">
					<h3>Electron Configuration</h3>
					<p class="mono">{element.electron_configuration_semantic}</p>
					<p class="mono small">{element.electron_configuration}</p>

					<!-- Animated Bohr model diagram -->
					<div class="bohr-diagram">
						<svg viewBox="-110 -110 220 220" class="bohr-svg">
							<!-- Nucleus -->
							<circle cx="0" cy="0" r="8" fill={color} opacity="0.8" />
							<text x="0" y="0" text-anchor="middle" dominant-baseline="central" fill="white" font-size="6" font-weight="700">{element.symbol}</text>

							<!-- Shells and electrons -->
							{#each element.shells as count, i}
								{@const radius = 20 + i * (85 / element.shells.length)}
								{@const duration = 8 + i * 4}
								{@const direction = i % 2 === 0 ? 1 : -1}

								<!-- Shell orbit ring -->
								<circle cx="0" cy="0" r={radius} fill="none" stroke="var(--text-secondary)" stroke-width="1" opacity="0.7" />

								<!-- Electrons on this shell -->
								<g class="electron-orbit" style:animation-duration="{duration}s" style:animation-direction={direction < 0 ? 'reverse' : 'normal'}>
									{#each Array(count) as _, j}
										{@const angle = (j / count) * 360}
										<circle
											cx={radius * Math.cos(angle * Math.PI / 180)}
											cy={radius * Math.sin(angle * Math.PI / 180)}
											r="3"
											fill="#00b4d8"
											opacity="0.9"
										/>
									{/each}
								</g>
							{/each}
						</svg>
					</div>

					<div class="shells">
						{#each element.shells as count}
							<span class="shell">{count}</span>
						{/each}
					</div>
				</div>

				{#if element.ionization_energies && element.ionization_energies.length > 1}
					<hr class="divider" />

					<div class="section">
						<h3>Ionization Energies (kJ/mol)</h3>
						<div class="ionization-list">
							{#each element.ionization_energies as energy, i}
								<span class="ionization-item">{i + 1}st: {energy}</span>
							{/each}
						</div>
					</div>
				{/if}

				{#if element.radius_van_der_waals != null || element.radius_covalent != null}
					{@const vdw = element.radius_van_der_waals ?? 0}
					{@const cov = element.radius_covalent ?? 0}
					{@const maxR = Math.max(vdw, cov, 1)}
					<hr class="divider" />

					<div class="section">
						<h3>Atomic Radius</h3>
						<div class="radius-diagram">
							<svg viewBox="0 0 200 200" class="radius-svg">
								{#if element.radius_van_der_waals != null}
									<circle cx="100" cy="100" r={85 * vdw / maxR} fill="none" stroke="var(--text-secondary)" stroke-width="1" stroke-dasharray="4 2" opacity="0.5" />
								{/if}
								{#if element.radius_covalent != null}
									<circle cx="100" cy="100" r={85 * cov / maxR} fill="var(--accent)" fill-opacity="0.12" stroke="var(--accent)" stroke-width="1.5" />
								{/if}
								<circle cx="100" cy="100" r="3" fill="var(--text-primary)" />
							</svg>
							<div class="radius-legend">
								{#if element.radius_van_der_waals != null}
									<div class="radius-legend-item">
										<span class="radius-dot vdw"></span>
										<span class="radius-legend-label">Van der Waals</span>
										<span class="radius-legend-value">{element.radius_van_der_waals} pm</span>
									</div>
								{/if}
								{#if element.radius_covalent != null}
									<div class="radius-legend-item">
										<span class="radius-dot cov"></span>
										<span class="radius-legend-label">Covalent</span>
										<span class="radius-legend-value">{element.radius_covalent} pm</span>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/if}

				{#if element.spectral_lines && element.spectral_lines.length > 0}
					<hr class="divider" />

					<div class="section">
						<h3>Emission Spectrum</h3>
						<div class="spectrum-container">
							<div class="spectrum-bar">
								{#each element.spectral_lines as wl}
									{@const pct = ((wl - 380) / (780 - 380)) * 100}
									{#if pct >= 0 && pct <= 100}
										<div
											class="spectrum-line"
											style:left="{pct}%"
											style:background={wavelengthToColor(wl)}
										></div>
									{/if}
								{/each}
							</div>
							<div class="spectrum-scale">
								<span>380</span>
								<span>480</span>
								<span>580</span>
								<span>680</span>
								<span>780 nm</span>
							</div>
						</div>
					</div>
				{/if}

				{/if}
		</div>
	</div>

	<div class="detail-close-bar">
		<button class="detail-close-btn" onclick={onclose}>Close</button>
	</div>
{/if}

<style>
	/* ── Full-screen overlay ── */
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 60;
		display: flex;
		background: var(--bg-surface);
	}

	.divider {
		border: none;
		border-top: 1px solid var(--border-color);
		margin: 1.25rem 0;
	}

	/* ── Left nav strip ── */
	.nav-strip {
		width: 200px;
		flex-shrink: 0;
		border-right: 1px solid var(--border-color);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.nav-header {
		padding: 0.75rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		border-bottom: 1px solid var(--border-color);
	}

	.nav-row-top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
	}

	.nav-row-bottom {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
	}

	.nav-symbol {
		font-size: 1.8rem;
		font-weight: 800;
		line-height: 1;
	}

	.nav-name {
		font-size: 1.15rem;
		font-weight: 600;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.nav-atomic-number {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.nav-atomic-mass {
		font-size: 0.85rem;
		color: var(--text-secondary);
		opacity: 0.7;
	}

	/* Mini-map navigation */
	.mini-map-nav {
		position: relative;
		border-bottom: 1px solid var(--border-color);
		padding: 0.5rem;
	}

	.chevron {
		position: absolute;
		background: none;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.4;
		transition: opacity 0.15s, color 0.15s;
		z-index: 3;
		-webkit-tap-highlight-color: transparent;
	}

	.chevron:hover {
		opacity: 1;
		color: var(--text-primary);
	}

	.chevron-up {
		top: 0;
		left: 20%;
		right: 20%;
		height: 30%;
		border-radius: 0 0 4px 4px;
	}

	.chevron-down {
		bottom: 0;
		left: 20%;
		right: 20%;
		height: 30%;
		border-radius: 4px 4px 0 0;
	}

	.chevron-left {
		left: 0;
		top: 20%;
		bottom: 20%;
		width: 20%;
		border-radius: 0 4px 4px 0;
	}

	.chevron-right {
		right: 0;
		top: 20%;
		bottom: 20%;
		width: 20%;
		border-radius: 4px 0 0 4px;
	}

	/* Mini-map */
	.mini-map {
		display: grid;
		grid-template-columns: repeat(18, 1fr);
		grid-template-rows: repeat(10, 1fr);
		gap: 1px;
	}

	.mini-cell {
		aspect-ratio: 1;
		border-radius: 1px;
		opacity: 0.5;
	}

	.mini-cell.selected {
		opacity: 1;
		outline: 2px solid #fff;
		outline-offset: -1px;
		z-index: 1;
	}

	.mini-map-info {
		grid-column: 4 / 16;
		grid-row: 1 / 4;
		display: none;
		flex-direction: column;
		justify-content: center;
		gap: 0.15rem;
		z-index: 2;
		padding: 0.15rem 0.5rem;
	}

	.mini-info-row {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
	}

	.mini-info-symbol {
		font-size: 2.2rem;
		font-weight: 800;
		line-height: 1;
	}

	.mini-info-name {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.mini-info-number {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.mini-info-mass {
		font-size: 0.9rem;
		color: var(--text-secondary);
		opacity: 0.7;
	}

	/* Tabs */
	.tabs {
		display: flex;
		flex-direction: column;
	}

	.tab-btn {
		padding: 0.6rem 1rem;
		background: none;
		border: none;
		border-left: 2px solid transparent;
		color: var(--text-secondary);
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		text-align: left;
		transition: color 0.15s, border-color 0.15s, background 0.15s;
	}

	.tab-btn:hover {
		color: var(--text-primary);
		background: var(--bg-cell);
	}

	.tab-btn.active {
		color: var(--text-primary);
		border-left-color: var(--accent, var(--text-primary));
		background: var(--bg-cell);
	}

	/* ── Content area ── */
	.content {
		flex: 1;
		overflow-y: auto;
		padding: 0 2.5rem 3rem;
		max-width: 640px;
	}

	/* General tab */
	.info-row {
		display: flex;
		justify-content: space-between;
		padding: 0.4rem 0;
		border-bottom: 1px solid var(--border-color);
	}

	.info-label {
		font-size: 0.9rem;
		color: var(--text-secondary);
	}

	.info-value {
		font-size: 0.95rem;
		color: var(--text-primary);
	}

	.particle-row {
		display: flex;
		gap: 1rem;
		margin-top: 1.25rem;
		margin-bottom: 1.25rem;
	}

	.particle {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;
		padding: 0.5rem;
		background: var(--bg-cell);
		border-radius: 6px;
	}

	.particle-count {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.particle-label {
		font-size: 0.65rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Details tab */
	.prop-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.prop {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.prop-label {
		font-size: 0.7rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.prop-value {
		font-size: 1rem;
	}

	.section {
		margin-top: 1.5rem;
	}

	.section:first-child {
		margin-top: 1.5rem;
	}

	h3 {
		margin: 0 0 0.35rem;
		font-size: 0.75rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.mono {
		font-family: 'SF Mono', 'Fira Code', monospace;
		font-size: 0.95rem;
		margin: 0;
		word-break: break-all;
	}

	.small {
		font-size: 0.7rem;
		opacity: 0.6;
		margin-top: 0.25rem;
	}

	.bohr-diagram {
		display: flex;
		justify-content: center;
		padding: 1rem 0;
	}

	.bohr-svg {
		width: 200px;
		height: 200px;
	}

	.electron-orbit {
		transform-origin: 0 0;
		animation-name: orbit;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}

	@keyframes orbit {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	.shells {
		display: flex;
		gap: 0.3rem;
		flex-wrap: wrap;
	}

	.shell {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 50%;
		border: 1px solid var(--border-color);
		font-size: 0.7rem;
		background: var(--bg-cell);
	}

	.summary {
		font-size: 0.9rem;
		line-height: 1.6;
		margin: 0;
	}

	.ionization-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.ionization-item {
		font-size: 0.8rem;
		padding: 0.2rem 0.5rem;
		background: var(--bg-cell);
		border-radius: 4px;
		color: var(--text-secondary);
	}

	.discovery p {
		margin: 0.2rem 0;
		font-size: 0.9rem;
	}

	/* Atomic Radius diagram */
	.radius-diagram {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.radius-svg {
		width: 140px;
		height: 140px;
		flex-shrink: 0;
	}

	.radius-legend {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.radius-legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.radius-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.radius-dot.vdw {
		border: 1.5px dashed var(--text-secondary);
		opacity: 0.6;
	}

	.radius-dot.cov {
		background: var(--accent, var(--text-primary));
		opacity: 0.3;
		border: 1.5px solid var(--accent, var(--text-primary));
	}

	.radius-legend-label {
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	.radius-legend-value {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-left: auto;
	}

	/* Emission Spectrum */
	.spectrum-container {
		margin-top: 0.5rem;
	}

	.spectrum-bar {
		position: relative;
		height: 40px;
		background: linear-gradient(
			to right,
			#0a000a,
			#0e0018 5%,
			#000028 15%,
			#001828 25%,
			#002820 32%,
			#003800 38%,
			#284000 48%,
			#555500 52%,
			#552800 62%,
			#550a00 75%,
			#150000 95%,
			#0a0000
		);
		border-radius: 4px;
		overflow: hidden;
	}

	.spectrum-line {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
		box-shadow: 0 0 6px currentColor, 0 0 2px currentColor;
	}

	.spectrum-scale {
		display: flex;
		justify-content: space-between;
		font-size: 0.65rem;
		color: var(--text-secondary);
		margin-top: 0.25rem;
		padding: 0 2px;
	}

	/* ── Close bar ── */
	.detail-close-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 200px;
		z-index: 65;
		padding: 0.75rem;
		background: var(--bg-surface);
		border-top: 1px solid var(--border-color);
	}

	.detail-close-btn {
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

	.detail-close-btn:hover {
		background: var(--border-color);
		color: var(--text-primary);
	}

	/* ── Vertical / portrait layout ── */
	@media (orientation: portrait) {
		.overlay {
			flex-direction: column;
		}

		.nav-strip {
			width: 100%;
			flex-shrink: 0;
			border-right: none;
			border-bottom: none;
			flex-direction: column;
			overflow: hidden;
		}

		.nav-header {
			display: none;
		}

		.mini-map-nav {
			padding: 0.75rem 1rem;
		}

		.mini-map-info {
			display: flex;
		}

		.tabs {
			flex-direction: row;
			border-top: 1px solid var(--border-color);
			border-bottom: 1px solid var(--border-color);
		}

		.tab-btn {
			flex: 1;
			border-left: none;
			border-bottom: 2px solid transparent;
			padding: 0.5rem 0.75rem;
			text-align: center;
		}

		.tab-btn.active {
			border-left-color: transparent;
			border-bottom-color: var(--accent, var(--text-primary));
		}

		.particle-row {
			margin-top: 0.25rem;
		}

		.content {
			padding: 1.25rem 1rem;
			padding-bottom: 6rem;
			max-width: none;
		}

		.section:first-child {
			margin-top: 0.25rem;
		}

		.detail-close-bar {
			width: 100%;
		}
	}
</style>
