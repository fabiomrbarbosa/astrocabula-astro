import { PLANET_SYMBOLS, type Planet, type Dignity } from "../data/dignities";
import {
	ui,
	type Lang,
	PLANET_NAMES_I18N,
	SIGN_NAMES_I18N,
} from "../i18n";

export const DEGREE_TICKS = Array.from({ length: 30 }, (_, i) => i);
export const FIVE_DEGREE_TICKS = [5, 10, 15, 20, 25];
export const TEN_DEGREE_TICKS = [10, 20];

// Background tint per planet, used for term segments and planet glyphs throughout the table.
// Nodes are intentionally excluded — they're shown without a background tint.
export const PLANET_COLORS: Partial<Record<Planet, string>> = {
	Sun: "#FDEFD8",
	Moon: "#E2E8EE",
	Mercury: "#FEF9D8",
	Venus: "#DBF0DD",
	Mars: "#F5D8D8",
	Jupiter: "#DAD9EC",
	Saturn: "#E6E4E0",
};

export function symbol(planet: Planet) {
	return PLANET_SYMBOLS[planet];
}

export function planetStyle(planet: Planet) {
	const color = PLANET_COLORS[planet];
	return color ? `background-color: ${color}` : undefined;
}

export function planetsStyle(planets: Planet[]) {
	if (planets.length === 1) return planetStyle(planets[0]);
	// Two co-rulers: solid base color plus a diagonal triangle (see .segment.split::after)
	// in the second planet's color, split along the bottom-left/top-right diagonal.
	return `${planetStyle(planets[0])}; --split-color: ${PLANET_COLORS[planets[1]]}`;
}

export function tickClass(degree: number, terms: { from: number }[]) {
	if (degree > 0 && terms.some((t) => t.from === degree)) return "major";
	if (degree % 5 === 0) return "medium";
	return "minor";
}

// Lang-bound label helpers, shared by DignitiesTable and DignitiesAccordion.
export function makeLabels(lang: Lang) {
	const t = ui[lang];

	function name(planet: Planet) {
		return PLANET_NAMES_I18N[lang][planet];
	}

	function signName(sign: string) {
		return SIGN_NAMES_I18N[lang][sign];
	}

	function dignityLabel(d?: Dignity) {
		if (!d) return "";
		return d.degree !== undefined
			? `${name(d.planet)} (${d.degree}°)`
			: name(d.planet);
	}

	function triplicityLabel(
		planet: Planet,
		role: "day" | "night" | "participant",
	) {
		const roleLabel =
			role === "participant" ? t.table.participantFull : t.table[role];
		return `${name(planet)} (${roleLabel})`;
	}

	return { name, signName, dignityLabel, triplicityLabel };
}
