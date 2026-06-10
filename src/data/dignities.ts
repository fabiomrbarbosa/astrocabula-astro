export type Planet =
	| 'Sun'
	| 'Moon'
	| 'Mercury'
	| 'Venus'
	| 'Mars'
	| 'Jupiter'
	| 'Saturn'
	| 'NorthNode'
	| 'SouthNode';

// Astronomicon glyphs (font-family: Astronomicon)
export const PLANET_SYMBOLS: Record<Planet, string> = {
	Moon: 'R',
	Mercury: 'S',
	Venus: 'T',
	Sun: 'Q',
	Mars: 'U',
	Jupiter: 'V',
	Saturn: 'W',
	NorthNode: 'g',
	SouthNode: 'i',
};

export const PLANET_NAMES: Record<Planet, string> = {
	Sun: 'Sun',
	Moon: 'Moon',
	Mercury: 'Mercury',
	Venus: 'Venus',
	Mars: 'Mars',
	Jupiter: 'Jupiter',
	Saturn: 'Saturn',
	NorthNode: 'North Node',
	SouthNode: 'South Node',
};

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';

export interface DegreeRange {
	from: number;
	to: number;
}

export interface TermEntry extends DegreeRange {
	planet: Planet;
}

export interface FaceEntry extends DegreeRange {
	planet: Planet;
}

export interface AlmutenEntry extends DegreeRange {
	planets: Planet[];
}

export interface Dignity {
	planet: Planet;
	degree?: number;
}

export interface SignDignities {
	sign: string;
	symbol: string;
	element: Element;
	throne: Planet;
	exaltation?: Dignity;
	triplicity: { day: Planet; night: Planet; participant: Planet };
	terms: TermEntry[];
	faces: FaceEntry[];
	exile: Planet;
	fall?: Dignity;
	almuten: AlmutenEntry[];
}

export const SIGNS: SignDignities[] = [
	{
		sign: 'Aries',
		symbol: 'A',
		element: 'Fire',
		throne: 'Mars',
		exaltation: { planet: 'Sun', degree: 19 },
		triplicity: { day: 'Sun', night: 'Jupiter', participant: 'Saturn' },
		terms: [
			{ from: 0, to: 5, planet: 'Jupiter' },
			{ from: 6, to: 11, planet: 'Venus' },
			{ from: 12, to: 19, planet: 'Mercury' },
			{ from: 20, to: 24, planet: 'Mars' },
			{ from: 25, to: 29, planet: 'Saturn' },
		],
		faces: [
			{ from: 0, to: 9, planet: 'Mars' },
			{ from: 10, to: 19, planet: 'Sun' },
			{ from: 20, to: 29, planet: 'Venus' },
		],
		exile: 'Venus',
		fall: { planet: 'Saturn', degree: 21 },
		almuten: [
			{ from: 0, to: 19, planets: ['Sun'] },
			{ from: 20, to: 24, planets: ['Sun', 'Mars'] },
			{ from: 25, to: 29, planets: ['Sun'] },
		],
	},
	{
		sign: 'Taurus',
		symbol: 'B',
		element: 'Earth',
		throne: 'Venus',
		exaltation: { planet: 'Moon', degree: 3 },
		triplicity: { day: 'Venus', night: 'Moon', participant: 'Mars' },
		terms: [
			{ from: 0, to: 7, planet: 'Venus' },
			{ from: 8, to: 13, planet: 'Mercury' },
			{ from: 14, to: 21, planet: 'Jupiter' },
			{ from: 22, to: 26, planet: 'Saturn' },
			{ from: 27, to: 29, planet: 'Mars' },
		],
		faces: [
			{ from: 0, to: 9, planet: 'Mercury' },
			{ from: 10, to: 19, planet: 'Moon' },
			{ from: 20, to: 29, planet: 'Saturn' },
		],
		exile: 'Mars',
		almuten: [
			{ from: 0, to: 9, planets: ['Venus'] },
			{ from: 10, to: 19, planets: ['Moon', 'Venus'] },
			{ from: 20, to: 29, planets: ['Venus'] },
		],
	},
	{
		sign: 'Gemini',
		symbol: 'C',
		element: 'Air',
		throne: 'Mercury',
		exaltation: { planet: 'NorthNode', degree: 3 },
		triplicity: { day: 'Saturn', night: 'Mercury', participant: 'Jupiter' },
		terms: [
			{ from: 0, to: 5, planet: 'Mercury' },
			{ from: 6, to: 11, planet: 'Jupiter' },
			{ from: 12, to: 16, planet: 'Venus' },
			{ from: 17, to: 23, planet: 'Mars' },
			{ from: 24, to: 29, planet: 'Saturn' },
		],
		faces: [
			{ from: 0, to: 9, planet: 'Jupiter' },
			{ from: 10, to: 19, planet: 'Mars' },
			{ from: 20, to: 29, planet: 'Sun' },
		],
		exile: 'Jupiter',
		fall: { planet: 'SouthNode', degree: 3 },
		almuten: [{ from: 0, to: 29, planets: ['Mercury'] }],
	},
	{
		sign: 'Cancer',
		symbol: 'D',
		element: 'Water',
		throne: 'Moon',
		exaltation: { planet: 'Jupiter', degree: 15 },
		triplicity: { day: 'Venus', night: 'Mars', participant: 'Moon' },
		terms: [
			{ from: 0, to: 6, planet: 'Mars' },
			{ from: 7, to: 12, planet: 'Venus' },
			{ from: 13, to: 18, planet: 'Mercury' },
			{ from: 19, to: 25, planet: 'Jupiter' },
			{ from: 26, to: 29, planet: 'Saturn' },
		],
		faces: [
			{ from: 0, to: 9, planet: 'Venus' },
			{ from: 10, to: 19, planet: 'Mercury' },
			{ from: 20, to: 29, planet: 'Moon' },
		],
		exile: 'Saturn',
		fall: { planet: 'Mars', degree: 28 },
		almuten: [{ from: 0, to: 29, planets: ['Moon'] }],
	},
	{
		sign: 'Leo',
		symbol: 'E',
		element: 'Fire',
		throne: 'Sun',
		triplicity: { day: 'Sun', night: 'Jupiter', participant: 'Saturn' },
		terms: [
			{ from: 0, to: 5, planet: 'Jupiter' },
			{ from: 6, to: 10, planet: 'Venus' },
			{ from: 11, to: 17, planet: 'Saturn' },
			{ from: 18, to: 23, planet: 'Mercury' },
			{ from: 24, to: 29, planet: 'Mars' },
		],
		faces: [
			{ from: 0, to: 9, planet: 'Saturn' },
			{ from: 10, to: 19, planet: 'Jupiter' },
			{ from: 20, to: 29, planet: 'Mars' },
		],
		exile: 'Saturn',
		almuten: [{ from: 0, to: 29, planets: ['Sun'] }],
	},
	{
		sign: 'Virgo',
		symbol: 'F',
		element: 'Earth',
		throne: 'Mercury',
		exaltation: { planet: 'Mercury', degree: 15 },
		triplicity: { day: 'Venus', night: 'Moon', participant: 'Mars' },
		terms: [
			{ from: 0, to: 6, planet: 'Mercury' },
			{ from: 7, to: 16, planet: 'Venus' },
			{ from: 17, to: 20, planet: 'Jupiter' },
			{ from: 21, to: 27, planet: 'Mars' },
			{ from: 28, to: 29, planet: 'Saturn' },
		],
		faces: [
			{ from: 0, to: 9, planet: 'Sun' },
			{ from: 10, to: 19, planet: 'Venus' },
			{ from: 20, to: 29, planet: 'Mercury' },
		],
		exile: 'Jupiter',
		fall: { planet: 'Venus', degree: 27 },
		almuten: [{ from: 0, to: 29, planets: ['Mercury'] }],
	},
	{
		sign: 'Libra',
		symbol: 'G',
		element: 'Air',
		throne: 'Venus',
		exaltation: { planet: 'Saturn', degree: 21 },
		triplicity: { day: 'Saturn', night: 'Mercury', participant: 'Jupiter' },
		terms: [
			{ from: 0, to: 5, planet: 'Saturn' },
			{ from: 6, to: 13, planet: 'Mercury' },
			{ from: 14, to: 20, planet: 'Jupiter' },
			{ from: 21, to: 27, planet: 'Venus' },
			{ from: 28, to: 29, planet: 'Mars' },
		],
		faces: [
			{ from: 0, to: 9, planet: 'Moon' },
			{ from: 10, to: 19, planet: 'Saturn' },
			{ from: 20, to: 29, planet: 'Jupiter' },
		],
		exile: 'Mars',
		fall: { planet: 'Sun', degree: 19 },
		almuten: [
			{ from: 0, to: 20, planets: ['Saturn'] },
			{ from: 21, to: 27, planets: ['Saturn', 'Venus'] },
			{ from: 28, to: 29, planets: ['Saturn'] },
		],
	},
	{
		sign: 'Scorpio',
		symbol: 'H',
		element: 'Water',
		throne: 'Mars',
		triplicity: { day: 'Venus', night: 'Mars', participant: 'Moon' },
		terms: [
			{ from: 0, to: 6, planet: 'Mars' },
			{ from: 7, to: 10, planet: 'Venus' },
			{ from: 11, to: 18, planet: 'Mercury' },
			{ from: 19, to: 23, planet: 'Jupiter' },
			{ from: 24, to: 29, planet: 'Saturn' },
		],
		faces: [
			{ from: 0, to: 9, planet: 'Mars' },
			{ from: 10, to: 19, planet: 'Sun' },
			{ from: 20, to: 29, planet: 'Venus' },
		],
		exile: 'Venus',
		fall: { planet: 'Moon', degree: 3 },
		almuten: [{ from: 0, to: 29, planets: ['Mars'] }],
	},
	{
		sign: 'Sagittarius',
		symbol: 'I',
		element: 'Fire',
		throne: 'Jupiter',
		exaltation: { planet: 'SouthNode', degree: 3 },
		triplicity: { day: 'Sun', night: 'Jupiter', participant: 'Saturn' },
		terms: [
			{ from: 0, to: 11, planet: 'Jupiter' },
			{ from: 12, to: 16, planet: 'Venus' },
			{ from: 17, to: 20, planet: 'Mercury' },
			{ from: 21, to: 25, planet: 'Saturn' },
			{ from: 26, to: 29, planet: 'Mars' },
		],
		faces: [
			{ from: 0, to: 9, planet: 'Mercury' },
			{ from: 10, to: 19, planet: 'Moon' },
			{ from: 20, to: 29, planet: 'Saturn' },
		],
		exile: 'Mercury',
		fall: { planet: 'NorthNode', degree: 3 },
		almuten: [{ from: 0, to: 29, planets: ['Jupiter'] }],
	},
	{
		sign: 'Capricorn',
		symbol: 'J',
		element: 'Earth',
		throne: 'Saturn',
		exaltation: { planet: 'Mars', degree: 28 },
		triplicity: { day: 'Venus', night: 'Moon', participant: 'Mars' },
		terms: [
			{ from: 0, to: 6, planet: 'Mercury' },
			{ from: 7, to: 13, planet: 'Jupiter' },
			{ from: 14, to: 21, planet: 'Venus' },
			{ from: 22, to: 25, planet: 'Saturn' },
			{ from: 26, to: 29, planet: 'Mars' },
		],
		faces: [
			{ from: 0, to: 9, planet: 'Jupiter' },
			{ from: 10, to: 19, planet: 'Mars' },
			{ from: 20, to: 29, planet: 'Sun' },
		],
		exile: 'Moon',
		fall: { planet: 'Jupiter', degree: 15 },
		almuten: [
			{ from: 0, to: 21, planets: ['Mars'] },
			{ from: 22, to: 25, planets: ['Mars', 'Saturn'] },
			{ from: 26, to: 29, planets: ['Mars'] },
		],
	},
	{
		sign: 'Aquarius',
		symbol: 'K',
		element: 'Air',
		throne: 'Saturn',
		triplicity: { day: 'Saturn', night: 'Mercury', participant: 'Jupiter' },
		terms: [
			{ from: 0, to: 6, planet: 'Mercury' },
			{ from: 7, to: 12, planet: 'Venus' },
			{ from: 13, to: 19, planet: 'Jupiter' },
			{ from: 20, to: 24, planet: 'Mars' },
			{ from: 25, to: 29, planet: 'Saturn' },
		],
		faces: [
			{ from: 0, to: 9, planet: 'Venus' },
			{ from: 10, to: 19, planet: 'Mercury' },
			{ from: 20, to: 29, planet: 'Moon' },
		],
		exile: 'Sun',
		almuten: [{ from: 0, to: 29, planets: ['Saturn'] }],
	},
	{
		sign: 'Pisces',
		symbol: 'L',
		element: 'Water',
		throne: 'Jupiter',
		exaltation: { planet: 'Venus', degree: 27 },
		triplicity: { day: 'Venus', night: 'Mars', participant: 'Moon' },
		terms: [
			{ from: 0, to: 11, planet: 'Venus' },
			{ from: 12, to: 15, planet: 'Jupiter' },
			{ from: 16, to: 18, planet: 'Mercury' },
			{ from: 19, to: 27, planet: 'Mars' },
			{ from: 28, to: 29, planet: 'Saturn' },
		],
		faces: [
			{ from: 0, to: 9, planet: 'Saturn' },
			{ from: 10, to: 19, planet: 'Jupiter' },
			{ from: 20, to: 29, planet: 'Mars' },
		],
		exile: 'Mercury',
		fall: { planet: 'Mercury', degree: 15 },
		almuten: [
			{ from: 0, to: 11, planets: ['Venus'] },
			{ from: 12, to: 15, planets: ['Venus', 'Jupiter'] },
			{ from: 16, to: 29, planets: ['Venus'] },
		],
	},
];
