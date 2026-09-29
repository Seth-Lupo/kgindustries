<script lang="ts">
	import { _, json } from 'svelte-i18n';
	import SEO from '$lib/components/SEO.svelte';
	import { base } from '$app/paths';
	import { beverageFamilies, SHOW_PALLET_CONFIG, type Beverage } from '$lib/data/beverages';
	import { rfqOpen, rfqItems, toggleRfqItem } from '$lib/stores/rfq';

	type Card = { title: string; text: string; origin: string; note?: string };
	type Row = { label: string; text: string };

	const sizeLabel = (b: Beverage) => (b.size ? $_(`productsPage.beverages.${b.size}`) : '');

	// English label used in the RFQ email, so the request reads the same for our team.
	const rfqLabel = (b: Beverage) =>
		[b.name, b.size === 'glass355' ? '355 ml glass' : b.size === 'glass500' ? '500 ml glass' : '']
			.filter(Boolean)
			.join(', ');

	const altText = (b: Beverage) =>
		[b.name, sizeLabel(b), $_('productsPage.beverages.caseOf', { values: { n: b.pack } })]
			.filter(Boolean)
			.join(', ');

	let openRow = $state<number | null>(0);
</script>

<SEO
	title="Products | KG Industries"
	description="US beverages, consumer goods, commercial foodservice equipment, genuine Ford parts, nitrile gloves, MRO supply, and packaging. Pricing quoted per RFQ, landed to your port."
	canonical="/products"
/>

<div class="container">
	<div class="grain"></div>

	<div class="products-page">
		<section class="products-hero">
			<div class="flag-container">
				<img src="{base}/images/us-flag.png" alt="" class="hero-flag" />
			</div>
			<div class="hero-content">
				<h1>{$_('productsPage.hero.title')}</h1>
				<p>{$_('productsPage.hero.subtitle')}</p>
			</div>
		</section>

		<section class="category-section">
			<div class="category-layout">
				<!-- US BEVERAGES -->
				<div class="category-block beverage-block" id="beverages">
					<div class="category-header">
						<h2>{$_('productsPage.beverages.title')}</h2>
						<p class="category-intro">{$_('productsPage.beverages.intro')}</p>
						<p class="category-sub">{$_('productsPage.beverages.specialty')}</p>
					</div>

					{#each beverageFamilies as family (family.id)}
						<div class="family">
							<h3 class="family-title">
								{$_(`productsPage.beverages.families.${family.id}`)}
								<span class="family-count">{family.items.length}</span>
							</h3>
							<div class="bev-grid">
								{#each family.items as bev (bev.image ?? bev.name)}
									{@const label = rfqLabel(bev)}
									<article class="bev-card">
										<div class="bev-photo">
											{#if bev.image}
												<img
													src="{base}{bev.image}"
													alt={altText(bev)}
													loading="lazy"
													width="800"
													height="800"
												/>
											{:else}
												<div class="bev-placeholder">{bev.name}</div>
											{/if}
										</div>
										<div class="bev-body">
											<h4 class="bev-name">{bev.name}</h4>
											<dl class="bev-meta">
												{#if bev.size}
													<div><dt>{$_('productsPage.beverages.size')}</dt><dd>{sizeLabel(bev)}</dd></div>
												{/if}
												<div>
													<dt>{$_('productsPage.beverages.pack')}</dt>
													<dd>{$_('productsPage.beverages.caseOf', { values: { n: bev.pack } })}</dd>
												</div>
												{#if SHOW_PALLET_CONFIG}
													<div>
														<dt>{$_('productsPage.beverages.pallet')}</dt>
														<dd>
															{$_('productsPage.beverages.palletValue', {
																values: {
																	cases: bev.casesPerPallet,
																	units: bev.unitsPerPallet.toLocaleString('en-US')
																}
															})}
														</dd>
													</div>
												{/if}
											</dl>
											<p class="bev-origin" class:non-us={bev.origin !== 'US'}>
												{bev.origin === 'MX'
													? $_('productsPage.beverages.originMX')
													: $_('productsPage.beverages.originUS')}
											</p>
											<button
												class="add-rfq"
												class:added={$rfqItems.includes(label)}
												aria-pressed={$rfqItems.includes(label)}
												onclick={() => toggleRfqItem(label)}
											>
												{$rfqItems.includes(label)
													? $_('productsPage.beverages.added')
													: $_('productsPage.beverages.add')}
											</button>
										</div>
									</article>
								{/each}
							</div>
						</div>
					{/each}

					{#if $rfqItems.length}
						<div class="rfq-bar">
							<span>{$_('productsPage.beverages.selectedCount', { values: { n: $rfqItems.length } })}</span>
							<button onclick={() => rfqOpen.set(true)}>{$_('nav.rfq')}</button>
						</div>
					{/if}
				</div>

				<!-- CONSUMER GOODS -->
				<div class="category-block consumer-block" id="consumer">
					<div class="category-header">
						<h2>{$_('productsPage.consumer.title')}</h2>
						<p class="category-intro">{$_('productsPage.consumer.intro')}</p>
					</div>
					<div class="consumer-grid">
						<div class="product-card">
							<div class="card-content">
								<h3>{$_('productsPage.consumer.onRequestTitle')}</h3>
								<ul class="plain-list">
									{#each $json('productsPage.consumer.onRequest') as string[] as line}
										<li>{line}</li>
									{/each}
								</ul>
								<!-- CONFIRM: named FMCG brand examples (only once confirmed sourced) -->
							</div>
						</div>
						<div class="product-card">
							<div class="card-content">
								<h3>{$_('productsPage.consumer.howTitle')}</h3>
								<p>{$_('productsPage.consumer.how')}</p>
							</div>
						</div>
						<!-- CONFIRM: additional consumer line pending agreement; not published -->
					</div>
				</div>

				<!-- INDUSTRIAL & COMMERCIAL -->
				<div class="category-block industrial-block" id="industrial">
					<div class="split-layout">
						<div class="split-header">
							<h2>{$_('productsPage.industrial.title')}<br />{$_('productsPage.industrial.titleLine2')}</h2>
							<p class="category-intro">{$_('productsPage.industrial.intro')}</p>
						</div>
						<div class="split-content">
							<div class="industrial-list">
								<!-- CONFIRM: foodservice brand name and logo withheld pending approval -->
								{#each $json('productsPage.industrial.cards') as Card[] as card}
									<div class="industrial-item">
										<div class="item-info">
											<h4>{card.title}</h4>
											<p>{card.text}</p>
											{#if card.note}<p class="item-note">{card.note}</p>{/if}
											<p class="item-origin">
												<span>{$_('productsPage.originLabel')}</span>
												{card.origin}
											</p>
										</div>
									</div>
								{/each}
								<!-- CONFIRM: glove certification status (CE / EN 455 / EN ISO 374) per market before any claim -->
							</div>
						</div>
					</div>
				</div>

				<!-- CUSTOM SOURCING -->
				<div class="category-block custom-block" id="custom">
					<div class="custom-inner">
						<div>
							<h2>{$_('productsPage.custom.title')}</h2>
							<p class="category-intro">{$_('productsPage.custom.text')}</p>
						</div>
						<button class="custom-button" onclick={() => rfqOpen.set(true)}>{$_('nav.rfq')}</button>
					</div>
				</div>
			</div>
		</section>

		<!-- ORDER INFORMATION -->
		<section class="requirements" id="order-info">
			<div class="req-container">
				<div class="req-header">
					<h2>{$_('productsPage.order.title')}</h2>
				</div>
				<!-- CONFIRM: beverage minimum (pallets per order; 20' vs 40' container) -->
				<!-- CONFIRM: foodservice minimum container size -->
				<div class="order-list">
					{#each $json('productsPage.order.rows') as Row[] as row, i}
						<div class="order-row" class:open={openRow === i}>
							<button
								class="order-label"
								aria-expanded={openRow === i}
								onclick={() => (openRow = openRow === i ? null : i)}
							>
								<span>{row.label}</span>
								<span class="chev" aria-hidden="true">+</span>
							</button>
							<div class="order-text">{row.text}</div>
						</div>
					{/each}
				</div>
			</div>
		</section>
	</div>
</div>

<style>
	.container {
		position: relative;
		min-height: 100vh;
		width: 100%;
		max-width: 100vw;
		margin: 0 auto;
		overflow-x: clip;
	}

	.grain {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='6.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
		opacity: 0.18;
		pointer-events: none;
		z-index: 1;
	}

	.products-page {
		min-height: 100vh;
		padding-top: 5rem;
		background: #050508;
	}

	.products-hero {
		padding: 6rem 4vw 4rem;
		border-bottom: 1px solid #1a1a22;
		text-align: center;
		position: relative;
		overflow: hidden;
		background: #050508;
	}

	.flag-container {
		position: absolute;
		top: -5%;
		right: -10%;
		width: 700px;
		height: 450px;
		opacity: 0.12;
		transform: rotate(-15deg);
		pointer-events: none;
		z-index: 0;
	}

	.hero-flag {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(60%) contrast(1.1) brightness(0.5);
		mix-blend-mode: screen;
	}

	.hero-content {
		position: relative;
		z-index: 1;
		max-width: 760px;
		margin: 0 auto;
	}

	.hero-content h1 {
		font-size: clamp(2.5rem, 8vw, 5.5rem);
		font-weight: 900;
		letter-spacing: 0.05em;
		color: #ffffff;
		margin: 0 0 1.5rem 0;
		text-transform: uppercase;
	}

	.hero-content p {
		font-size: 1.1rem;
		line-height: 1.6;
		color: #a1a1aa;
		margin: 0;
		font-weight: 400;
	}

	.category-section {
		position: relative;
		z-index: 2;
		padding: 6rem 4vw;
	}

	.category-layout {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 6rem;
	}

	.category-block {
		border-top: 1px solid #1a1a22;
		padding-top: 3rem;
		scroll-margin-top: 6rem;
	}

	.category-header {
		margin-bottom: 3rem;
		max-width: 820px;
	}

	.category-header h2,
	.custom-block h2 {
		font-size: 1.8rem;
		font-weight: 900;
		letter-spacing: 0.08em;
		color: #ffffff;
		margin: 0 0 1rem 0;
		text-transform: uppercase;
	}

	.category-intro {
		font-size: 1.05rem;
		line-height: 1.7;
		color: #d4d4d8;
		margin: 0;
	}

	.category-sub {
		font-size: 0.95rem;
		line-height: 1.6;
		color: #a1a1aa;
		margin: 0.75rem 0 0;
	}

	/* Beverages */
	.beverage-block {
		background: #0a0a0d;
		padding: 3rem;
		border: 1px solid #1a1a22;
	}

	.family + .family {
		margin-top: 3rem;
	}

	.family-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		color: #a1a1aa;
		text-transform: uppercase;
		margin: 0 0 1.25rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid #1a1a22;
	}

	.family-count {
		font-size: 0.7rem;
		color: #52525b;
	}

	.bev-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1.25rem;
	}

	.bev-card {
		background: #050508;
		border: 1px solid #1a1a22;
		display: flex;
		flex-direction: column;
	}

	.bev-photo {
		aspect-ratio: 1 / 1;
		background: #ffffff;
		overflow: hidden;
	}

	.bev-photo img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
	}

	.bev-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 1.5rem;
		background: #111116;
		color: #71717a;
		font-weight: 700;
		letter-spacing: 0.05em;
		font-size: 0.95rem;
	}

	.bev-body {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		flex: 1;
	}

	.bev-name {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 700;
		color: #ffffff;
		line-height: 1.3;
	}

	.bev-meta {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.8rem;
	}

	.bev-meta div {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.bev-meta dt {
		color: #71717a;
	}

	.bev-meta dd {
		margin: 0;
		color: #d4d4d8;
		text-align: end;
	}

	.bev-origin {
		margin: 0;
		font-size: 0.75rem;
		color: #a1a1aa;
		letter-spacing: 0.02em;
	}

	.bev-origin.non-us {
		color: #f5c211;
	}

	.add-rfq {
		margin-top: auto;
		padding: 0.6rem;
		background: transparent;
		border: 1px solid #27272a;
		color: #a1a1aa;
		font-family: inherit;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		transition: all 0.2s;
	}

	.add-rfq:hover {
		border-color: #1c71d8;
		color: #ffffff;
	}

	.add-rfq.added {
		background: #1c71d8;
		border-color: #1c71d8;
		color: #ffffff;
	}

	.rfq-bar {
		position: sticky;
		bottom: 1rem;
		margin-top: 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 0.9rem 1.2rem;
		background: #111116;
		border: 1px solid #1c71d8;
		font-size: 0.9rem;
		color: #ffffff;
		z-index: 5;
	}

	.rfq-bar button,
	.custom-button {
		padding: 0.7rem 1.2rem;
		background: #1c71d8;
		border: none;
		color: #ffffff;
		font-family: inherit;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		cursor: pointer;
		white-space: nowrap;
	}

	/* Consumer */
	.consumer-block {
		background: #0a0a0d;
		padding: 4rem;
	}

	.consumer-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2rem;
	}

	.product-card {
		background: #050508;
		border: 1px solid #1a1a22;
		padding: 2.5rem;
		position: relative;
	}

	.card-content h3 {
		font-size: 1.1rem;
		font-weight: 900;
		letter-spacing: 0.05em;
		color: #ffffff;
		margin: 0 0 1rem 0;
		text-transform: uppercase;
	}

	.card-content p,
	.plain-list {
		font-size: 0.95rem;
		line-height: 1.7;
		color: #a1a1aa;
		margin: 0;
		font-weight: 400;
	}

	.plain-list {
		padding-inline-start: 1.1rem;
	}

	/* Industrial */
	.industrial-block {
		background: #050508;
		padding: 4rem;
		border: 2px solid #1a1a22;
	}

	.split-layout {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 0.8fr 1.2fr;
		gap: 5rem;
		align-items: start;
	}

	.split-header {
		position: relative;
		padding-top: 2rem;
	}

	.split-header h2 {
		font-size: 2.5rem;
		font-weight: 900;
		letter-spacing: 0.05em;
		color: #ffffff;
		margin: 0 0 1.5rem;
		text-transform: uppercase;
		line-height: 1.1;
	}

	.industrial-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.industrial-item {
		padding: 2rem;
		background: #0a0a0d;
		border-inline-start: 3px solid #1c71d8;
	}

	.item-info h4 {
		font-size: 1.05rem;
		font-weight: 900;
		letter-spacing: 0.05em;
		color: #ffffff;
		margin: 0 0 0.75rem 0;
		text-transform: uppercase;
	}

	.item-info p {
		font-size: 0.95rem;
		line-height: 1.6;
		color: #a1a1aa;
		margin: 0;
		font-weight: 400;
	}

	.item-info .item-note {
		margin-top: 0.75rem;
		font-size: 0.85rem;
		color: #71717a;
	}

	.item-info .item-origin {
		margin-top: 1rem;
		font-size: 0.8rem;
		color: #d4d4d8;
	}

	.item-origin span {
		color: #52525b;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		font-size: 0.7rem;
		margin-inline-end: 0.5rem;
	}

	/* Custom sourcing */
	.custom-block {
		background: #0a0a0d;
		padding: 3rem;
		border: 1px solid #1c71d8;
	}

	.custom-inner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
	}

	.custom-inner > div {
		max-width: 720px;
	}

	.custom-button {
		padding: 1.1rem 1.8rem;
	}

	/* Order information */
	.requirements {
		position: relative;
		z-index: 2;
		padding: 6rem 4vw;
		background: #0a0a0d;
		border-top: 1px solid #1a1a22;
		scroll-margin-top: 5rem;
	}

	.req-container {
		max-width: 1100px;
		margin: 0 auto;
	}

	.req-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.req-header h2 {
		font-size: 3rem;
		font-weight: 900;
		letter-spacing: 0.08em;
		color: #ffffff;
		margin: 0;
		text-transform: uppercase;
	}

	.order-list {
		border-top: 1px solid #1a1a22;
	}

	.order-row {
		display: grid;
		grid-template-columns: 260px 1fr;
		gap: 2rem;
		padding: 1.25rem 0;
		border-bottom: 1px solid #1a1a22;
	}

	.order-label {
		background: none;
		border: none;
		padding: 0;
		text-align: start;
		font-family: inherit;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		color: #71717a;
		text-transform: uppercase;
		cursor: default;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		pointer-events: none;
	}

	.chev {
		display: none;
	}

	.order-text {
		font-size: 0.95rem;
		line-height: 1.7;
		color: #d4d4d8;
	}

	@media (max-width: 900px) {
		.flag-container {
			width: 400px;
			height: 250px;
			top: -5%;
			right: -25%;
			opacity: 0.1;
		}

		.consumer-grid {
			grid-template-columns: 1fr;
		}

		.consumer-block,
		.industrial-block,
		.custom-block {
			padding: 2rem 1.25rem;
		}

		.split-layout {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.split-header {
			padding-top: 0;
		}

		.split-header h2 {
			font-size: 2rem;
		}

		.industrial-item {
			padding: 1.5rem 1.25rem;
		}

		.product-card {
			padding: 1.75rem 1.25rem;
		}

		.req-header h2 {
			font-size: 2rem;
		}

		.products-hero {
			padding: 4rem 4vw 3rem;
		}

		.category-section {
			padding: 3rem 4vw;
		}

		.category-layout {
			gap: 3.5rem;
		}

		.beverage-block {
			padding: 1.5rem 1rem;
		}

		.bev-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.75rem;
		}

		.bev-body {
			padding: 0.75rem;
		}

		.bev-name {
			font-size: 0.85rem;
		}

		.bev-meta div {
			flex-direction: column;
			gap: 0;
		}

		.bev-meta dd {
			text-align: start;
		}

		.custom-inner {
			flex-direction: column;
			align-items: stretch;
		}

		.requirements {
			padding: 4rem 4vw;
		}

		/* Accordion on mobile */
		.order-row {
			grid-template-columns: 1fr;
			gap: 0;
			padding: 0;
		}

		.order-label {
			pointer-events: auto;
			cursor: pointer;
			padding: 1.1rem 0;
			width: 100%;
			color: #d4d4d8;
		}

		.chev {
			display: inline;
			font-size: 1.1rem;
			color: #1c71d8;
			transition: transform 0.2s;
		}

		.order-row.open .chev {
			transform: rotate(45deg);
		}

		.order-text {
			display: none;
			padding-bottom: 1.1rem;
			color: #a1a1aa;
		}

		.order-row.open .order-text {
			display: block;
		}
	}
</style>
