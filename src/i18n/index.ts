import type { Planet } from '../data/dignities';

export const LANGS = ['en', 'pt'] as const;
export type Lang = (typeof LANGS)[number];
export const defaultLang: Lang = 'en';

// html lang attribute per site language (pt -> European Portuguese)
export const HTML_LANG: Record<Lang, string> = {
	en: 'en',
	pt: 'pt-PT',
};

export const ui = {
	en: {
		siteName: 'Astrology Cheatsheet',
		nav: {
			dignities: 'Essential Dignities',
		},
		page: {
			title: 'Essential Dignities',
			intro:
				'Throne (domicile), exaltation, triplicities, terms, faces, detriment, fall, and almuten for each planet by sign, following the Egyptian terms and the day/night/participant triplicity rulers.',
		},
		table: {
			sign: 'Sign',
			throne: 'Throne',
			exalt: 'Exalt.',
			triplicities: 'Triplicities',
			day: 'Day',
			night: 'Night',
			participant: 'Part.',
			terms: 'Terms',
			faces: 'Faces',
			exile: 'Exile',
			fall: 'Fall',
			almuten: 'Almuten',
		},
		legend: {
			title: 'Scoring',
			domicile: 'Domicile / Throne',
			exaltation: 'Exaltation',
			triplicity: 'Triplicity (each ruler)',
			term: 'Term',
			face: 'Face',
			exile: 'Detriment / Exile',
			fall: 'Fall / Debility',
		},
		footer:
			'Dignities data adapted from Tabela de Dignidades Essenciais © 2019 Helena Avelar & Luís Ribeiro, Academia de Estudos Astrológicos.',
	},
	pt: {
		siteName: 'Cábula Astrológica',
		nav: {
			dignities: 'Dignidades Essenciais',
		},
		page: {
			title: 'Dignidades Essenciais',
			intro:
				'Domicílio (trono), exaltação, triplicidades, termos, faces, exílio, queda e almuten para cada planeta por signo, segundo os termos egípcios e os regentes de triplicidade diurno, noturno e participante.',
		},
		table: {
			sign: 'Signo',
			throne: 'Trono',
			exalt: 'Exalt.',
			triplicities: 'Triplicidades',
			day: 'Dia',
			night: 'Noite',
			participant: 'Part.',
			terms: 'Termos',
			faces: 'Faces',
			exile: 'Exílio',
			fall: 'Queda',
			almuten: 'Almuten',
		},
		legend: {
			title: 'Pontuação',
			domicile: 'Domicílio / Trono',
			exaltation: 'Exaltação',
			triplicity: 'Triplicidade (cada regente)',
			term: 'Termo',
			face: 'Face',
			exile: 'Exílio',
			fall: 'Queda',
		},
		footer:
			'Dados de dignidades adaptados da Tabela de Dignidades Essenciais © 2019 Helena Avelar e Luís Ribeiro, Academia de Estudos Astrológicos.',
	},
} as const;

export const PLANET_NAMES_I18N: Record<Lang, Record<Planet, string>> = {
	en: {
		Sun: 'Sun',
		Moon: 'Moon',
		Mercury: 'Mercury',
		Venus: 'Venus',
		Mars: 'Mars',
		Jupiter: 'Jupiter',
		Saturn: 'Saturn',
		NorthNode: 'North Node',
		SouthNode: 'South Node',
	},
	pt: {
		Sun: 'Sol',
		Moon: 'Lua',
		Mercury: 'Mercúrio',
		Venus: 'Vénus',
		Mars: 'Marte',
		Jupiter: 'Júpiter',
		Saturn: 'Saturno',
		NorthNode: 'Nodo Norte',
		SouthNode: 'Nodo Sul',
	},
};

// Keyed by the English sign name used in src/data/dignities.ts (`sign` field)
export const SIGN_NAMES_I18N: Record<Lang, Record<string, string>> = {
	en: {
		Aries: 'Aries',
		Taurus: 'Taurus',
		Gemini: 'Gemini',
		Cancer: 'Cancer',
		Leo: 'Leo',
		Virgo: 'Virgo',
		Libra: 'Libra',
		Scorpio: 'Scorpio',
		Sagittarius: 'Sagittarius',
		Capricorn: 'Capricorn',
		Aquarius: 'Aquarius',
		Pisces: 'Pisces',
	},
	pt: {
		Aries: 'Carneiro',
		Taurus: 'Touro',
		Gemini: 'Gémeos',
		Cancer: 'Caranguejo',
		Leo: 'Leão',
		Virgo: 'Virgem',
		Libra: 'Balança',
		Scorpio: 'Escorpião',
		Sagittarius: 'Sagitário',
		Capricorn: 'Capricórnio',
		Aquarius: 'Aquário',
		Pisces: 'Peixes',
	},
};
