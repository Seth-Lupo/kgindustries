<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/i18n';
	import { _, isLoading } from 'svelte-i18n';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import RfqPanel from '$lib/components/RfqPanel.svelte';
	import { rfqOpen, RFQ_EMAIL, LINKEDIN_URL } from '$lib/stores/rfq';
	import { base } from '$app/paths';
	import { page } from '$app/state';

	let { children } = $props();
	let mobileMenuOpen = $state(false);
	let scrolled = $state(false);
	let hidden = $state(false);

	const navLinks = [
		{ href: '/', key: 'nav.overview' },
		{ href: '/products/', key: 'nav.products' },
		{ href: '/how-it-works', key: 'nav.howItWorks' },
		{ href: '/#contact', key: 'nav.contact' }
	];

	const path = $derived(page.url.pathname.replace(base, '') || '/');
	// Products stays highlighted on the buyer-type pages under it.
	const isActive = (href: string) =>
		!href.includes('#') && (href === '/' ? path === '/' : path.startsWith(href));

	const toggleMenu = () => {
		mobileMenuOpen = !mobileMenuOpen;
		document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
	};

	const closeMenu = () => {
		mobileMenuOpen = false;
		document.body.style.overflow = '';
	};

	onMount(() => {
		let lastScroll = window.scrollY;

		const handleScroll = () => {
			const y = window.scrollY;
			scrolled = y > 24;
			// Hide on scroll down, show on scroll up; ignore tiny jitters.
			if (Math.abs(y - lastScroll) > 6) {
				hidden = y > lastScroll && y > 200 && !mobileMenuOpen;
				lastScroll = y;
			}
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if $isLoading}
	<div class="loading-screen">
		<span class="loading-mark">KG</span>
		<span class="loading-bar"></span>
	</div>
{:else}
	<header class:scrolled class:hidden={hidden && !mobileMenuOpen} class:menu-open={mobileMenuOpen}>
		<a href="{base}/" class="logo" onclick={closeMenu}>
			<span class="logo-kg">KG</span>
			<span class="logo-divider" aria-hidden="true"></span>
			<span class="logo-industries">INDUSTRIES</span>
		</a>
		<nav class="desktop-nav">
			{#each navLinks as link (link.href)}
				<a href="{base}{link.href}" class:active={isActive(link.href)}>{$_(link.key)}</a>
			{/each}
		</nav>
		<div class="header-right">
			<button class="nav-rfq" onclick={() => rfqOpen.set(true)} aria-haspopup="dialog">
				{$_('nav.rfq')}
			</button>
			<LanguageSwitcher />
			<button
				class="hamburger"
				class:open={mobileMenuOpen}
				onclick={toggleMenu}
				aria-label="Toggle menu"
				aria-expanded={mobileMenuOpen}
			>
				<span class="hamburger-line"></span>
				<span class="hamburger-line"></span>
			</button>
		</div>
	</header>

	<div class="mobile-menu" class:open={mobileMenuOpen}>
		<nav class="mobile-nav">
			{#each navLinks as link, i (link.href)}
				<a
					href="{base}{link.href}"
					onclick={closeMenu}
					class:active={isActive(link.href)}
					style="--i: {i}"
				>
					<span class="mobile-num">{String(i + 1).padStart(2, '0')}</span>
					{$_(link.key)}
				</a>
			{/each}
		</nav>
		<div class="mobile-foot" style="--i: {navLinks.length}">
			<button
				class="btn-gold"
				onclick={() => {
					closeMenu();
					rfqOpen.set(true);
				}}
			>
				{$_('nav.rfq')}
			</button>
			<a href="mailto:{RFQ_EMAIL}">{RFQ_EMAIL}</a>
		</div>
	</div>

	{#key path}
		<div class="page" in:fade={{ duration: 550, easing: cubicOut }}>
			{@render children()}
		</div>
	{/key}

	<footer class="site-footer">
		<div class="footer-glow" aria-hidden="true"></div>
		<div class="footer-inner">
			<div class="footer-brand">
				<a href="{base}/" class="logo">
					<span class="logo-kg">KG</span>
					<span class="logo-divider" aria-hidden="true"></span>
					<span class="logo-industries">INDUSTRIES</span>
				</a>
				<p class="footer-company">KG Industries LLC · {$_('footer.location')}</p>
			</div>
			<nav class="footer-nav">
				{#each navLinks as link (link.href)}
					<a href="{base}{link.href}">{$_(link.key)}</a>
				{/each}
			</nav>
			<div class="footer-contact">
				<a href="mailto:{RFQ_EMAIL}">{RFQ_EMAIL}</a>
				<a href={LINKEDIN_URL} target="_blank" rel="noopener">LinkedIn ↗</a>
			</div>
		</div>
		<div class="footer-bottom">
			<p class="footer-disclaimer">{$_('footer.disclaimer')}</p>
			<span class="footer-copy">© 2026 KG Industries LLC</span>
		</div>
	</footer>

	<RfqPanel />
{/if}

<style>
	.loading-screen {
		position: fixed;
		inset: 0;
		background: var(--navy-900);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.25rem;
		z-index: 1000;
	}

	.loading-mark {
		font-family: 'Cormorant Garamond', serif;
		font-size: 3rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		color: var(--gold);
		animation: breathe 1.6s var(--ease-in-out) infinite alternate;
	}

	.loading-bar {
		width: 72px;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--gold), transparent);
		background-size: 200% 100%;
		animation: sweep 1.4s linear infinite;
	}

	@keyframes breathe {
		from {
			opacity: 0.45;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes sweep {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}

	/* ---------- Header ---------- */

	header {
		position: fixed;
		inset: 0 0 auto 0;
		z-index: 100;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1.5rem;
		height: var(--header-h);
		padding: 0 var(--gutter);
		border-bottom: 1px solid transparent;
		transition:
			transform 0.5s var(--ease-out),
			background-color 0.5s var(--ease-out),
			border-color 0.5s var(--ease-out),
			height 0.5s var(--ease-out),
			backdrop-filter 0.5s var(--ease-out);
	}

	header.scrolled {
		height: 68px;
		background: rgba(9, 15, 28, 0.78);
		backdrop-filter: blur(18px) saturate(140%);
		-webkit-backdrop-filter: blur(18px) saturate(140%);
		border-bottom-color: var(--gold-line);
	}

	header.menu-open {
		z-index: 170;
		background: transparent;
		border-bottom-color: transparent;
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
	}

	header.hidden {
		transform: translateY(-100%);
	}

	.logo {
		display: inline-flex;
		align-items: center;
		gap: 0.85rem;
		text-decoration: none;
		line-height: 1;
		position: relative;
		z-index: 101;
	}

	.logo-kg {
		font-family: 'Cormorant Garamond', serif;
		font-size: 2rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--ink);
		transition: color 0.3s;
	}

	.logo-divider {
		width: 1px;
		height: 1.6rem;
		background: linear-gradient(to bottom, transparent, var(--gold), transparent);
	}

	.logo-industries {
		font-family: 'Inter', sans-serif;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.42em;
		color: var(--gold);
	}

	.logo:hover .logo-kg {
		color: var(--gold-light);
	}

	.desktop-nav {
		display: flex;
		gap: clamp(1.5rem, 3vw, 3rem);
	}

	.desktop-nav a {
		position: relative;
		padding: 0.5rem 0;
		color: var(--muted);
		text-decoration: none;
		font-size: 0.72rem;
		letter-spacing: 0.2em;
		font-weight: 600;
		white-space: nowrap;
		transition: color 0.3s;
	}

	.desktop-nav a::after {
		content: '';
		position: absolute;
		inset-inline: 0;
		bottom: 0;
		height: 1px;
		background: var(--gold);
		transform: scaleX(0);
		transition: transform 0.45s var(--ease-out);
	}

	.desktop-nav a:hover,
	.desktop-nav a.active {
		color: var(--ink);
	}

	.desktop-nav a:hover::after,
	.desktop-nav a.active::after {
		transform: scaleX(1);
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 1rem;
		position: relative;
		z-index: 101;
	}

	.nav-rfq {
		padding: 0.7rem 1.25rem;
		background: transparent;
		border: 1px solid var(--gold);
		color: var(--gold-light);
		font-family: inherit;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.18em;
		white-space: nowrap;
		cursor: pointer;
		transition:
			background-color 0.35s var(--ease-out),
			color 0.35s var(--ease-out),
			box-shadow 0.35s var(--ease-out);
	}

	.nav-rfq:hover {
		background: var(--gold);
		color: var(--navy-950);
		box-shadow: 0 8px 26px -10px var(--gold-glow);
	}

	.hamburger {
		display: none;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end;
		gap: 7px;
		width: 40px;
		height: 40px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0 6px;
	}

	.hamburger-line {
		display: block;
		height: 1.5px;
		background: var(--ink);
		transition:
			transform 0.45s var(--ease-out),
			width 0.45s var(--ease-out);
	}

	.hamburger-line:nth-child(1) {
		width: 26px;
	}

	.hamburger-line:nth-child(2) {
		width: 17px;
		background: var(--gold);
	}

	.hamburger.open .hamburger-line {
		width: 24px;
	}

	.hamburger.open .hamburger-line:nth-child(1) {
		transform: translateY(4.25px) rotate(45deg);
	}

	.hamburger.open .hamburger-line:nth-child(2) {
		transform: translateY(-4.25px) rotate(-45deg);
	}

	/* ---------- Mobile menu ---------- */

	.mobile-menu {
		position: fixed;
		inset: 0;
		z-index: 160;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: calc(var(--header-h) + 1rem) var(--gutter) 2.5rem;
		background:
			radial-gradient(ellipse at 80% 0%, rgba(201, 164, 92, 0.12), transparent 55%),
			var(--navy-950);
		clip-path: inset(0 0 100% 0);
		visibility: hidden;
		transition:
			clip-path 0.7s var(--ease-in-out),
			visibility 0s linear 0.7s;
	}

	.mobile-menu.open {
		clip-path: inset(0 0 0 0);
		visibility: visible;
		transition:
			clip-path 0.7s var(--ease-in-out),
			visibility 0s;
	}

	.mobile-nav {
		display: flex;
		flex-direction: column;
	}

	.mobile-nav a,
	.mobile-foot {
		opacity: 0;
		transform: translateY(24px);
		transition:
			opacity 0.6s var(--ease-out),
			transform 0.6s var(--ease-out);
	}

	.mobile-menu.open .mobile-nav a,
	.mobile-menu.open .mobile-foot {
		opacity: 1;
		transform: none;
		transition-delay: calc(0.25s + var(--i) * 0.07s);
	}

	.mobile-nav a {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		padding: 1.1rem 0;
		border-bottom: 1px solid var(--line);
		color: var(--ink);
		text-decoration: none;
		font-family: var(--font-display);
		font-size: clamp(1.9rem, 8vw, 2.6rem);
		font-weight: 600;
		letter-spacing: 0.02em;
		line-height: 1.1;
	}

	.mobile-nav a.active {
		color: var(--gold-light);
	}

	.mobile-num {
		font-family: var(--font-body);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		color: var(--gold);
	}

	.mobile-foot {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		margin-top: 2.5rem;
	}

	.mobile-foot a {
		color: var(--muted);
		text-decoration: none;
		font-size: 0.9rem;
		text-align: center;
	}

	@media (max-width: 1080px) {
		.desktop-nav,
		.nav-rfq {
			display: none;
		}

		.hamburger {
			display: flex;
		}

		header {
			--header-h: 72px;
		}

		.logo-kg {
			font-size: 1.7rem;
		}

		.logo-industries {
			font-size: 0.6rem;
			letter-spacing: 0.34em;
		}
	}

	/* ---------- Footer ---------- */

	.site-footer {
		position: relative;
		overflow: hidden;
		padding: 5rem var(--gutter) 6rem;
		background: var(--navy-950);
		border-top: 1px solid var(--gold-line);
	}

	.footer-glow {
		position: absolute;
		inset: -40% 20% auto;
		height: 300px;
		background: radial-gradient(ellipse at center, rgba(201, 164, 92, 0.1), transparent 70%);
		pointer-events: none;
	}

	.footer-inner {
		position: relative;
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.4fr 1fr 1fr;
		gap: 3rem;
		padding-bottom: 3rem;
		border-bottom: 1px solid var(--line);
	}

	.footer-company {
		margin: 1.25rem 0 0;
		font-size: 0.85rem;
		color: var(--dim);
	}

	.footer-nav,
	.footer-contact {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.footer-nav a,
	.footer-contact a {
		width: fit-content;
		color: var(--muted);
		text-decoration: none;
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		transition: color 0.3s;
	}

	.footer-nav a:hover,
	.footer-contact a:hover {
		color: var(--gold-light);
	}

	.footer-bottom {
		position: relative;
		max-width: 1280px;
		margin: 0 auto;
		padding-top: 2rem;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 2rem;
	}

	.footer-disclaimer {
		margin: 0;
		max-width: 820px;
		font-size: 0.72rem;
		line-height: 1.7;
		color: var(--dim);
	}

	.footer-copy {
		flex-shrink: 0;
		font-size: 0.72rem;
		color: var(--dim);
	}

	@media (min-width: 901px) {
		.site-footer {
			padding-bottom: 3rem;
		}
	}

	@media (max-width: 768px) {
		.footer-inner {
			grid-template-columns: 1fr 1fr;
			gap: 2.5rem 2rem;
		}

		.footer-brand {
			grid-column: 1 / -1;
		}

		.footer-bottom {
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>
