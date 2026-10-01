// Buyer types on the products page. Each one gets its own page listing only the
// product lines that buyer is likely to want, in the order shown here.

// Lines quoted as a single RFQ line (no per-SKU catalog). Copy lives in productsPage.lines.
export type GeneralLineId =
	| 'foodservice'
	| 'facility'
	| 'gloves'
	| 'packaging'
	| 'mro'
	| 'ford'
	| 'otherBrands';
export type LineId = 'beverages' | 'consumer' | GeneralLineId;

export type SegmentId = 'retail' | 'hospitality' | 'industrial' | 'automotive';

export interface Segment {
	id: SegmentId;
	lines: LineId[];
	// English SEO copy; on-page text comes from productsPage.segments.<id>.
	seoTitle: string;
	seoDescription: string;
}

export const segments: Segment[] = [
	{
		id: 'retail',
		lines: ['beverages', 'consumer'],
		seoTitle: 'Retail Buyers | US Beverages and Consumer Goods | KG Industries',
		seoDescription:
			'US soft drinks by the pallet and US grocery and consumer brands for supermarkets, importers, and distributors. Pricing quoted per RFQ, delivered to your business.'
	},
	{
		id: 'hospitality',
		lines: ['foodservice', 'facility', 'beverages'],
		seoTitle: 'Hospitality Buyers | Cambro, Facility Supply, US Beverages | KG Industries',
		seoDescription:
			'Cambro foodservice equipment, facility supply, and US beverages for hotels, restaurants, caterers, and institutional kitchens. Pricing quoted per RFQ, delivered to your business.'
	},
	{
		id: 'industrial',
		lines: ['gloves', 'packaging', 'mro'],
		seoTitle: 'Industrial & Commercial Buyers | Gloves, Packaging, MRO | KG Industries',
		seoDescription:
			'Rhinoskin nitrile gloves, packaging and processing equipment, and MRO and industrial supply from US and European manufacturers. Pricing quoted per RFQ, delivered to your business.'
	},
	{
		id: 'automotive',
		lines: ['ford', 'otherBrands'],
		seoTitle: 'Automotive Parts Buyers | Genuine Ford OEM Parts | KG Industries',
		seoDescription:
			'Genuine Ford OEM parts for US-spec vehicles, sourced through the US dealer network. Pricing quoted per RFQ, delivered to your business.'
	}
];

export const segmentHref = (id: SegmentId) => `/products/${id}/`;

export const isSegmentId = (id: string | null): id is SegmentId =>
	segments.some((s) => s.id === id);

// Full beverage catalog; buyer pages show a short preview and link here.
export const beverageCatalogHref = (from: SegmentId) => `/products/beverages/?from=${from}`;
