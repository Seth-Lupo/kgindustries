import { writable } from 'svelte/store';

export const RFQ_EMAIL = 'info@kgindustries.us';
export const LINKEDIN_URL = 'https://www.linkedin.com/company/kg-industries-us/';

export const rfqOpen = writable(false);

// Product labels collected from "Add to RFQ" buttons.
export const rfqItems = writable<string[]>([]);

export function toggleRfqItem(label: string) {
	rfqItems.update((items) =>
		items.includes(label) ? items.filter((i) => i !== label) : [...items, label]
	);
}

export function buildRfqMailto(product: string, port: string) {
	const subject = `RFQ – ${product || '[Product]'} – ${port || '[Destination port]'}`;
	const body = [
		'Company:',
		`Product / item numbers: ${product}`,
		'Specification:',
		'Quantity:',
		`Destination port / city: ${port}`,
		'Target delivery:',
		'Current supplier price (optional):'
	].join('\n');
	return `mailto:${RFQ_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
