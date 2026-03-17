<script lang="ts">
	import type { Element, Phase } from '../types/element';
	import { getCategoryColor, categoryLabels } from '../utils/categories';

	interface Props {
		element: Element | null;
		phase: Phase;
		temperature: number;
		onclose: () => void;
	}

	let { element, phase, temperature, onclose }: Props = $props();

	let dialog: HTMLDialogElement | undefined = $state();

	$effect(() => {
		if (element && dialog && !dialog.open) {
			dialog.showModal();
		} else if (!element && dialog?.open) {
			dialog.close();
		}
	});

	function handleClose() {
		onclose();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === dialog) {
			onclose();
		}
	}

	function formatMass(mass: number): string {
		return mass < 10 ? mass.toFixed(4) : mass.toFixed(3);
	}
</script>

{#if element}
	{@const color = getCategoryColor(element.category)}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<dialog
		bind:this={dialog}
		onclose={handleClose}
		onclick={handleBackdropClick}
		aria-label="Element details for {element.name}"
	>
		<div class="detail-content" style:--accent={color}>
			<header>
				<div class="header-top">
					<span class="atomic-number">#{element.number}</span>
					<button class="close-btn" onclick={onclose} aria-label="Close">&times;</button>
				</div>
				<div class="symbol-row">
					<span class="big-symbol">{element.symbol}</span>
					<div class="name-block">
						<h2>{element.name}</h2>
						<span class="category-badge" style:background={color}>
							{categoryLabels[element.category]}
						</span>
					</div>
				</div>
				<p class="mass">{formatMass(element.atomic_mass)} u</p>
			</header>

			<div class="properties">
				<div class="prop-grid">
					<div class="prop">
						<span class="prop-label">Block</span>
						<span class="prop-value">{element.block}</span>
					</div>
					<div class="prop">
						<span class="prop-label">Phase (STP)</span>
						<span class="prop-value">{element.phase}</span>
					</div>
					<div class="prop">
						<span class="prop-label">Phase ({temperature} K)</span>
						<span class="prop-value">{phase}</span>
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
				</div>

				<div class="section">
					<h3>Electron Configuration</h3>
					<p class="mono">{element.electron_configuration_semantic}</p>
					<p class="mono small">{element.electron_configuration}</p>
				</div>

				<div class="section">
					<h3>Electron Shells</h3>
					<div class="shells">
						{#each element.shells as count, i}
							<span class="shell">{count}</span>
						{/each}
					</div>
				</div>

				{#if element.appearance}
					<div class="section">
						<h3>Appearance</h3>
						<p>{element.appearance}</p>
					</div>
				{/if}

				<div class="section">
					<h3>Summary</h3>
					<p class="summary">{element.summary}</p>
				</div>

				<div class="section discovery">
					{#if element.discovered_by}
						<p><strong>Discovered by:</strong> {element.discovered_by}</p>
					{/if}
					{#if element.named_by}
						<p><strong>Named by:</strong> {element.named_by}</p>
					{/if}
					{#if element.year_discovered}
						<p><strong>Year:</strong> {element.year_discovered}</p>
					{/if}
				</div>
			</div>
		</div>
	</dialog>
{/if}

<style>
	dialog {
		background: var(--bg-surface);
		color: var(--text-primary);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		padding: 0;
		max-width: 480px;
		width: 90vw;
		max-height: 85vh;
		overflow-y: auto;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.6);
	}

	.detail-content {
		padding: 1.5rem;
	}

	header {
		border-bottom: 2px solid var(--accent);
		padding-bottom: 1rem;
		margin-bottom: 1rem;
	}

	.header-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.atomic-number {
		font-size: 0.9rem;
		opacity: 0.6;
	}

	.close-btn {
		background: none;
		border: none;
		color: var(--text-secondary);
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0 0.25rem;
		line-height: 1;
	}

	.close-btn:hover {
		color: var(--text-primary);
	}

	.symbol-row {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 0.25rem;
	}

	.big-symbol {
		font-size: 3rem;
		font-weight: 800;
		color: var(--accent);
		line-height: 1;
	}

	.name-block {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	h2 {
		margin: 0;
		font-size: 1.4rem;
		font-weight: 600;
	}

	.category-badge {
		display: inline-block;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
		font-size: 0.7rem;
		color: #000;
		font-weight: 600;
		width: fit-content;
	}

	.mass {
		margin: 0.5rem 0 0;
		font-size: 1.1rem;
		opacity: 0.8;
	}

	.prop-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
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
		font-size: 0.95rem;
	}

	.section {
		margin-top: 1rem;
	}

	h3 {
		margin: 0 0 0.35rem;
		font-size: 0.8rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.mono {
		font-family: 'SF Mono', 'Fira Code', monospace;
		font-size: 0.9rem;
		margin: 0;
	}

	.small {
		font-size: 0.75rem;
		opacity: 0.6;
		margin-top: 0.25rem;
	}

	.shells {
		display: flex;
		gap: 0.35rem;
	}

	.shell {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.8rem;
		height: 1.8rem;
		border-radius: 50%;
		border: 1px solid var(--border-color);
		font-size: 0.8rem;
		background: var(--bg-cell);
	}

	.summary {
		font-size: 0.85rem;
		line-height: 1.5;
		margin: 0;
	}

	.discovery p {
		margin: 0.2rem 0;
		font-size: 0.85rem;
	}
</style>
