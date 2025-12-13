<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>


<div class="container">
	<div class="grain"></div>

	<div class="how-page">
	<section class="how-hero">
		<div class="hero-content">
			<h1>{$_('howItWorks.hero.title')}</h1>
			<p>{$_('howItWorks.hero.subtitle')}</p>
		</div>
	</section>

	<section class="process-flow">
		<div class="flow-content">
			<div class="flow-main">
				<div class="flow-line"></div>

				<div class="flow-step">
					<div class="step-label">{$_('howItWorks.steps.request.label')}</div>
					<div class="step-text">{$_('howItWorks.steps.request.title')}</div>
					<div class="step-description">{$_('howItWorks.steps.request.description')}</div>
				</div>

				<div class="flow-step">
					<div class="step-label">{$_('howItWorks.steps.quote.label')}</div>
					<div class="step-text">{$_('howItWorks.steps.quote.title')}</div>
					<div class="step-description">{$_('howItWorks.steps.quote.description')}</div>
				</div>

				<div class="flow-step">
					<div class="step-label">{$_('howItWorks.steps.source.label')}</div>
					<div class="step-text">{$_('howItWorks.steps.source.title')}</div>
					<div class="step-description">{$_('howItWorks.steps.source.description')}</div>
				</div>

				<div class="flow-step">
					<div class="step-label">{$_('howItWorks.steps.ship.label')}</div>
					<div class="step-text">{$_('howItWorks.steps.ship.title')}</div>
					<div class="step-description">{$_('howItWorks.steps.ship.description')}</div>
				</div>

				<div class="flow-step">
					<div class="step-label">{$_('howItWorks.steps.deliver.label')}</div>
					<div class="step-text">{$_('howItWorks.steps.deliver.title')}</div>
					<div class="step-description">{$_('howItWorks.steps.deliver.description')}</div>
				</div>
			</div>

			<div class="flow-sidebar">
				<div class="sidebar-sticky">
					<div class="flag-img flag-top">
						<img
							src="/images/us-flag.png"
							alt="US"
						/>
					</div>
					<div class="arrow-container">
						<div class="arrow-track">
							<div class="fluid"></div>
						</div>
						<div class="arrow-mask"></div>
					</div>
					<div class="flag-img flag-bottom">
						<img
							src="/images/azerbaijan-flag.png"
							alt="Destination"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>

	</div>
</div>

<style>
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

	.how-page {
		min-height: 100vh;
		padding-top: 5rem;
		background: #050508;
	}

	.how-hero {
		padding: 8rem 4vw;
		border-bottom: 1px solid #1a1a22;
		text-align: center;
	}

	.hero-content h1 {
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 900;
		letter-spacing: 0.05em;
		color: #ffffff;
		margin: 0 0 1.5rem 0;
		text-transform: uppercase;
	}

	.hero-content p {
		font-size: 1rem;
		color: #a1a1aa;
		margin: 0;
		font-weight: 400;
	}

	.process-flow {
		padding: 12rem 0;
		background: #0a0a0d;
		position: relative;
	}

	.flow-content {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 4vw;
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 4rem;
	}

	.flow-main {
		position: relative;
		padding-right: 2rem;
		align-self: start;
	}

	.flow-line {
		position: absolute;
		top: 0;
		left: 35%;
		width: 1px;
		height: 100%;
		background: linear-gradient(to bottom, transparent, #1a1a22 20%, #1a1a22 80%, transparent);
	}

	.flow-step {
		max-width: 560px;
		margin: 0 auto 6rem auto;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		position: relative;
	}

	.flow-step:last-child {
		margin-bottom: 0;
	}

	.flow-sidebar {
		position: relative;
		align-self: stretch;
		min-height: 100%;
	}

	.sidebar-sticky {
		position: sticky;
		top: 180px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding: 1.5rem;
		padding-left: 1.5rem;
		background: linear-gradient(to right, rgba(28, 113, 216, 0.04), transparent 30%);
		border-left: 2px solid #1c71d8;
		box-shadow: inset 4px 0 12px -6px rgba(28, 113, 216, 0.2);
	}

	.flag-img {
		width: 100%;
		max-width: 180px;
		aspect-ratio: 3 / 2;
		border: 2px solid #1a1a22;
		overflow: hidden;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
	}

	.flag-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.arrow-container {
		position: relative;
		width: 32px;
		height: 128px;
	}

	.arrow-track {
		position: absolute;
		inset: 0;
		clip-path: polygon(
			/* Shaft top-left */ 11px 0%,
			/* Shaft top-right */ 21px 0%,
			/* Shaft bottom-right */ 21px 100px,
			/* Triangle right */ 100% 100px,
			/* Triangle bottom */ 50% 100%,
			/* Triangle left */ 0% 100px,
			/* Shaft bottom-left */ 11px 100px
		);
		background: #18181b;
		overflow: hidden;
	}

	.arrow-track::before {
		content: '';
		position: absolute;
		inset: 0;
		clip-path: inherit;
		border: 1px solid #27272a;
		background: transparent;
		pointer-events: none;
	}

	.fluid {
		position: absolute;
		left: 0;
		width: 100%;
		height: 70px;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			rgba(28, 113, 216, 0.2) 15%,
			rgba(28, 113, 216, 0.7) 40%,
			rgba(59, 130, 246, 0.9) 50%,
			rgba(28, 113, 216, 0.7) 60%,
			rgba(28, 113, 216, 0.2) 85%,
			transparent 100%
		);
		animation: fluidFlow 2.2s ease-in-out infinite;
	}

	@keyframes fluidFlow {
		0% {
			top: -70px;
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		100% {
			top: 128px;
			opacity: 0;
		}
	}

	.arrow-mask {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.arrow-mask::before {
		content: '';
		position: absolute;
		top: 0;
		left: 11px;
		width: 10px;
		height: 100px;
		border: 1px solid #27272a;
		border-bottom: none;
		border-radius: 5px 5px 0 0;
		box-sizing: border-box;
	}

	.arrow-mask::after {
		content: '';
		position: absolute;
		top: 99px;
		left: 0;
		width: 32px;
		height: 29px;
		clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
		border: 1px solid #27272a;
	}

	.step-label {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		color: #52525b;
		text-transform: uppercase;
	}

	.step-text {
		font-size: clamp(1.5rem, 3vw, 2.25rem);
		font-weight: 500;
		color: #ffffff;
		line-height: 1.3;
		letter-spacing: -0.02em;
	}

	.step-description {
		font-size: 1rem;
		font-weight: 400;
		color: #71717a;
		line-height: 1.6;
		max-width: 480px;
	}

	@media (max-width: 1200px) {
		.flow-content {
			grid-template-columns: 1fr 200px;
			gap: 2rem;
		}

		.arrow-container {
			height: 100px;
		}

		.arrow-track {
			clip-path: polygon(
				11px 0%,
				21px 0%,
				21px 72px,
				100% 72px,
				50% 100%,
				0% 72px,
				11px 72px
			);
		}

		.arrow-mask::before {
			height: 72px;
		}

		.arrow-mask::after {
			top: 71px;
		}

		@keyframes fluidFlow {
			0% {
				top: -70px;
				opacity: 0;
			}
			10% {
				opacity: 1;
			}
			85% {
				opacity: 1;
			}
			100% {
				top: 100px;
				opacity: 0;
			}
		}
	}

	@media (max-width: 768px) {
		.flow-sidebar {
			display: none;
		}

		.flow-content {
			grid-template-columns: 1fr;
		}

		.flow-main {
			padding-right: 0;
		}

		.flow-line {
			left: 50%;
		}
	}

	@media (max-width: 900px) {
		.how-hero {
			padding: 6rem 4vw;
		}

		.process-flow {
			padding: 8rem 4vw;
		}

		.flow-step {
			margin-bottom: 4rem;
		}
	}
</style>
