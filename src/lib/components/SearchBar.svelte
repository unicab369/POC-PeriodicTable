<script lang="ts">
	interface Props {
		value: string;
		oninput: (value: string) => void;
	}

	let { value, oninput }: Props = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		oninput(target.value);
	}

	function clear() {
		oninput('');
	}
</script>

<div class="search-bar">
	<svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
		<circle cx="11" cy="11" r="8" />
		<line x1="21" y1="21" x2="16.65" y2="16.65" />
	</svg>
	<input
		type="text"
		placeholder="Search elements..."
		{value}
		oninput={handleInput}
		aria-label="Search elements"
	/>
	{#if value}
		<button class="clear-btn" onclick={clear} aria-label="Clear search">
			&times;
		</button>
	{/if}
</div>

<style>
	.search-bar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--bg-cell);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 0.4rem 0.75rem;
		max-width: 280px;
	}

	.search-icon {
		opacity: 0.5;
		flex-shrink: 0;
	}

	input {
		flex: 1;
		background: none;
		border: none;
		color: var(--text-primary);
		font-size: 0.9rem;
		outline: none;
		min-width: 0;
	}

	input::placeholder {
		color: var(--text-secondary);
	}

	.clear-btn {
		background: none;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 1.2rem;
		padding: 0 0.25rem;
		line-height: 1;
	}

	.clear-btn:hover {
		color: var(--text-primary);
	}
</style>
