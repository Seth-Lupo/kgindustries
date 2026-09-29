<script lang="ts">
	import { onMount } from 'svelte';
	import { LAND_DOTS, MAP } from '$lib/data/worldDots';

	type Point = { x: number; y: number };

	const project = (lat: number, lon: number): Point => ({
		x: (lon - MAP.lon0) * MAP.k,
		y: (MAP.lat1 - lat) * MAP.k
	});

	const origins = {
		newYork: project(40.7, -74.0),
		houston: project(29.76, -95.37)
	};

	// Representative ports and hubs in the markets we ship to.
	const destinations = [
		{ id: 'lisbon', at: project(38.7, -9.1), from: origins.newYork },
		{ id: 'alexandria', at: project(31.2, 29.9), from: origins.newYork },
		{ id: 'jeddah', at: project(21.5, 39.2), from: origins.newYork },
		{ id: 'jebel-ali', at: project(25.0, 55.1), from: origins.houston },
		{ id: 'doha', at: project(25.3, 51.5), from: origins.newYork },
		{ id: 'poti', at: project(42.15, 41.67), from: origins.newYork },
		{ id: 'baku', at: project(40.4, 49.9), from: origins.newYork },
		{ id: 'almaty', at: project(43.2, 76.9), from: origins.newYork },
		{ id: 'santos', at: project(-23.96, -46.3), from: origins.houston }
	];

	// Quadratic arc bowed to the left of travel, so eastbound routes lift north like great circles.
	function arc(a: Point, b: Point) {
		const mx = (a.x + b.x) / 2;
		const my = (a.y + b.y) / 2;
		const dx = b.x - a.x;
		const dy = b.y - a.y;
		const len = Math.hypot(dx, dy);
		const lift = Math.min(len * 0.2, 120);
		const cx = mx + (dy / len) * lift;
		const cy = my - (dx / len) * lift;
		return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
	}

	const routes = destinations.map((d, i) => ({ ...d, d: arc(d.from, d.at), delay: 600 + i * 180 }));

	let wrapper: HTMLDivElement;
	let paused = $state(false);

	// Stop all map animation while the hero is off screen.
	onMount(() => {
		const io = new IntersectionObserver(([entry]) => {
			paused = !entry.isIntersecting;
		});
		io.observe(wrapper);
		return () => io.disconnect();
	});
</script>

<!--
	Land and routes are separate SVGs on separate compositor layers, and the slow
	drift runs on the wrapper. Scaling an SVG <g> re-rasterizes thousands of land
	dots every frame, which made them shimmer; this way the land is painted once
	and only the small animated routes repaint.
-->
<div class="route-map" class:paused bind:this={wrapper} aria-hidden="true">
	<svg
		class="layer land-layer"
		viewBox="0 0 {MAP.width} {MAP.height}"
		preserveAspectRatio="xMidYMid slice"
		focusable="false"
	>
		<path class="land" d={LAND_DOTS} />
	</svg>

	<svg
		class="layer routes-layer"
		viewBox="0 0 {MAP.width} {MAP.height}"
		preserveAspectRatio="xMidYMid slice"
		focusable="false"
	>
		<defs>
			<radialGradient id="rm-glow">
				<stop offset="0%" stop-color="var(--gold-light)" stop-opacity="0.9" />
				<stop offset="100%" stop-color="var(--gold)" stop-opacity="0" />
			</radialGradient>
			<linearGradient id="rm-arc" x1="0" x2="1" y1="0" y2="0">
				<stop offset="0%" stop-color="var(--gold)" stop-opacity="0.25" />
				<stop offset="100%" stop-color="var(--gold-light)" stop-opacity="0.9" />
			</linearGradient>
		</defs>

		<g>
			{#each routes as r (r.id)}
				<path class="arc" d={r.d} pathLength="1" style="--d: {r.delay}ms" />
			{/each}

			<!--
				A short dash travels each arc and ends on the destination dot. The glow is
				a wider faint dash underneath rather than a drop-shadow filter: re-blurring
				every arc each frame dropped frames on large Retina screens.
			-->
			{#each routes as r (r.id)}
				<g class="gleam" style="--d: {r.delay + 1400}ms">
					<path class="gleam-halo" d={r.d} pathLength="1" />
					<path class="gleam-core" d={r.d} pathLength="1" />
				</g>
			{/each}

			{#each routes as r (r.id)}
				<g class="node" style="--d: {r.delay + 1100}ms">
					<circle class="pulse" cx={r.at.x} cy={r.at.y} r="9" />
					<circle class="dot" cx={r.at.x} cy={r.at.y} r="3.2" />
				</g>
			{/each}

			{#each Object.values(origins) as o, i}
				<g class="origin" style="--d: {300 + i * 150}ms">
					<circle cx={o.x} cy={o.y} r="26" fill="url(#rm-glow)" opacity="0.45" />
					<circle class="pulse" cx={o.x} cy={o.y} r="12" />
					<circle class="dot" cx={o.x} cy={o.y} r="4.5" />
				</g>
			{/each}
		</g>
	</svg>
</div>

<style>
	.route-map {
		position: relative;
		width: 100%;
		height: 100%;
		transform-origin: 60% 45%;
		will-change: transform;
		animation: drift 38s var(--ease-in-out) infinite alternate;
	}

	.layer {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	/* Own layer, so route repaints never touch the land dots beneath. */
	.routes-layer {
		will-change: transform;
	}

	@keyframes drift {
		from {
			transform: scale(1) translate(0, 0);
		}
		to {
			transform: scale(1.06) translate(-14px, 6px);
		}
	}

	.land {
		fill: none;
		stroke: rgba(150, 172, 214, 0.32);
		stroke-width: 2.6;
		stroke-linecap: round;
		opacity: 0;
		animation: fadeIn 1.6s var(--ease-out) 0.1s forwards;
	}

	.arc {
		fill: none;
		stroke: url(#rm-arc);
		stroke-width: 1.3;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 2.2s var(--ease-in-out) var(--d) forwards;
	}

	.gleam {
		opacity: 0;
		animation: fadeIn 0.6s linear var(--d) forwards;
	}

	.gleam path {
		fill: none;
		stroke-linecap: round;
		stroke-dasharray: 0.045 0.955;
		stroke-dashoffset: 1;
		animation: travel 5.5s linear var(--d) infinite;
	}

	.gleam-core {
		stroke: var(--gold-light);
		stroke-width: 2.4;
	}

	.gleam-halo {
		stroke: var(--gold);
		stroke-width: 7;
		opacity: 0.22;
	}

	@keyframes travel {
		from {
			stroke-dashoffset: 1;
		}
		to {
			stroke-dashoffset: 0;
		}
	}

	/* Pause everything while the hero is scrolled out of view. */
	.route-map.paused,
	.route-map.paused :global(*) {
		animation-play-state: paused !important;
	}

	.node,
	.origin {
		opacity: 0;
		animation: fadeIn 0.8s var(--ease-out) var(--d) forwards;
	}

	.dot {
		fill: var(--gold-light);
	}

	.origin .dot {
		fill: #fff6e2;
	}

	.pulse {
		fill: none;
		stroke: var(--gold);
		stroke-width: 1.2;
		transform-box: fill-box;
		transform-origin: center;
		animation: pulse 3.2s var(--ease-out) var(--d) infinite;
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes fadeIn {
		to {
			opacity: 1;
		}
	}

	@keyframes pulse {
		0% {
			transform: scale(0.35);
			opacity: 0.9;
		}
		80%,
		100% {
			transform: scale(1.6);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.route-map {
			animation: none;
		}

		.arc {
			stroke-dashoffset: 0;
		}

		.land,
		.node,
		.origin {
			opacity: 1;
		}

		.gleam,
		.pulse {
			display: none;
		}
	}
</style>
