<script lang="ts">
	import { _, json } from 'svelte-i18n';
	import SEO from '$lib/components/SEO.svelte';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

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
	type TableRow = { item: string; kg: boolean; buyer: boolean; note?: string };

	let activeFlag = $state(0);

	onMount(() => {
		const interval = setInterval(() => {
			activeFlag = (activeFlag + 1) % destinations.length;
		}, 1500);
		return () => clearInterval(interval);
	});
</script>

<SEO
	title="How It Works | KG Industries"
	description="From RFQ to CIP/CIF delivery: KG Industries buys in the US as the domestic purchaser, handles US export, and delivers to your named port."
	canonical="/how-it-works"
/>

<div class="container">
	<div class="grain"></div>

	<div class="how-page">
	<section class="how-hero">
		<div class="hero-content">
			<h1>{$_('howItWorks.hero.title')}</h1>
			<p>{$_('howItWorks.hero.subtitle')}</p>
		</div>
	</section>

	<section class="process-flow">
		<div class="flow-content">
			<ol class="flow-main">
				<li class="flow-line" aria-hidden="true"></li>
				<!-- CONFIRM: RFQ response-time promise (step 2), only one we will always meet -->
				{#each $json('howItWorks.steps') as Step[] as step, i}
					<li class="flow-step">
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
			<div class="incoterms">
				<h2>{$_('howItWorks.incoterms.title')}</h2>
				{#each $json('howItWorks.incoterms.items') as Term[] as t}
					<div class="term">
						<h3>{t.term}</h3>
						<p>{t.text}</p>
					</div>
				{/each}
				<p class="term-risk">{$_('howItWorks.incoterms.risk')}</p>
				<p class="term-other">{$_('howItWorks.incoterms.other')}</p>
			</div>

			<div class="who-table">
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
								<td class="mark">{row.kg ? '✓' : ''}</td>
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

	.how-page {
		min-height: 100vh;
		padding-top: 5rem;
		background: #050508;
	}

	.how-hero {
		padding: 8rem 4vw;
		border-bottom: 1px solid #1a1a22;
		text-align: center;
	}

	.hero-content h1 {
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 900;
		letter-spacing: 0.05em;
		color: #ffffff;
		margin: 0 0 1.5rem 0;
		text-transform: uppercase;
	}

	.hero-content p {
		font-size: 1rem;
		color: #a1a1aa;
		margin: 0;
		font-weight: 400;
	}

	.process-flow {
		padding: 12rem 0;
		background: #0a0a0d;
		position: relative;
	}

	.flow-content {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 4vw;
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 4rem;
	}

	.flow-main {
		position: relative;
		padding: 0;
		padding-inline-end: 2rem;
		margin: 0;
		list-style: none;
		align-self: start;
	}

	.flow-line {
		position: absolute;
		top: 0;
		left: 35%;
		width: 1px;
		height: 100%;
		background: linear-gradient(to bottom, transparent, #1a1a22 20%, #1a1a22 80%, transparent);
	}

	.flow-step {
		max-width: 560px;
		margin: 0 auto 4.5rem auto;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		position: relative;
	}

	.flow-step:last-child {
		margin-bottom: 0;
	}

	.flow-sidebar {
		position: relative;
		align-self: stretch;
		min-height: 100%;
	}

	.sidebar-sticky {
		position: sticky;
		top: 180px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding: 1.5rem;
		padding-left: 1.5rem;
		background: linear-gradient(to right, rgba(28, 113, 216, 0.04), transparent 30%);
		border-left: 2px solid #1c71d8;
		box-shadow: inset 4px 0 12px -6px rgba(28, 113, 216, 0.2);
	}

	.flag-img {
		width: 100%;
		max-width: 180px;
		aspect-ratio: 3 / 2;
		border: 2px solid #1a1a22;
		overflow: hidden;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
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
		transition: opacity 0.5s ease;
	}

	.flag-bottom img.active {
		opacity: 1;
	}

	.arrow-container {
		position: relative;
		width: 32px;
		height: 128px;
	}

	.arrow-track {
		position: absolute;
		inset: 0;
		clip-path: polygon(
			/* Shaft top-left */ 11px 0%,
			/* Shaft top-right */ 21px 0%,
			/* Shaft bottom-right */ 21px 100px,
			/* Triangle right */ 100% 100px,
			/* Triangle bottom */ 50% 100%,
			/* Triangle left */ 0% 100px,
			/* Shaft bottom-left */ 11px 100px
		);
		background: #18181b;
		overflow: hidden;
	}

	.arrow-track::before {
		content: '';
		position: absolute;
		inset: 0;
		clip-path: inherit;
		border: 1px solid #27272a;
		background: transparent;
		pointer-events: none;
	}

	.fluid {
		position: absolute;
		left: 0;
		width: 100%;
		height: 70px;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			rgba(28, 113, 216, 0.2) 15%,
			rgba(28, 113, 216, 0.7) 40%,
			rgba(59, 130, 246, 0.9) 50%,
			rgba(28, 113, 216, 0.7) 60%,
			rgba(28, 113, 216, 0.2) 85%,
			transparent 100%
		);
		animation: fluidFlow 2.2s ease-in-out infinite;
	}

	@keyframes fluidFlow {
		0% {
			top: -70px;
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		100% {
			top: 128px;
			opacity: 0;
		}
	}

	.arrow-mask {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.arrow-mask::before {
		content: '';
		position: absolute;
		top: 0;
		left: 11px;
		width: 10px;
		height: 100px;
		border: 1px solid #27272a;
		border-bottom: none;
		border-radius: 5px 5px 0 0;
		box-sizing: border-box;
	}

	.arrow-mask::after {
		content: '';
		position: absolute;
		top: 99px;
		left: 0;
		width: 32px;
		height: 29px;
		clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
		border: 1px solid #27272a;
	}

	.step-label {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		color: #52525b;
		text-transform: uppercase;
	}

	.step-text {
		font-size: clamp(1.5rem, 3vw, 2.25rem);
		font-weight: 500;
		color: #ffffff;
		line-height: 1.3;
		letter-spacing: -0.02em;
	}

	.step-description {
		font-size: 1rem;
		font-weight: 400;
		color: #a1a1aa;
		line-height: 1.6;
		max-width: 480px;
	}

	.step-who {
		font-size: 0.8rem;
		font-weight: 600;
		color: #1c71d8;
		letter-spacing: 0.02em;
	}

	.terms {
		position: relative;
		z-index: 2;
		padding: 6rem 4vw;
		border-top: 1px solid #1a1a22;
		background: #050508;
	}

	.terms-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: start;
	}

	.terms h2 {
		font-size: 1.3rem;
		font-weight: 900;
		letter-spacing: 0.08em;
		color: #ffffff;
		margin: 0 0 1.5rem;
		text-transform: uppercase;
	}

	.incoterms {
		background: #0a0a0d;
		border: 1px solid #1a1a22;
		border-inline-start: 3px solid #1c71d8;
		padding: 2rem;
	}

	.term + .term {
		margin-top: 1.25rem;
	}

	.term h3 {
		margin: 0 0 0.4rem;
		font-size: 0.95rem;
		font-weight: 700;
		color: #ffffff;
	}

	.term p,
	.term-risk,
	.term-other {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.6;
		color: #a1a1aa;
	}

	.term-risk {
		margin-top: 1.5rem;
		padding-top: 1.25rem;
		border-top: 1px solid #1a1a22;
		color: #d4d4d8;
		font-weight: 600;
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
		text-align: start;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #71717a;
		padding: 0 0.5rem 0.75rem;
		border-bottom: 1px solid #27272a;
	}

	td {
		padding: 0.8rem 0.5rem;
		border-bottom: 1px solid #1a1a22;
		color: #d4d4d8;
		line-height: 1.5;
		vertical-align: top;
	}

	th:not(:first-child),
	td.mark {
		text-align: center;
		width: 4.5rem;
	}

	td.mark {
		color: #1c71d8;
		font-weight: 700;
	}

	.mark-note {
		display: block;
		font-size: 0.7rem;
		font-weight: 400;
		color: #71717a;
	}

	@media (max-width: 1200px) {
		.flow-content {
			grid-template-columns: 1fr 200px;
			gap: 2rem;
		}

		.arrow-container {
			height: 100px;
		}

		.arrow-track {
			clip-path: polygon(
				11px 0%,
				21px 0%,
				21px 72px,
				100% 72px,
				50% 100%,
				0% 72px,
				11px 72px
			);
		}

		.arrow-mask::before {
			height: 72px;
		}

		.arrow-mask::after {
			top: 71px;
		}

		@keyframes fluidFlow {
			0% {
				top: -70px;
				opacity: 0;
			}
			10% {
				opacity: 1;
			}
			85% {
				opacity: 1;
			}
			100% {
				top: 100px;
				opacity: 0;
			}
		}
	}

	@media (max-width: 768px) {
		.flow-sidebar {
			display: none;
		}

		.flow-content {
			grid-template-columns: 1fr;
		}

		.flow-main {
			padding-inline-end: 0;
		}

		.flow-line {
			display: none;
		}

		.terms-inner {
			grid-template-columns: 1fr;
			gap: 3rem;
		}

		.incoterms {
			padding: 1.5rem 1.25rem;
		}
	}

	@media (max-width: 900px) {
		.how-hero {
			padding: 4rem 4vw;
		}

		.process-flow {
			padding: 4rem 4vw;
		}

		.flow-step {
			margin-bottom: 3rem;
		}

		.terms {
			padding: 4rem 4vw;
		}
	}
</style>
