<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import SEO from '$lib/components/SEO.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import ProductSections from '$lib/components/ProductSections.svelte';
	import OrderInfo from '$lib/components/OrderInfo.svelte';
	import { isSegmentId, segmentHref } from '$lib/data/segments';

	// Back link returns to the buyer page the visitor came from (?from=hospitality).
	const from = $derived(page.url.searchParams.get('from'));
</script>

<SEO
	title="US Beverages Catalog | KG Industries"
	description="Full catalog of US-market soft drinks and specialty flavors, sold by the pallet and shipped in consolidated containers. Pricing quoted per RFQ, landed to your port."
	canonical="/products/beverages/"
/>

<div class="page-wrap">
	<div class="products-page">
		<PageHero title={$_('productsPage.beverages.title')} subtitle={$_('productsPage.beverages.intro')} />

		<ProductSections lines={['beverages']}>
			<nav class="back-nav">
				{#if isSegmentId(from)}
					<a class="back" href="{base}{segmentHref(from)}">
						<span class="btn-arrow back-arrow" aria-hidden="true">←</span>
						{$_(`productsPage.segments.${from}.title`)}
					</a>
				{:else}
					<a class="back" href="{base}/products/">
						<span class="btn-arrow back-arrow" aria-hidden="true">←</span>
						{$_('productsPage.hub.back')}
					</a>
				{/if}
			</nav>
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

	.back-nav {
		margin-bottom: calc(clamp(3rem, 7vw, 6rem) * -0.5);
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--line);
	}

	.back {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.18em;
		color: var(--gold);
		text-decoration: none;
		text-transform: uppercase;
	}

	.back:hover {
		color: var(--gold-light);
	}

	.back:hover .back-arrow {
		transform: translateX(-4px);
	}

	:global(:root[dir='rtl']) .back:hover .back-arrow {
		transform: scaleX(-1) translateX(-4px);
	}
</style>
