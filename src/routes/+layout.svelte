<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/i18n';
	import { _, isLoading } from 'svelte-i18n';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import RfqPanel from '$lib/components/RfqPanel.svelte';
	import { rfqOpen, RFQ_EMAIL, LINKEDIN_URL } from '$lib/stores/rfq';
	import { base } from '$app/paths';

	let { children } = $props();
	let mobileMenuOpen = $state(false);

	const toggleMenu = () => {
		mobileMenuOpen = !mobileMenuOpen;
		if (mobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	};

	const closeMenu = () => {
		mobileMenuOpen = false;
		document.body.style.overflow = '';
	};

	onMount(() => {
		// Header scroll behavior
		let lastScroll = 0;
		const header = document.querySelector('header');

		const handleScroll = () => {
			const currentScroll = window.pageYOffset;

			if (currentScroll <= 0) {
				header?.classList.remove('scroll-up');
				header?.classList.remove('scroll-down');
				return;
			}

			if (currentScroll > lastScroll && !header?.classList.contains('scroll-down')) {
				// Scrolling down
				header?.classList.remove('scroll-up');
				header?.classList.add('scroll-down');
			} else if (currentScroll < lastScroll && header?.classList.contains('scroll-down')) {
				// Scrolling up
				header?.classList.remove('scroll-down');
				header?.classList.add('scroll-up');
			}

			lastScroll = currentScroll;
		};

		window.addEventListener('scroll', handleScroll);
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if $isLoading}
	<div class="loading-screen">
		<div class="loading-spinner"></div>
	</div>
{:else}
	<header>
		<a href="{base}/" class="logo">
			<span class="logo-kg">KG</span>
			<span class="logo-industries">INDUSTRIES</span>
		</a>
		<nav class="desktop-nav">
			<a href="{base}/">{$_('nav.overview')}</a>
			<a href="{base}/products">{$_('nav.products')}</a>
			<a href="{base}/how-it-works">{$_('nav.howItWorks')}</a>
			<a href="{base}/#contact">{$_('nav.contact')}</a>
		</nav>
		<div class="header-right">
			<button class="nav-rfq" onclick={() => rfqOpen.set(true)} aria-haspopup="dialog">
				{$_('nav.rfq')}
			</button>
			<LanguageSwitcher />
			<button class="hamburger" onclick={toggleMenu} aria-label="Toggle menu">
				<span class="hamburger-line" class:open={mobileMenuOpen}></span>
				<span class="hamburger-line" class:open={mobileMenuOpen}></span>
				<span class="hamburger-line" class:open={mobileMenuOpen}></span>
			</button>
		</div>
	</header>

	<div class="mobile-menu" class:open={mobileMenuOpen}>
		<nav class="mobile-nav">
			<a href="{base}/" onclick={closeMenu}>{$_('nav.overview')}</a>
			<a href="{base}/products" onclick={closeMenu}>{$_('nav.products')}</a>
			<a href="{base}/how-it-works" onclick={closeMenu}>{$_('nav.howItWorks')}</a>
			<a href="{base}/#contact" onclick={closeMenu}>{$_('nav.contact')}</a>
		</nav>
	</div>

	{@render children()}

	<footer class="site-footer">
		<div class="footer-row">
			<span class="footer-company">
				KG Industries LLC · {$_('footer.location')} ·
				<a href="mailto:{RFQ_EMAIL}">{RFQ_EMAIL}</a> ·
				<a href={LINKEDIN_URL} target="_blank" rel="noopener">LinkedIn</a>
			</span>
			<span class="footer-copy">© 2026 KG Industries LLC</span>
		</div>
		<p class="footer-disclaimer">{$_('footer.disclaimer')}</p>
	</footer>

	<RfqPanel />
{/if}

<style>
	.loading-screen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background: #050508;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid #1a1a22;
		border-top-color: #1c71d8;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		max-width: 100vw;
		z-index: 100;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2rem 4vw;
		border-bottom: 1px solid #1a1a22;
		background: rgba(10, 10, 13, 0.97);
		backdrop-filter: blur(8px);
		transform: translateY(0);
		transition: transform 0.3s ease;
		box-sizing: border-box;
	}

	header.scroll-down {
		transform: translateY(-100%);
	}

	header.scroll-up {
		transform: translateY(0);
	}

	header::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='6.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
		opacity: 0.18;
		pointer-events: none;
		z-index: -1;
	}

	.logo {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-decoration: none;
		line-height: 1;
	}

	.logo-kg {
		font-size: 2rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: #ffffff;
	}

	.logo-industries {
		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: 0.25em;
		color: #a1a1aa;
		font-family: 'Times New Roman', Times, serif;
		margin-top: 2px;
	}

	.desktop-nav {
		display: flex;
		gap: 3rem;
	}

	.desktop-nav a {
		color: #a1a1aa;
		text-decoration: none;
		font-size: 0.75rem;
		letter-spacing: 0.12em;
		font-weight: 600;
		transition: color 0.2s;
	}

	.desktop-nav a:hover {
		color: #1c71d8;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.hamburger {
		display: none;
		flex-direction: column;
		justify-content: center;
		gap: 5px;
		width: 28px;
		height: 28px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		z-index: 101;
	}

	.hamburger-line {
		display: block;
		width: 100%;
		height: 2px;
		background: #a1a1aa;
		transition: all 0.3s ease;
	}

	.hamburger-line.open:nth-child(1) {
		transform: rotate(45deg) translate(5px, 5px);
	}

	.hamburger-line.open:nth-child(2) {
		opacity: 0;
	}

	.hamburger-line.open:nth-child(3) {
		transform: rotate(-45deg) translate(5px, -5px);
	}

	.mobile-menu {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background: #050508;
		z-index: 99;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		visibility: hidden;
		transition: opacity 0.3s ease, visibility 0.3s ease;
	}

	.mobile-menu.open {
		opacity: 1;
		visibility: visible;
	}

	.mobile-nav {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2.5rem;
	}

	.mobile-nav a {
		color: #ffffff;
		text-decoration: none;
		font-size: 1.5rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		transition: color 0.2s;
	}

	.mobile-nav a:hover {
		color: #1c71d8;
	}

	@media (max-width: 768px) {
		.desktop-nav {
			display: none;
		}

		.hamburger {
			display: flex;
		}
	}

	.nav-rfq {
		padding: 0.55rem 1rem;
		background: transparent;
		border: 1px solid #1c71d8;
		color: #1c71d8;
		font-family: inherit;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		cursor: pointer;
		transition: all 0.2s;
	}

	.nav-rfq:hover {
		background: #1c71d8;
		color: #050508;
	}

	@media (max-width: 768px) {
		.nav-rfq {
			display: none;
		}
	}

	.site-footer {
		position: relative;
		z-index: 10;
		padding: 2rem 4vw 5.5rem;
		border-top: 1px solid #1a1a22;
		background: #050508;
	}

	.footer-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.footer-company {
		font-size: 0.8rem;
		color: #71717a;
		line-height: 1.6;
	}

	.footer-company a {
		color: #a1a1aa;
		text-decoration: none;
	}

	.footer-company a:hover {
		color: #1c71d8;
	}

	.footer-copy {
		font-size: 0.7rem;
		color: #52525b;
	}

	.footer-disclaimer {
		margin: 1rem 0 0;
		font-size: 0.7rem;
		line-height: 1.6;
		color: #52525b;
		max-width: 900px;
	}

	@media (min-width: 769px) {
		.site-footer {
			padding-bottom: 2rem;
		}
	}

	@media (max-width: 600px) {
		.footer-row {
			flex-direction: column;
			text-align: center;
		}

		.footer-disclaimer {
			text-align: center;
		}
	}
</style>
