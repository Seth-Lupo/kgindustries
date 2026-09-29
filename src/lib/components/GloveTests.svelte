<script lang="ts">
	import { tick } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { gloveReports, nitrileResistance } from '$lib/data/gloves';
	import { rfqLabels } from '$lib/data/rfqLabels';
	import { openRfqFor, rfqOpen } from '$lib/stores/rfq';

	let { open = $bindable(false) }: { open: boolean } = $props();
	let dialog: HTMLDivElement | undefined = $state();

	const ratings = ['excellent', 'good', 'fair', 'poor'] as const;

	$effect(() => {
		document.body.style.overflow = open || $rfqOpen ? 'hidden' : '';
		if (open) tick().then(() => dialog?.focus());
	});

	function requestReports() {
		open = false;
		openRfqFor('gloveReports', rfqLabels.gloveReports, $_('gloves.requestItem'));
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
	<div class="backdrop" onclick={() => (open = false)}></div>
	<div
		class="modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="glove-title"
		tabindex="-1"
		bind:this={dialog}
	>
		<div class="head">
			<h2 id="glove-title">{$_('gloves.title')}</h2>
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

		<p class="disclaimer">{$_('gloves.disclaimer')}</p>

		<button class="primary" onclick={requestReports}>{$_('gloves.requestFull')}</button>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		z-index: 250;
	}

	.modal {
		position: fixed;
		z-index: 251;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(760px, calc(100vw - 2rem));
		max-height: calc(100vh - 2rem);
		max-height: calc(100dvh - 2rem);
		overflow-y: auto;
		background: #0a0a0d;
		border: 1px solid #27272a;
		padding: 1.75rem;
		color: #d4d4d8;
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
		color: #ffffff;
	}

	.close {
		flex-shrink: 0;
		background: none;
		border: 1px solid #27272a;
		color: #a1a1aa;
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
		color: #a1a1aa;
	}

	.reports {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin: 1.25rem 0 1.75rem;
	}

	.report {
		background: #050508;
		border: 1px solid #1a1a22;
		border-inline-start: 3px solid #1c71d8;
		padding: 1.1rem;
	}

	.report h3,
	.chart-title {
		margin: 0 0 0.5rem;
		font-size: 0.95rem;
		font-weight: 700;
		color: #ffffff;
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
		color: #71717a;
	}

	dd {
		margin: 0;
		color: #d4d4d8;
	}

	.ratings {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin: 1rem 0 1.25rem;
	}

	.rating {
		padding: 0.8rem 1rem;
		background: #050508;
		border: 1px solid #1a1a22;
		border-inline-start: 3px solid #3f3f46;
	}

	.rating-excellent {
		border-inline-start-color: #57e389;
	}

	.rating-good {
		border-inline-start-color: #1c71d8;
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
		color: #ffffff;
	}

	.rating h4 span {
		color: #52525b;
		margin-inline-start: 0.4rem;
	}

	.rating p {
		margin: 0;
		font-size: 0.8rem;
		line-height: 1.7;
		color: #a1a1aa;
	}

	.disclaimer {
		font-size: 0.8rem;
		padding-top: 1rem;
		border-top: 1px solid #1a1a22;
	}

	.primary {
		margin-top: 1.25rem;
		width: 100%;
		padding: 1rem;
		background: #1c71d8;
		border: none;
		color: #ffffff;
		font-family: inherit;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		cursor: pointer;
	}

	.primary:hover {
		background: #3584e4;
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
