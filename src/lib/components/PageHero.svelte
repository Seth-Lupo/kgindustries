<script lang="ts">
	import { LAND_DOTS, MAP } from '$lib/data/worldDots';

	let { title, subtitle }: { title: string; subtitle: string } = $props();
</script>

<section class="page-hero">
	<svg
		class="dots"
		viewBox="0 0 {MAP.width} {MAP.height}"
		preserveAspectRatio="xMidYMid slice"
		aria-hidden="true"
		focusable="false"
	>
		<path d={LAND_DOTS} />
	</svg>
	<div class="glow" aria-hidden="true"></div>

	<div class="content">
		<span class="rule-top" aria-hidden="true"></span>
		<h1>{title}</h1>
		<p>{subtitle}</p>
	</div>
</section>

<style>
	.page-hero {
		position: relative;
		overflow: hidden;
		padding: calc(var(--header-h) + clamp(4rem, 9vw, 7rem)) var(--gutter) clamp(4rem, 8vw, 6rem);
		text-align: center;
		background: linear-gradient(to bottom, var(--navy-950), var(--navy-900));
		border-bottom: 1px solid var(--line);
	}

	.dots {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		-webkit-mask-image: radial-gradient(ellipse 60% 70% at 50% 45%, #000 10%, transparent 75%);
		mask-image: radial-gradient(ellipse 60% 70% at 50% 45%, #000 10%, transparent 75%);
		animation: settle 2.4s var(--ease-out) both;
	}

	.dots path {
		fill: none;
		stroke: rgba(150, 172, 214, 0.22);
		stroke-width: 2.6;
		stroke-linecap: round;
	}

	.glow {
		position: absolute;
		left: 50%;
		bottom: -60%;
		width: 900px;
		max-width: 160vw;
		aspect-ratio: 1;
		transform: translateX(-50%);
		background: radial-gradient(circle, rgba(201, 164, 92, 0.12), transparent 60%);
		pointer-events: none;
	}

	.content {
		position: relative;
		max-width: 780px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.rule-top {
		width: 1px;
		height: 56px;
		margin-bottom: 2rem;
		background: linear-gradient(to bottom, transparent, var(--gold));
		transform-origin: top;
		animation: grow 1.2s var(--ease-out) 0.1s both;
	}

	h1 {
		margin: 0 0 1.5rem;
		font-family: var(--font-display);
		font-size: clamp(2.8rem, 8vw, 6rem);
		font-weight: 600;
		line-height: 1;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		color: var(--ink);
		animation: rise 1.2s var(--ease-out) 0.2s both;
	}

	p {
		margin: 0;
		max-width: 620px;
		font-size: clamp(1rem, 1.6vw, 1.15rem);
		line-height: 1.7;
		color: var(--muted);
		animation: rise 1.2s var(--ease-out) 0.35s both;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(22px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes grow {
		from {
			transform: scaleY(0);
		}
		to {
			transform: scaleY(1);
		}
	}

	@keyframes settle {
		from {
			opacity: 0;
			transform: scale(1.06);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
</style>
