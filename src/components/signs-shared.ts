import { SIGNS, type Element } from "../data/dignities";
import type { BilingualText } from "../data/planets";
import { ELEMENT_NAMES_I18N, type Lang } from "../i18n";

// Background tint per element, sampled from the source PDF's column colors
// (fire pink, earth green, air yellow, water periwinkle). Distinct from the
// :root --fire/--earth/--air/--water variables, which are no longer used for
// row tinting anywhere.
export const ELEMENT_COLORS: Record<Element, string> = {
	Fire: "#F4CFCB",
	Earth: "#D2E8D0",
	Air: "#FBF0C4",
	Water: "#DAD8EB",
};

export function elementStyle(element: Element) {
	return `background-color: ${ELEMENT_COLORS[element]}`;
}

// The dignities entry for a sign — ruler, exaltation, triplicities, terms
// and faces on the Signs page come from dignities.ts, not data/signs.ts.
export function dignitiesOf(sign: string) {
	return SIGNS.find((s) => s.sign === sign)!;
}

export function makeSignsLabels(lang: Lang) {
	function text(bi: BilingualText) {
		return bi[lang];
	}

	function elementName(element: Element) {
		return ELEMENT_NAMES_I18N[lang][element];
	}

	return { text, elementName };
}
