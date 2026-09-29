<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
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
		<div class="dropdown" transition:fly={{ y: -8, duration: 280, easing: cubicOut }}>
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
		background: rgba(17, 26, 46, 0.7);
		border: 1px solid var(--line-strong);
		border-radius: 2px;
		color: var(--muted);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		cursor: pointer;
		transition: all 0.2s;
	}

	.switcher-button:hover {
		background: rgba(26, 38, 64, 0.9);
		border-color: rgba(255, 255, 255, 0.2);
		color: var(--ink);
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
		color: var(--dim);
	}

	.chevron.open {
		transform: rotate(180deg);
	}

	.dropdown {
		position: absolute;
		top: calc(100% + 0.5rem);
		inset-inline-end: 0;
		min-width: 160px;
		background: rgba(14, 23, 40, 0.96);
		border: 1px solid var(--line-strong);
		border-radius: 2px;
		overflow: hidden;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.75rem 1rem;
		background: transparent;
		border: none;
		color: var(--muted);
		font-size: 0.85rem;
		font-weight: 500;
		text-align: start;
		cursor: pointer;
		transition: all 0.15s;
	}

	.dropdown-item:hover {
		background: rgba(201, 164, 92, 0.1);
		color: var(--ink);
	}

	.dropdown-item.active {
		background: rgba(201, 164, 92, 0.15);
		color: var(--gold-light);
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
			inset-inline-end: 0;
			min-width: 140px;
		}
	}
</style>
