<script lang="ts">
	import { _, json } from 'svelte-i18n';
	import SEO from '$lib/components/SEO.svelte';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import { reveal } from '$lib/actions/motion';

	const destinations = [
		{ file: 'azerbaijan-flag.png', name: 'Azerbaijan' },
		{ file: 'uae-flag.png', name: 'United Arab Emirates' },
		{ file: 'saudi-arabia-flag.png', name: 'Saudi Arabia' },
		{ file: 'qatar-flag.png', name: 'Qatar' },
		{ file: 'egypt-flag.png', name: 'Egypt' },
		{ file: 'georgia-flag.png', name: 'Georgia' },
		{ file: 'portugal-flag.png', name: 'Portugal' },
		{ file: 'brazil-flag.png', name: 'Brazil' },
		{ file: 'kazakhstan-flag.png', name: 'Kazakhstan' }
	];

	type Step = { title: string; text: string; who?: string };
	type Term = { term: string; text: string };
	type TableRow = { item: string; kg: boolean; buyer: boolean; kgNote?: string; note?: string };

	let activeFlag = $state(0);
	let flow: HTMLOListElement;
	let progress = $state(0);

	onMount(() => {
		const interval = setInterval(() => {
			activeFlag = (activeFlag + 1) % destinations.length;
		}, 1800);

		// Fill the timeline as the reader moves through the steps.
		let frame = 0;
		const update = () => {
			frame = 0;
			const rect = flow.getBoundingClientRect();
			const anchor = window.innerHeight * 0.6;
			progress = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		update();
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			clearInterval(interval);
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<SEO
	title="How It Works | KG Industries"
	description="From RFQ to delivery: KG Industries buys in the US as the domestic purchaser, handles US export, and quotes CIP to your port as standard, with door delivery on request."
	canonical="/how-it-works"
/>

<div class="page-wrap">
	<div class="how-page">
	<PageHero title={$_('howItWorks.hero.title')} subtitle={$_('howItWorks.hero.subtitle')} />

	<section class="delivery-callout">
		<div class="delivery-inner">
			<h2 use:reveal>{$_('howItWorks.delivery.title')}</h2>
			<div class="delivery-grid">
				{#each $json('howItWorks.delivery.points') as Term[] as point, i}
					<div class="delivery-point" use:reveal={{ delay: i * 110 }}>
						<h3>{point.term}</h3>
						<p>{point.text}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="process-flow">
		<div class="flow-content">
			<ol class="flow-main" bind:this={flow}>
				<li class="flow-line" aria-hidden="true">
					<span class="flow-fill" style="transform: scaleY({progress})"></span>
				</li>
				<!-- CONFIRM: RFQ response-time promise (step 2), only one we will always meet -->
				{#each $json('howItWorks.steps') as Step[] as step, i}
					<li class="flow-step" use:reveal>
						<span class="step-node" aria-hidden="true"></span>
						<div class="step-label">{String(i + 1).padStart(2, '0')}</div>
						<div class="step-text">{step.title}</div>
						<div class="step-description">{step.text}</div>
						{#if step.who}<div class="step-who">{step.who}</div>{/if}
					</li>
				{/each}
			</ol>

			<div class="flow-sidebar">
				<div class="sidebar-sticky">
					<div class="flag-img flag-top">
						<img
							src="{base}/images/us-flag.png"
							alt="US"
						/>
					</div>
					<div class="arrow-container">
						<div class="arrow-track">
							<div class="fluid"></div>
						</div>
						<div class="arrow-mask"></div>
					</div>
					<div class="flag-img flag-bottom">
						{#each destinations as dest, i}
							<img
								src="{base}/images/{dest.file}"
								alt={dest.name}
								class:active={i === activeFlag}
								aria-hidden={i !== activeFlag}
							/>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="terms">
		<div class="terms-inner">
			<div class="incoterms" use:reveal>
				<h2>{$_('howItWorks.incoterms.title')}</h2>
				{#each $json('howItWorks.incoterms.items') as Term[] as t}
					<div class="term">
						<h3>{t.term}</h3>
						<p>{t.text}</p>
					</div>
				{/each}
				<p class="term-base">{$_('howItWorks.incoterms.base')}</p>
				<p class="term-risk">{$_('howItWorks.incoterms.risk')}</p>
				<p class="term-other">{$_('howItWorks.incoterms.other')}</p>
			</div>

			<div class="who-table" use:reveal={{ delay: 150 }}>
				<h2>{$_('howItWorks.table.title')}</h2>
				<table>
					<thead>
						<tr>
							<th scope="col">{$_('howItWorks.table.item')}</th>
							<th scope="col">KG</th>
							<th scope="col">{$_('howItWorks.table.buyer')}</th>
						</tr>
					</thead>
					<tbody>
						{#each $json('howItWorks.table.rows') as TableRow[] as row}
							<tr>
								<td>{row.item}</td>
								<td class="mark">
									{row.kg ? '✓' : ''}
									{#if row.kgNote}<span class="mark-note">{row.kgNote}</span>{/if}
								</td>
								<td class="mark">
									{row.buyer ? '✓' : ''}
									{#if row.note}<span class="mark-note">{row.note}</span>{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</section>

	</div>
</div>

<style>
	.page-wrap {
		position: relative;
		min-height: 100vh;
		width: 100%;
		overflow-x: clip;
	}

	.how-page {
		min-height: 100vh;
		background: var(--navy-900);
	}

	/* ---------- Delivery callout ---------- */

	.delivery-callout {
		position: relative;
		padding: clamp(4rem, 8vw, 6rem) var(--gutter);
		background: var(--navy-900);
	}

	.delivery-inner {
		max-width: 1280px;
		margin: 0 auto;
	}

	.delivery-inner h2,
	.terms h2 {
		margin: 0 0 2.25rem;
		font-family: var(--font-display);
		font-size: clamp(1.9rem, 3.5vw, 2.6rem);
		font-weight: 600;
		line-height: 1.1;
		letter-spacing: 0.02em;
		color: var(--ink);
		text-transform: uppercase;
	}

	.delivery-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.25rem;
	}

	.delivery-point {
		position: relative;
		padding: 2rem 1.75rem;
		background: linear-gradient(165deg, var(--navy-800), var(--navy-850));
		border: 1px solid var(--line);
		transition:
			border-color 0.45s var(--ease-out),
			translate 0.45s var(--ease-out);
	}

	.delivery-point::before {
		content: '';
		position: absolute;
		top: -1px;
		inset-inline: -1px;
		height: 2px;
		background: linear-gradient(90deg, var(--gold-dark), var(--gold-light), var(--gold-dark));
	}

	.delivery-point:last-child::before {
		background: var(--line-strong);
	}

	.delivery-point:hover {
		border-color: var(--gold-line);
		translate: 0 -3px;
	}

	.delivery-point h3 {
		margin: 0 0 0.75rem;
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--gold-light);
	}

	.delivery-point p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.7;
		color: var(--muted);
	}

	/* ---------- Process timeline ---------- */

	.process-flow {
		position: relative;
		padding: clamp(5rem, 10vw, 9rem) 0;
		background:
			radial-gradient(ellipse 50% 40% at 85% 30%, rgba(201, 164, 92, 0.06), transparent 70%),
			var(--navy-950);
		border-block: 1px solid var(--line);
	}

	.flow-content {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 var(--gutter);
		display: grid;
		grid-template-columns: 1fr 280px;
		gap: clamp(2rem, 6vw, 6rem);
	}

	.flow-main {
		position: relative;
		margin: 0;
		padding: 0;
		padding-inline-start: 4rem;
		list-style: none;
		align-self: start;
	}

	.flow-line {
		position: absolute;
		top: 0.4rem;
		bottom: 0.4rem;
		inset-inline-start: 0.75rem;
		width: 1px;
		background: var(--line-strong);
	}

	.flow-fill {
		position: absolute;
		inset: 0;
		background: linear-gradient(to bottom, var(--gold-dark), var(--gold-light));
		box-shadow: 0 0 12px var(--gold-glow);
		transform-origin: top;
		transition: transform 0.15s linear;
	}

	.flow-step {
		position: relative;
		max-width: 640px;
		margin: 0 0 4.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.flow-step:last-child {
		margin-bottom: 0;
	}

	.step-node {
		position: absolute;
		top: 0.1rem;
		inset-inline-start: calc(-4rem + 0.75rem - 6px);
		width: 13px;
		height: 13px;
		background: var(--navy-950);
		border: 1px solid var(--line-strong);
		transform: rotate(45deg);
		transition:
			background-color 0.6s var(--ease-out) 0.3s,
			border-color 0.6s var(--ease-out) 0.3s,
			box-shadow 0.6s var(--ease-out) 0.3s;
	}

	.flow-step:global(.is-visible) .step-node {
		background: var(--gold);
		border-color: var(--gold-light);
		box-shadow: 0 0 0 5px rgba(201, 164, 92, 0.12);
	}

	.step-label {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.26em;
		color: var(--gold);
		text-transform: uppercase;
	}

	.step-text {
		font-family: var(--font-display);
		font-size: clamp(1.7rem, 3.2vw, 2.5rem);
		font-weight: 600;
		line-height: 1.15;
		color: var(--ink);
	}

	.step-description {
		max-width: 520px;
		font-size: 1rem;
		line-height: 1.75;
		color: var(--muted);
	}

	.step-who {
		width: fit-content;
		margin-top: 0.25rem;
		padding: 0.35rem 0.8rem;
		border: 1px solid var(--gold-line);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		color: var(--gold-light);
	}

	/* ---------- Flag sidebar ---------- */

	.flow-sidebar {
		position: relative;
		align-self: stretch;
	}

	.sidebar-sticky {
		position: sticky;
		top: calc(var(--header-h) + 5rem);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 2rem 1.5rem;
		background: linear-gradient(170deg, var(--navy-800), var(--navy-900));
		border: 1px solid var(--gold-line);
		box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.8);
	}

	.flag-img {
		width: 100%;
		max-width: 170px;
		aspect-ratio: 3 / 2;
		overflow: hidden;
		border: 1px solid var(--line-strong);
		box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.7);
	}

	.flag-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.flag-bottom {
		position: relative;
	}

	.flag-bottom img {
		position: absolute;
		inset: 0;
		opacity: 0;
		transform: scale(1.08);
		transition:
			opacity 0.8s var(--ease-out),
			transform 1.6s var(--ease-out);
	}

	.flag-bottom img.active {
		opacity: 1;
		transform: none;
	}

	.arrow-container {
		position: relative;
		width: 20px;
		height: 110px;
	}

	.arrow-track {
		position: absolute;
		top: 0;
		bottom: 8px;
		left: 50%;
		width: 1px;
		background: var(--gold-line);
		overflow: hidden;
	}

	.fluid {
		position: absolute;
		left: 0;
		width: 100%;
		height: 40px;
		background: linear-gradient(to bottom, transparent, var(--gold-light), transparent);
		box-shadow: 0 0 8px var(--gold);
		animation: fluidFlow 2s var(--ease-in-out) infinite;
	}

	@keyframes fluidFlow {
		from {
			top: -40px;
		}
		to {
			top: 100%;
		}
	}

	.arrow-mask {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.arrow-mask::after {
		content: '';
		position: absolute;
		bottom: 3px;
		left: 50%;
		width: 10px;
		height: 10px;
		border-inline-end: 1px solid var(--gold);
		border-bottom: 1px solid var(--gold);
		transform: translateX(-50%) rotate(45deg);
	}

	/* ---------- Terms ---------- */

	.terms {
		position: relative;
		padding: clamp(4rem, 9vw, 7rem) var(--gutter);
		background: var(--navy-900);
	}

	.terms-inner {
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(2.5rem, 5vw, 5rem);
		align-items: start;
	}

	.incoterms {
		position: relative;
		padding: clamp(1.5rem, 3vw, 2.5rem);
		background: linear-gradient(170deg, var(--navy-800), var(--navy-850));
		border: 1px solid var(--line);
	}

	.incoterms::before {
		content: '';
		position: absolute;
		top: -1px;
		inset-inline: -1px;
		height: 2px;
		background: linear-gradient(90deg, var(--gold-dark), var(--gold-light), var(--gold-dark));
	}

	.term {
		padding: 1.1rem 0;
		border-top: 1px solid var(--line);
	}

	.term h3 {
		margin: 0 0 0.4rem;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--ink);
	}

	.term p,
	.term-risk,
	.term-other {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.7;
		color: var(--muted);
	}

	.term-base {
		margin: 1.25rem 0 0 !important;
		padding: 1.1rem 1.25rem;
		background: linear-gradient(90deg, var(--gold-wash), transparent);
		border-inline-start: 2px solid var(--gold);
		color: var(--ink) !important;
		font-weight: 500;
		line-height: 1.6;
	}

	:global(:root[dir='rtl']) .term-base {
		background: linear-gradient(-90deg, var(--gold-wash), transparent);
	}

	.term-risk {
		margin-top: 1.5rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--line);
		color: var(--text);
		font-weight: 500;
	}

	.term-other {
		margin-top: 0.75rem;
		font-size: 0.85rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	th {
		padding: 0 0.75rem 0.9rem;
		border-bottom: 1px solid var(--gold-line);
		text-align: start;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--gold);
	}

	td {
		padding: 0.95rem 0.75rem;
		border-bottom: 1px solid var(--line);
		color: var(--text);
		line-height: 1.55;
		vertical-align: top;
		transition: background-color 0.3s;
	}

	tbody tr:hover td {
		background: rgba(255, 255, 255, 0.02);
	}

	th:not(:first-child),
	td.mark {
		text-align: center;
		width: 4.75rem;
	}

	td.mark {
		color: var(--gold-light);
		font-weight: 700;
	}

	.mark-note {
		display: block;
		font-size: 0.7rem;
		font-weight: 400;
		color: var(--dim);
	}

	@media (max-width: 1100px) {
		.flow-content {
			grid-template-columns: 1fr 200px;
		}
	}

	@media (max-width: 900px) {
		.flow-sidebar {
			display: none;
		}

		.flow-content,
		.terms-inner,
		.delivery-grid {
			grid-template-columns: 1fr;
		}

		.flow-main {
			padding-inline-start: 2.75rem;
		}

		.step-node {
			inset-inline-start: calc(-2.75rem + 0.75rem - 6px);
		}

		.flow-step {
			margin-bottom: 3.25rem;
		}
	}
</style>
