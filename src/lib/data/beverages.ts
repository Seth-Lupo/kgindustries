// US beverage range (34 SKUs). Display order leads with specialty items that
// local bottlers in export markets do not produce.

// Pallet configurations from the July 2026 deck. Never show prices here.
// Each RFQ line for a beverage is one pallet; buyers adjust the count in the RFQ panel.
export const BEVERAGE_LEAD_TIME_WEEKS = 5;

export type Origin = 'US' | 'MX';
export type Size = 'glass355' | 'glass500';

export interface Beverage {
	name: string;
	image: string | null;
	origin: Origin;
	// Container size is only set where confirmed; omitted otherwise.
	size?: Size;
	pack: number;
	casesPerPallet: number;
	unitsPerPallet: number;
}

export interface BeverageFamily {
	id: string;
	items: Beverage[];
}

const img = (slug: string) => `/assets/products/beverages/${slug}.webp`;

const us = (name: string, slug: string | null, cases: number): Beverage => ({
	name,
	image: slug ? img(slug) : null,
	origin: 'US',
	pack: 24,
	casesPerPallet: cases,
	unitsPerPallet: cases * 24
});

const mx = (name: string, slug: string, size: Size, cases: number): Beverage => ({
	name,
	image: img(slug),
	origin: 'MX',
	size,
	pack: 24,
	casesPerPallet: cases,
	unitsPerPallet: cases * 24
});

export const beverageFamilies: BeverageFamily[] = [
	{
		id: 'crush',
		items: [
			us('Crush Orange', 'crush-orange', 100),
			us('Crush Grape', 'crush-grape', 100),
			us('Crush Strawberry', 'crush-strawberry', 100),
			us('Crush Peach', 'crush-peach', 100),
			us('Crush Pineapple', 'crush-pineapple', 100)
		]
	},
	{
		id: 'specialty',
		items: [
			us('Dr Pepper Vanilla Float', 'dr-pepper-vanilla-float', 104),
			us('Mountain Dew Baja Blast', null, 120),
			us('Mug Root Beer', 'mug-root-beer', 100)
		]
	},
	{
		id: 'pepsi',
		items: [
			us('Pepsi Wild Cherry', 'pepsi-wild-cherry', 120),
			us('Pepsi Wild Cherry & Cream', 'pepsi-wild-cherry-and-cream', 120),
			us('Pepsi Real Sugar', 'pepsi-real-sugar', 120),
			us('Pepsi Classic', 'pepsi-classic', 120),
			us('Pepsi Caffeine Free', 'pepsi-caffeine-free', 100)
		]
	},
	{
		id: 'mexican',
		items: [
			mx('Mexican Coca-Cola', 'mexican-coca-cola-355ml-glass', 'glass355', 60),
			mx('Mexican Coca-Cola', 'mexican-coca-cola-500ml-glass', 'glass500', 48),
			mx('Mexican Fanta Orange', 'mexican-fanta-orange-355ml-glass', 'glass355', 60),
			mx('Mexican Sprite', 'mexican-sprite-355ml-glass', 'glass355', 60)
		]
	},
	{
		id: 'cocaCola',
		items: [
			us('Coca-Cola Cherry Float', 'coca-cola-cherry-float', 104),
			us('Coca-Cola Vanilla', 'coca-cola-vanilla', 104),
			us('Coca-Cola Cherry', 'coca-cola-cherry', 104),
			us('Coca-Cola Zero Sugar Vanilla', 'coca-cola-zero-sugar-vanilla', 104),
			us('Coca-Cola Zero Sugar Cherry', 'coca-cola-zero-sugar-cherry', 104),
			us('Coca-Cola Original', 'coca-cola-original', 104),
			us('Coca-Cola Zero Sugar', 'coca-cola-zero-sugar', 104),
			us('Coca-Cola Caffeine Free', 'coca-cola-caffeine-free', 104)
		]
	},
	{
		id: 'fanta',
		items: [
			us('Fanta Orange', 'fanta-orange', 104),
			us('Fanta Orange Zero Sugar', 'fanta-orange-zero-sugar', 104),
			us('Fanta Grape', 'fanta-grape', 104),
			us('Fanta Strawberry', 'fanta-strawberry', 104),
			us('Fanta Pineapple', 'fanta-pineapple', 104),
			us('Fanta Peach', 'fanta-peach', 104),
			us('Fanta Berry', 'fanta-berry', 104)
		]
	},
	{
		id: 'sprite',
		items: [
			us('Sprite Original', 'sprite-original', 104),
			us('Sprite Chill Cherry Lime', 'sprite-chill-cherry-lime', 104)
		]
	}
];
