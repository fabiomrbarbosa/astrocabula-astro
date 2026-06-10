import { SIGNS, type Planet } from "../data/dignities";
import type { BilingualText, Weekday } from "../data/planets";
import { ui, type Lang } from "../i18n";

const ROMAN_NUMERALS = [
	"I",
	"II",
	"III",
	"IV",
	"V",
	"VI",
	"VII",
	"VIII",
	"IX",
	"X",
	"XI",
	"XII",
];

export function toRoman(n: number) {
	return ROMAN_NUMERALS[n - 1];
}

// Signs whose ruler (throne) is the given planet.
export function domicileSigns(planet: Planet) {
	return SIGNS.filter((s) => s.throne === planet);
}

// Sign in which the given planet is exalted, if any.
export function exaltationSign(planet: Planet) {
	return SIGNS.find((s) => s.exaltation?.planet === planet);
}

export function makePlanetsLabels(lang: Lang) {
	const t = ui[lang];

	function text(bi: BilingualText) {
		return bi[lang];
	}

	function weekday(day: Weekday) {
		return t.weekdays[day];
	}

	function years(n: number) {
		return n.toLocaleString(lang === "pt" ? "pt-PT" : "en-US");
	}

	return { text, weekday, years };
}
