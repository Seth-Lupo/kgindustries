import { error } from '@sveltejs/kit';
import { segments } from '$lib/data/segments';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => segments.map((s) => ({ segment: s.id }));

export const load: PageLoad = ({ params }) => {
	const segment = segments.find((s) => s.id === params.segment);
	if (!segment) error(404, 'Not found');
	return { segment };
};
