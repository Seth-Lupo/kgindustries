// Rhinoskin nitrile glove test data, summarized from independent lab reports
// (ASTM D6978 permeation, A2LA ISO 17025-accredited laboratory). The full
// reports are published unaltered in static/assets/docs.

export interface GloveReport {
	glove: 'black' | 'orange';
	tested: string;
	method: string;
	agent: string;
	temperature: string;
	specimens: number;
	observation: 'swellDeg' | 'swellNoDeg';
	pdf: string;
}

export const GLOVE_CHART_PDF = '/assets/docs/rhinoskin-chemical-resistance-chart.pdf';

export const gloveReports: GloveReport[] = [
	{
		glove: 'black',
		tested: '2023-05',
		method: 'ASTM D6978-05(2019)',
		agent: 'Fentanyl citrate injection, 100 mcg/2 mL',
		temperature: '35 °C',
		specimens: 3,
		observation: 'swellDeg',
		pdf: '/assets/docs/rhinoskin-black-nitrile-fentanyl-permeation-2023.pdf'
	},
	{
		glove: 'orange',
		tested: '2020-04',
		method: 'ASTM D6978',
		agent: 'Fentanyl citrate injection, 100 mcg/2 mL',
		temperature: '35 °C',
		specimens: 3,
		observation: 'swellNoDeg',
		pdf: '/assets/docs/rhinoskin-orange-nitrile-fentanyl-permeation-2020.pdf'
	}
];

// General nitrile chemical resistance ratings (from the Rhinoskin chart).
export const nitrileResistance: Record<'excellent' | 'good' | 'fair' | 'poor', string[]> = {
	excellent: [
		'Ammonium hydroxide',
		'Animal fats',
		'Asphalt',
		'Benzyl alcohol',
		'Bleach',
		'Boric acid',
		'Brake fluid',
		'Citric acid 10%',
		'Creosote',
		'Cutting oil',
		'Cyclohexane',
		'Diesel fuel',
		'Diethanolamine',
		'Diethyl ether',
		'Ethanol',
		'Ethylene glycol',
		'Fertilizers',
		'Fish and shellfish',
		'Fluorides',
		'Formaldehyde 37% (formalin)',
		'Fuel oil',
		'Gasoline',
		'Hexane',
		'Hydraulic fluid',
		'Hydrochloric acid 30%',
		'Hydrofluoric acid 30%',
		'Hydrogen peroxide',
		'Kerosene',
		'Linseed oil',
		'Methanol',
		'Mineral oils',
		'Naphtha',
		'Oleic acid',
		'Phosphoric acid',
		'Photo developer / fixer',
		'Pine oil',
		'Poultry',
		'Silicates',
		'Sodium hypochlorite',
		'Sulfuric acid (diluted)',
		'Turpentine',
		'Vegetable oil',
		'Weed killer',
		'Wood preservatives'
	],
	good: [
		'Acetic acid',
		'Carbon tetrachloride',
		'Dioctyl phthalate (DOP)',
		'Household detergent',
		'Naphthalene',
		'Perchloroethylene',
		'Stearic acid',
		'Trinitrobenzene',
		'Xylene'
	],
	fair: [
		'Acetaldehyde',
		'Amyl acetate',
		'Aniline',
		'Butyl acetate',
		'Chromic acid 50%',
		'Methyl formate',
		'Nitric acid 20%',
		'Nitrobenzene',
		'Potassium hydroxide 50%',
		'Propylene dichloride',
		'Sodium hydroxide 50%',
		'Toluene'
	],
	poor: [
		'Acetone',
		'Chloroacetone',
		'Ethyl acetate',
		'Methyl ethyl ketone (MEK)',
		'Sulfuric acid (concentrated)',
		'Tetrahydrofuran (THF)'
	]
};
