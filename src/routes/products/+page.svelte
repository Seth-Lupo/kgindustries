<script lang="ts">
	import { _ } from 'svelte-i18n';
	import SEO from '$lib/components/SEO.svelte';
	import { base } from '$app/paths';
</script>

<SEO
	title="Products - US Manufactured Goods for Export | KG Industries"
	description="Browse US-manufactured products available for international export: beverages (Coca-Cola, Pepsi), consumer electronics, home goods, health & beauty, industrial equipment. B2B container shipping."
	keywords="US manufactured products, American beverages export, Coca-Cola export, Pepsi international, US consumer goods, industrial equipment export, B2B wholesale, made in USA products"
	canonical="/products"
/>

<div class="container">
	<div class="grain"></div>

	<div class="products-page">
	<section class="products-hero">
		<div class="flag-container">
			<img
				src="{base}/images/us-flag.png"
				alt="American Flag"
				class="hero-flag"
			/>
		</div>
		<div class="hero-content">
			<h1>{$_('productsPage.hero.title')}</h1>
			<p>{$_('productsPage.hero.subtitle')}</p>
		</div>
	</section>

	<section class="category-section">
		<div class="category-layout">
			<div class="category-block beverage-block">
				<div class="category-header">
					<h2>{$_('productsPage.beverages.title')}</h2>
					<div class="category-line"></div>
				</div>
				<div class="beverage-carousel">
					<div class="carousel-track">
						<div class="carousel-item">
							<img
								src="{base}/images/coca-cola.jpg"
								alt="Coca-Cola"
								class="bev-image"
							/>
							<div class="bev-name">{$_('productsPage.beverages.cocaCola')}</div>
							<div class="bev-origin">{$_('productsPage.beverages.atlanta')}</div>
						</div>
						<div class="carousel-item">
							<img
								src="{base}/images/pepsi.jpg"
								alt="Pepsi"
								class="bev-image"
							/>
							<div class="bev-name">{$_('productsPage.beverages.pepsi')}</div>
							<div class="bev-origin">{$_('productsPage.beverages.purchase')}</div>
						</div>
						<div class="carousel-item">
							<img
								src="{base}/images/sprite.jpg"
								alt="Sprite"
								class="bev-image"
							/>
							<div class="bev-name">{$_('productsPage.beverages.sprite')}</div>
							<div class="bev-origin">{$_('productsPage.beverages.usProduction')}</div>
						</div>
						<div class="carousel-item">
							<img
								src="{base}/images/ginger-ale.jpg"
								alt="Ginger Ale"
								class="bev-image"
							/>
							<div class="bev-name">{$_('productsPage.beverages.gingerAle')}</div>
							<div class="bev-origin">{$_('productsPage.beverages.usProduction')}</div>
						</div>
						<div class="carousel-item">
							<img
								src="{base}/images/ale-8-one.jpg"
								alt="Ale-8-One"
								class="bev-image"
							/>
							<div class="bev-name">{$_('productsPage.beverages.ale8One')}</div>
							<div class="bev-origin">{$_('productsPage.beverages.winchester')}</div>
						</div>
						<!-- Duplicate for seamless loop -->
						<div class="carousel-item">
							<img
								src="{base}/images/coca-cola.jpg"
								alt="Coca-Cola"
								class="bev-image"
							/>
							<div class="bev-name">{$_('productsPage.beverages.cocaCola')}</div>
							<div class="bev-origin">{$_('productsPage.beverages.atlanta')}</div>
						</div>
						<div class="carousel-item">
							<img
								src="{base}/images/pepsi.jpg"
								alt="Pepsi"
								class="bev-image"
							/>
							<div class="bev-name">{$_('productsPage.beverages.pepsi')}</div>
							<div class="bev-origin">{$_('productsPage.beverages.purchase')}</div>
						</div>
						<div class="carousel-item">
							<img
								src="{base}/images/sprite.jpg"
								alt="Sprite"
								class="bev-image"
							/>
							<div class="bev-name">{$_('productsPage.beverages.sprite')}</div>
							<div class="bev-origin">{$_('productsPage.beverages.usProduction')}</div>
						</div>
						<div class="carousel-item">
							<img
								src="{base}/images/ginger-ale.jpg"
								alt="Ginger Ale"
								class="bev-image"
							/>
							<div class="bev-name">{$_('productsPage.beverages.gingerAle')}</div>
							<div class="bev-origin">{$_('productsPage.beverages.usProduction')}</div>
						</div>
						<div class="carousel-item">
							<img
								src="{base}/images/ale-8-one.jpg"
								alt="Ale-8-One"
								class="bev-image"
							/>
							<div class="bev-name">{$_('productsPage.beverages.ale8One')}</div>
							<div class="bev-origin">{$_('productsPage.beverages.winchester')}</div>
						</div>
					</div>
				</div>
			</div>

			<div class="category-block consumer-block">
				<div class="category-header">
					<h2>{$_('productsPage.consumer.title')}</h2>
				</div>
				<div class="consumer-grid">
					<div class="product-card">
						<div class="card-content">
							<h3>{$_('productsPage.consumer.electronics')}</h3>
							<p>{$_('productsPage.consumer.electronicsDesc')}</p>
						</div>
					</div>
					<div class="product-card">
						<div class="card-content">
							<h3>{$_('productsPage.consumer.homeGoods')}</h3>
							<p>{$_('productsPage.consumer.homeGoodsDesc')}</p>
						</div>
					</div>
					<div class="product-card">
						<div class="card-content">
							<h3>{$_('productsPage.consumer.healthBeauty')}</h3>
							<p>{$_('productsPage.consumer.healthBeautyDesc')}</p>
						</div>
					</div>
					<div class="product-card">
						<div class="card-content">
							<h3>{$_('productsPage.consumer.apparel')}</h3>
							<p>{$_('productsPage.consumer.apparelDesc')}</p>
						</div>
					</div>
				</div>
			</div>

			<div class="category-block industrial-block">
				<div class="split-layout">
					<div class="split-header">
						<h2>{$_('productsPage.industrial.title')}<br />{$_('productsPage.industrial.titleLine2')}</h2>
					</div>
					<div class="split-content">
						<div class="industrial-list">
							<div class="industrial-item">
								<div class="item-info">
									<h4>{$_('productsPage.industrial.equipment')}</h4>
									<p>{$_('productsPage.industrial.equipmentDesc')}</p>
								</div>
							</div>
							<div class="industrial-item">
								<div class="item-info">
									<h4>{$_('productsPage.industrial.supplies')}</h4>
									<p>{$_('productsPage.industrial.suppliesDesc')}</p>
								</div>
							</div>
							<div class="industrial-item">
								<div class="item-info">
									<h4>{$_('productsPage.industrial.materials')}</h4>
									<p>{$_('productsPage.industrial.materialsDesc')}</p>
								</div>
							</div>
							<div class="industrial-item">
								<div class="item-info">
									<h4>{$_('productsPage.industrial.tools')}</h4>
									<p>{$_('productsPage.industrial.toolsDesc')}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="requirements">
		<div class="req-container">
			<div class="req-header">
				<h2>{$_('productsPage.requirements.title')}</h2>
			</div>
			<div class="req-grid">
				<div class="req-item">
					<div class="req-content">
						<div class="req-label">{$_('productsPage.requirements.minOrder')}</div>
						<div class="req-value">{$_('productsPage.requirements.minOrderValue')}</div>
						<div class="req-note">{$_('productsPage.requirements.minOrderNote')}</div>
					</div>
				</div>
				<div class="req-item">
					<div class="req-content">
						<div class="req-label">{$_('productsPage.requirements.verification')}</div>
						<div class="req-value">{$_('productsPage.requirements.verificationValue')}</div>
						<div class="req-note">{$_('productsPage.requirements.verificationNote')}</div>
					</div>
				</div>
				<div class="req-item">
					<div class="req-content">
						<div class="req-label">{$_('productsPage.requirements.pricing')}</div>
						<div class="req-value">{$_('productsPage.requirements.pricingValue')}</div>
						<div class="req-note">{$_('productsPage.requirements.pricingNote')}</div>
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

	.products-page {
		min-height: 100vh;
		padding-top: 5rem;
		background: #050508;
	}

	.products-hero {
		padding: 6rem 4vw 4rem;
		border-bottom: 1px solid #1a1a22;
		text-align: center;
		position: relative;
		overflow: hidden;
		background: #050508;
	}

	.flag-container {
		position: absolute;
		top: -5%;
		right: -10%;
		width: 700px;
		height: 450px;
		opacity: 0.12;
		transform: rotate(-15deg);
		pointer-events: none;
		z-index: 0;
	}

	.hero-flag {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(60%) contrast(1.1) brightness(0.5);
		mix-blend-mode: screen;
	}

	.hero-content {
		position: relative;
		z-index: 1;
	}

	.hero-content h1 {
		font-size: clamp(3rem, 8vw, 5.5rem);
		font-weight: 900;
		letter-spacing: 0.05em;
		color: #ffffff;
		margin: 0 0 1.5rem 0;
		text-transform: uppercase;
	}

	.hero-content p {
		font-size: 1.1rem;
		color: #a1a1aa;
		margin: 0;
		font-weight: 400;
	}

	.category-section {
		padding: 6rem 4vw;
	}

	.category-layout {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 6rem;
	}

	.category-block {
		border-top: 1px solid #1a1a22;
		padding-top: 3rem;
	}

	.category-header {
		margin-bottom: 3rem;
	}

	.category-header h2 {
		font-size: 1.8rem;
		font-weight: 900;
		letter-spacing: 0.08em;
		color: #ffffff;
		margin: 0 0 1rem 0;
		text-transform: uppercase;
	}

	.consumer-block {
		background: #0a0a0d;
		padding: 4rem;
	}

	.consumer-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.product-card {
		background: #050508;
		border: 1px solid #1a1a22;
		padding: 2.5rem;
		position: relative;
	}

	.card-content h3 {
		font-size: 1.3rem;
		font-weight: 900;
		letter-spacing: 0.05em;
		color: #ffffff;
		margin: 0 0 1rem 0;
		text-transform: uppercase;
	}

	.card-content p {
		font-size: 0.9rem;
		line-height: 1.7;
		color: #a1a1aa;
		margin: 0;
		font-weight: 400;
	}

	.industrial-block {
		background: #050508;
		padding: 4rem;
		border: 2px solid #1a1a22;
	}

	.split-layout {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 0.8fr 1.2fr;
		gap: 5rem;
		align-items: start;
	}

	.split-header {
		position: relative;
		padding-top: 2rem;
	}

	.split-header h2 {
		font-size: 2.5rem;
		font-weight: 900;
		letter-spacing: 0.05em;
		color: #ffffff;
		margin: 0;
		text-transform: uppercase;
		line-height: 1.1;
	}

	.industrial-list {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.industrial-item {
		padding: 2rem;
		background: #0a0a0d;
		border-left: 3px solid #1c71d8;
	}

	.item-info h4 {
		font-size: 1.1rem;
		font-weight: 900;
		letter-spacing: 0.05em;
		color: #ffffff;
		margin: 0 0 0.5rem 0;
		text-transform: uppercase;
	}

	.item-info p {
		font-size: 0.9rem;
		line-height: 1.6;
		color: #a1a1aa;
		margin: 0;
		font-weight: 400;
	}

	.beverage-block {
		background: #0a0a0d;
		padding: 3rem;
		border: 1px solid #1a1a22;
	}

	.beverage-carousel {
		overflow: hidden;
		max-width: 900px;
		margin: 0 auto;
		position: relative;
		padding: 2rem 0;
	}

	.carousel-track {
		display: flex;
		animation: scroll 20s linear infinite;
		gap: 3rem;
	}

	.carousel-item {
		min-width: 320px;
		padding: 0;
		background: #050508;
		border: 1px solid #1a1a22;
		text-align: center;
		flex-shrink: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.bev-image {
		width: 100%;
		height: 280px;
		object-fit: cover;
		display: block;
		filter: grayscale(20%) contrast(1.1) brightness(0.9);
	}

	.bev-name {
		font-size: 1.3rem;
		font-weight: 900;
		letter-spacing: 0.05em;
		color: #ffffff;
		margin: 2rem 2rem 0.75rem 2rem;
		text-transform: uppercase;
	}

	.bev-origin {
		font-size: 0.85rem;
		color: #71717a;
		font-weight: 500;
		letter-spacing: 0.05em;
		margin: 0 2rem 2rem 2rem;
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc((-320px - 3rem) * 5));
		}
	}

	.carousel-track:hover {
		animation-play-state: paused;
	}

	.requirements {
		padding: 6rem 4vw;
		background: #0a0a0d;
		border-top: 1px solid #1a1a22;
	}

	.req-container {
		max-width: 1400px;
		margin: 0 auto;
	}

	.req-header {
		text-align: center;
		margin-bottom: 4rem;
	}

	.req-header h2 {
		font-size: 3rem;
		font-weight: 900;
		letter-spacing: 0.08em;
		color: #ffffff;
		margin: 0;
		text-transform: uppercase;
	}

	.req-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 3rem;
	}

	.req-item {
		background: #050508;
		border: 2px solid #1a1a22;
		padding: 3rem 2rem;
		text-align: center;
		position: relative;
	}

	.req-content {
		width: 100%;
	}

	.req-label {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		color: #52525b;
		margin-bottom: 1rem;
		text-transform: uppercase;
	}

	.req-value {
		font-size: 1.8rem;
		font-weight: 900;
		letter-spacing: 0.02em;
		color: #ffffff;
		margin-bottom: 0.75rem;
		text-transform: uppercase;
	}

	.req-note {
		font-size: 0.85rem;
		color: #a1a1aa;
		font-weight: 400;
		line-height: 1.5;
	}

	@media (max-width: 900px) {
		.flag-container {
			width: 400px;
			height: 250px;
			top: -5%;
			right: -25%;
			opacity: 0.1;
		}

		.consumer-grid {
			grid-template-columns: 1fr;
		}

		.consumer-block,
		.industrial-block {
			padding: 2.5rem;
		}

		.split-layout {
			grid-template-columns: 1fr;
			gap: 3rem;
		}

		.split-header h2 {
			font-size: 2rem;
		}

		.req-grid {
			grid-template-columns: 1fr;
		}

		.req-value {
			font-size: 1.5rem;
		}

		.req-header h2 {
			font-size: 2rem;
		}

		.products-hero {
			padding: 4rem 4vw 3rem;
		}

		.category-section {
			padding: 4rem 4vw;
		}

		.beverage-block {
			padding: 2rem 1rem;
		}

		.beverage-carousel {
			padding: 1.5rem 0;
		}

		.carousel-track {
			gap: 1.5rem;
		}

		.carousel-item {
			min-width: 200px;
		}

		.bev-image {
			height: 180px;
		}

		.bev-name {
			font-size: 1rem;
			margin: 1.25rem 1rem 0.5rem 1rem;
		}

		.bev-origin {
			font-size: 0.75rem;
			margin: 0 1rem 1.25rem 1rem;
		}

		@keyframes scroll {
			0% {
				transform: translateX(0);
			}
			100% {
				transform: translateX(calc((-200px - 1.5rem) * 5));
			}
		}
	}

	@media (max-width: 480px) {
		.beverage-block {
			padding: 1.5rem 0.5rem;
		}

		.carousel-track {
			gap: 1rem;
		}

		.carousel-item {
			min-width: 160px;
		}

		.bev-image {
			height: 140px;
		}

		.bev-name {
			font-size: 0.9rem;
			margin: 1rem 0.75rem 0.4rem 0.75rem;
		}

		.bev-origin {
			font-size: 0.7rem;
			margin: 0 0.75rem 1rem 0.75rem;
		}

		@keyframes scroll {
			0% {
				transform: translateX(0);
			}
			100% {
				transform: translateX(calc((-160px - 1rem) * 5));
			}
		}
	}
</style>
