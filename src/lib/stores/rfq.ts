import { writable, get } from 'svelte/store';

export const RFQ_EMAIL = 'info@kgindustries.us';
export const LINKEDIN_URL = 'https://www.linkedin.com/company/kg-industries-us/';

// Pallets per container for beverage loads.
export const PALLETS_20FT = 12;
export const PALLETS_40FT = 24;

// Kept encoded so the number is never plain text in the page or bundle,
// which cuts down on scraping. Decoded only when the WhatsApp button is used.
const WA = 'MTUwMjg1NTkwMTg=';

export interface RfqItem {
	key: string;
	// English label, used in the email so our team reads the same text for every locale.
	label: string;
	// Localized label shown in the panel.
	display: string;
	kind: 'pallet' | 'general';
	qty: number;
	casesPerPallet?: number;
	pack?: number;
	notes: string;
}

export const rfqOpen = writable(false);
export const rfqItems = writable<RfqItem[]>([]);
// Key of the item whose notes field should get focus when the panel opens.
export const rfqFocusKey = writable<string | null>(null);

export function hasItem(key: string) {
	return get(rfqItems).some((i) => i.key === key);
}

export function togglePallet(item: Omit<RfqItem, 'kind' | 'qty' | 'notes'>) {
	rfqItems.update((items) =>
		items.some((i) => i.key === item.key)
			? items.filter((i) => i.key !== item.key)
			: [...items, { ...item, kind: 'pallet', qty: 1, notes: '' }]
	);
}

// Opens the panel with a general (non-pallet) line pre-selected so the buyer can add detail.
export function openRfqFor(key: string, label: string, display: string) {
	if (!hasItem(key)) {
		rfqItems.update((items) => [...items, { key, label, display, kind: 'general', qty: 1, notes: '' }]);
	}
	rfqFocusKey.set(key);
	rfqOpen.set(true);
}

export function updateItem(key: string, patch: Partial<RfqItem>) {
	rfqItems.update((items) => items.map((i) => (i.key === key ? { ...i, ...patch } : i)));
}

export function removeItem(key: string) {
	rfqItems.update((items) => items.filter((i) => i.key !== key));
}

export function totalPallets(items: RfqItem[]) {
	return items.filter((i) => i.kind === 'pallet').reduce((sum, i) => sum + i.qty, 0);
}

export interface RfqDraft {
	items: RfqItem[];
	other: string;
	delivery: 'port' | 'door';
	port: string;
	door: string;
}

function itemLine(i: RfqItem) {
	if (i.kind === 'pallet') {
		const plural = i.qty === 1 ? 'pallet' : 'pallets';
		return `- ${i.label}: ${i.qty} ${plural} (${i.casesPerPallet} cases × ${i.pack} per pallet)`;
	}
	return `- ${i.label}${i.notes.trim() ? `: ${i.notes.trim()}` : ''}`;
}

function draftBody(d: RfqDraft) {
	const pallets = totalPallets(d.items);
	const lines = ['Company:', 'Products:'];
	lines.push(...d.items.map(itemLine));
	if (d.other.trim()) lines.push(`- ${d.other.trim()}`);
	if (pallets) {
		const fit =
			pallets <= PALLETS_20FT
				? `fits one 20' container (${PALLETS_20FT} pallets)`
				: pallets <= PALLETS_40FT
					? `fits one 40' container (${PALLETS_40FT} pallets)`
					: `more than one 40' container`;
		lines.push(`Total soda pallets: ${pallets} (${fit})`);
	}
	lines.push(
		'Specification:',
		'Quantity:',
		d.delivery === 'door'
			? `Delivery: to our door / warehouse: ${d.door.trim()} (nearest port: ${d.port.trim()})`
			: `Delivery: CIP to port: ${d.port.trim()}`,
		'Target delivery:',
		'Current supplier price (optional):'
	);
	return lines.join('\n');
}

function draftSubject(d: RfqDraft) {
	const names = [...d.items.map((i) => i.label), d.other.trim()].filter(Boolean);
	const product = names.length
		? names[0] + (names.length > 1 ? ` + ${names.length - 1} more` : '')
		: '[Product]';
	return `RFQ – ${product} – ${d.port.trim() || '[Destination port]'}`;
}

export function buildRfqMailto(d: RfqDraft) {
	return `mailto:${RFQ_EMAIL}?subject=${encodeURIComponent(draftSubject(d))}&body=${encodeURIComponent(draftBody(d))}`;
}

export function openWhatsApp(d: RfqDraft) {
	const text = `${draftSubject(d)}\n\n${draftBody(d)}`;
	window.open(`https://wa.me/${atob(WA)}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
}
