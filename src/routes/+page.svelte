<script lang="ts">
	import { onMount } from 'svelte';

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

		function drawGlobe() {
			if (!ctx) return;
			ctx.clearRect(0, 0, globeCanvas.width, globeCanvas.height);

			ctx.shadowBlur = 15;
			ctx.shadowColor = '#1a5fb4';

			// Draw longitude lines
			for (let i = 0; i < 16; i++) {
				const lon = (i * Math.PI) / 8;

				ctx.strokeStyle = '#1c71d8';
				ctx.lineWidth = 1.2;
				ctx.globalAlpha = 0.5;

				ctx.beginPath();
				let first = true;
				for (let lat = -Math.PI / 2; lat <= Math.PI / 2; lat += 0.02) {
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

			// Draw latitude lines
			for (let i = 0; i < 7; i++) {
				const lat = ((i - 3) * Math.PI) / 8;
				const isEquator = i === 3;

				ctx.strokeStyle = isEquator ? '#3584e4' : '#1c71d8';
				ctx.lineWidth = isEquator ? 2 : 1;
				ctx.globalAlpha = 0.5;

				ctx.beginPath();
				let first = true;
				for (let lon = 0; lon < Math.PI * 2; lon += 0.02) {
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

					// Draw trail as continuous arc
					ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
					ctx.lineWidth = 2;
					ctx.shadowBlur = 20;
					ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';

					for (let i = 0; i < 15; i++) {
						const trailIndex = Math.max(0, currentIndex - i * 2);
						const nextTrailIndex = Math.max(0, currentIndex - (i + 1) * 2);

						const trailPoint = flight.arcPoints[trailIndex];
						const nextPoint = flight.arcPoints[nextTrailIndex];

						const trail = latLonToXYZ(trailPoint.lat, trailPoint.lon, rotation);
						const nextTrail = latLonToXYZ(nextPoint.lat, nextPoint.lon, rotation);

						// Only draw if both points are visible
						if (trail.z > 0 && nextTrail.z > 0) {
							const trailIntensity = (1 - i / 15) * intensity;
							ctx.globalAlpha = 0.6 * trailIntensity;

							ctx.beginPath();
							ctx.moveTo(trail.x, trail.y);
							ctx.lineTo(nextTrail.x, nextTrail.y);
							ctx.stroke();
						}
					}

					// Draw directional point
					ctx.shadowBlur = 25;
					ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';

					// Bright white core
					ctx.globalAlpha = 0.95 * intensity;
					ctx.fillStyle = '#ffffff';
					ctx.beginPath();
					ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
					ctx.fill();

					// Outer glow
					ctx.globalAlpha = 0.4 * intensity;
					ctx.fillStyle = 'rgba(200, 220, 255, 0.6)';
					ctx.beginPath();
					ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
					ctx.fill();

					// Direction indicator
					if (currentIndex < flight.arcPoints.length - 3) {
						const nextIndex = currentIndex + 3;
						const nextPointData = flight.arcPoints[nextIndex];
						const nextPos = latLonToXYZ(nextPointData.lat, nextPointData.lon, rotation);

						if (nextPos.z > 0) {
							const angle = Math.atan2(nextPos.y - point.y, nextPos.x - point.x);
							ctx.globalAlpha = 0.8 * intensity;
							ctx.fillStyle = '#ffffff';
							ctx.beginPath();
							ctx.moveTo(point.x + Math.cos(angle) * 6, point.y + Math.sin(angle) * 6);
							ctx.lineTo(
								point.x + Math.cos(angle + 2.5) * 3,
								point.y + Math.sin(angle + 2.5) * 3
							);
							ctx.lineTo(
								point.x + Math.cos(angle - 2.5) * 3,
								point.y + Math.sin(angle - 2.5) * 3
							);
							ctx.fill();
						}
					}
				}
			});

			rotation += 0.003;
			requestAnimationFrame(drawGlobe);
		}

		drawGlobe();
	});
</script>

<div class="container">
	<div class="grain"></div>

	<header>
		<div class="logo">KG</div>
		<nav>
			<a href="#services">SERVICES</a>
			<a href="#fleet">FLEET</a>
			<a href="#contact">CONTACT</a>
		</nav>
	</header>

	<main>
		<section class="hero">
			<div class="hero-layout">
				<div class="hero-text">
					<h1 class="title-massive">GLOBAL</h1>
					<h1 class="title-medium">FREIGHT</h1>
					<div class="title-small">OPERATIONS</div>
				</div>
				<div class="globe-container">
					<canvas bind:this={globeCanvas} width="600" height="600"></canvas>
				</div>
			</div>
			<div class="hero-footer">
				<p class="subtitle">Moving cargo across continents since 1987</p>
			</div>
		</section>

		<section class="stats">
			<div class="stat">
				<div class="stat-number">847</div>
				<div class="stat-label">VESSELS</div>
			</div>
			<div class="stat">
				<div class="stat-number">156</div>
				<div class="stat-label">PORTS</div>
			</div>
			<div class="stat">
				<div class="stat-number">24/7</div>
				<div class="stat-label">OPERATIONS</div>
			</div>
		</section>

		<section class="image-section">
			<img
				src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&q=80"
				alt="Container ship"
			/>
			<div class="image-overlay">
				<h2>CONTAINERIZED<br />SHIPPING</h2>
			</div>
		</section>

		<section class="cta">
			<h2 class="cta-title">REQUEST QUOTE</h2>
			<a href="#contact" class="cta-button">INITIATE</a>
		</section>
	</main>

	<footer>
		<div class="footer-content">
			<div>KG INDUSTRIES</div>
			<div class="footer-right">EST. 1987</div>
		</div>
	</footer>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

	:global(body) {
		margin: 0;
		padding: 0;
		background: #050508;
		color: #d4d4d8;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		overflow-x: hidden;
	}

	.container {
		position: relative;
		min-height: 100vh;
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

	header {
		position: relative;
		z-index: 10;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2rem 4vw;
		border-bottom: 1px solid #1a1a22;
	}

	.logo {
		font-size: 2rem;
		font-weight: 900;
		letter-spacing: -0.05em;
		color: #1c71d8;
	}

	nav {
		display: flex;
		gap: 3rem;
	}

	nav a {
		color: #a1a1aa;
		text-decoration: none;
		font-size: 0.75rem;
		letter-spacing: 0.12em;
		font-weight: 600;
		transition: color 0.2s;
	}

	nav a:hover {
		color: #1c71d8;
	}

	main {
		position: relative;
		z-index: 2;
	}

	.hero {
		min-height: 92vh;
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
		gap: 4rem;
		margin-bottom: 3rem;
	}

	.hero-text {
		position: relative;
		z-index: 3;
		flex-shrink: 0;
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
		right: -5vw;
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

	.stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		background: #1a1a22;
		margin: 6rem 0 0 0;
		border-top: 1px solid #1a1a22;
		border-bottom: 1px solid #1a1a22;
	}

	.stat {
		background: #050508;
		padding: 3.5rem 2rem;
		text-align: center;
	}

	.stat-number {
		font-size: 4rem;
		font-weight: 900;
		color: #1c71d8;
		letter-spacing: -0.03em;
		margin-bottom: 0.75rem;
	}

	.stat-label {
		font-size: 0.7rem;
		letter-spacing: 0.22em;
		color: #52525b;
		font-weight: 600;
	}

	.image-section {
		position: relative;
		margin: 8rem 0;
		height: 65vh;
		overflow: hidden;
	}

	.image-section img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(70%) contrast(1.2) brightness(0.8);
		opacity: 0.6;
	}

	.image-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(to bottom, rgba(5, 5, 8, 0.2), rgba(5, 5, 8, 0.8));
	}

	.image-overlay h2 {
		font-size: clamp(2.5rem, 7vw, 5rem);
		font-weight: 900;
		letter-spacing: 0.12em;
		color: #ffffff;
		text-transform: uppercase;
		line-height: 1.1;
		text-align: center;
	}

	.cta {
		padding: 8rem 4vw;
		text-align: center;
		border-top: 1px solid #1a1a22;
	}

	.cta-title {
		font-size: clamp(3rem, 8vw, 6rem);
		font-weight: 900;
		letter-spacing: 0.06em;
		margin-bottom: 3rem;
		color: #ffffff;
	}

	.cta-button {
		display: inline-block;
		padding: 1.3rem 4.5rem;
		background: transparent;
		border: 2px solid #1c71d8;
		color: #1c71d8;
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 700;
		letter-spacing: 0.3em;
		transition: all 0.3s;
	}

	.cta-button:hover {
		background: #1c71d8;
		color: #050508;
		box-shadow: 0 0 25px rgba(28, 113, 216, 0.4);
	}

	footer {
		position: relative;
		z-index: 10;
		padding: 2rem 4vw;
		border-top: 1px solid #1a1a22;
	}

	.footer-content {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		letter-spacing: 0.12em;
		color: #52525b;
		font-weight: 600;
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
	}

	@media (max-width: 900px) {
		.hero-layout {
			flex-direction: column;
			gap: 3rem;
		}

		.globe-container {
			position: relative;
			right: 0;
			transform: none;
			opacity: 0.5;
		}

		canvas {
			width: 400px;
			height: 400px;
		}

		.hero-text {
			text-align: center;
		}

		.stats {
			grid-template-columns: 1fr;
		}

		nav {
			gap: 2rem;
		}
	}
</style>
