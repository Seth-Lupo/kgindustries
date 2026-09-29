<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { base } from '$app/paths';
	import SEO from '$lib/components/SEO.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import ProductSections from '$lib/components/ProductSections.svelte';
	import OrderInfo from '$lib/components/OrderInfo.svelte';
	import { segments, segmentHref } from '$lib/data/segments';
	import { reveal } from '$lib/actions/motion';
</script>

<SEO
	title="Products | KG Industries"
	description="US products for retail, hospitality, industrial, and automotive buyers: beverages, consumer goods, Cambro foodservice equipment, facility and MRO supply, nitrile gloves, packaging, and genuine Ford parts. Pricing quoted per RFQ, landed to your port."
	canonical="/products/"
/>

<div class="page-wrap">
	<div class="products-page">
		<PageHero title={$_('productsPage.hero.title')} subtitle={$_('productsPage.hero.subtitle')} />

		<ProductSections>
			<div class="segments-block">
				<div class="segments-header" use:reveal>
					<h2>{$_('productsPage.hub.title')}</h2>
					<p>{$_('productsPage.hub.intro')}</p>
				</div>

				<div class="segment-grid">
					{#each segments as seg, i (seg.id)}
						<a class="segment-card" href="{base}{segmentHref(seg.id)}" use:reveal={{ delay: i * 90 }}>
							<span class="segment-label">{$_(`productsPage.segments.${seg.id}.label`)}</span>
							<span class="segment-title">{$_(`productsPage.segments.${seg.id}.title`)}</span>
							<span class="segment-who">{$_(`productsPage.segments.${seg.id}.who`)}</span>
							<ul class="segment-lines">
								{#each seg.lines as id (id)}
									<li>{$_(`productsPage.lineNames.${id}`)}</li>
								{/each}
							</ul>
							<span class="segment-cta">
								{$_('productsPage.hub.view')} <span class="btn-arrow" aria-hidden="true">→</span>
							</span>
						</a>
					{/each}
				</div>
			</div>
		</ProductSections>

		<OrderInfo />
	</div>
</div>

<style>
	.page-wrap {
		position: relative;
		min-height: 100vh;
		width: 100%;
		overflow-x: clip;
	}

	.products-page {
		min-height: 100vh;
		background: var(--navy-900);
	}

	.segments-header {
		max-width: 820px;
		margin-bottom: 2.5rem;
	}

	.segments-header h2 {
		margin: 0 0 1.1rem;
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 600;
		line-height: 1.05;
		letter-spacing: 0.02em;
		color: var(--ink);
		text-transform: uppercase;
	}

	.segments-header h2::after {
		content: '';
		display: block;
		width: 56px;
		height: 1px;
		margin-top: 1.1rem;
		background: var(--gold);
	}

	.segments-header p {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.75;
		color: var(--text);
	}

	.segment-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.25rem;
	}

	.segment-card {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		padding: clamp(1.5rem, 3vw, 2.5rem);
		background: linear-gradient(170deg, var(--navy-850), var(--navy-900) 70%);
		border: 1px solid var(--line);
		color: inherit;
		text-decoration: none;
		overflow: hidden;
		transition:
			border-color 0.45s var(--ease-out),
			background-color 0.45s var(--ease-out),
			translate 0.45s var(--ease-out),
			box-shadow 0.45s var(--ease-out);
	}

	.segment-card::before {
		content: '';
		position: absolute;
		inset-block: 0;
		inset-inline-start: 0;
		width: 2px;
		background: var(--gold);
		transform: scaleY(0.3);
		transform-origin: top;
		transition: transform 0.55s var(--ease-out);
	}

	.segment-card:hover,
	.segment-card:focus-visible {
		translate: 0 -4px;
		border-color: var(--gold-line);
		background: var(--navy-800);
		box-shadow: 0 24px 48px -24px rgba(0, 0, 0, 0.7);
		outline: none;
	}

	.segment-card:hover::before,
	.segment-card:focus-visible::before {
		transform: scaleY(1);
	}

	.segment-label {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.22em;
		color: var(--gold);
		text-transform: uppercase;
	}

	.segment-title {
		font-family: var(--font-display);
		font-size: clamp(1.6rem, 3vw, 2.2rem);
		font-weight: 600;
		line-height: 1.1;
		letter-spacing: 0.02em;
		color: var(--ink);
		text-transform: uppercase;
	}

	.segment-who {
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--muted);
	}

	.segment-lines {
		list-style: none;
		margin: 0.25rem 0 0;
		padding: 1rem 0 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border-top: 1px solid var(--line);
		font-size: 0.95rem;
		color: var(--text);
	}

	.segment-lines li {
		position: relative;
		padding-inline-start: 1rem;
	}

	.segment-lines li::before {
		content: '';
		position: absolute;
		inset-inline-start: 0;
		top: 0.6em;
		width: 5px;
		height: 5px;
		background: var(--gold);
		transform: rotate(45deg);
	}

	.segment-cta {
		margin-top: auto;
		padding-top: 0.75rem;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		color: var(--gold);
		text-transform: uppercase;
	}

	@media (max-width: 900px) {
		.segment-grid {
			grid-template-columns: 1fr;
		}

		.segment-card:hover {
			translate: none;
		}
	}
</style>
