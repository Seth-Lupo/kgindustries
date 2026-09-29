<script lang="ts">
	import { base } from '$app/paths';

	interface Props {
		title?: string;
		description?: string;
		keywords?: string;
		canonical?: string;
		ogImage?: string;
		ogType?: string;
		noindex?: boolean;
	}

	const {
		title = 'KG Industries | US Sourcing and Export for International Buyers',
		description = 'US trading company supplying beverages, foodservice equipment, genuine Ford parts, and industrial goods to buyers in the Gulf, MENA, Caucasus, and Central Asia. Landed CIP/CIF quotes.',
		keywords = 'US sourcing, US export, US trading company, US beverages wholesale, foodservice equipment export, genuine Ford parts export, nitrile gloves, MRO sourcing, CIP, CIF, Gulf, MENA, Caucasus, Central Asia',
		canonical = '',
		ogImage = '/og-image.png',
		ogType = 'website',
		noindex = false
	}: Props = $props();

	const siteName = 'KG Industries';
	const siteUrl = 'https://kgindustries.us';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />

	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<meta name="robots" content="index, follow" />
	{/if}

	<link rel="canonical" href={canonical ? `${siteUrl}${canonical}` : siteUrl} />

	<!-- Open Graph -->
	<meta property="og:type" content={ogType} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical ? `${siteUrl}${canonical}` : siteUrl} />
	<meta property="og:image" content="{siteUrl}{base}{ogImage}" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="{siteUrl}{base}{ogImage}" />

	<!-- Additional SEO -->
	<meta name="author" content="KG Industries" />
	<meta name="geo.region" content="US" />
	<meta name="geo.placename" content="United States" />

	<!-- Structured Data - Organization -->
	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": "KG Industries",
		"legalName": "KG Industries LLC",
		"url": "${siteUrl}",
		"email": "info@kgindustries.us",
		"description": "${description}",
		"address": {
			"@type": "PostalAddress",
			"addressRegion": "DE",
			"addressCountry": "US"
		},
		"sameAs": ["https://www.linkedin.com/company/kg-industries-us/"],
		"areaServed": ["Gulf", "Middle East and North Africa", "Caucasus", "Central Asia", "Europe", "Latin America"]
	}
	</script>`}
</svelte:head>
