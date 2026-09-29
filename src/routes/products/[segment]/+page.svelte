<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { base } from '$app/paths';
	import SEO from '$lib/components/SEO.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import ProductSections from '$lib/components/ProductSections.svelte';
	import OrderInfo from '$lib/components/OrderInfo.svelte';
	import { segments, segmentHref } from '$lib/data/segments';

	let { data } = $props();

	const seg = $derived(data.segment);
	const t = (key: string) => $_(`productsPage.segments.${seg.id}.${key}`);
</script>

<SEO title={seg.seoTitle} description={seg.seoDescription} canonical={segmentHref(seg.id)} />

<div class="page-wrap">
	<div class="products-page">
		<PageHero title={t('title')} subtitle={t('hero')} />

		{#key seg.id}
			<ProductSections
				lines={seg.lines}
				groupTitle={t('linesTitle')}
				groupIntro={t('linesIntro')}
				bevPreviewFrom={seg.id}
			>
				<nav class="segment-nav" aria-label={$_('productsPage.hub.title')}>
					<a class="back" href="{base}/products/">
						<span class="btn-arrow back-arrow" aria-hidden="true">←</span>
						{$_('productsPage.hub.back')}
					</a>
					<div class="pills">
						{#each segments as s (s.id)}
							<a
								class="pill"
								class:active={s.id === seg.id}
								aria-current={s.id === seg.id ? 'page' : undefined}
								href="{base}{segmentHref(s.id)}"
							>
								{$_(`productsPage.segments.${s.id}.title`)}
							</a>
						{/each}
					</div>
				</nav>
			</ProductSections>
		{/key}

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

	/* Pulls up into the layout gap so it sits just under the hero. */
	.segment-nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem 2rem;
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

	/* Arrow points back, so it slides the other way on hover. */
	.back:hover .back-arrow {
		transform: translateX(-4px);
	}

	:global(:root[dir='rtl']) .back:hover .back-arrow {
		transform: scaleX(-1) translateX(-4px);
	}

	.pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.pill {
		padding: 0.55rem 1rem;
		border: 1px solid var(--line-strong);
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		color: var(--text);
		text-decoration: none;
		text-transform: uppercase;
		transition:
			border-color 0.3s,
			color 0.3s,
			background-color 0.3s;
	}

	.pill:hover {
		border-color: var(--gold);
		color: var(--gold-light);
	}

	.pill.active {
		background: var(--gold);
		border-color: var(--gold);
		color: var(--navy-950);
	}
</style>
