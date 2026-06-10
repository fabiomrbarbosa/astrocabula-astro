// Shared open/close animation for the mobile <details> accordions
// (DignitiesAccordion, PlanetsAccordion). Animates each section's
// expand/collapse, unless the user has requested reduced motion — in
// which case we leave the native (instant) <details> toggle behaviour
// untouched.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const ANIMATION_OPTIONS: KeyframeAnimationOptions = {
	duration: 200,
	easing: "ease-out",
};
// 1.5rem matches <main>'s top padding in Layout.astro.
const MAIN_PADDING = 1.5 * 16;

interface Item {
	details: HTMLDetailsElement;
	summary: HTMLElement;
	body: HTMLElement;
	animation: Animation | null;
	isClosing: boolean;
	isExpanding: boolean;
}

export function setupAccordionAnimation(rootSelector: string) {
	const items: Item[] = Array.from(
		document.querySelectorAll<HTMLDetailsElement>(`${rootSelector} details`),
	)
		.map((details): Item | null => {
			const summary = details.querySelector<HTMLElement>("summary");
			const body = details.querySelector<HTMLElement>(".body");
			if (!summary || !body) return null;
			return {
				details,
				summary,
				body,
				animation: null,
				isClosing: false,
				isExpanding: false,
			};
		})
		.filter((item): item is Item => item !== null);

	let openItem: Item | null = items.find((item) => item.details.open) ?? null;

	// The shared `name` gives a no-JS exclusive accordion. With JS driving
	// open/close ourselves (including animating the previously-open item
	// shut), the native exclusive-group behaviour only gets in the way —
	// among other things, Chromium scroll-jumps a `name`-grouped <details>
	// to the viewport center when its open state changes, fighting our own
	// scroll animation. Drop it for the animated path; reduced motion keeps
	// the native (instant) grouping.
	if (!reduceMotion.matches) {
		items.forEach((item) => item.details.removeAttribute("name"));
	}

	function headerOffset() {
		const header = document.querySelector<HTMLElement>(".site-header");
		return (header?.offsetHeight ?? 0) + MAIN_PADDING;
	}

	// Where `item`'s summary will end up once `closing` (if any) has
	// collapsed — used to scroll smoothly from the current position
	// straight to the post-toggle layout, in one motion.
	function scrollTarget(item: Item, closing: Item | null) {
		const top = item.summary.getBoundingClientRect().top + window.scrollY;
		let shift = 0;
		if (closing && closing !== item) {
			const closingIndex = items.indexOf(closing);
			const itemIndex = items.indexOf(item);
			if (closingIndex < itemIndex) {
				shift = closing.details.offsetHeight - closing.summary.offsetHeight;
			}
		}
		return top - shift - headerOffset();
	}

	items.forEach((item, index) => {
		const { details, summary } = item;

		// Pre-empt the browser's own focus handling: focusing a <summary> on
		// click also scroll-jumps it to the viewport center, fighting our
		// scroll animation. Focusing it ourselves first (without scrolling)
		// means the click's default focus is a no-op (already focused), so
		// it has nothing left to scroll for.
		summary.addEventListener("pointerdown", () => {
			summary.focus({ preventScroll: true });
		});

		summary.addEventListener("click", (event) => {
			if (reduceMotion.matches) return;
			event.preventDefault();
			details.style.overflow = "hidden";

			if (item.isClosing || !details.open) {
				const previous = openItem !== item ? openItem : null;

				// Scroll directly from the current position to where this
				// section will land once `previous` (if any) has finished
				// collapsing — skipped for the very first section, which
				// is already at the top.
				if (index > 0) {
					window.scrollTo({
						top: scrollTarget(item, previous),
						behavior: "smooth",
					});
				}

				if (previous) {
					// Close `previous` ourselves, animated.
					previous.details.style.overflow = "hidden";
					shrink(previous);
				}
				expand(item);

				openItem = item;
			} else if (item.isExpanding || details.open) {
				shrink(item);
				if (openItem === item) openItem = null;
			}
		});

		// Reduced-motion path: native instant toggle, so the layout is
		// already final by the time "toggle" fires.
		details.addEventListener("toggle", () => {
			if (!reduceMotion.matches) return;
			if (details.open) {
				openItem = item;
				if (index > 0) {
					window.scrollTo({ top: scrollTarget(item, null), behavior: "auto" });
				}
			} else if (openItem === item) {
				openItem = null;
			}
		});
	});

	function shrink(item: Item) {
		item.isClosing = true;
		const startHeight = `${item.details.offsetHeight}px`;
		const endHeight = `${item.summary.offsetHeight}px`;

		item.animation?.cancel();
		item.animation = item.details.animate(
			{ height: [startHeight, endHeight] },
			ANIMATION_OPTIONS,
		);
		item.animation.onfinish = () => onFinish(item, false);
		item.animation.oncancel = () => (item.isClosing = false);
	}

	function expand(item: Item) {
		item.details.style.height = `${item.details.offsetHeight}px`;
		item.details.open = true;
		requestAnimationFrame(() => {
			item.isExpanding = true;
			const startHeight = `${item.details.offsetHeight}px`;
			const endHeight = `${item.summary.offsetHeight + item.body.offsetHeight}px`;

			item.animation?.cancel();
			item.animation = item.details.animate(
				{ height: [startHeight, endHeight] },
				ANIMATION_OPTIONS,
			);
			item.animation.onfinish = () => onFinish(item, true);
			item.animation.oncancel = () => (item.isExpanding = false);
		});
	}

	function onFinish(item: Item, open: boolean) {
		item.details.open = open;
		item.animation = null;
		item.isClosing = false;
		item.isExpanding = false;
		item.details.style.height = "";
		item.details.style.overflow = "";
	}
}
