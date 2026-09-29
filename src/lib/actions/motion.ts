type RevealOptions = { delay?: number; variant?: 'up' | 'fade' | 'scale' | 'rule' };

let observer: IntersectionObserver | undefined;

function getObserver() {
	observer ??= new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer?.unobserve(entry.target);
				}
			}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
	);
	return observer;
}

/** Fades an element in once it scrolls into view. */
export function reveal(node: HTMLElement, opts: RevealOptions = {}) {
	const { delay = 0, variant = 'up' } = opts;
	node.classList.add(variant === 'rule' ? 'rule' : 'reveal');
	if (variant === 'fade') node.classList.add('reveal-fade');
	if (variant === 'scale') node.classList.add('reveal-scale');
	if (delay) node.style.setProperty('--reveal-delay', `${delay}ms`);

	const io = getObserver();
	io.observe(node);
	return {
		destroy() {
			io.unobserve(node);
		}
	};
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Drifts an element vertically as its container scrolls through the viewport. */
export function parallax(node: HTMLElement, strength = 0.12) {
	if (prefersReducedMotion()) return;
	const host = node.parentElement ?? node;
	let frame = 0;

	const update = () => {
		frame = 0;
		const rect = host.getBoundingClientRect();
		const vh = window.innerHeight;
		if (rect.bottom < 0 || rect.top > vh) return;
		// -1 when the host enters from the bottom, +1 when it leaves at the top.
		const progress = (vh - rect.top) / (vh + rect.height) * 2 - 1;
		node.style.transform = `translate3d(0, ${(progress * strength * rect.height).toFixed(1)}px, 0) scale(${1 + strength * 1.6})`;
	};

	const onScroll = () => {
		if (!frame) frame = requestAnimationFrame(update);
	};

	update();
	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll);
	return {
		destroy() {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		}
	};
}
