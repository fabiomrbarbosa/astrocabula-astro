import type { Planet } from "./dignities";

// Weekday index, JS convention: 0 = Sunday ... 6 = Saturday.
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface BilingualText {
	en: string;
	pt: string;
}

export interface PlanetAttributes {
	planet: Planet;
	qualities: BilingualText;
	temperament: BilingualText;
	gender: BilingualText;
	sect: BilingualText;
	benefic: BilingualText;
	halfOrb: number;
	// Half of the half-orb, as a fraction (e.g. "4 1/2") rather than a
	// decimal — half-orbs are all whole or half degrees, so the only
	// fractional part that occurs is 1/2. Degree sign added at render time,
	// like halfOrb.
	moiety: string;
	friends: Planet[];
	enemies: Planet[];
	avgSpeed: string;
	zodiacalCycle: BilingualText;
	firdaria: number;
	agesOfMan: BilingualText;
	years: { minor: number; middle: number; major: number; max: number };
	houseOfJoy: number;
	dayRuler: Weekday;
	nightRuler: Weekday;
}

// Order follows the source table: Saturn -> Moon (slowest to fastest).
export const PLANETS: PlanetAttributes[] = [
	{
		planet: "Saturn",
		qualities: { en: "Cold + Dry", pt: "Frio + Seco" },
		temperament: { en: "Melancholic", pt: "Melancólico" },
		gender: { en: "Masculine", pt: "Masculino" },
		sect: { en: "Diurnal", pt: "Diurno" },
		benefic: { en: "Malefic", pt: "Maléfico" },
		halfOrb: 9,
		moiety: "4 1/2",
		friends: ["Moon", "Mercury", "Sun", "Jupiter"],
		enemies: ["Venus", "Mars"],
		avgSpeed: "0°02′",
		zodiacalCycle: { en: "29.5 years", pt: "29,5 anos" },
		firdaria: 11,
		agesOfMan: { en: "Decline: 68–98", pt: "Declínio: 68-98" },
		years: { minor: 30, middle: 43.5, major: 57, max: 256 },
		houseOfJoy: 12,
		dayRuler: 6,
		nightRuler: 2,
	},
	{
		planet: "Jupiter",
		qualities: { en: "Hot + Moist", pt: "Quente + Húmido" },
		temperament: { en: "Sanguine", pt: "Sanguíneo" },
		gender: { en: "Masculine", pt: "Masculino" },
		sect: { en: "Diurnal", pt: "Diurno" },
		benefic: { en: "Benefic", pt: "Benéfico" },
		halfOrb: 9,
		moiety: "4 1/2",
		friends: ["Moon", "Mercury", "Venus", "Sun", "Saturn"],
		enemies: ["Mars"],
		avgSpeed: "0°05′",
		zodiacalCycle: { en: "12 years", pt: "12 anos" },
		firdaria: 12,
		agesOfMan: { en: "Old age: 56–68", pt: "Velhice: 56-68" },
		years: { minor: 12, middle: 45.5, major: 79, max: 426 },
		houseOfJoy: 11,
		dayRuler: 4,
		nightRuler: 0,
	},
	{
		planet: "Mars",
		qualities: { en: "Hot + Dry", pt: "Quente + Seco" },
		temperament: { en: "Choleric", pt: "Colérico" },
		gender: { en: "Masculine", pt: "Masculino" },
		sect: { en: "Nocturnal", pt: "Nocturno" },
		benefic: { en: "Malefic", pt: "Maléfico" },
		halfOrb: 8,
		moiety: "4",
		friends: ["Venus"],
		enemies: ["Moon", "Mercury", "Sun", "Jupiter", "Saturn"],
		avgSpeed: "0°31′",
		zodiacalCycle: { en: "2 years", pt: "2 anos" },
		firdaria: 7,
		agesOfMan: { en: "Maturity: 41–56", pt: "Maturidade: 41-56" },
		years: { minor: 15, middle: 40.5, major: 66, max: 284 },
		houseOfJoy: 6,
		dayRuler: 2,
		nightRuler: 5,
	},
	{
		planet: "Sun",
		qualities: { en: "Hot + Dry", pt: "Quente + Seco" },
		temperament: {
			en: "Spring – Sanguine\nSummer – Choleric\nAutumn – Melancholic\nWinter – Phlegmatic",
			pt: "Primavera - Sanguíneo\nVerão - Colérico\nOutono - Melancólico\nInverno - Fleumático",
		},
		gender: { en: "Masculine", pt: "Masculino" },
		sect: { en: "Diurnal", pt: "Diurno" },
		benefic: {
			en: "Moderately Benefic (Malefic by conjunction)",
			pt: "Moderadamente Benéfico (Maléfico por conjunção)",
		},
		halfOrb: 15,
		moiety: "7 1/2",
		friends: ["Venus", "Jupiter", "Saturn"],
		enemies: ["Moon", "Mercury", "Mars"],
		avgSpeed: "0°59′",
		zodiacalCycle: { en: "1 year", pt: "1 ano" },
		firdaria: 10,
		agesOfMan: { en: "Adulthood: 22–41", pt: "Idade Adulta: 22-41" },
		years: { minor: 19, middle: 69.5, major: 120, max: 1461 },
		houseOfJoy: 9,
		dayRuler: 0,
		nightRuler: 3,
	},
	{
		planet: "Venus",
		qualities: {
			en: "Cold + Moist (Hot + Moist according to others)",
			pt: "Frio + Húmido (Quente + Húmido segundo outros)",
		},
		temperament: {
			en: "Moderately Phlegmatic or Sanguine",
			pt: "Moderadamente Fleumático ou Sanguíneo",
		},
		gender: { en: "Feminine", pt: "Feminino" },
		sect: { en: "Nocturnal", pt: "Nocturno" },
		benefic: { en: "Benefic", pt: "Benéfico" },
		halfOrb: 7,
		moiety: "3 1/2",
		friends: ["Moon", "Mercury", "Sun", "Mars", "Jupiter"],
		enemies: ["Saturn"],
		avgSpeed: "0°59′",
		zodiacalCycle: { en: "1 year (approx.)", pt: "1 ano (aprox.)" },
		firdaria: 8,
		agesOfMan: { en: "Adolescence: 14–22", pt: "Adolescência: 14-22" },
		years: { minor: 8, middle: 45, major: 82, max: 1151 },
		houseOfJoy: 5,
		dayRuler: 5,
		nightRuler: 1,
	},
	{
		planet: "Mercury",
		qualities: { en: "Common", pt: "Comum" },
		temperament: {
			en: "Common (moderately melancholic by itself)",
			pt: "Comum (moderadamente melancólico por si)",
		},
		gender: { en: "Neuter", pt: "Neutro" },
		sect: { en: "Common", pt: "Comum" },
		benefic: { en: "Common", pt: "Comum" },
		halfOrb: 7,
		moiety: "3 1/2",
		friends: ["Venus", "Jupiter", "Saturn"],
		enemies: ["Moon", "Sun", "Mars"],
		avgSpeed: "0°59′",
		zodiacalCycle: { en: "1 year (approx.)", pt: "1 ano (aprox.)" },
		firdaria: 13,
		agesOfMan: { en: "Childhood: 4–14", pt: "Infância: 4-14" },
		years: { minor: 20, middle: 48, major: 76, max: 461 },
		houseOfJoy: 1,
		dayRuler: 3,
		nightRuler: 6,
	},
	{
		planet: "Moon",
		qualities: { en: "Cold + Moist", pt: "Frio + Húmido" },
		temperament: {
			en: "1st quarter – Sanguine\n2nd quarter – Choleric\n3rd quarter – Melancholic\n4th quarter – Phlegmatic",
			pt: "1º quarto - Sanguíneo\n2º quarto - Colérico\n3º quarto - Melancólico\n4º quarto - Fleumático",
		},
		gender: { en: "Feminine", pt: "Feminino" },
		sect: { en: "Nocturnal", pt: "Nocturno" },
		benefic: { en: "Variable", pt: "Variável" },
		halfOrb: 12,
		moiety: "6",
		friends: ["Venus", "Jupiter", "Saturn"],
		enemies: ["Mercury", "Sun", "Mars"],
		avgSpeed: "13°11′",
		zodiacalCycle: { en: "27.5 days", pt: "27,5 dias" },
		firdaria: 9,
		agesOfMan: { en: "Infancy: 0–4", pt: "Bebé: 0-4" },
		years: { minor: 25, middle: 66.5, major: 108, max: 520 },
		houseOfJoy: 3,
		dayRuler: 1,
		nightRuler: 4,
	},
];
