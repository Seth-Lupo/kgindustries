<script lang="ts">
	import { tick } from 'svelte';
	import { _ } from 'svelte-i18n';
	import {
		rfqOpen,
		rfqItems,
		toggleRfqItem,
		buildRfqMailto,
		RFQ_EMAIL,
		LINKEDIN_URL
	} from '$lib/stores/rfq';

	let product = $state('');
	let port = $state('');
	let productInput: HTMLInputElement | undefined = $state();

	const productText = $derived(
		[...$rfqItems, product.trim()].filter(Boolean).join('; ')
	);
	const mailto = $derived(buildRfqMailto(productText, port.trim()));

	$effect(() => {
		document.body.style.overflow = $rfqOpen ? 'hidden' : '';
		if ($rfqOpen) tick().then(() => productInput?.focus());
	});

	function isTyping(target: EventTarget | null) {
		const el = target as HTMLElement | null;
		if (!el) return false;
		return (
			el.isContentEditable ||
			['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)
		);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && $rfqOpen) {
			rfqOpen.set(false);
			return;
		}
		if (e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
		// e.code covers non-Latin keyboard layouts (Russian, Arabic, etc.)
		if ((e.key === 'q' || e.key === 'Q' || e.code === 'KeyQ') && !$rfqOpen) {
			e.preventDefault();
			rfqOpen.set(true);
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<button class="rfq-fab" onclick={() => rfqOpen.set(true)} aria-haspopup="dialog">
	{$_('nav.rfq')}
	{#if $rfqItems.length}<span class="count">{$rfqItems.length}</span>{/if}
</button>

{#if $rfqOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="rfq-backdrop" onclick={() => rfqOpen.set(false)}></div>
	<div class="rfq-panel" role="dialog" aria-modal="true" aria-labelledby="rfq-title">
		<div class="panel-head">
			<h2 id="rfq-title">{$_('rfq.title')}</h2>
			<button class="close" onclick={() => rfqOpen.set(false)} aria-label={$_('rfq.close')}>
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
					<path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
				</svg>
			</button>
		</div>

		<p class="intro">{$_('rfq.intro')}</p>

		{#if $rfqItems.length}
			<div class="selected">
				<div class="field-label">{$_('rfq.selected')}</div>
				<ul>
					{#each $rfqItems as item (item)}
						<li>
							<span>{item}</span>
							<button onclick={() => toggleRfqItem(item)} aria-label="{$_('rfq.remove')}: {item}">×</button>
						</li>
					{/each}
				</ul>
				<button class="text-btn" onclick={() => rfqItems.set([])}>{$_('rfq.clear')}</button>
			</div>
		{/if}

		<label class="field">
			<span class="field-label">{$_('rfq.product')}</span>
			<input bind:this={productInput} bind:value={product} placeholder={$_('rfq.productPh')} />
		</label>
		<label class="field">
			<span class="field-label">{$_('rfq.destination')}</span>
			<input bind:value={port} placeholder={$_('rfq.destinationPh')} />
		</label>

		<a class="primary" href={mailto}>{$_('rfq.emailButton')}</a>
		<p class="note">{$_('rfq.emailNote')} <a href="mailto:{RFQ_EMAIL}">{RFQ_EMAIL}</a></p>

		<!-- CONFIRM: business WhatsApp number (wa.me link with the same pre-filled text) -->
		<!-- CONFIRM: optional short form, only via a backend the company controls -->

		<a class="secondary" href={LINKEDIN_URL} target="_blank" rel="noopener">{$_('rfq.linkedin')}</a>

		<p class="bank">{$_('rfq.bank')}</p>
		<p class="shortcut">{$_('rfq.shortcut')}</p>
	</div>
{/if}

<style>
	.rfq-fab {
		display: none;
		position: fixed;
		bottom: 1rem;
		inset-inline-end: 1rem;
		z-index: 150;
		align-items: center;
		gap: 0.5rem;
		padding: 0.9rem 1.2rem;
		background: #1c71d8;
		color: #ffffff;
		border: none;
		font-family: inherit;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5);
		cursor: pointer;
	}

	.count {
		background: #ffffff;
		color: #1c71d8;
		border-radius: 999px;
		min-width: 1.3rem;
		height: 1.3rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 0.7rem;
		letter-spacing: 0;
	}

	@media (max-width: 768px) {
		.rfq-fab {
			display: inline-flex;
		}
	}

	.rfq-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 300;
	}

	.rfq-panel {
		position: fixed;
		top: 0;
		bottom: 0;
		inset-inline-end: 0;
		width: min(440px, 100vw);
		z-index: 301;
		background: #0a0a0d;
		border-inline-start: 1px solid #27272a;
		padding: 1.75rem 1.5rem 2rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		color: #d4d4d8;
		box-sizing: border-box;
	}

	.panel-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	h2 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 900;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #ffffff;
	}

	.close {
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

	.close:hover {
		color: #ffffff;
		border-color: #3f3f46;
	}

	.intro,
	.note,
	.bank,
	.shortcut {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.6;
		color: #a1a1aa;
	}

	.note {
		font-size: 0.8rem;
	}

	.note a {
		color: #d4d4d8;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.field-label {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: #71717a;
		text-transform: uppercase;
	}

	input {
		background: #050508;
		border: 1px solid #27272a;
		color: #ffffff;
		padding: 0.8rem 0.9rem;
		font-family: inherit;
		font-size: 1rem;
	}

	input:focus {
		outline: none;
		border-color: #1c71d8;
	}

	.selected ul {
		list-style: none;
		margin: 0.5rem 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.selected li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: #050508;
		border: 1px solid #1a1a22;
		font-size: 0.85rem;
	}

	.selected li button {
		background: none;
		border: none;
		color: #71717a;
		font-size: 1.1rem;
		cursor: pointer;
	}

	.text-btn {
		background: none;
		border: none;
		padding: 0;
		color: #71717a;
		font-size: 0.8rem;
		text-decoration: underline;
		cursor: pointer;
	}

	.primary,
	.secondary {
		display: block;
		text-align: center;
		padding: 1rem;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-decoration: none;
	}

	.primary {
		background: #1c71d8;
		color: #ffffff;
		margin-top: 0.5rem;
	}

	.primary:hover {
		background: #3584e4;
	}

	.secondary {
		border: 1px solid #27272a;
		color: #d4d4d8;
	}

	.secondary:hover {
		border-color: #1c71d8;
		color: #ffffff;
	}

	.bank {
		font-size: 0.8rem;
		padding: 0.75rem;
		border-inline-start: 2px solid #1c71d8;
		background: #050508;
	}

	.shortcut {
		font-size: 0.75rem;
		color: #52525b;
	}

	@media (max-width: 768px) {
		.shortcut {
			display: none;
		}
	}
</style>
