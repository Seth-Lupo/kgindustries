<script lang="ts">
	import { tick } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { _ } from 'svelte-i18n';
	import { base } from '$app/paths';
	import { gloveReports, nitrileResistance, GLOVE_CHART_PDF } from '$lib/data/gloves';
	import { rfqLabels } from '$lib/data/rfqLabels';
	import { openRfqFor, rfqOpen } from '$lib/stores/rfq';

	let { open = $bindable(false) }: { open: boolean } = $props();
	let dialog: HTMLDivElement | undefined = $state();

	const ratings = ['excellent', 'good', 'fair', 'poor'] as const;

	$effect(() => {
		document.body.style.overflow = open || $rfqOpen ? 'hidden' : '';
		if (open) tick().then(() => dialog?.focus());
	});

	function requestQuote() {
		open = false;
		openRfqFor('gloves', rfqLabels.gloves, $_('gloves.requestItem'));
	}

	function handleKeydown(e: KeyboardEvent) {
		if (open && e.key === 'Escape') {
			e.stopPropagation();
			open = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="backdrop" onclick={() => (open = false)} transition:fade={{ duration: 300 }}></div>
	<div
		class="modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="glove-title"
		tabindex="-1"
		bind:this={dialog}
		transition:scale={{ start: 0.96, duration: 450, easing: cubicOut }}
	>
		<div class="head">
			<div class="brand">
				<img src="{base}/assets/brands/rhinoskin-logo.webp" alt="Rhinoskin" width="446" height="399" />
				<h2 id="glove-title">{$_('gloves.title')}</h2>
			</div>
			<button class="close" onclick={() => (open = false)} aria-label={$_('rfq.close')}>
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
					<path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
				</svg>
			</button>
		</div>

		<p class="intro">{$_('gloves.intro')}</p>

		<div class="reports">
			{#each gloveReports as r (r.glove)}
				<section class="report">
					<h3>{$_(`gloves.${r.glove}`)}</h3>
					<p class="result">{$_('gloves.result')}</p>
					<dl>
						<div><dt>{$_('gloves.method')}</dt><dd>{r.method}</dd></div>
						<div><dt>{$_('gloves.agent')}</dt><dd>{r.agent}</dd></div>
						<div><dt>{$_('gloves.conditions')}</dt><dd>{r.temperature} · {$_('gloves.specimens', { values: { n: r.specimens } })}</dd></div>
						<div><dt>{$_('gloves.observation')}</dt><dd>{$_(`gloves.${r.observation}`)}</dd></div>
						<div><dt>{$_('gloves.tested')}</dt><dd>{r.tested}</dd></div>
					</dl>
					<a class="pdf" href="{base}{r.pdf}" target="_blank" rel="noopener">{$_('gloves.viewReport')} ↗</a>
				</section>
			{/each}
		</div>

		<h3 class="chart-title">{$_('gloves.chartTitle')}</h3>
		<p class="chart-note">{$_('gloves.chartNote')}</p>
		<div class="ratings">
			{#each ratings as rating (rating)}
				<div class="rating rating-{rating}">
					<h4>{$_(`gloves.${rating}`)} <span>{nitrileResistance[rating].length}</span></h4>
					<p>{nitrileResistance[rating].join(' · ')}</p>
				</div>
			{/each}
		</div>
		<a class="pdf" href="{base}{GLOVE_CHART_PDF}" target="_blank" rel="noopener">{$_('gloves.viewChart')} ↗</a>

		<p class="disclaimer">{$_('gloves.disclaimer')}</p>

		<button class="primary" onclick={requestQuote}>{$_('gloves.requestFull')}</button>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(4, 7, 14, 0.75);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		z-index: 250;
	}

	.modal {
		position: fixed;
		z-index: 251;
		inset: 0;
		margin: auto;
		height: fit-content;
		width: min(760px, calc(100vw - 2rem));
		max-height: calc(100vh - 2rem);
		max-height: calc(100dvh - 2rem);
		overflow-y: auto;
		background: linear-gradient(175deg, var(--navy-800), var(--navy-900) 40%);
		border: 1px solid var(--gold-line);
		box-shadow: 0 40px 100px -30px rgba(0, 0, 0, 0.9);
		padding: 2rem;
		color: var(--text);
		box-sizing: border-box;
		outline: none;
	}

	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.75rem;
	}

	h2 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 900;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.brand img {
		width: 64px;
		height: auto;
		flex-shrink: 0;
		background: #ffffff;
		padding: 4px;
	}

	.pdf {
		display: inline-block;
		margin-top: 0.9rem;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gold-light);
		text-decoration: none;
	}

	.pdf:hover {
		color: var(--ink);
		text-decoration: underline;
	}

	.ratings + .pdf {
		margin: -0.5rem 0 1.25rem;
	}

	.close {
		flex-shrink: 0;
		background: none;
		border: 1px solid var(--line-strong);
		color: var(--muted);
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.intro,
	.chart-note,
	.disclaimer {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--muted);
	}

	.reports {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin: 1.25rem 0 1.75rem;
	}

	.report {
		background: var(--navy-900);
		border: 1px solid var(--line);
		border-inline-start: 3px solid var(--gold);
		padding: 1.1rem;
	}

	.report h3,
	.chart-title {
		margin: 0 0 0.5rem;
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--ink);
	}

	.result {
		margin: 0 0 0.75rem;
		font-size: 0.9rem;
		font-weight: 700;
		color: #57e389;
	}

	dl {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		font-size: 0.8rem;
	}

	dt {
		color: var(--dim);
	}

	dd {
		margin: 0;
		color: var(--text);
	}

	.ratings {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin: 1rem 0 1.25rem;
	}

	.rating {
		padding: 0.8rem 1rem;
		background: var(--navy-900);
		border: 1px solid var(--line);
		border-inline-start: 3px solid rgba(255, 255, 255, 0.2);
	}

	.rating-excellent {
		border-inline-start-color: #57e389;
	}

	.rating-good {
		border-inline-start-color: #6fa8dc;
	}

	.rating-fair {
		border-inline-start-color: #f5c211;
	}

	.rating-poor {
		border-inline-start-color: #e01b24;
	}

	.rating h4 {
		margin: 0 0 0.35rem;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink);
	}

	.rating h4 span {
		color: var(--dim);
		margin-inline-start: 0.4rem;
	}

	.rating p {
		margin: 0;
		font-size: 0.8rem;
		line-height: 1.7;
		color: var(--muted);
	}

	.disclaimer {
		font-size: 0.8rem;
		padding-top: 1rem;
		border-top: 1px solid var(--line);
	}

	.primary {
		margin-top: 1.25rem;
		width: 100%;
		padding: 1rem;
		background: linear-gradient(135deg, var(--gold-light), var(--gold) 50%, var(--gold-dark));
		border: none;
		color: var(--navy-950);
		font-family: inherit;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		cursor: pointer;
	}

	.primary:hover {
		filter: brightness(1.08);
	}

	@media (max-width: 640px) {
		.modal {
			padding: 1.25rem 1rem;
		}

		.reports {
			grid-template-columns: 1fr;
		}
	}
</style>
