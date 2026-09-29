<script lang="ts">
	import { _, json } from 'svelte-i18n';
	import { reveal } from '$lib/actions/motion';

	type Row = { label: string; text: string };

	let openRow = $state<number | null>(0);
</script>

<section class="requirements" id="order-info">
	<div class="req-container">
		<div class="req-header" use:reveal>
			<h2>{$_('productsPage.order.title')}</h2>
		</div>
		<div class="order-list" use:reveal={{ delay: 100 }}>
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
					<div class="order-text"><div>{row.text}</div></div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.requirements {
		position: relative;
		padding: clamp(4rem, 9vw, 7rem) var(--gutter);
		background: var(--navy-950);
		border-top: 1px solid var(--line);
		scroll-margin-top: var(--header-h);
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
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(2.2rem, 5vw, 3.6rem);
		font-weight: 600;
		letter-spacing: 0.03em;
		color: var(--ink);
		text-transform: uppercase;
	}

	.order-list {
		border-top: 1px solid var(--gold-line);
	}

	.order-row {
		display: grid;
		grid-template-columns: 260px 1fr;
		gap: 2rem;
		padding: 1.5rem 0;
		border-bottom: 1px solid var(--line);
		transition: background-color 0.4s var(--ease-out);
	}

	.order-label {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 0;
		background: none;
		border: none;
		text-align: start;
		font-family: inherit;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.18em;
		color: var(--gold);
		text-transform: uppercase;
		cursor: default;
		pointer-events: none;
	}

	.chev {
		display: none;
	}

	.order-text > div {
		overflow: hidden;
	}

	.order-text {
		font-size: 0.95rem;
		line-height: 1.75;
		color: var(--text);
	}

	/* Accordion on mobile */
	@media (max-width: 900px) {
		.order-row {
			grid-template-columns: 1fr;
			gap: 0;
			padding: 0;
		}

		.order-label {
			pointer-events: auto;
			cursor: pointer;
			padding: 1.25rem 0;
			width: 100%;
			color: var(--ink);
		}

		.chev {
			display: inline;
			font-size: 1.2rem;
			line-height: 1;
			color: var(--gold);
			transition: transform 0.4s var(--ease-out);
		}

		.order-row.open .chev {
			transform: rotate(45deg);
		}

		.order-text {
			display: grid;
			grid-template-rows: 0fr;
			color: var(--muted);
			transition:
				grid-template-rows 0.5s var(--ease-out),
				padding 0.5s var(--ease-out);
		}

		.order-row.open .order-text {
			grid-template-rows: 1fr;
			padding-bottom: 1.25rem;
		}
	}
</style>
