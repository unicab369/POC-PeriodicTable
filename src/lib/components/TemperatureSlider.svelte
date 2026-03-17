<script lang="ts">
	import { kelvinToCelsius } from '../utils/element-helpers';

	interface Props {
		temperature: number;
		onchange: (value: number) => void;
	}

	let { temperature, onchange }: Props = $props();

	let celsius = $derived(kelvinToCelsius(temperature));

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		onchange(Number(target.value));
	}
</script>

<div class="temperature-slider">
	<label for="temp-slider">Temperature</label>
	<input
		id="temp-slider"
		type="range"
		min="0"
		max="6000"
		step="10"
		value={temperature}
		oninput={handleInput}
	/>
	<div class="temp-display">
		<span class="temp-value">{temperature} K</span>
		<span class="temp-celsius">({celsius} °C)</span>
	</div>
</div>

<style>
	.temperature-slider {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	label {
		font-size: 0.85rem;
		color: var(--text-secondary);
		white-space: nowrap;
	}

	input[type='range'] {
		flex: 1;
		min-width: 120px;
		max-width: 240px;
		accent-color: #6eb5ff;
		cursor: pointer;
	}

	.temp-display {
		display: flex;
		gap: 0.35rem;
		align-items: baseline;
		white-space: nowrap;
	}

	.temp-value {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.temp-celsius {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}
</style>
