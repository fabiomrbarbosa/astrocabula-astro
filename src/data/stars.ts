import type { Planet } from './dignities';

// Fixed stars table, transcribed from "Tabela de Estrelas Fixas e sua
// natureza" © 2019 Helena Avelar & Luís Ribeiro (the notes section of the
// source PDF is intentionally not included). Stars are listed in the source
// order — ascending 2000 zodiacal longitude.

// Some entries are not actually stars: N = nebula, E = star cluster,
// G = galaxy (M31, the Andromeda galaxy).
export type StarDesignation = 'N' | 'E' | 'G';

// `sign` is the zodiac index 0–11 (Aries → Pisces); render via
// SIGNS[sign].symbol / SIGNS[sign].sign from dignities.ts.
export interface StarLongitude {
	sign: number;
	deg: number;
	min: number;
}

export const STAR_EPOCHS = [1900, 1950, 2000, 2050] as const;

export interface Star {
	name: string;
	// Only set where the Portuguese spelling differs (e.g. Plêiades).
	namePt?: string;
	desc: { en: string; pt: string };
	nature: Planet[];
	mag: number;
	longitudes: [StarLongitude, StarLongitude, StarLongitude, StarLongitude];
	constellation: Constellation;
	designation?: StarDesignation;
}

export const CONSTELLATIONS = {
	Andromeda: { en: 'Andromeda', pt: 'Andrómeda' },
	Aquarius: { en: 'Aquarius', pt: 'Aquário' },
	Aquila: { en: 'Aquila', pt: 'Águia' },
	Aries: { en: 'Aries', pt: 'Carneiro' },
	Auriga: { en: 'Auriga', pt: 'Cocheiro' },
	Bootes: { en: 'Boötes', pt: 'Boieiro' },
	Cancer: { en: 'Cancer', pt: 'Caranguejo' },
	CanisMajor: { en: 'Canis Major', pt: 'Cão Maior' },
	CanisMinor: { en: 'Canis Minor', pt: 'Cão Menor' },
	Capricornus: { en: 'Capricornus', pt: 'Capricórnio' },
	Carina: { en: 'Carina', pt: 'A Quilha' },
	Cassiopeia: { en: 'Cassiopeia', pt: 'Cassiopeia' },
	Centaurus: { en: 'Centaurus', pt: 'Centauro' },
	Cetus: { en: 'Cetus', pt: 'Baleia' },
	Columba: { en: 'Columba', pt: 'Columba' },
	CoronaBorealis: { en: 'Corona Borealis', pt: 'Coroa Boreal' },
	Corvus: { en: 'Corvus', pt: 'Corvo' },
	Crater: { en: 'Crater', pt: 'A Taça' },
	Cygnus: { en: 'Cygnus', pt: 'Cisne' },
	Eridanus: { en: 'Eridanus', pt: 'Eridano' },
	Gemini: { en: 'Gemini', pt: 'Gémeos' },
	Hercules: { en: 'Hercules', pt: 'Hércules' },
	Hydra: { en: 'Hydra', pt: 'Hidra' },
	Leo: { en: 'Leo', pt: 'Leão' },
	Libra: { en: 'Libra', pt: 'Balança' },
	Lyra: { en: 'Lyra', pt: 'Lira' },
	Ophiuchus: { en: 'Ophiuchus', pt: 'Serpentário' },
	Orion: { en: 'Orion', pt: 'Orion' },
	Pegasus: { en: 'Pegasus', pt: 'Pégaso' },
	Perseus: { en: 'Perseus', pt: 'Perseu' },
	Pisces: { en: 'Pisces', pt: 'Peixes' },
	PiscisAustrinus: { en: 'Piscis Austrinus', pt: 'Peixe Austral' },
	Sagittarius: { en: 'Sagittarius', pt: 'Sagitário' },
	Scorpius: { en: 'Scorpius', pt: 'Escorpião' },
	Serpens: { en: 'Serpens', pt: 'Serpente' },
	Taurus: { en: 'Taurus', pt: 'Touro' },
	Vela: { en: 'Vela', pt: 'A Vela' },
	Virgo: { en: 'Virgo', pt: 'Virgem' },
} as const satisfies Record<string, { en: string; pt: string }>;

export type Constellation = keyof typeof CONSTELLATIONS;

// Longitudes are written as the source prints them — "09I46" is 9° of the
// 9th sign (I = Sagittarius) 46' — and parsed into StarLongitude here.
const SIGN_LETTERS = 'ABCDEFGHIJKL';

function lons(spec: string): Star['longitudes'] {
	const parsed = spec.split(' ').map((token) => {
		const m = token.match(/^(\d{2})([A-L])(\d{2})$/);
		if (!m) throw new Error(`Bad star longitude: ${token}`);
		return {
			deg: Number(m[1]),
			sign: SIGN_LETTERS.indexOf(m[2]),
			min: Number(m[3]),
		};
	});
	if (parsed.length !== 4) throw new Error(`Expected 4 longitudes: ${spec}`);
	return parsed as Star['longitudes'];
}

function star(
	name: string,
	nature: Planet[],
	mag: number,
	longitudes: string,
	constellation: Constellation,
	desc: { en: string; pt: string },
	extra?: { designation?: StarDesignation; namePt?: string },
): Star {
	return { name, nature, mag, longitudes: lons(longitudes), constellation, desc, ...extra };
}

export const STARS: Star[] = [
	star('Deneb Kaitos', ['Saturn'], 2, '01A11 01A53 02A35 03A17', 'Cetus', {
		en: 'the tail of the Whale',
		pt: 'a cauda da Baleia',
	}),
	star('Algenib', ['Mars', 'Mercury'], 3, '07A46 08A28 09A09 09A51', 'Pegasus', {
		en: 'the tip of the wing of Pegasus',
		pt: 'a ponta da asa do Pégaso',
	}),
	star('Alpheratz', ['Venus'], 2, '12A55 13A37 14A18 15A00', 'Andromeda', {
		en: 'the head of Andromeda',
		pt: 'a cabeça de Andrómeda',
	}),
	star('Baten Kaitos', ['Saturn'], 4, '20A33 21A15 21A57 22A39', 'Cetus', {
		en: 'the belly of the Whale',
		pt: 'a barriga da Baleia',
	}),
	star('Al Pherg', ['Saturn', 'Jupiter'], 4, '25A26 26A07 26A49 27A30', 'Pisces', {
		en: 'of the tail of the Northern Fish',
		pt: 'da cauda do Peixe Norte',
	}),
	star('Vertex', ['Venus'], 5, '26A28 27A09 27A51 28A33', 'Andromeda', {
		en: 'of the head of Andromeda',
		pt: 'da cabeça de Andrómeda',
	}, { designation: 'G' }),
	star('Mirach', ['Venus'], 2, '29A01 29A42 00B24 01B06', 'Andromeda', {
		en: 'of the chain of Andromeda',
		pt: 'da corrente de Andrómeda',
	}),
	star('Mira', ['Saturn'], 3, '00B07 00B49 01B31 02B13', 'Cetus', {
		en: 'of the Whale',
		pt: 'da Baleia',
	}),
	star('Sheratan', ['Mars', 'Saturn'], 3, '02B34 03B16 03B58 04B40', 'Aries', {
		en: 'the northern horn of the Ram',
		pt: 'o corno Norte do Carneiro',
	}),
	star('Hamal', ['Mars', 'Saturn'], 2, '06B16 06B58 07B40 08B22', 'Aries', {
		en: 'the head of the Ram',
		pt: 'a cabeça do Carneiro',
	}),
	star('Schedar', ['Saturn', 'Venus'], 2, '06B24 07B05 07B47 08B29', 'Cassiopeia', {
		en: 'of Cassiopeia',
		pt: 'da Cassiopeia',
	}),
	star('Almak', ['Venus'], 2, '12B50 13B32 14B13 14B55', 'Andromeda', {
		en: 'the left foot of Andromeda',
		pt: 'o pé esquerdo de Andrómeda',
	}),
	star('Menkar', ['Saturn'], 3, '12B55 13B37 14B19 15B01', 'Cetus', {
		en: 'the jaw of the Whale',
		pt: 'a mandíbula da Baleia',
	}),
	star('Zaurak', ['Saturn'], 3, '22B28 23B10 23B52 24B34', 'Eridanus', {
		en: 'of the river Eridanus',
		pt: 'do rio Eridanus',
	}),
	star('Capulus', ['Mars', 'Mercury'], 4, '22B49 23B30 24B12 24B54', 'Perseus', {
		en: "the hilt of Perseus's sword",
		pt: 'o punho da espada de Perseu',
	}, { designation: 'E' }),
	star('Algol', ['Saturn', 'Jupiter'], 2, '24B46 25B28 26B10 26B52', 'Perseus', {
		en: 'the head of Medusa',
		pt: 'a cabeça da Medusa',
	}),
	star('Pleiades (Alcyone)', ['Moon', 'Mars'], 3, '28B36 29B18 29B59 00C41', 'Taurus', {
		en: 'the seven sisters',
		pt: 'as sete irmãs',
	}, { designation: 'E', namePt: 'Plêiades (Alcyone)' }),
	star('Hyades', ['Saturn', 'Mercury'], 4, '05C28 06C10 06C52 07C34', 'Taurus', {
		en: 'the seven mourners',
		pt: 'as sete carpideiras',
	}, { designation: 'E' }),
	star('Ain', ['Saturn', 'Mercury'], 3, '07C04 07C46 08C28 09C10', 'Taurus', {
		en: 'the northern eye of the Bull',
		pt: 'o olho Norte do Touro',
	}),
	star('Aldebaran', ['Mars'], 1, '08C24 09C05 09C47 10C29', 'Taurus', {
		en: 'the southern eye of the Bull',
		pt: 'o olho Sul do Touro',
	}),
	star('Rigel', ['Jupiter', 'Saturn'], 1, '15C26 16C08 16C50 17C32', 'Orion', {
		en: 'the left foot of Orion',
		pt: 'o pé esquerdo de Orion',
	}),
	star('Bellatrix', ['Mars', 'Mercury'], 2, '19C33 20C15 20C57 21C39', 'Orion', {
		en: 'the left shoulder of Orion',
		pt: 'o ombro esquerdo de Orion',
	}),
	star('Capella', ['Mars', 'Mercury'], 1, '20C28 21C10 21C51 22C34', 'Auriga', {
		en: 'the little goat',
		pt: 'a cabrinha',
	}),
	star('Phakt', ['Mercury', 'Venus'], 3, '20C46 21C28 22C10 22C52', 'Columba', {
		en: 'the right wing of the Dove',
		pt: 'a asa direita da Pomba',
	}),
	star('Mintaka', ['Jupiter', 'Saturn'], 2, '21C01 21C43 22C24 23C06', 'Orion', {
		en: "of Orion's belt",
		pt: 'do cinturão de Orion',
	}),
	star('El Nath', ['Mars'], 2, '21C11 21C53 22C34 23C17', 'Taurus', {
		en: 'the northern horn of the Bull',
		pt: 'o corno Norte do Touro',
	}),
	star('Ensis', ['Mars', 'Moon'], 4, '21C36 22C17 22C59 23C41', 'Orion', {
		en: "the scabbard of Orion's sword",
		pt: 'a bainha da espada de Orion',
	}, { designation: 'N' }),
	star('Alnilam', ['Jupiter', 'Saturn'], 2, '22C04 22C46 23C28 24C10', 'Orion', {
		en: "of Orion's belt",
		pt: 'do cinturão de Orion',
	}),
	star('Al Hecka', ['Mars'], 3, '23C23 24C05 24C47 25C29', 'Gemini', {
		en: 'the southern horn of the Bull',
		pt: 'o corno Sul do Touro',
	}),
	star('Betelgeuse', ['Mars', 'Mercury'], 1, '27C21 28C03 28C45 29C27', 'Orion', {
		en: 'the right shoulder of Orion',
		pt: 'o ombro direito de Orion',
	}),
	star('Menkalinan', ['Jupiter'], 2, '28C31 29C13 29C55 00D37', 'Auriga', {
		en: 'the shoulder of the Charioteer',
		pt: 'o ombro do Cocheiro',
	}),
	star('Propus', ['Mercury', 'Venus'], 3, '02D03 02D45 03D26 04D08', 'Gemini', {
		en: 'between the shoulders of the Twins',
		pt: 'entre os ombros do Gémeos',
	}),
	star('Tejat Posterior', ['Mercury', 'Venus'], 3, '03D55 04D36 05D18 06D00', 'Gemini', {
		en: 'of the left foot of Castor',
		pt: 'do pé esquerdo de Castor',
	}),
	star('Alhena', ['Mercury', 'Venus'], 2, '07D43 08D25 09D06 09D48', 'Gemini', {
		en: 'the left foot of Pollux',
		pt: 'o pé esquerdo de Pollux',
	}),
	star('Sirius', ['Jupiter', 'Mars'], 1, '12D42 13D24 14D05 14D46', 'CanisMajor', {
		en: 'the mouth of the Greater Dog',
		pt: 'a boca do Cão Maior',
	}),
	star('Canopus', ['Saturn', 'Jupiter'], 1, '13D35 14D16 14D58 15D40', 'Carina', {
		en: 'the pilot of the ship Argo',
		pt: 'o piloto do navio Argos',
	}),
	star('Wasat', ['Saturn'], 3, '17D08 17D50 18D31 19D13', 'Gemini', {
		en: 'the right arm of Castor',
		pt: 'o braço direito de Castor',
	}),
	star('Castor', ['Mercury'], 2, '18D51 19D33 20D15 20D56', 'Gemini', {
		en: 'the northern Twin',
		pt: 'o Gémeo do Norte',
	}),
	star('Pollux', ['Mars'], 1, '21D50 22D32 23D13 23D54', 'Gemini', {
		en: 'the southern Twin',
		pt: 'o Gémeo do Sul',
	}),
	star('Procyon', ['Mercury', 'Mars'], 1, '24D24 25D06 25D48 26D29', 'CanisMinor', {
		en: 'of the Lesser Dog',
		pt: 'do Cão Menor',
	}),
	star('Praesaepe', ['Mars', 'Moon'], 4, '05E57 06E39 07E20 08E02', 'Cancer', {
		en: 'the manger',
		pt: 'a mangedoura',
	}, { designation: 'E' }),
	star('Asellus Borealis', ['Mars', 'Sun'], 5, '06E09 06E50 07E32 08E14', 'Cancer', {
		en: 'the northern donkey',
		pt: 'o burro do Norte',
	}),
	star('Asellus Australis', ['Mars', 'Sun'], 4, '07E19 08E01 08E43 09E25', 'Cancer', {
		en: 'the southern donkey',
		pt: 'o burro do Sul',
	}),
	star('Acubens', ['Saturn', 'Mercury'], 4, '12E15 12E57 13E38 14E20', 'Cancer', {
		en: 'the southern claw of the Crab',
		pt: 'a pinça Sul do Caranguejo',
	}),
	star('Algenubi', ['Saturn', 'Mars'], 3, '19E18 20E00 20E42 21E24', 'Leo', {
		en: 'the mouth of the Lion',
		pt: 'a boca do Leão',
	}),
	star('Alphard', ['Saturn', 'Venus'], 2, '25E53 26E35 27E17 27E59', 'Hydra', {
		en: 'the heart of the Hydra',
		pt: 'o coração da Hidra',
	}),
	star('Adhafera', ['Saturn', 'Mercury'], 3, '26E11 26E52 27E34 28E16', 'Leo', {
		en: 'the mane of the Lion',
		pt: 'a juba do Leão',
	}),
	star('Al Jabhah', ['Saturn', 'Mercury'], 3, '26E31 27E13 27E54 28E36', 'Leo', {
		en: 'the forehead of the Lion',
		pt: 'a testa do Leão',
	}),
	star('Regulus', ['Mars', 'Jupiter'], 1, '28E26 29E08 29E50 00F31', 'Leo', {
		en: 'the heart of the Lion',
		pt: 'o coração do Leão',
	}),
	star('Zosma', ['Saturn', 'Venus'], 2, '09F55 10F37 11F19 12F10', 'Leo', {
		en: 'of the back of the Lion',
		pt: 'do dorso do leão',
	}),
	star('Denebola', ['Saturn', 'Venus'], 2, '20F13 20F55 21F37 22F19', 'Leo', {
		en: 'the tail of the Lion',
		pt: 'a cauda do Leão',
	}),
	star('Labrum', ['Venus', 'Mercury'], 4, '25F18 26F00 26F41 27F23', 'Crater', {
		en: 'the cup',
		pt: 'a taça',
	}),
	star('Zavijava', ['Mercury', 'Mars'], 4, '25F45 26F27 27F10 27F52', 'Virgo', {
		en: 'of the head of the Virgin',
		pt: 'da cabeça da Virgem',
	}),
	star('Markeb', ['Saturn', 'Jupiter'], 3, '27F32 28F13 28F53 29F35', 'Vela', {
		en: 'of the hull of the ship Argo',
		pt: 'do casco do navio Argo',
	}),
	star('Zaniah', ['Mercury', 'Venus'], 4, '03G08 03G50 04G31 05G13', 'Virgo', {
		en: 'of the wing of the Virgin',
		pt: 'da asa da Virgem',
	}),
	star('Vindemiatrix', ['Saturn', 'Mercury'], 3, '08G33 09G15 09G57 10G38', 'Virgo', {
		en: 'of the wing of the Virgin',
		pt: 'da asa da Virgem',
	}),
	star('Algorab', ['Mars', 'Saturn'], 3, '12G04 12G45 13G27 14G09', 'Corvus', {
		en: 'the right wing of the Crow',
		pt: 'a asa direita do Corvo',
	}),
	star('Seginus', ['Mercury', 'Saturn'], 3, '16G16 16G58 17G40 18G29', 'Bootes', {
		en: 'the left shoulder of the Hunter',
		pt: 'o ombro esquerdo do Caçador',
	}),
	star('Foramen', ['Saturn', 'Jupiter'], 3, '20G47 21G28 22G09 22G50', 'Carina', {
		en: 'the mast of the ship Argo',
		pt: 'o mastro do navio Argos',
	}),
	star('Spica', ['Venus', 'Mars'], 1, '22G27 23G09 23G51 24G32', 'Virgo', {
		en: 'the ear of wheat of the Virgin',
		pt: 'a espiga da Virgem',
	}),
	star('Arcturus', ['Jupiter', 'Mars'], 1, '22G49 23G32 24G15 24G56', 'Bootes', {
		en: 'the knee of the Hunter',
		pt: 'o joelho do Caçador',
	}),
	star('Princeps', ['Mercury', 'Saturn'], 3, '01H45 02H27 03H09 03H09', 'Bootes', {
		en: 'of the Hunter',
		pt: 'do Caçador',
	}),
	star('Khambalia', ['Venus', 'Mars'], 4, '05H34 06H15 06H57 06H57', 'Virgo', {
		en: 'the left foot of the Virgin',
		pt: 'o pé esquerdo da Virgem',
	}),
	star('Alphecca', ['Venus', 'Mercury'], 2, '10H53 11H35 12H18 13H00', 'CoronaBorealis', {
		en: 'the brightest jewel of the Crown',
		pt: 'a mais brilhante jóia da Coroa',
	}),
	star('Zuben Elgenubi', ['Saturn', 'Mars'], 3, '13H41 14H23 15H05 15H46', 'Libra', {
		en: 'the southern claw',
		pt: 'a pinça Sul',
	}),
	star('Zuben Eschemali', ['Jupiter', 'Mercury'], 3, '17H59 18H40 19H22 20H04', 'Libra', {
		en: 'the northern claw',
		pt: 'a pinça Norte',
	}),
	star('Unukalhai', ['Saturn', 'Mars'], 3, '20H40 21H22 22H04 22H46', 'Serpens', {
		en: 'the heart of the Serpent',
		pt: 'o coração da Serpente',
	}),
	star('Agena', ['Venus', 'Jupiter'], 1, '22H24 23H06 23H48 24H29', 'Centaurus', {
		en: 'the right leg of the Centaur',
		pt: 'a perna direita do Centauro',
	}),
	star('Rigel Centaurus', ['Venus', 'Jupiter'], 1, '28H10 28H51 29H32 00I06', 'Centaurus', {
		en: 'the foot of the Centaur',
		pt: 'o pé do Centauro',
	}),
	star('Yed Prior', ['Saturn', 'Venus'], 3, '00I54 01I36 02I18 03I00', 'Ophiuchus', {
		en: 'the left hand of the Serpent-bearer',
		pt: 'a mão esquerda do Serpentário',
	}),
	star('Dschubba', ['Mars', 'Saturn'], 2, '01I10 01I52 02I34 03I16', 'Scorpius', {
		en: 'of the head of the Scorpion',
		pt: 'da cabeça do Escorpião',
	}),
	star('Acrab', ['Mars', 'Saturn'], 3, '01I48 02I29 03I11 03I53', 'Scorpius', {
		en: 'of the head of the Scorpion',
		pt: 'da cabeça do Escorpião',
	}),
	star('Han', ['Saturn', 'Venus'], 3, '07I50 08I31 09I13 09I13', 'Ophiuchus', {
		en: 'the left knee of the Serpent-bearer',
		pt: 'o joelho esquerdo do Serpentário',
	}),
	star('Antares', ['Mars', 'Jupiter'], 1, '08I22 09I04 09I46 10I27', 'Scorpius', {
		en: 'the heart of the Scorpion',
		pt: 'o coração do Escorpião',
	}),
	star('Ras Algethi', ['Mars', 'Venus'], 3, '14I45 15I27 16I09 16I50', 'Hercules', {
		en: 'of Hercules',
		pt: 'do Hércules',
	}),
	star('Graffias', ['Mars', 'Saturn'], 4, '15I51 16I32 17I14 17I55', 'Scorpius', {
		en: 'the head of the Scorpion',
		pt: 'a cabeça do Escorpião',
	}),
	star('Sabik', ['Saturn', 'Venus'], 2, '16I34 17I16 17I58 18I40', 'Ophiuchus', {
		en: 'the left knee of the Serpent-bearer',
		pt: 'o joelho esquerdo do Serpentário',
	}),
	star('Ras Alhague', ['Saturn', 'Venus'], 2, '21I03 21I45 22I27 23I08', 'Ophiuchus', {
		en: 'the head of the Serpent-bearer',
		pt: 'a cabeça do Serpentário',
	}),
	star('Lesath', ['Mercury', 'Mars'], 3, '22I37 23I19 24I01 24I42', 'Scorpius', {
		en: 'the sting of the Scorpion',
		pt: 'o ferrão do Escorpião',
	}),
	star('Aculeus', ['Mars', 'Moon'], 5, '24I20 25I02 25I43 26I25', 'Scorpius', {
		en: 'of the sting of the Scorpion',
		pt: 'do ferrão do Escorpião',
	}, { designation: 'N' }),
	star('Acumen', ['Mars', 'Moon'], 3, '27I21 28I03 28I45 29I26', 'Scorpius', {
		en: 'of the sting of the Scorpion',
		pt: 'do ferrão do Escorpião',
	}, { designation: 'N' }),
	star('Sinistra', ['Saturn', 'Venus'], 3, '28I21 29I03 29I45 00J26', 'Ophiuchus', {
		en: 'the left hand of the Serpent-bearer',
		pt: 'a mão esquerda do Serpentário',
	}),
	star('Spiculum', ['Mars', 'Moon'], 6, '29I40 00J21 01J03 01J45', 'Sagittarius', {
		en: "the tip of the Archer's arrow",
		pt: 'a ponta da flecha do Arqueiro',
	}, { designation: 'N' }),
	star('Polis', ['Jupiter', 'Mars'], 4, '01J49 02J30 03J12 03J54', 'Sagittarius', {
		en: "of the Archer's bow",
		pt: 'do arco do Arqueiro',
	}),
	star('Facies', ['Sun', 'Mars'], 6, '06J54 07J36 08J18 08J59', 'Sagittarius', {
		en: 'the face of the Archer',
		pt: 'a face do Arqueiro',
	}, { designation: 'E' }),
	star('Nunki', ['Jupiter', 'Mercury'], 2, '10J59 11J41 12J23 13J04', 'Sagittarius', {
		en: "of the Archer's arrow",
		pt: 'da flecha do Arqueiro',
	}),
	star('Ascella', ['Jupiter', 'Mercury'], 3, '12J14 12J56 13J38 14J20', 'Sagittarius', {
		en: 'the shoulder of the Archer',
		pt: 'o ombro do Arqueiro',
	}),
	star('Manubrium', ['Sun', 'Mars'], 4, '13J35 14J17 14J59 15J41', 'Sagittarius', {
		en: 'of the Archer',
		pt: 'do Arqueiro',
	}),
	star('Wega', ['Venus', 'Mercury'], 1, '13J55 14J37 15J19 16J00', 'Lyra', {
		en: 'of the Lyre',
		pt: 'da Lira',
	}),
	star('Deneb Okab', ['Mars', 'Jupiter'], 3, '22J14 22J56 23J38 24J20', 'Aquila', {
		en: 'the tail of the Eagle',
		pt: 'a cauda da Águia',
	}),
	star('Terebellum', ['Venus', 'Saturn'], 5, '24J27 25J09 25J50 26J33', 'Sagittarius', {
		en: 'the tail of the Archer',
		pt: 'a cauda do Arqueiro',
	}),
	star('Albireo', ['Venus', 'Mercury'], 3, '29J52 00K33 01K14 01K56', 'Cygnus', {
		en: 'the head of the Swan',
		pt: 'a cabeça do Cisne',
	}),
	star('Altair', ['Mars', 'Jupiter'], 1, '00K22 01K04 01K46 02K28', 'Aquila', {
		en: 'the Eagle',
		pt: 'a Águia',
	}),
	star('Giedi a1', ['Venus', 'Mars'], 5, '02K22 03K04 03K46 04K27', 'Capricornus', {
		en: 'of the southern horn of the Goat',
		pt: 'do corno Sul do Bode',
	}),
	star('Giedi a2', ['Venus', 'Mars'], 4, '02K28 03K10 03K51 04K33', 'Capricornus', {
		en: 'of the southern horn of the Goat',
		pt: 'do corno Sul do Bode',
	}),
	star('Dabir', ['Saturn', 'Venus'], 3, '02K39 03K21 04K03 04K44', 'Capricornus', {
		en: 'the left eye of the Goat',
		pt: 'o olho esquerdo do Bode',
	}),
	star('Oculus', ['Saturn', 'Venus'], 5, '03K19 04K01 04K42 05K24', 'Capricornus', {
		en: 'the right eye of the Goat',
		pt: 'o olho direito do Bode',
	}),
	star('Bos', ['Saturn', 'Venus'], 5, '03K46 04K28 05K09 05K51', 'Capricornus', {
		en: 'the face of the Goat',
		pt: 'a face do Bode',
	}),
	star('Armus', ['Mars', 'Mercury'], 5, '11K21 12K02 12K44 13K26', 'Capricornus', {
		en: 'the heart of the Goat',
		pt: 'o coração do Bode',
	}),
	star('Dorsum', ['Saturn', 'Jupiter'], 4, '12K27 13K08 13K50 14K32', 'Capricornus', {
		en: 'the back of the Goat',
		pt: 'o dorso do Bode',
	}),
	star('Castra', ['Saturn', 'Jupiter'], 5, '18K48 19K30 20K11 20K53', 'Capricornus', {
		en: 'the belly of the Goat',
		pt: 'a barriga do Bode',
	}),
	star('Nashira', ['Saturn', 'Jupiter'], 4, '20K23 21K05 21K47 22K29', 'Capricornus', {
		en: 'of the tail of the Goat',
		pt: 'da cauda do Bode',
	}),
	star('Sadalsuud', ['Saturn', 'Mercury'], 3, '22K00 22K42 23K23 24K05', 'Aquarius', {
		en: 'the left shoulder of the Water-bearer',
		pt: 'o ombro esquerdo do Aguadeiro',
	}),
	star('Deneb Algedi', ['Saturn', 'Jupiter'], 3, '22K09 22K50 23K32 24K14', 'Capricornus', {
		en: 'the tail of the Goat',
		pt: 'a cauda do Bode',
	}),
	star('Sadalmelek', ['Saturn', 'Mercury'], 3, '02L22 03L03 03L45 04L27', 'Aquarius', {
		en: 'the right shoulder of the Water-bearer',
		pt: 'o ombro direito do Aguadeiro',
	}),
	star('Fomalhaut', ['Venus', 'Mercury'], 1, '02L27 03L09 03L51 04L33', 'PiscisAustrinus', {
		en: 'the mouth of the Fish',
		pt: 'a boca do Peixe',
	}),
	star('Deneb Adige', ['Venus', 'Mercury'], 1, '03L57 04L38 05L20 06L00', 'Cygnus', {
		en: 'the tail of the Swan',
		pt: 'a cauda do Cisne',
	}),
	star('Skat', ['Mercury', 'Saturn'], 3, '08L02 08L10 08L52 09L34', 'Aquarius', {
		en: 'the left leg of the Water-bearer',
		pt: 'a perna esquerda do Aguadeiro',
	}),
	star('Achernar', ['Jupiter'], 1, '13L54 14L36 15L19 16L01', 'Eridanus', {
		en: 'the end of the River',
		pt: 'o fim do Rio',
	}),
	star('Markab', ['Mars', 'Mercury'], 2, '22L06 22L47 23L29 24L11', 'Pegasus', {
		en: 'of the wing of Pegasus',
		pt: 'da asa do Pégaso',
	}),
	star('Scheat', ['Mars', 'Mercury'], 2, '27L59 28L41 29L22 00A04', 'Pegasus', {
		en: 'the left leg of Pegasus',
		pt: 'a perna esquerda do Pégaso',
	}),
];
