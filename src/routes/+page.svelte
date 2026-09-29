<script lang="ts">
	import { _, json } from 'svelte-i18n';
	import SEO from '$lib/components/SEO.svelte';
	import RouteMap from '$lib/components/RouteMap.svelte';
	import { base } from '$app/paths';
	import { rfqOpen, RFQ_EMAIL, LINKEDIN_URL } from '$lib/stores/rfq';
	import { reveal, parallax } from '$lib/actions/motion';
	import { segments, segmentHref } from '$lib/data/segments';

	type HandleItem = { title: string; text: string };
	type DataPoint = { value: string; label: string };
</script>

<SEO
	title="KG Industries | US Sourcing and Export for International Buyers"
	description="US trading company supplying beverages, foodservice equipment, genuine Ford parts, and industrial goods to buyers in the Gulf, MENA, Caucasus, and Central Asia. Landed CIP/CIF quotes."
/>

<main>
	<section class="hero">
		<div class="hero-map">
			<RouteMap />
		</div>
		<div class="hero-shade" aria-hidden="true"></div>

		<div class="hero-inner">
			<div class="hero-text">
				<span class="eyebrow hero-in" style="--i: 0">{$_('home.hero.operations')}</span>
				<h1 class="hero-title">
					<span class="line"><span class="hero-in" style="--i: 1">{$_('home.hero.global')}</span></span>
					<span class="line gold"><span class="hero-in" style="--i: 2">{$_('home.hero.freight')}</span></span>
				</h1>
				<p class="subtitle hero-in" style="--i: 3">{$_('home.hero.subtitle')}</p>
				<div class="hero-ctas hero-in" style="--i: 4">
					<button class="btn-gold" onclick={() => rfqOpen.set(true)}>
						{$_('nav.rfq')} <span class="btn-arrow" aria-hidden="true">→</span>
					</button>
					<a class="btn-ghost" href="{base}/products/">{$_('nav.products')}</a>
				</div>
			</div>
		</div>

		<a class="scroll-cue" href="#overview" aria-label={$_('nav.overview')}>
			<span></span>
		</a>
	</section>

	<section class="overview" id="overview">
		<div class="overview-content">
			<div class="overview-text">
				<span class="eyebrow" use:reveal>{$_('home.overview.label')}</span>
				<p class="lead" use:reveal={{ delay: 100 }}>{$_('home.overview.p1')}</p>
				<span class="overview-rule" use:reveal={{ variant: 'rule', delay: 200 }}></span>
				<p use:reveal={{ delay: 250 }}>{$_('home.overview.p2')}</p>
				<p use:reveal={{ delay: 350 }}>{$_('home.overview.p3')}</p>
			</div>
			<aside class="overview-detail" use:reveal={{ delay: 300, variant: 'scale' }}>
				<span class="detail-label">{$_('home.overview.factsLabel')}</span>
				<span class="detail-value">KG Industries LLC</span>
				<ul class="facts">
					<li>{$_('home.overview.registered')}</li>
					<li><a href="mailto:{RFQ_EMAIL}">{RFQ_EMAIL}</a></li>
					<li><a href={LINKEDIN_URL} target="_blank" rel="noopener">LinkedIn ↗</a></li>
				</ul>
			</aside>
		</div>
	</section>

	<section class="image-full">
		<img use:parallax src="{base}/images/container-operations.jpg" alt="" loading="lazy" />
		<div class="image-tint" aria-hidden="true"></div>
	</section>

	<section class="process">
		<div class="process-layout">
			<div class="process-text">
				<h2 use:reveal>{$_('home.handle.title')}</h2>
				<ol class="handle-list">
					{#each $json('home.handle.items') as HandleItem[] as item, i}
						<li use:reveal={{ delay: i * 90 }}>
							<span class="handle-num">{String(i + 1).padStart(2, '0')}</span>
							<div>
								<h3>{item.title}</h3>
								<p>{item.text}</p>
							</div>
						</li>
					{/each}
				</ol>
				<p class="risk-line" use:reveal>{$_('home.handle.risk')}</p>
				<p class="delivery-line" use:reveal>{$_('home.handle.delivery')}</p>
			</div>
			<div class="process-data">
				{#each $json('home.handle.data') as DataPoint[] as point, i}
					<div class="data-point" use:reveal={{ delay: 150 + i * 120 }}>
						<div class="data-number">{point.value}</div>
						<div class="data-label">{point.label}</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="image-split" id="products">
		<div class="split-left">
			<img use:parallax={0.08} src="{base}/images/port-operations.jpg" alt="" loading="lazy" />
			<div class="image-tint" aria-hidden="true"></div>
			<div class="split-caption" use:reveal={{ variant: 'fade', delay: 300 }}>
				{$_('home.categories.caption')}
			</div>
		</div>
		<div class="split-right">
			<div class="split-info">
				<h3 use:reveal>{$_('home.categories.title')}</h3>
				<div class="tiles">
					{#each segments as seg, i (seg.id)}
						<a class="tile" href="{base}{segmentHref(seg.id)}" use:reveal={{ delay: 80 + i * 90 }}>
							<span class="tile-head">
								<span class="tile-title">{$_(`productsPage.segments.${seg.id}.label`)}</span>
								<span class="tile-arrow btn-arrow" aria-hidden="true">→</span>
							</span>
							<span class="tile-text">
								{seg.lines.map((id) => $_(`productsPage.lineNames.${id}`)).join(', ')}
							</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<section class="contact-simple" id="contact">
		<div class="contact-glow" aria-hidden="true"></div>
		<div class="contact-wrapper">
			<span class="contact-rule" use:reveal={{ variant: 'rule' }}></span>
			<h2 use:reveal={{ delay: 100 }}>{$_('home.contact.title')}</h2>
			<p class="contact-description" use:reveal={{ delay: 200 }}>{$_('home.contact.description')}</p>
			<div use:reveal={{ delay: 300 }}>
				<button class="btn-gold contact-button" onclick={() => rfqOpen.set(true)}>
					{$_('home.contact.button')} <span class="btn-arrow" aria-hidden="true">→</span>
				</button>
			</div>
			<a class="contact-email" href="mailto:{RFQ_EMAIL}" use:reveal={{ delay: 400, variant: 'fade' }}>{RFQ_EMAIL}</a>
		</div>
	</section>
</main>

<style>
	main {
		position: relative;
	}

	/* ---------- Hero ---------- */

	.hero {
		position: relative;
		min-height: 100vh;
		min-height: 100svh;
		display: flex;
		align-items: center;
		padding: calc(var(--header-h) + 2rem) var(--gutter) 6rem;
		overflow: hidden;
		background:
			radial-gradient(ellipse 70% 60% at 72% 42%, rgba(36, 51, 82, 0.55), transparent 70%),
			linear-gradient(to bottom, var(--navy-950), var(--navy-900));
	}

	.hero-map {
		position: absolute;
		inset: 0;
		z-index: 0;
	}

	.hero-shade {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		background:
			linear-gradient(90deg, rgba(6, 10, 20, 0.92) 0%, rgba(6, 10, 20, 0.55) 38%, transparent 65%),
			linear-gradient(to top, var(--navy-900) 0%, transparent 28%);
	}

	:global(:root[dir='rtl']) .hero-shade {
		background:
			linear-gradient(-90deg, rgba(6, 10, 20, 0.92) 0%, rgba(6, 10, 20, 0.55) 38%, transparent 65%),
			linear-gradient(to top, var(--navy-900) 0%, transparent 28%);
	}

	.hero-inner {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 1280px;
		margin: 0 auto;
	}

	.hero-text {
		max-width: 980px;
	}

	.hero-text > .eyebrow,
	.subtitle {
		max-width: 480px;
	}

	.hero-title {
		margin: 1.75rem 0 0;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: clamp(3.2rem, 8.2vw, 8rem);
		line-height: 0.92;
		letter-spacing: -0.01em;
		color: var(--ink);
		text-transform: uppercase;
	}

	.hero-title .line {
		display: block;
		overflow: hidden;
		padding-bottom: 0.06em;
	}

	.hero-title .line > span {
		display: block;
	}

	/* Static gradient: animating background-position on clip-text repaints the
	   huge glyphs every frame and flickers in Safari and Chrome. */
	.hero-title .gold > span {
		background: linear-gradient(100deg, var(--gold-dark), var(--gold-light) 40%, var(--gold) 60%, var(--gold-dark));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		letter-spacing: 0.05em;
	}

	/* Staggered entrance for hero lines. */
	.hero-in {
		animation: heroUp 1.2s var(--ease-out) calc(0.15s + var(--i) * 0.12s) both;
	}

	.hero-title .line > .hero-in {
		animation-name: heroRise;
	}

	@keyframes heroUp {
		from {
			opacity: 0;
			transform: translateY(24px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes heroRise {
		from {
			transform: translateY(105%);
		}
		to {
			transform: none;
		}
	}

	.subtitle {
		margin: 2rem 0 0;
		max-width: 460px;
		font-size: 1.05rem;
		line-height: 1.7;
		color: var(--text);
	}

	.hero-ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 2.75rem;
	}

	.scroll-cue {
		position: absolute;
		z-index: 2;
		bottom: 2rem;
		left: 50%;
		width: 1px;
		height: 56px;
		background: var(--line-strong);
		overflow: hidden;
	}

	.scroll-cue span {
		position: absolute;
		inset: 0;
		background: linear-gradient(to bottom, transparent, var(--gold));
		animation: cue 2.2s var(--ease-in-out) infinite;
	}

	@keyframes cue {
		from {
			transform: translateY(-100%);
		}
		to {
			transform: translateY(100%);
		}
	}

	/* ---------- Overview ---------- */

	.overview {
		padding: clamp(5rem, 11vw, 9rem) var(--gutter);
		background: var(--navy-900);
	}

	.overview-content {
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.7fr 1fr;
		gap: clamp(2.5rem, 6vw, 6rem);
		align-items: center;
	}

	.overview-text {
		display: flex;
		flex-direction: column;
		gap: 1.4rem;
	}

	.overview-text p {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.8;
		color: var(--muted);
	}

	.overview-text p.lead {
		margin-top: 0.5rem;
		font-family: var(--font-display);
		font-size: clamp(1.7rem, 3vw, 2.4rem);
		font-weight: 500;
		line-height: 1.3;
		color: var(--ink);
	}

	.overview-rule {
		width: 120px;
	}

	.overview-detail {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 2.5rem;
		background: linear-gradient(160deg, var(--navy-800), var(--navy-850));
		border: 1px solid var(--line);
		box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.6);
	}

	.overview-detail::before {
		content: '';
		position: absolute;
		top: -1px;
		inset-inline: -1px;
		height: 2px;
		background: linear-gradient(90deg, var(--gold-dark), var(--gold-light), var(--gold-dark));
	}

	.detail-label {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.24em;
		color: var(--gold);
	}

	.detail-value {
		font-family: var(--font-display);
		font-size: 1.8rem;
		font-weight: 600;
		color: var(--ink);
	}

	.facts {
		list-style: none;
		margin: 0.75rem 0 0;
		padding: 1.25rem 0 0;
		border-top: 1px solid var(--line);
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		font-size: 0.9rem;
		color: var(--muted);
	}

	.facts a {
		color: var(--text);
		text-decoration: none;
		transition: color 0.3s;
	}

	.facts a:hover {
		color: var(--gold-light);
	}

	/* ---------- Photography ---------- */

	.image-full {
		position: relative;
		height: clamp(320px, 62vh, 640px);
		overflow: hidden;
	}

	.image-full img,
	.split-left img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		filter: grayscale(35%) contrast(1.08) brightness(0.8);
		will-change: transform;
	}

	/* Navy duotone over the photos so they sit in the palette. */
	.image-tint {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(to bottom, var(--navy-900), transparent 25%, transparent 70%, var(--navy-900)),
			linear-gradient(135deg, rgba(11, 18, 32, 0.55), rgba(201, 164, 92, 0.12));
		mix-blend-mode: normal;
		pointer-events: none;
	}

	/* ---------- What we handle ---------- */

	.process {
		padding: clamp(5rem, 10vw, 8rem) var(--gutter);
		background: var(--navy-900);
	}

	.process-layout {
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.5fr 1fr;
		gap: clamp(3rem, 7vw, 7rem);
	}

	.process-text h2 {
		margin: 0 0 3rem;
		font-family: var(--font-display);
		font-size: clamp(2.2rem, 4.5vw, 3.4rem);
		font-weight: 600;
		line-height: 1.05;
		color: var(--ink);
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	.handle-list {
		list-style: none;
		margin: 0 0 3rem;
		padding: 0;
		display: flex;
		flex-direction: column;
	}

	.handle-list li {
		position: relative;
		display: flex;
		gap: 1.75rem;
		align-items: flex-start;
		padding: 1.5rem 0;
		border-top: 1px solid var(--line);
		transition: background-color 0.4s var(--ease-out);
	}

	.handle-list li:last-child {
		border-bottom: 1px solid var(--line);
	}

	.handle-list li::before {
		content: '';
		position: absolute;
		top: -1px;
		inset-inline-start: 0;
		width: 100%;
		height: 1px;
		background: var(--gold);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.6s var(--ease-out);
	}

	:global(:root[dir='rtl']) .handle-list li::before {
		transform-origin: right;
	}

	.handle-list li:hover::before {
		transform: scaleX(1);
	}

	.handle-num {
		flex-shrink: 0;
		min-width: 2.5rem;
		font-family: var(--font-display);
		font-size: 1.6rem;
		font-weight: 600;
		line-height: 1;
		color: var(--gold);
	}

	.handle-list h3 {
		margin: 0 0 0.4rem;
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--ink);
	}

	.handle-list p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.7;
		color: var(--muted);
	}

	.risk-line {
		margin: 0;
		padding: 1.5rem 1.75rem;
		background: linear-gradient(90deg, var(--gold-wash), transparent);
		border-inline-start: 2px solid var(--gold);
		color: var(--ink);
		font-weight: 500;
		line-height: 1.7;
	}

	:global(:root[dir='rtl']) .risk-line {
		background: linear-gradient(-90deg, var(--gold-wash), transparent);
	}

	.delivery-line {
		margin: 1.5rem 0 0;
		font-size: 0.95rem;
		line-height: 1.7;
		color: var(--muted);
	}

	.process-data {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding-top: 6rem;
	}

	.data-point {
		position: relative;
		padding: 2rem 2rem 1.75rem;
		background: linear-gradient(160deg, var(--navy-800), var(--navy-850));
		border: 1px solid var(--line);
		transition:
			border-color 0.4s var(--ease-out),
			transform 0.4s var(--ease-out);
	}

	.data-point:hover {
		border-color: var(--gold-line);
		transform: translateY(-3px);
	}

	.data-number {
		font-family: var(--font-display);
		font-size: clamp(2.8rem, 5vw, 3.6rem);
		font-weight: 600;
		line-height: 1;
		letter-spacing: 0.04em;
		margin-bottom: 0.75rem;
		background: linear-gradient(135deg, var(--gold-light), var(--gold) 55%, var(--gold-dark));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.data-label {
		font-size: 0.88rem;
		line-height: 1.5;
		color: var(--muted);
	}

	/* ---------- Categories ---------- */

	.image-split {
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		min-height: 70vh;
		background: var(--navy-850);
	}

	.split-left {
		position: relative;
		overflow: hidden;
		min-height: 420px;
	}

	.split-caption {
		position: absolute;
		bottom: 2rem;
		inset-inline-start: 2rem;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.22em;
		color: var(--ink);
		background: rgba(6, 10, 20, 0.7);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		padding: 0.75rem 1.1rem;
		border: 1px solid var(--gold-line);
	}

	.split-right {
		display: flex;
		align-items: center;
	}

	.split-info {
		width: 100%;
		padding: clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 4rem);
	}

	.split-info h3 {
		margin: 0 0 2rem;
		font-family: var(--font-display);
		font-size: clamp(2rem, 3.5vw, 2.8rem);
		font-weight: 600;
		line-height: 1.1;
		color: var(--ink);
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	.tiles {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.tile {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 1.3rem 1.5rem;
		background: rgba(11, 18, 32, 0.6);
		border: 1px solid var(--line);
		text-decoration: none;
		overflow: hidden;
		transition:
			border-color 0.4s var(--ease-out),
			background-color 0.4s var(--ease-out),
			transform 0.4s var(--ease-out);
	}

	.tile::before {
		content: '';
		position: absolute;
		inset-block: 0;
		inset-inline-start: 0;
		width: 2px;
		background: var(--gold);
		transform: scaleY(0.35);
		transition: transform 0.5s var(--ease-out);
	}

	.tile:hover {
		border-color: var(--gold-line);
		background: rgba(26, 38, 64, 0.6);
	}

	.tile:hover::before {
		transform: scaleY(1);
	}

	.tile-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.tile-title {
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		color: var(--ink);
		text-transform: uppercase;
	}

	.tile-arrow {
		color: var(--gold);
	}

	.tile-text {
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--muted);
	}

	/* ---------- Contact ---------- */

	.contact-simple {
		position: relative;
		overflow: hidden;
		padding: clamp(6rem, 14vw, 11rem) var(--gutter);
		background: var(--navy-950);
		border-top: 1px solid var(--line);
	}

	.contact-glow {
		position: absolute;
		left: 50%;
		top: 50%;
		width: min(1100px, 140vw);
		aspect-ratio: 2 / 1;
		transform: translate(-50%, -50%);
		background: radial-gradient(ellipse at center, rgba(201, 164, 92, 0.13), transparent 62%);
		animation: glow 9s var(--ease-in-out) infinite alternate;
		pointer-events: none;
	}

	@keyframes glow {
		from {
			opacity: 0.6;
			transform: translate(-50%, -50%) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1.05);
		}
	}

	.contact-wrapper {
		position: relative;
		max-width: 860px;
		margin: 0 auto;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.contact-rule {
		width: 80px;
		margin-bottom: 2.5rem;
		background: linear-gradient(90deg, transparent, var(--gold), transparent) !important;
		transform-origin: center !important;
	}

	.contact-wrapper h2 {
		margin: 0 0 2rem;
		font-family: var(--font-display);
		font-size: clamp(2.6rem, 7vw, 5.2rem);
		font-weight: 600;
		line-height: 1;
		color: var(--ink);
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	.contact-description {
		margin: 0 0 3rem;
		font-size: 1.1rem;
		line-height: 1.8;
		color: var(--muted);
	}

	.contact-button {
		padding: 1.3rem 2.75rem;
		font-size: 0.8rem;
	}

	.contact-email {
		display: block;
		margin-top: 1.75rem;
		color: var(--dim);
		font-size: 0.9rem;
		text-decoration: none;
		transition: color 0.3s;
	}

	.contact-email:hover {
		color: var(--gold-light);
	}

	/* ---------- Responsive ---------- */

	@media (max-width: 1100px) {
		.overview-content,
		.process-layout {
			grid-template-columns: 1fr;
		}

		.process-data {
			padding-top: 0;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
		}

		.image-split {
			grid-template-columns: 1fr;
		}

		.split-left {
			min-height: 50vh;
		}
	}

	@media (max-width: 900px) {
		.hero {
			flex-direction: column;
			justify-content: flex-start;
			align-items: stretch;
			min-height: auto;
			padding: calc(var(--header-h) + 2.5rem) var(--gutter) 0;
		}

		/* On phones the map becomes a band below the headline, zoomed to the Atlantic–Gulf corridor. */
		.hero-map {
			position: relative;
			inset: auto;
			order: 2;
			direction: ltr;
			height: 82vw;
			margin: 1.5rem calc(var(--gutter) * -1) -1rem;
			overflow: hidden;
		}

		.hero-map :global(.route-map) {
			width: 175%;
			height: auto;
			aspect-ratio: 2 / 1;
			margin-left: -40%;
		}

		.hero-shade {
			background: linear-gradient(to top, var(--navy-900) 0%, transparent 18%);
		}

		:global(:root[dir='rtl']) .hero-shade {
			background: linear-gradient(to top, var(--navy-900) 0%, transparent 18%);
		}

		.hero-text {
			max-width: none;
		}

		.overview {
			padding-top: 3rem;
		}

		.hero-title {
			font-size: clamp(2.6rem, 13.5vw, 6rem);
		}

		.subtitle {
			font-size: 1rem;
		}

		.hero-ctas {
			flex-direction: column;
		}

		.hero-ctas > * {
			width: 100%;
		}

		.scroll-cue {
			display: none;
		}
	}

	@media (max-width: 640px) {
		.process-data {
			grid-template-columns: 1fr;
		}

		.overview-detail {
			padding: 2rem 1.5rem;
		}

		.data-point {
			padding: 1.5rem;
		}

		.split-caption {
			inset-inline: 1rem auto;
			bottom: 1rem;
		}

		.tile {
			padding: 1.1rem 1.2rem;
		}
	}
</style>
