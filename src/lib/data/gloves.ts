// Nitrile glove test data, summarized from independent lab reports
// (ASTM D6978 permeation, A2LA ISO 17025-accredited laboratory).
// The source reports carry manufacturer branding, so they are not published;
// buyers can request the full reports through the RFQ panel.

export interface GloveReport {
	glove: 'black' | 'orange';
	tested: string;
	method: string;
	agent: string;
	temperature: string;
	specimens: number;
	observation: 'swellDeg' | 'swellNoDeg';
}

export const gloveReports: GloveReport[] = [
	{
		glove: 'black',
		tested: '2023-05',
		method: 'ASTM D6978-05(2019)',
		agent: 'Fentanyl citrate injection, 100 mcg/2 mL',
		temperature: '35 °C',
		specimens: 3,
		observation: 'swellDeg'
	},
	{
		glove: 'orange',
		tested: '2020-04',
		method: 'ASTM D6978',
		agent: 'Fentanyl citrate injection, 100 mcg/2 mL',
		temperature: '35 °C',
		specimens: 3,
		observation: 'swellNoDeg'
	}
];

// General nitrile chemical resistance ratings (from the manufacturer's chart).
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
