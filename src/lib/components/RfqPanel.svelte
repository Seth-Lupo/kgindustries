<script lang="ts">
	import { tick } from 'svelte';
	import { get } from 'svelte/store';
	import { _ } from 'svelte-i18n';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import {
		rfqOpen,
		rfqItems,
		rfqFocusKey,
		updateItem,
		removeItem,
		totalPallets,
		buildRfqMailto,
		openWhatsApp,
		PALLETS_20FT,
		PALLETS_40FT,
		RFQ_EMAIL,
		LINKEDIN_URL,
		type RfqDraft
	} from '$lib/stores/rfq';

	let other = $state('');
	let port = $state('');
	let door = $state('');
	let delivery = $state<'port' | 'door'>('door');
	let panel: HTMLDivElement | undefined = $state();

	const draft = $derived<RfqDraft>({ items: $rfqItems, other, delivery, port, door });
	const mailto = $derived(buildRfqMailto(draft));
	const pallets = $derived(totalPallets($rfqItems));
	const fitKey = $derived(
		pallets <= PALLETS_20FT ? 'rfq.fit20' : pallets <= PALLETS_40FT ? 'rfq.fit40' : 'rfq.over40'
	);

	$effect(() => {
		document.body.style.overflow = $rfqOpen ? 'hidden' : '';
		if ($rfqOpen) {
			// Read without subscribing, so clearing the key below doesn't re-run this effect.
			const key = get(rfqFocusKey);
			tick().then(() => {
				const target = key
					? panel?.querySelector<HTMLElement>(`[data-notes="${key}"]`)
					: panel?.querySelector<HTMLElement>('[data-first]');
				target?.focus();
				rfqFocusKey.set(null);
			});
		}
	});

	function isTyping(target: EventTarget | null) {
		const el = target as HTMLElement | null;
		if (!el) return false;
		return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName);
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

	// Slide in from the inline-end edge, which flips for Arabic.
	const slideX = () => (document.documentElement.dir === 'rtl' ? -480 : 480);

	const setQty = (key: string, qty: number) => updateItem(key, { qty: Math.max(1, Math.min(999, qty || 1)) });
</script>

<svelte:window onkeydown={handleKeydown} />

<button class="rfq-fab" onclick={() => rfqOpen.set(true)} aria-haspopup="dialog">
	{$_('nav.rfq')}
	{#if $rfqItems.length}<span class="count">{$rfqItems.length}</span>{/if}
</button>

{#if $rfqOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="rfq-backdrop" onclick={() => rfqOpen.set(false)} transition:fade={{ duration: 350 }}></div>
	<div
		class="rfq-panel"
		role="dialog"
		aria-modal="true"
		aria-labelledby="rfq-title"
		bind:this={panel}
		transition:fly={{ x: slideX(), duration: 550, easing: cubicOut, opacity: 1 }}
	>
		<div class="panel-head">
			<h2 id="rfq-title">{$_('rfq.title')}</h2>
			<button class="close" onclick={() => rfqOpen.set(false)} aria-label={$_('rfq.close')}>
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
					<path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
				</svg>
			</button>
		</div>

		<p class="intro">{$_('rfq.intro')}</p>
		<p class="response">{$_('rfq.response')}</p>

		{#if $rfqItems.length}
			<div class="selected">
				<div class="field-label">{$_('rfq.selected')}</div>
				<ul>
					{#each $rfqItems as item (item.key)}
						<li>
							<div class="item-row">
								<span class="item-name">{item.display}</span>
								<button class="remove" onclick={() => removeItem(item.key)} aria-label="{$_('rfq.remove')}: {item.display}">×</button>
							</div>
							{#if item.kind === 'pallet'}
								<div class="qty">
									<span class="qty-label">{$_('rfq.pallets')}</span>
									<div class="stepper">
										<button onclick={() => setQty(item.key, item.qty - 1)} disabled={item.qty <= 1} aria-label="−">−</button>
										<input
											type="number"
											min="1"
											inputmode="numeric"
											value={item.qty}
											aria-label="{$_('rfq.pallets')}: {item.display}"
											oninput={(e) => setQty(item.key, parseInt(e.currentTarget.value))}
										/>
										<button onclick={() => setQty(item.key, item.qty + 1)} aria-label="+">+</button>
									</div>
								</div>
							{:else}
								<textarea
									data-notes={item.key}
									rows="2"
									placeholder={$_('rfq.detailsPh')}
									value={item.notes}
									aria-label="{$_('rfq.details')}: {item.display}"
									oninput={(e) => updateItem(item.key, { notes: e.currentTarget.value })}
								></textarea>
							{/if}
						</li>
					{/each}
				</ul>
				{#if pallets}
					<p class="pallet-total">
						<strong>{$_('rfq.totalPallets', { values: { n: pallets } })}</strong>
						· {$_(fitKey)}
					</p>
					<p class="hint">{$_('rfq.palletHint')}</p>
				{/if}
				<button class="text-btn" onclick={() => rfqItems.set([])}>{$_('rfq.clear')}</button>
			</div>
		{/if}

		<label class="field">
			<span class="field-label">{$_('rfq.product')}</span>
			<input data-first bind:value={other} placeholder={$_('rfq.productPh')} />
		</label>

		<fieldset class="field delivery">
			<legend class="field-label">{$_('rfq.delivery')}</legend>
			<label class="radio">
				<input type="radio" bind:group={delivery} value="door" />
				<span>{$_('rfq.deliveryDoor')}</span>
			</label>
			<label class="radio">
				<input type="radio" bind:group={delivery} value="port" />
				<span>{$_('rfq.deliveryPort')}</span>
			</label>
		</fieldset>

		<label class="field">
			<span class="field-label">{$_('rfq.destination')}</span>
			<input bind:value={port} placeholder={$_('rfq.destinationPh')} />
		</label>
		{#if delivery === 'door'}
			<label class="field">
				<span class="field-label">{$_('rfq.doorLabel')}</span>
				<input bind:value={door} placeholder={$_('rfq.doorPh')} />
			</label>
		{/if}

		<a class="btn-gold primary" href={mailto}>{$_('rfq.emailButton')}</a>
		<button class="secondary whatsapp" onclick={() => openWhatsApp(draft)}>{$_('rfq.whatsapp')}</button>
		<p class="note">{$_('rfq.emailNote')} <a href="mailto:{RFQ_EMAIL}">{RFQ_EMAIL}</a></p>

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
		padding: 1rem 1.35rem;
		background: linear-gradient(135deg, var(--gold-light), var(--gold) 50%, var(--gold-dark));
		color: var(--navy-950);
		border: none;
		font-family: inherit;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		box-shadow:
			0 12px 32px -8px rgba(0, 0, 0, 0.7),
			0 8px 24px -12px var(--gold-glow);
		cursor: pointer;
		animation: fabIn 0.8s var(--ease-out) 0.6s both;
	}

	@keyframes fabIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.count {
		background: var(--navy-950);
		color: var(--gold-light);
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
		background: rgba(4, 7, 14, 0.7);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		z-index: 300;
	}

	.rfq-panel {
		position: fixed;
		top: 0;
		bottom: 0;
		inset-inline-end: 0;
		width: min(440px, 100vw);
		z-index: 301;
		background: linear-gradient(175deg, var(--navy-800), var(--navy-900) 40%);
		border-inline-start: 1px solid var(--gold-line);
		box-shadow: -30px 0 80px -20px rgba(0, 0, 0, 0.8);
		padding: 1.75rem 1.75rem 2rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		color: var(--text);
		box-sizing: border-box;
	}

	/* The panel scrolls; keep children from being squeezed by the flex column. */
	.rfq-panel > :global(*) {
		flex-shrink: 0;
	}

	.panel-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	h2 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.8rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		color: var(--ink);
	}

	.close {
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

	.close:hover {
		color: var(--ink);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.intro,
	.note,
	.bank,
	.shortcut {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--muted);
	}

	.note {
		font-size: 0.8rem;
	}

	.note a {
		color: var(--text);
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
		color: var(--dim);
		text-transform: uppercase;
	}

	input {
		background: var(--navy-900);
		border: 1px solid var(--line-strong);
		color: var(--ink);
		padding: 0.8rem 0.9rem;
		font-family: inherit;
		font-size: 1rem;
	}

	input:focus {
		outline: none;
		border-color: var(--gold);
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
		background: var(--navy-900);
		border: 1px solid var(--line);
		font-size: 0.85rem;
	}

	.selected li {
		flex-direction: column;
		align-items: stretch;
	}

	.item-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}

	.item-name {
		color: var(--ink);
		font-weight: 600;
	}

	.remove {
		background: none;
		border: none;
		color: var(--dim);
		font-size: 1.1rem;
		cursor: pointer;
	}

	.qty {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}

	.qty-label {
		font-size: 0.75rem;
		color: var(--dim);
	}

	.stepper {
		display: flex;
		align-items: stretch;
		border: 1px solid var(--line-strong);
	}

	.stepper button {
		width: 34px;
		background: var(--navy-800);
		border: none;
		color: var(--ink);
		font-size: 1rem;
		cursor: pointer;
	}

	.stepper button:disabled {
		color: rgba(255, 255, 255, 0.2);
		cursor: default;
	}

	.stepper input {
		width: 52px;
		padding: 0.4rem;
		border: none;
		border-inline: 1px solid var(--line-strong);
		text-align: center;
		font-size: 0.95rem;
		-moz-appearance: textfield;
		appearance: textfield;
	}

	.stepper input::-webkit-outer-spin-button,
	.stepper input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	textarea {
		background: var(--navy-850);
		border: 1px solid var(--line-strong);
		color: var(--ink);
		padding: 0.6rem 0.7rem;
		font-family: inherit;
		font-size: 0.9rem;
		resize: vertical;
	}

	textarea:focus {
		outline: none;
		border-color: var(--gold);
	}

	.pallet-total {
		margin: 0.25rem 0 0;
		font-size: 0.85rem;
		color: var(--text);
	}

	.hint {
		margin: 0.25rem 0 0.5rem;
		font-size: 0.8rem;
		line-height: 1.5;
		color: var(--dim);
	}

	.response {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ink);
		padding: 0.6rem 0.75rem;
		background: rgba(201, 164, 92, 0.12);
		border-inline-start: 2px solid var(--gold);
	}

	.delivery {
		border: none;
		margin: 0;
		padding: 0;
	}

	.delivery legend {
		margin-bottom: 0.4rem;
		padding: 0;
	}

	.radio {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.6rem 0.75rem;
		border: 1px solid var(--line-strong);
		background: var(--navy-900);
		font-size: 0.9rem;
		cursor: pointer;
	}

	.radio + .radio {
		margin-top: 0.4rem;
	}

	.radio:has(input:checked) {
		border-color: var(--gold);
		color: var(--ink);
	}

	.radio input {
		accent-color: var(--gold);
		padding: 0;
	}

	.whatsapp {
		background: transparent;
		font-family: inherit;
		cursor: pointer;
		width: 100%;
	}

	.text-btn {
		background: none;
		border: none;
		padding: 0;
		color: var(--dim);
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
		margin-top: 0.5rem;
	}

	.secondary {
		border: 1px solid var(--line-strong);
		color: var(--text);
	}

	.secondary:hover {
		border-color: var(--gold);
		color: var(--ink);
	}

	.bank {
		font-size: 0.8rem;
		padding: 0.75rem;
		border-inline-start: 2px solid var(--gold);
		background: var(--navy-900);
	}

	.shortcut {
		font-size: 0.75rem;
		color: var(--dim);
	}

	@media (max-width: 768px) {
		.shortcut {
			display: none;
		}
	}
</style>
