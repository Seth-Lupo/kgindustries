<script lang="ts">
	import type { Snippet } from 'svelte';
	import { _, json } from 'svelte-i18n';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { base } from '$app/paths';
	import { beverageFamilies, BEVERAGE_LEAD_TIME_WEEKS, type Beverage } from '$lib/data/beverages';
	import { rfqLabels } from '$lib/data/rfqLabels';
	import {
		beverageCatalogHref,
		type GeneralLineId,
		type LineId,
		type SegmentId
	} from '$lib/data/segments';
	import {
		rfqOpen,
		rfqItems,
		togglePallet,
		openRfqFor,
		totalPallets,
		PALLETS_20FT,
		PALLETS_40FT
	} from '$lib/stores/rfq';
	import GloveTests from '$lib/components/GloveTests.svelte';
	import { reveal } from '$lib/actions/motion';

	interface Props {
		// Product lines to show, in order. Empty shows only custom sourcing.
		lines?: LineId[];
		// Header for runs of single-RFQ lines (Cambro, gloves, Ford, ...).
		groupTitle?: string;
		groupIntro?: string;
		// When set, beverages show this many cards and link to the full catalog.
		bevPreviewFrom?: SegmentId;
		children?: Snippet;
	}

	let { lines = [], groupTitle = '', groupIntro = '', bevPreviewFrom, children }: Props = $props();

	const BEV_PREVIEW_COUNT = 5;
	const allBeverages = beverageFamilies.flatMap((f) => f.items);

	type Option = { id: string; title: string };
	type Line = { title: string; text: string; origin?: string; note?: string };
	type Block = { kind: 'beverages' } | { kind: 'consumer' } | { kind: 'group'; ids: GeneralLineId[] };

	// Consecutive single-RFQ lines share one panel so they read as a list.
	const blocks = $derived(
		lines.reduce<Block[]>((acc, id) => {
			if (id === 'beverages' || id === 'consumer') {
				acc.push({ kind: id });
			} else {
				const last = acc.at(-1);
				if (last?.kind === 'group') last.ids.push(id);
				else acc.push({ kind: 'group', ids: [id] });
			}
			return acc;
		}, [])
	);

	let glovesOpen = $state(false);

	const bevKey = (b: Beverage) => b.image ?? b.name;
	const inRfq = (key: string) => $rfqItems.some((i) => i.key === key);

	const sizeLabel = (b: Beverage) => (b.size ? $_(`productsPage.beverages.${b.size}`) : '');

	// English label used in the RFQ email, so the request reads the same for our team.
	const rfqLabel = (b: Beverage) =>
		[b.name, b.size === 'glass355' ? '355 ml glass' : b.size === 'glass500' ? '500 ml glass' : '']
			.filter(Boolean)
			.join(', ');

	const toggleBev = (b: Beverage) =>
		togglePallet({
			key: bevKey(b),
			label: rfqLabel(b),
			display: [b.name, sizeLabel(b)].filter(Boolean).join(', '),
			casesPerPallet: b.casesPerPallet,
			pack: b.pack
		});

	const altText = (b: Beverage) =>
		[b.name, sizeLabel(b), $_('productsPage.beverages.caseOf', { values: { n: b.pack } })]
			.filter(Boolean)
			.join(', ');

	const line = (id: GeneralLineId) => $json(`productsPage.lines.${id}`) as Line;
</script>

{#snippet bevCard(bev: Beverage, i: number)}
	{@const added = inRfq(bevKey(bev))}
	<article class="bev-card" class:added use:reveal={{ delay: (i % 5) * 70 }}>
		<div class="bev-photo">
			{#if bev.image}
				<img src="{base}{bev.image}" alt={altText(bev)} loading="lazy" width="800" height="800" />
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
			</dl>
			<p class="bev-origin" class:non-us={bev.origin !== 'US'}>
				{bev.origin === 'MX' ? $_('productsPage.beverages.originMX') : $_('productsPage.beverages.originUS')}
			</p>
			<button class="add-rfq" class:added aria-pressed={added} onclick={() => toggleBev(bev)}>
				{added ? $_('productsPage.beverages.added') : $_('productsPage.beverages.add')}
			</button>
		</div>
	</article>
{/snippet}

<section class="category-section">
	<div class="category-layout">
		{@render children?.()}

		{#each blocks as block}
			{#if block.kind === 'beverages'}
				<!-- US BEVERAGES -->
				<div class="category-block beverage-block" id="beverages">
					<div class="category-header" use:reveal>
						<h2>{$_('productsPage.beverages.title')}</h2>
						<p class="category-intro">{$_('productsPage.beverages.intro')}</p>
						<p class="category-sub">{$_('productsPage.beverages.specialty')}</p>
					</div>

					<ul class="pallet-facts" use:reveal={{ delay: 100 }}>
						<li>{$_('productsPage.beverages.palletNote')}</li>
						<li>
							{$_('productsPage.beverages.containerFit', {
								values: { p20: PALLETS_20FT, p40: PALLETS_40FT }
							})}
						</li>
						<li>{$_('productsPage.beverages.leadTime', { values: { n: BEVERAGE_LEAD_TIME_WEEKS } })}</li>
					</ul>

					{#if bevPreviewFrom}
						<div class="bev-grid">
							{#each allBeverages.slice(0, BEV_PREVIEW_COUNT) as bev, i (bevKey(bev))}
								{@render bevCard(bev, i)}
							{/each}
						</div>
						<div class="catalog-link-row">
							<a class="btn-ghost" href="{base}{beverageCatalogHref(bevPreviewFrom)}">
								{$_('productsPage.beverages.viewAll', { values: { n: allBeverages.length } })}
								<span class="btn-arrow" aria-hidden="true">→</span>
							</a>
						</div>
					{:else}
						{#each beverageFamilies as family (family.id)}
							<div class="family">
								<h3 class="family-title" use:reveal>
									{$_(`productsPage.beverages.families.${family.id}`)}
									<span class="family-count">{family.items.length}</span>
								</h3>
								<div class="bev-grid">
									{#each family.items as bev, i (bevKey(bev))}
										{@render bevCard(bev, i)}
									{/each}
								</div>
							</div>
						{/each}
					{/if}

					{#if totalPallets($rfqItems)}
						<div class="rfq-bar" transition:fly={{ y: 24, duration: 450, easing: cubicOut }}>
							<span>{$_('productsPage.beverages.selectedCount', { values: { n: totalPallets($rfqItems) } })}</span>
							<button class="btn-gold" onclick={() => rfqOpen.set(true)}>{$_('nav.rfq')}</button>
						</div>
					{/if}
				</div>
			{:else if block.kind === 'consumer'}
				<!-- CONSUMER GOODS -->
				<div class="category-block consumer-block" id="consumer">
					<div class="category-header" use:reveal>
						<h2>{$_('productsPage.consumer.title')}</h2>
						<p class="category-intro">{$_('productsPage.consumer.intro')}</p>
					</div>
					<div class="consumer-grid">
						<div class="product-card" use:reveal>
							<div class="card-content">
								<h3>{$_('productsPage.consumer.onRequestTitle')}</h3>
								<p class="pick-hint">{$_('productsPage.pickHint')}</p>
								<div class="options">
									{#each $json('productsPage.consumer.onRequest') as Option[] as opt (opt.id)}
										<button class="option" onclick={() => openRfqFor(opt.id, rfqLabels[opt.id], opt.title)}>
											<span>{opt.title}</span>
											<span class="option-cta" aria-hidden="true">RFQ <span class="btn-arrow">→</span></span>
										</button>
									{/each}
								</div>
								<!-- CONFIRM: named FMCG brand examples (only once confirmed sourced) -->
							</div>
						</div>
						<div class="product-card" use:reveal={{ delay: 120 }}>
							<div class="card-content">
								<h3>{$_('productsPage.consumer.howTitle')}</h3>
								<p>{$_('productsPage.consumer.how')}</p>
							</div>
						</div>
						<!-- CONFIRM: additional consumer line pending agreement; not published -->
					</div>
				</div>
			{:else}
				<!-- SINGLE-RFQ LINES -->
				<div class="category-block industrial-block" id={block.ids[0]}>
					<div class="split-layout">
						<div class="split-header" use:reveal>
							<h2>{groupTitle}</h2>
							<p class="category-intro">{groupIntro}</p>
						</div>
						<div class="split-content">
							<div class="industrial-list">
								{#each block.ids as id, i (id)}
									{@const card = line(id)}
									<div class="industrial-item" id={i ? id : undefined} use:reveal={{ delay: (i % 3) * 80 }}>
										<div class="item-info">
											<h4>
												<button class="card-link" onclick={() => openRfqFor(id, rfqLabels[id], card.title)}>
													{card.title}
												</button>
											</h4>
											<p>{card.text}</p>
											{#if card.note}<p class="item-note">{card.note}</p>{/if}
											{#if card.origin}
												<p class="item-origin">
													<span>{$_('productsPage.originLabel')}</span>
													{card.origin}
												</p>
											{/if}
											<div class="card-actions">
												<span class="card-cta" aria-hidden="true">{$_('productsPage.cardCta')} <span class="btn-arrow">→</span></span>
												{#if id === 'gloves'}
													<button class="tests-btn" onclick={() => (glovesOpen = true)}>
														{$_('gloves.button')}
													</button>
												{/if}
											</div>
										</div>
									</div>
								{/each}
								<!-- Glove popup shows permeation test results only; no CE / EN certification claims. -->
							</div>
						</div>
					</div>
				</div>
			{/if}
		{/each}

		<!-- CUSTOM SOURCING -->
		<div class="category-block custom-block" id="custom" use:reveal={{ variant: 'scale' }}>
			<div class="custom-inner">
				<div>
					<h2>{$_('productsPage.custom.title')}</h2>
					<p class="category-intro">{$_('productsPage.custom.text')}</p>
				</div>
				<button
					class="btn-gold custom-button"
					onclick={() => openRfqFor('custom', rfqLabels.custom, $_('productsPage.custom.title'))}
				>
					{$_('nav.rfq')} <span class="btn-arrow" aria-hidden="true">→</span>
				</button>
			</div>
		</div>
	</div>
</section>

{#if lines.includes('gloves')}
	<GloveTests bind:open={glovesOpen} />
{/if}

<style>
	.category-section {
		position: relative;
		padding: clamp(3rem, 7vw, 6rem) var(--gutter);
	}

	.category-layout {
		max-width: 1320px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: clamp(3rem, 7vw, 6rem);
	}

	.category-block,
	.industrial-item {
		position: relative;
		scroll-margin-top: calc(var(--header-h) + 1.5rem);
	}

	.category-header {
		margin-bottom: 2.5rem;
		max-width: 820px;
	}

	.category-header h2,
	.custom-block h2,
	.split-header h2 {
		margin: 0 0 1.1rem;
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 600;
		line-height: 1.05;
		letter-spacing: 0.02em;
		color: var(--ink);
		text-transform: uppercase;
	}

	.category-header h2::after,
	.split-header h2::after {
		content: '';
		display: block;
		width: 56px;
		height: 1px;
		margin-top: 1.1rem;
		background: var(--gold);
	}

	.category-intro {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.75;
		color: var(--text);
	}

	.category-sub {
		margin: 0.75rem 0 0;
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--muted);
	}

	/* Shared panel surface for each category. */
	.beverage-block,
	.consumer-block,
	.industrial-block,
	.custom-block {
		padding: clamp(1.5rem, 4vw, 3.5rem);
		background: linear-gradient(170deg, var(--navy-850), var(--navy-900) 70%);
		border: 1px solid var(--line);
	}

	/* ---------- Beverages ---------- */

	.pallet-facts {
		list-style: none;
		margin: -0.5rem 0 3rem;
		padding: 1.1rem 1.4rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem 2.25rem;
		background: linear-gradient(90deg, var(--gold-wash), transparent 80%);
		border-inline-start: 2px solid var(--gold);
		font-size: 0.9rem;
		color: var(--ink);
	}

	:global(:root[dir='rtl']) .pallet-facts {
		background: linear-gradient(-90deg, var(--gold-wash), transparent 80%);
	}

	.pallet-facts li {
		position: relative;
		padding-inline-start: 1rem;
	}

	.pallet-facts li::before {
		content: '';
		position: absolute;
		inset-inline-start: 0;
		top: 0.6em;
		width: 5px;
		height: 5px;
		background: var(--gold);
		transform: rotate(45deg);
	}

	.family + .family {
		margin-top: 3.5rem;
	}

	.family-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin: 0 0 1.5rem;
		padding-bottom: 0.9rem;
		border-bottom: 1px solid var(--line);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.22em;
		color: var(--gold-light);
		text-transform: uppercase;
	}

	.family-count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.6rem;
		height: 1.6rem;
		padding: 0 0.4rem;
		border: 1px solid var(--gold-line);
		font-size: 0.65rem;
		letter-spacing: 0;
		color: var(--muted);
	}

	.bev-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
		gap: 1.25rem;
	}

	.bev-card {
		position: relative;
		display: flex;
		flex-direction: column;
		background: var(--navy-800);
		border: 1px solid var(--line);
		transition:
			border-color 0.45s var(--ease-out),
			box-shadow 0.45s var(--ease-out),
			translate 0.45s var(--ease-out);
	}

	.bev-card:hover {
		translate: 0 -4px;
		border-color: var(--gold-line);
		box-shadow: 0 24px 48px -24px rgba(0, 0, 0, 0.7);
	}

	.bev-card.added {
		border-color: var(--gold);
		box-shadow: 0 0 0 1px var(--gold), 0 20px 40px -24px var(--gold-glow);
	}

	.bev-photo {
		position: relative;
		aspect-ratio: 1 / 1;
		background: #ffffff;
		overflow: hidden;
	}

	.bev-photo img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
		transition: transform 0.8s var(--ease-out);
	}

	.bev-card:hover .bev-photo img {
		transform: scale(1.06);
	}

	.bev-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 1.5rem;
		background: linear-gradient(160deg, var(--navy-700), var(--navy-800));
		color: var(--muted);
		font-family: var(--font-display);
		font-size: 1.15rem;
		font-weight: 600;
	}

	.bev-body {
		padding: 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		flex: 1;
	}

	.bev-name {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--ink);
		line-height: 1.35;
	}

	.bev-meta {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.8rem;
	}

	.bev-meta div {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.bev-meta dt {
		color: var(--dim);
	}

	.bev-meta dd {
		margin: 0;
		color: var(--text);
		text-align: end;
	}

	.bev-origin {
		margin: 0;
		font-size: 0.75rem;
		color: var(--muted);
	}

	.bev-origin.non-us {
		color: #e8b85c;
	}

	.add-rfq {
		margin-top: auto;
		padding: 0.7rem;
		background: transparent;
		border: 1px solid var(--line-strong);
		color: var(--text);
		font-family: inherit;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		cursor: pointer;
		transition:
			background-color 0.35s var(--ease-out),
			border-color 0.35s var(--ease-out),
			color 0.35s var(--ease-out);
	}

	.add-rfq:hover {
		border-color: var(--gold);
		color: var(--gold-light);
	}

	.add-rfq.added {
		background: var(--gold);
		border-color: var(--gold);
		color: var(--navy-950);
	}

	.catalog-link-row {
		display: flex;
		justify-content: center;
		margin-top: 2rem;
	}

	.rfq-bar {
		position: sticky;
		bottom: 1.25rem;
		z-index: 5;
		margin-top: 2.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 0.85rem 0.85rem 0.85rem 1.4rem;
		background: rgba(14, 23, 40, 0.82);
		backdrop-filter: blur(16px) saturate(140%);
		-webkit-backdrop-filter: blur(16px) saturate(140%);
		border: 1px solid var(--gold-line);
		box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.8);
		font-size: 0.9rem;
		color: var(--ink);
	}

	.rfq-bar button {
		padding: 0.85rem 1.4rem;
		font-size: 0.7rem;
		white-space: nowrap;
	}

	/* ---------- Consumer ---------- */

	.consumer-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
	}

	.product-card {
		position: relative;
		padding: clamp(1.5rem, 3vw, 2.5rem);
		background: var(--navy-800);
		border: 1px solid var(--line);
	}

	.card-content h3 {
		margin: 0 0 1rem;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		color: var(--gold-light);
		text-transform: uppercase;
	}

	.card-content p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.75;
		color: var(--muted);
	}

	.pick-hint {
		margin-bottom: 1rem !important;
		font-size: 0.85rem !important;
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.option {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 0.95rem 1.1rem;
		background: var(--navy-900);
		border: 1px solid var(--line);
		color: var(--ink);
		font-family: inherit;
		font-size: 0.95rem;
		text-align: start;
		cursor: pointer;
		transition:
			border-color 0.35s var(--ease-out),
			background-color 0.35s var(--ease-out);
	}

	.option:hover,
	.option:focus-visible {
		border-color: var(--gold-line);
		background: var(--navy-700);
	}

	.option-cta,
	.card-cta {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		color: var(--gold);
		white-space: nowrap;
		text-transform: uppercase;
	}

	.option:hover .btn-arrow,
	.industrial-item:hover .btn-arrow {
		transform: translateX(4px);
	}

	:global(:root[dir='rtl']) .option:hover .btn-arrow,
	:global(:root[dir='rtl']) .industrial-item:hover .btn-arrow {
		transform: scaleX(-1) translateX(4px);
	}

	/* ---------- Single-RFQ lines ---------- */

	.split-layout {
		display: grid;
		grid-template-columns: 0.8fr 1.2fr;
		gap: clamp(2rem, 5vw, 5rem);
		align-items: start;
	}

	.split-header {
		position: sticky;
		top: calc(var(--header-h) + 2rem);
	}

	.industrial-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.industrial-item {
		padding: clamp(1.4rem, 2.5vw, 2rem);
		background: var(--navy-800);
		border: 1px solid var(--line);
		overflow: hidden;
		transition:
			border-color 0.45s var(--ease-out),
			background-color 0.45s var(--ease-out);
	}

	.industrial-item::before {
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

	.industrial-item:hover,
	.industrial-item:focus-within {
		border-color: var(--gold-line);
		background: var(--navy-700);
	}

	.industrial-item:hover::before,
	.industrial-item:focus-within::before {
		transform: scaleY(1);
	}

	/* Stretched button: the whole card opens the RFQ for that line. */
	.card-link {
		background: none;
		border: none;
		padding: 0;
		color: inherit;
		font: inherit;
		letter-spacing: inherit;
		text-transform: inherit;
		text-align: start;
		cursor: pointer;
	}

	.card-link::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.card-link:focus-visible {
		outline: none;
	}

	.industrial-item:has(.card-link:focus-visible) {
		outline: 2px solid var(--gold);
	}

	.card-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
		margin-top: 1.4rem;
	}

	.tests-btn {
		position: relative;
		z-index: 1;
		padding: 0.6rem 1rem;
		background: transparent;
		border: 1px solid var(--line-strong);
		color: var(--text);
		font-family: inherit;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		cursor: pointer;
		transition:
			border-color 0.3s,
			color 0.3s;
	}

	.tests-btn:hover {
		border-color: var(--gold);
		color: var(--gold-light);
	}

	.item-info h4 {
		margin: 0 0 0.75rem;
		font-size: 1rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--ink);
		text-transform: uppercase;
	}

	.item-info p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.7;
		color: var(--muted);
	}

	.item-info .item-note {
		margin-top: 0.75rem;
		font-size: 0.85rem;
		color: var(--dim);
	}

	.item-info .item-origin {
		margin-top: 1rem;
		font-size: 0.8rem;
		color: var(--text);
	}

	.item-origin span {
		margin-inline-end: 0.5rem;
		font-size: 0.66rem;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--gold);
	}

	/* ---------- Custom sourcing ---------- */

	.custom-block {
		overflow: hidden;
		border-color: var(--gold-line);
		background:
			radial-gradient(ellipse at 100% 0%, rgba(201, 164, 92, 0.14), transparent 55%),
			linear-gradient(170deg, var(--navy-800), var(--navy-900));
	}

	:global(:root[dir='rtl']) .custom-block {
		background:
			radial-gradient(ellipse at 0% 0%, rgba(201, 164, 92, 0.14), transparent 55%),
			linear-gradient(170deg, var(--navy-800), var(--navy-900));
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
		flex-shrink: 0;
	}

	@media (max-width: 900px) {
		.consumer-grid,
		.split-layout {
			grid-template-columns: 1fr;
		}

		.split-header {
			position: static;
		}

		.bev-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.75rem;
		}

		.bev-body {
			padding: 0.8rem;
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

		.bev-card:hover {
			translate: none;
		}

		.custom-inner {
			flex-direction: column;
			align-items: stretch;
		}

		.pallet-facts {
			flex-direction: column;
			font-size: 0.85rem;
		}

		.rfq-bar {
			bottom: 5rem;
			padding: 0.7rem 0.7rem 0.7rem 1rem;
			font-size: 0.8rem;
		}
	}
</style>
