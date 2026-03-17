<script lang="ts">
	interface Props {
		label: string;
		unit: string;
		minValue: number;
		maxValue: number;
	}

	let { label, unit, minValue, maxValue }: Props = $props();

	function formatValue(v: number): string {
		if (Math.abs(v) >= 1000) return v.toFixed(0);
		if (Math.abs(v) >= 100) return v.toFixed(1);
		if (Math.abs(v) >= 1) return v.toFixed(2);
		return v.toPrecision(3);
	}
</script>

<div class="heatmap-legend">
	<div class="legend-title">{label}{unit ? ` (${unit})` : ''}</div>
	<div class="fill-row">
		<div class="fill-sample">
			<div class="fill-sample-bar" style:height="30%"></div>
		</div>
		<span class="range-label">{formatValue(minValue)}</span>
		<span class="range-sep">—</span>
		<div class="fill-sample">
			<div class="fill-sample-bar" style:height="100%"></div>
		</div>
		<span class="range-label">{formatValue(maxValue)}</span>
	</div>
	<div class="no-data-row">
		<span class="no-data-swatch"></span>
		<span class="no-data-label">No data</span>
	</div>
</div>

<style>
	.heatmap-legend {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
	}

	.legend-title {
		font-size: 0.8em;
		color: var(--text-primary);
		font-weight: 600;
	}

	.fill-row {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.fill-sample {
		width: 16px;
		height: 20px;
		background: var(--bg-cell, #1a1a2e);
		border-radius: 2px;
		position: relative;
		overflow: hidden;
		border: 1px solid var(--border-color);
	}

	.fill-sample-bar {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--text-secondary);
		opacity: 0.6;
	}

	.range-label {
		font-size: 0.7em;
		color: var(--text-secondary);
		white-space: nowrap;
	}

	.range-sep {
		font-size: 0.7em;
		color: var(--text-secondary);
		opacity: 0.4;
	}

	.no-data-row {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.no-data-swatch {
		display: inline-block;
		width: 12px;
		height: 12px;
		border-radius: 2px;
		background: #6b7280;
		opacity: 0.4;
	}

	.no-data-label {
		font-size: 0.7em;
		color: var(--text-secondary);
	}
</style>
