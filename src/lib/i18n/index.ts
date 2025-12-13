import { browser } from '$app/environment';
import { init, register, locale, getLocaleFromNavigator } from 'svelte-i18n';

const defaultLocale = 'en';

register('en', () => import('./en.json'));
register('az', () => import('./az.json'));
register('ru', () => import('./ru.json'));
register('tr', () => import('./tr.json'));
register('es', () => import('./es.json'));
register('zh', () => import('./zh.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? (localStorage.getItem('locale') || getLocaleFromNavigator()?.split('-')[0] || defaultLocale) : defaultLocale
});

export { locale };

export function setLocale(newLocale: string) {
	locale.set(newLocale);
	if (browser) {
		localStorage.setItem('locale', newLocale);
	}
}

export const supportedLocales = [
	{ code: 'en', name: 'English', flag: '🇺🇸' },
	{ code: 'az', name: 'Azərbaycanca', flag: '🇦🇿' },
	{ code: 'ru', name: 'Русский', flag: '🇷🇺' },
	{ code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
	{ code: 'es', name: 'Español', flag: '🇪🇸' },
	{ code: 'zh', name: '中文', flag: '🇨🇳' }
];
