<script lang="ts">
	import { locale, setLocale, supportedLocales } from '$lib/i18n';

	let isOpen = $state(false);

	const currentLocale = $derived(supportedLocales.find((l) => l.code === $locale) || supportedLocales[0]);

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function selectLocale(code: string) {
		setLocale(code);
		isOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.language-switcher')) {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="language-switcher">
	<button class="switcher-button" onclick={toggleDropdown} aria-label="Select language">
		<span class="flag">{currentLocale.flag}</span>
		<span class="code">{currentLocale.code.toUpperCase()}</span>
		<svg class="chevron" class:open={isOpen} width="12" height="12" viewBox="0 0 12 12" fill="none">
			<path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
	</button>

	{#if isOpen}
		<div class="dropdown">
			{#each supportedLocales as loc}
				<button
					class="dropdown-item"
					class:active={loc.code === $locale}
					onclick={() => selectLocale(loc.code)}
				>
					<span class="flag">{loc.flag}</span>
					<span class="name">{loc.name}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.language-switcher {
		position: relative;
		z-index: 200;
	}

	.switcher-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: rgba(26, 26, 34, 0.8);
		border: 1px solid #27272a;
		border-radius: 6px;
		color: #a1a1aa;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		cursor: pointer;
		transition: all 0.2s;
	}

	.switcher-button:hover {
		background: rgba(39, 39, 42, 0.9);
		border-color: #3f3f46;
		color: #ffffff;
	}

	.flag {
		font-size: 1rem;
		line-height: 1;
	}

	.code {
		font-family: 'Inter', sans-serif;
	}

	.chevron {
		transition: transform 0.2s;
		color: #52525b;
	}

	.chevron.open {
		transform: rotate(180deg);
	}

	.dropdown {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		min-width: 160px;
		background: rgba(10, 10, 13, 0.98);
		border: 1px solid #27272a;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(8px);
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.75rem 1rem;
		background: transparent;
		border: none;
		color: #a1a1aa;
		font-size: 0.85rem;
		font-weight: 500;
		text-align: left;
		cursor: pointer;
		transition: all 0.15s;
	}

	.dropdown-item:hover {
		background: rgba(28, 113, 216, 0.1);
		color: #ffffff;
	}

	.dropdown-item.active {
		background: rgba(28, 113, 216, 0.15);
		color: #1c71d8;
	}

	.dropdown-item .name {
		font-family: 'Inter', sans-serif;
	}

	@media (max-width: 768px) {
		.switcher-button {
			padding: 0.4rem 0.6rem;
		}

		.code {
			display: none;
		}

		.dropdown {
			right: 0;
			min-width: 140px;
		}
	}
</style>
