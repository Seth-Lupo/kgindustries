<script lang="ts">
	import { onMount } from 'svelte';
	import { _, json } from 'svelte-i18n';
	import SEO from '$lib/components/SEO.svelte';
	import { base } from '$app/paths';
	import { rfqOpen, RFQ_EMAIL, LINKEDIN_URL } from '$lib/stores/rfq';

	type HandleItem = { title: string; text: string };
	type DataPoint = { value: string; label: string };
	type Tile = { title: string; text: string };

	const tileAnchors = ['beverages', 'consumer', 'industrial', 'custom'];

	let globeCanvas: HTMLCanvasElement;

	interface FlightPath {
		startLat: number;
		startLon: number;
		endLat: number;
		endLon: number;
		progress: number;
		speed: number;
		arcPoints: Array<{ lat: number; lon: number }>;
	}

	onMount(() => {
		// Globe animation
		const ctx = globeCanvas.getContext('2d');
		if (!ctx) return;

		let rotation = 0;
		const radius = 220;
		const centerX = globeCanvas.width / 2;
		const centerY = globeCanvas.height / 2;

		function calculateGreatCircle(
			lat1: number,
			lon1: number,
			lat2: number,
			lon2: number
		): Array<{ lat: number; lon: number }> {
			const points = [];
			const steps = 50;

			for (let i = 0; i <= steps; i++) {
				const f = i / steps;
				const d =
					2 *
					Math.asin(
						Math.sqrt(
							Math.pow(Math.sin((lat1 - lat2) / 2), 2) +
								Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon1 - lon2) / 2), 2)
						)
					);

				if (d === 0) {
					points.push({ lat: lat1, lon: lon1 });
					continue;
				}

				const A = Math.sin((1 - f) * d) / Math.sin(d);
				const B = Math.sin(f * d) / Math.sin(d);

				const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
				const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
				const z = A * Math.sin(lat1) + B * Math.sin(lat2);

				const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
				const lon = Math.atan2(y, x);

				points.push({ lat, lon });
			}

			return points;
		}

		// Generate flight paths
		const flights: FlightPath[] = [];
		for (let i = 0; i < 10; i++) {
			const startLat = (Math.random() - 0.5) * Math.PI * 0.7;
			const startLon = Math.random() * Math.PI * 2;
			const endLat = (Math.random() - 0.5) * Math.PI * 0.7;
			const endLon = Math.random() * Math.PI * 2;

			flights.push({
				startLat,
				startLon,
				endLat,
				endLon,
				progress: Math.random(),
				speed: 0.0015 + Math.random() * 0.002,
				arcPoints: calculateGreatCircle(startLat, startLon, endLat, endLon)
			});
		}

		function latLonToXYZ(lat: number, lon: number, rot: number) {
			const adjustedLon = lon + rot;
			const x = radius * Math.cos(lat) * Math.cos(adjustedLon);
			const y = radius * Math.sin(lat);
			const z = radius * Math.cos(lat) * Math.sin(adjustedLon);
			return { x: centerX + x, y: centerY - y, z };
		}

		let frameCount = 0;
		function drawGlobe() {
			if (!ctx) return;
			frameCount++;

			// Only render every other frame (30fps instead of 60fps)
			if (frameCount % 2 !== 0) {
				requestAnimationFrame(drawGlobe);
				return;
			}

			ctx.clearRect(0, 0, globeCanvas.width, globeCanvas.height);

			ctx.shadowBlur = 8;
			ctx.shadowColor = '#1a5fb4';

			// Draw longitude lines (reduced from 16 to 12)
			for (let i = 0; i < 12; i++) {
				const lon = (i * Math.PI) / 6;

				ctx.strokeStyle = '#1c71d8';
				ctx.lineWidth = 1.2;
				ctx.globalAlpha = 0.5;

				ctx.beginPath();
				let first = true;
				for (let lat = -Math.PI / 2; lat <= Math.PI / 2; lat += 0.05) {
					const point = latLonToXYZ(lat, lon, rotation);
					if (point.z > 0) {
						if (first) {
							ctx.moveTo(point.x, point.y);
							first = false;
						} else {
							ctx.lineTo(point.x, point.y);
						}
					} else {
						first = true;
					}
				}
				ctx.stroke();
			}

			// Draw latitude lines (reduced from 7 to 5)
			for (let i = 0; i < 5; i++) {
				const lat = ((i - 2) * Math.PI) / 6;
				const isEquator = i === 2;

				ctx.strokeStyle = isEquator ? '#3584e4' : '#1c71d8';
				ctx.lineWidth = isEquator ? 2 : 1;
				ctx.globalAlpha = 0.5;

				ctx.beginPath();
				let first = true;
				for (let lon = 0; lon < Math.PI * 2; lon += 0.05) {
					const point = latLonToXYZ(lat, lon, rotation);
					if (point.z > 0) {
						if (first) {
							ctx.moveTo(point.x, point.y);
							first = false;
						} else {
							ctx.lineTo(point.x, point.y);
						}
					} else {
						first = true;
					}
				}
				ctx.stroke();
			}

			// Draw flight paths
			ctx.shadowBlur = 10;
			flights.forEach((flight) => {
				flight.progress += flight.speed;
				if (flight.progress > 1) {
					flight.progress = 0;
					const newEndLat = (Math.random() - 0.5) * Math.PI * 0.7;
					const newEndLon = Math.random() * Math.PI * 2;
					flight.startLat = flight.endLat;
					flight.startLon = flight.endLon;
					flight.endLat = newEndLat;
					flight.endLon = newEndLon;
					flight.arcPoints = calculateGreatCircle(
						flight.startLat,
						flight.startLon,
						flight.endLat,
						flight.endLon
					);
				}

				const currentIndex = Math.floor(flight.progress * (flight.arcPoints.length - 1));
				const currentPoint = flight.arcPoints[currentIndex];
				const point = latLonToXYZ(currentPoint.lat, currentPoint.lon, rotation);

				if (point.z > 0) {
					const intensity = Math.min(1, point.z / radius);

					// Draw simplified trail
					ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
					ctx.lineWidth = 1.8;
					ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
					ctx.globalAlpha = 0.5 * intensity;

					ctx.beginPath();
					let trailFirst = true;
					for (let i = 0; i < 8; i++) {
						const trailIndex = Math.max(0, currentIndex - i * 3);
						const trailPoint = flight.arcPoints[trailIndex];
						const trail = latLonToXYZ(trailPoint.lat, trailPoint.lon, rotation);

						if (trail.z > 0) {
							if (trailFirst) {
								ctx.moveTo(trail.x, trail.y);
								trailFirst = false;
							} else {
								ctx.lineTo(trail.x, trail.y);
							}
						}
					}
					ctx.stroke();

					// Draw point
					ctx.shadowBlur = 12;
					ctx.globalAlpha = 0.9 * intensity;
					ctx.fillStyle = '#ffffff';
					ctx.beginPath();
					ctx.arc(point.x, point.y, 3.5, 0, Math.PI * 2);
					ctx.fill();

					// Simplified glow
					ctx.globalAlpha = 0.3 * intensity;
					ctx.beginPath();
					ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
					ctx.fill();
				}
			});

			rotation += 0.003;
			requestAnimationFrame(drawGlobe);
		}

		drawGlobe();
	});
</script>

<SEO
	title="KG Industries | US Sourcing and Export for International Buyers"
	description="US trading company supplying beverages, foodservice equipment, genuine Ford parts, and industrial goods to buyers in the Gulf, MENA, Caucasus, and Central Asia. Landed CIP/CIF quotes."
/>

<div class="container">
	<div class="grain"></div>

	<main>
		<section class="hero">
			<div class="hero-layout">
				<div class="hero-text">
					<h1 class="title-massive">{$_('home.hero.global')}</h1>
					<div class="title-medium">{$_('home.hero.freight')}</div>
					<div class="title-small">{$_('home.hero.operations')}</div>
				</div>
				<div class="globe-container">
					<canvas bind:this={globeCanvas} width="600" height="600"></canvas>
				</div>
			</div>
			<div class="hero-footer">
				<p class="subtitle">{$_('home.hero.subtitle')}</p>
			</div>
		</section>

		<section class="overview" id="overview">
			<div class="overview-content">
				<div class="overview-text">
					<span class="detail-label">{$_('home.overview.label')}</span>
					<p class="lead">{$_('home.overview.p1')}</p>
					<p>{$_('home.overview.p2')}</p>
					<p>{$_('home.overview.p3')}</p>
				</div>
				<div class="overview-detail">
					<span class="detail-label">{$_('home.overview.factsLabel')}</span>
					<span class="detail-value">KG Industries LLC</span>
					<ul class="facts">
						<li>{$_('home.overview.registered')}</li>
						<li><a href="mailto:{RFQ_EMAIL}">{RFQ_EMAIL}</a></li>
						<li><a href={LINKEDIN_URL} target="_blank" rel="noopener">LinkedIn</a></li>
					</ul>
				</div>
			</div>
		</section>

		<section class="image-full">
			<img src="{base}/images/container-operations.jpg" alt="" loading="lazy" />
		</section>

		<section class="process">
			<div class="process-layout">
				<div class="process-text">
					<h2>{$_('home.handle.title')}</h2>
					<ol class="handle-list">
						{#each $json('home.handle.items') as HandleItem[] as item, i}
							<li>
								<span class="handle-num">{String(i + 1).padStart(2, '0')}</span>
								<div>
									<h3>{item.title}</h3>
									<p>{item.text}</p>
								</div>
							</li>
						{/each}
					</ol>
					<p class="risk-line">{$_('home.handle.risk')}</p>
				</div>
				<div class="process-data">
					{#each $json('home.handle.data') as DataPoint[] as point}
						<div class="data-point">
							<div class="data-number">{point.value}</div>
							<div class="data-label">{point.label}</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<section class="image-split" id="products">
			<div class="split-left">
				<img src="{base}/images/port-operations.jpg" alt="" loading="lazy" />
				<div class="split-caption">{$_('home.categories.caption')}</div>
			</div>
			<div class="split-right">
				<div class="split-info">
					<h3>{$_('home.categories.title')}</h3>
					<div class="tiles">
						{#each $json('home.categories.tiles') as Tile[] as tile, i}
							<a class="tile" href="{base}/products#{tileAnchors[i]}">
								<span class="tile-title">{tile.title}</span>
								<span class="tile-text">{tile.text}</span>
							</a>
						{/each}
					</div>
				</div>
			</div>
		</section>

		<section class="contact-simple" id="contact">
			<div class="contact-wrapper">
				<h2>{$_('home.contact.title')}</h2>
				<p class="contact-description">{$_('home.contact.description')}</p>
				<button class="contact-button" onclick={() => rfqOpen.set(true)}>
					{$_('home.contact.button')}
				</button>
				<a class="contact-email" href="mailto:{RFQ_EMAIL}">{RFQ_EMAIL}</a>
			</div>
		</section>
	</main>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

	:global(*),
	:global(*::before),
	:global(*::after) {
		box-sizing: border-box;
	}

	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		width: 100%;
		overflow-x: clip;
	}

	:global(body) {
		background: #050508;
		color: #d4d4d8;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	}

	.container {
		position: relative;
		min-height: 100vh;
		width: 100%;
		max-width: 100vw;
		margin: 0 auto;
		overflow-x: clip;
	}

	.grain {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='6.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
		opacity: 0.18;
		pointer-events: none;
		z-index: 1;
	}

	main {
		position: relative;
		z-index: 2;
		padding-top: 10rem;
	}

	.hero {
		min-height: 85vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
		padding: 0 4vw;
	}

	.hero-layout {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.hero-text {
		position: relative;
		z-index: 3;
		flex-shrink: 0;
		text-align: center;
	}

	.title-massive {
		font-size: clamp(7rem, 18vw, 16rem);
		font-weight: 900;
		letter-spacing: -0.06em;
		line-height: 0.75;
		margin: 0;
		color: #ffffff;
		text-transform: uppercase;
	}

	.title-medium {
		font-size: clamp(3.5rem, 9vw, 8rem);
		font-weight: 900;
		letter-spacing: 0.5em;
		margin: 0.5rem 0 0 0;
		color: #1c71d8;
		text-transform: uppercase;
	}

	.title-small {
		font-size: clamp(1rem, 2vw, 1.5rem);
		font-weight: 700;
		letter-spacing: 0.6em;
		margin-top: 1.5rem;
		color: #52525b;
		text-transform: uppercase;
	}

	.globe-container {
		position: absolute;
		right: 2vw;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
		opacity: 0.85;
	}

	canvas {
		filter: contrast(1.25) brightness(1.05);
	}

	.hero-footer {
		text-align: center;
	}

	.subtitle {
		font-size: 0.95rem;
		letter-spacing: 0.18em;
		color: #71717a;
		text-transform: uppercase;
		margin: 0;
		font-weight: 500;
	}

	.overview {
		padding: 5rem 4vw;
		border-top: 1px solid #1a1a22;
		border-bottom: 1px solid #1a1a22;
	}

	.overview-content {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 4rem;
		align-items: center;
	}

	.overview-text {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.overview-text p {
		font-size: 1.05rem;
		line-height: 1.7;
		color: #a1a1aa;
		margin: 0;
		font-weight: 400;
	}

	.overview-text p.lead {
		font-size: 1.3rem;
		color: #ffffff;
		line-height: 1.5;
	}

	.facts {
		list-style: none;
		margin: 0.5rem 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		font-size: 0.9rem;
		color: #a1a1aa;
	}

	.facts a {
		color: #a1a1aa;
		text-decoration: none;
	}

	.facts a:hover {
		color: #1c71d8;
	}

	.overview-detail {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 2rem;
		border-inline-start: 2px solid #1a1a22;
	}

	.detail-label {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		color: #52525b;
	}

	.detail-value {
		font-size: 1.2rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: #ffffff;
	}

	.image-full {
		width: 100%;
		height: 50vh;
		overflow: hidden;
	}

	.image-full img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		filter: grayscale(60%) contrast(1.1) brightness(0.85);
	}

	.process {
		padding: 6rem 4vw;
		border-top: 1px solid #1a1a22;
	}

	.process-layout {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.5fr 1fr;
		gap: 5rem;
	}

	.process-text h2 {
		font-size: 1.5rem;
		font-weight: 900;
		letter-spacing: 0.08em;
		color: #ffffff;
		margin: 0 0 2rem 0;
		text-transform: uppercase;
	}

	.process-text p {
		font-size: 1rem;
		line-height: 1.8;
		color: #a1a1aa;
		margin: 0 0 1.5rem 0;
		font-weight: 400;
	}

	.handle-list {
		list-style: none;
		margin: 0 0 2rem;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.handle-list li {
		display: flex;
		gap: 1.25rem;
		align-items: flex-start;
	}

	.handle-num {
		font-size: 0.8rem;
		font-weight: 700;
		color: #1c71d8;
		letter-spacing: 0.1em;
		padding-top: 0.2rem;
		flex-shrink: 0;
	}

	.handle-list h3 {
		margin: 0 0 0.35rem;
		font-size: 1rem;
		font-weight: 700;
		color: #ffffff;
		letter-spacing: 0.02em;
	}

	.handle-list p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.process-text p.risk-line {
		margin: 0;
		padding: 1.25rem 1.5rem;
		border-inline-start: 2px solid #1c71d8;
		background: #0a0a0d;
		color: #ffffff;
		font-weight: 600;
		line-height: 1.6;
	}

	.process-data {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		padding-top: 3rem;
	}

	.data-point {
		border-top: 1px solid #1a1a22;
		padding-top: 1rem;
	}

	.data-number {
		font-size: 2rem;
		font-weight: 900;
		letter-spacing: 0.02em;
		color: #1c71d8;
		margin-bottom: 0.5rem;
	}

	.data-label {
		font-size: 0.85rem;
		line-height: 1.4;
		color: #71717a;
		font-weight: 500;
	}

	.image-split {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		min-height: 50vh;
		border-top: 1px solid #1a1a22;
	}

	.split-left {
		position: relative;
		overflow: hidden;
	}

	.split-left img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(60%) contrast(1.1) brightness(0.85);
	}

	.split-caption {
		position: absolute;
		bottom: 1.5rem;
		inset-inline-start: 1.5rem;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		color: #ffffff;
		background: rgba(5, 5, 8, 0.9);
		padding: 0.5rem 1rem;
		border: 1px solid #1a1a22;
	}

	.split-right {
		background: #0a0a0d;
		border-inline-start: 1px solid #1a1a22;
		display: flex;
		align-items: center;
	}

	.split-info {
		padding: 3rem 2.5rem;
	}

	.split-info h3 {
		font-size: 1.2rem;
		font-weight: 900;
		letter-spacing: 0.08em;
		color: #ffffff;
		margin: 0 0 1.5rem 0;
		text-transform: uppercase;
	}

	.tiles {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.tile {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding: 1rem 1.25rem;
		border: 1px solid #1a1a22;
		border-inline-start: 3px solid #1c71d8;
		background: #050508;
		text-decoration: none;
		transition: border-color 0.2s;
	}

	.tile:hover {
		border-color: #1c71d8;
	}

	.tile-title {
		font-size: 0.85rem;
		font-weight: 900;
		letter-spacing: 0.08em;
		color: #ffffff;
		text-transform: uppercase;
	}

	.tile-text {
		font-size: 0.9rem;
		line-height: 1.5;
		color: #a1a1aa;
	}

	.contact-simple {
		padding: 10rem 4vw;
		border-top: 1px solid #1a1a22;
		background: #0a0a0d;
		position: relative;
	}

	.contact-wrapper {
		max-width: 900px;
		margin: 0 auto;
		text-align: center;
		position: relative;
	}


	.contact-wrapper h2 {
		font-size: clamp(2.2rem, 7vw, 4.5rem);
		font-weight: 900;
		letter-spacing: 0.05em;
		color: #ffffff;
		margin: 0 0 2.5rem 0;
		text-transform: uppercase;
	}

	.contact-description {
		font-size: 1.15rem;
		line-height: 1.8;
		color: #a1a1aa;
		margin: 0 0 3.5rem 0;
		font-weight: 400;
	}

	.contact-button {
		display: inline-block;
		padding: 1.5rem 3.5rem;
		background: transparent;
		border: 2px solid #1c71d8;
		color: #1c71d8;
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		transition: all 0.3s;
	}

	.contact-button {
		font-family: inherit;
		cursor: pointer;
	}

	.contact-button:hover {
		background: #1c71d8;
		color: #050508;
	}

	.contact-email {
		display: block;
		margin-top: 1.5rem;
		color: #71717a;
		font-size: 0.9rem;
		text-decoration: none;
	}

	.contact-email:hover {
		color: #1c71d8;
	}

	@media (max-width: 1200px) {
		.globe-container {
			right: -10vw;
			opacity: 0.6;
		}

		canvas {
			width: 500px;
			height: 500px;
		}

		.overview-content {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.image-split {
			grid-template-columns: 1fr;
		}

		.split-right {
			border-inline-start: none;
			border-top: 1px solid #1a1a22;
		}
	}

	@media (max-width: 768px) {
		.process-layout {
			grid-template-columns: 1fr;
			gap: 3rem;
		}


		.process-data {
			align-items: center;
		}

		.data-point {
			text-align: center;
			width: 100%;
			max-width: 300px;
		}
	}

	@media (max-width: 900px) {
		main {
			padding-top: 8rem;
		}

		.hero {
			min-height: auto;
			padding: 2rem 4vw 4rem;
		}

		.hero-layout {
			flex-direction: column;
			gap: 1.5rem;
		}

		.hero-text {
			text-align: center;
		}

		.title-massive {
			font-size: clamp(3.5rem, 15vw, 7rem);
			line-height: 0.85;
		}

		.title-medium {
			font-size: clamp(2rem, 10vw, 4rem);
			letter-spacing: 0.3em;
			padding-left: 0.3em;
		}

		.title-small {
			font-size: 0.75rem;
			letter-spacing: 0.4em;
			padding-left: 0.4em;
			margin-top: 1rem;
		}

		.globe-container {
			position: relative;
			right: 0;
			transform: none;
			opacity: 0.6;
		}

		canvas {
			width: 280px;
			height: 280px;
		}

		.hero-footer {
			margin-top: 1rem;
		}

		.subtitle {
			font-size: 0.75rem;
			letter-spacing: 0.1em;
		}

		.overview,
		.process,
		.contact-simple {
			padding: 4rem 4vw;
		}

		.overview-text p {
			font-size: 1rem;
		}

		.process-text p {
			font-size: 0.95rem;
		}

		.image-full {
			height: 40vh;
		}

		.image-split {
			min-height: auto;
		}

		.split-left {
			min-height: 40vh;
		}
	}
</style>
