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
		title = 'KG Industries - Global Freight Operations | US Export Logistics',
		description = 'KG Industries helps international businesses source and ship US-manufactured products worldwide. Full-service export logistics: sourcing, freight, customs, and delivery.',
		keywords = 'US export logistics, international freight, US manufactured products, B2B export, container shipping, customs clearance, American products export, global freight operations',
		canonical = '',
		ogImage = '/og-image.jpg',
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
		"url": "${siteUrl}",
		"logo": "${siteUrl}${base}/logo.png",
		"email": "info@kgindustries.us",
		"description": "${description}",
		"areaServed": "Worldwide",
		"serviceType": ["Export Logistics", "Freight Forwarding", "Customs Clearance", "Product Sourcing"]
	}
	</script>`}

	<!-- Structured Data - LocalBusiness -->
	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		"name": "KG Industries",
		"url": "${siteUrl}",
		"email": "info@kgindustries.us",
		"description": "Full-service US export logistics company specializing in sourcing and shipping American-manufactured products to international markets.",
		"priceRange": "$$$$",
		"address": {
			"@type": "PostalAddress",
			"addressCountry": "US"
		},
		"geo": {
			"@type": "GeoCoordinates",
			"addressCountry": "US"
		},
		"openingHoursSpecification": {
			"@type": "OpeningHoursSpecification",
			"dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
			"opens": "09:00",
			"closes": "17:00"
		}
	}
	</script>`}
</svelte:head>
