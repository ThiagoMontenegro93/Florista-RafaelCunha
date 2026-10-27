export type Bioma = 'Amazônia' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';

export type Flor = {
  slug: string;
  nome: string;
  cientifico: string;
  bioma: Bioma;
  regiao: string;
  origem: string;
  meses: number[]; // 1-12, meses de floração/oferta
  durabilidade: [number, number]; // dias
  cores: string[];
  ocasioes: string[];
  quandoUsar: string;
  trabalhamos: boolean;
  aquarela: [string, string]; // gradiente do card watercolor
  emoji: string;
};

export const FLORES: Flor[] = [
  { slug: 'anturio', nome: 'Antúrio', cientifico: 'Anthurium andraeanum', bioma: 'Amazônia', regiao: 'Norte', origem: 'Florestas úmidas tropicais', meses: [1,2,3,4,5,6,7,8,9,10,11,12], durabilidade: [10, 14], cores: ['Vermelho', 'Branco', 'Rosa'], ocasioes: ['Centro Mesa', 'Empresa'], quandoUsar: 'Arranjos tropicais modernos e ambientes corporativos.', trabalhamos: true, aquarela: ['#F8C9C0', '#D4A5A5'], emoji: '❤️' },
  { slug: 'alpinia', nome: 'Alpínia', cientifico: 'Alpinia purpurata', bioma: 'Amazônia', regiao: 'Norte', origem: 'Sub-bosque amazônico', meses: [11,12,1,2,3,4], durabilidade: [7, 12], cores: ['Vermelho', 'Rosa'], ocasioes: ['Centro Mesa', 'Casamento'], quandoUsar: 'Volume e altura em arranjos de recepção.', trabalhamos: false, aquarela: ['#F3B6B0', '#C97B7B'], emoji: '🌺' },
  { slug: 'heliconia', nome: 'Helicônia', cientifico: 'Heliconia rostrata', bioma: 'Amazônia', regiao: 'Norte', origem: 'Matas ciliares amazônicas', meses: [11,12,1,2,3], durabilidade: [7, 10], cores: ['Vermelho', 'Amarelo'], ocasioes: ['Centro Mesa'], quandoUsar: 'Festas tropicais e casamentos de praia.', trabalhamos: false, aquarela: ['#F9D9A8', '#E58F6A'], emoji: '🦜' },
  { slug: 'bastao-do-imperador', nome: 'Bastão-do-imperador', cientifico: 'Etlingera elatior', bioma: 'Amazônia', regiao: 'Norte', origem: 'Introduzida e naturalizada na Amazônia', meses: [10,11,12,1,2,3], durabilidade: [7, 10], cores: ['Rosa', 'Vermelho'], ocasioes: ['Centro Mesa', 'Casamento'], quandoUsar: 'Peça escultural em arranjos altos.', trabalhamos: false, aquarela: ['#F6C1CF', '#C66A86'], emoji: '🌸' },
  { slug: 'strelitzia', nome: 'Estrelítzia (Ave-do-paraíso)', cientifico: 'Strelitzia reginae', bioma: 'Nordeste', regiao: 'Nordeste', origem: 'Cultivada no litoral nordestino', meses: [3,4,5,6,7,8,9], durabilidade: [10, 14], cores: ['Laranja', 'Azul'], ocasioes: ['Empresa', 'Centro Mesa'], quandoUsar: 'Halls, recepções e projetos corporativos.', trabalhamos: true, aquarela: ['#FBD7A1', '#8FB1C9'], emoji: '🐦' },
  { slug: 'bromelia', nome: 'Bromélia', cientifico: 'Guzmania lingulata', bioma: 'Nordeste', regiao: 'Nordeste', origem: 'Mata Atlântica nordestina', meses: [1,2,3,4,5,6,7,8,9,10,11,12], durabilidade: [20, 60], cores: ['Vermelho', 'Amarelo', 'Rosa'], ocasioes: ['Empresa', 'Aniversário'], quandoUsar: 'Presentes duradouros em vaso.', trabalhamos: true, aquarela: ['#F9C7A3', '#D97C63'], emoji: '🪴' },
  { slug: 'orquidea-catasetum', nome: 'Orquídea Catasetum', cientifico: 'Catasetum macrocarpum', bioma: 'Nordeste', regiao: 'Nordeste', origem: 'Caatinga e matas secas', meses: [11,12,1,2], durabilidade: [10, 20], cores: ['Verde', 'Amarelo'], ocasioes: ['Presente'], quandoUsar: 'Presente exótico para colecionadores.', trabalhamos: false, aquarela: ['#E2E8C0', '#A7B27A'], emoji: '🌼' },
  { slug: 'sempre-viva', nome: 'Sempre-viva', cientifico: 'Comanthera elegans', bioma: 'Centro-Oeste', regiao: 'Centro-Oeste', origem: 'Campos rupestres do Cerrado', meses: [4,5,6,7,8], durabilidade: [180, 365], cores: ['Branco', 'Palha'], ocasioes: ['Noiva', 'Casamento'], quandoUsar: 'Buquês secos e lembranças eternas.', trabalhamos: true, aquarela: ['#F5E6D3', '#CDB48E'], emoji: '🤍' },
  { slug: 'capim-dourado', nome: 'Capim-dourado', cientifico: 'Syngonanthus nitens', bioma: 'Centro-Oeste', regiao: 'Centro-Oeste', origem: 'Jalapão e veredas do Cerrado', meses: [9,10,11], durabilidade: [365, 730], cores: ['Dourado'], ocasioes: ['Noiva', 'Presente'], quandoUsar: 'Amarrações de buquê e detalhes dourados.', trabalhamos: false, aquarela: ['#F3DDA6', '#B08D57'], emoji: '✨' },
  { slug: 'orquidea-roxa', nome: 'Orquídea Roxa (Laélia)', cientifico: 'Laelia purpurata', bioma: 'Sudeste', regiao: 'Sudeste · Mata Atlântica', origem: 'Mata Atlântica — flor símbolo de SC e RJ', meses: [10,11,12,1], durabilidade: [10, 20], cores: ['Roxo', 'Branco'], ocasioes: ['Casamento', 'Noiva', 'Igreja'], quandoUsar: 'Buquê cascata e centros de mesa nobres (Solar Real).', trabalhamos: true, aquarela: ['#E3CDEB', '#8F6BA8'], emoji: '💜' },
  { slug: 'lirio-amarelo', nome: 'Lírio Amarelo', cientifico: 'Lilium spp. (asiático)', bioma: 'Sudeste', regiao: 'Sudeste · Mata Atlântica', origem: 'Cultivo serrano RJ e Holambra', meses: [11,12,1,2,3], durabilidade: [8, 12], cores: ['Amarelo'], ocasioes: ['Casamento', 'Centro Mesa', 'Aniversário'], quandoUsar: 'Assinatura do ateliê com hortênsias azuis.', trabalhamos: true, aquarela: ['#FBE9A6', '#E2B84F'], emoji: '💛' },
  { slug: 'hortensia-azul', nome: 'Hortênsia Azul', cientifico: 'Hydrangea macrophylla', bioma: 'Sudeste', regiao: 'Sudeste · Mata Atlântica', origem: 'Região Serrana (Petrópolis, Teresópolis)', meses: [11,12,1,2,3], durabilidade: [5, 8], cores: ['Azul', 'Branco', 'Lilás'], ocasioes: ['Casamento', 'Igreja', 'Centro Mesa'], quandoUsar: 'Base volumosa em altares e mesas.', trabalhamos: true, aquarela: ['#CFE0F1', '#7A9CC6'], emoji: '💙' },
  { slug: 'rosa', nome: 'Rosa', cientifico: 'Rosa × hybrida', bioma: 'Sudeste', regiao: 'Sudeste · Mata Atlântica', origem: 'Cultivo em Nova Friburgo e Holambra', meses: [1,2,3,4,5,6,7,8,9,10,11,12], durabilidade: [5, 9], cores: ['Branco', 'Vermelho', 'Rosa', 'Marsala'], ocasioes: ['Namorados', 'Noiva', 'Casamento', 'Igreja'], quandoUsar: 'Clássica em qualquer celebração.', trabalhamos: true, aquarela: ['#F7D1D1', '#D4A5A5'], emoji: '🌹' },
  { slug: 'lisianthus', nome: 'Lisianthus', cientifico: 'Eustoma grandiflorum', bioma: 'Sudeste', regiao: 'Sudeste · Mata Atlântica', origem: 'Cultivo serrano fluminense', meses: [9,10,11,12,1,2,3], durabilidade: [10, 14], cores: ['Branco', 'Lilás', 'Rosa'], ocasioes: ['Noiva', 'Casamento', 'Igreja'], quandoUsar: 'Delicadeza e durabilidade no buquê de noiva (assinatura).', trabalhamos: true, aquarela: ['#EFE3F3', '#B79CC5'], emoji: '🪻' },
  { slug: 'eucalipto', nome: 'Eucalipto Baby Blue', cientifico: 'Eucalyptus pulverulenta', bioma: 'Sudeste', regiao: 'Sudeste · Mata Atlântica', origem: 'Cultivo em MG e RJ', meses: [1,2,3,4,5,6,7,8,9,10,11,12], durabilidade: [14, 21], cores: ['Verde'], ocasioes: ['Noiva', 'Casamento', 'Centro Mesa'], quandoUsar: 'Folhagem perfumada em buquês e mesas.', trabalhamos: true, aquarela: ['#DCE5D4', '#8A9A7B'], emoji: '🌿' },
  { slug: 'girassol', nome: 'Girassol', cientifico: 'Helianthus annuus', bioma: 'Sudeste', regiao: 'Sudeste', origem: 'Cultivo em SP e MG', meses: [10,11,12,1,2,3], durabilidade: [6, 10], cores: ['Amarelo'], ocasioes: ['Aniversário', 'Presente'], quandoUsar: 'Alegria em aniversários e cestas de café.', trabalhamos: true, aquarela: ['#FCE7A0', '#E0A63A'], emoji: '🌻' },
  { slug: 'astromelia', nome: 'Astromélia', cientifico: 'Alstroemeria spp.', bioma: 'Sul', regiao: 'Sul', origem: 'Cultivo no RS e SC', meses: [9,10,11,12,1,2,3,4], durabilidade: [10, 14], cores: ['Rosa', 'Laranja', 'Branco'], ocasioes: ['Aniversário', 'Presente'], quandoUsar: 'Buquês do dia a dia e assinatura Essencial.', trabalhamos: true, aquarela: ['#FAD3C4', '#E38E77'], emoji: '🌷' },
  { slug: 'tango', nome: 'Tango (Solidago)', cientifico: 'Solidago canadensis', bioma: 'Sul', regiao: 'Sul', origem: 'Cultivo no Sul e Holambra', meses: [1,2,3,4,5,6,7,8,9,10,11,12], durabilidade: [7, 12], cores: ['Amarelo'], ocasioes: ['Centro Mesa', 'Aniversário'], quandoUsar: 'Preenchimento luminoso e rústico.', trabalhamos: true, aquarela: ['#FBF0B5', '#D7B743'], emoji: '💐' },
];

export const BIOMAS: { nome: Bioma; regiao: string; cor: string }[] = [
  { nome: 'Amazônia', regiao: 'Norte', cor: '#5A6B4F' },
  { nome: 'Nordeste', regiao: 'Nordeste', cor: '#D4A5A5' },
  { nome: 'Centro-Oeste', regiao: 'Centro-Oeste', cor: '#B08D57' },
  { nome: 'Sudeste', regiao: 'Sudeste · Mata Atlântica (assinatura)', cor: '#8A9A7B' },
  { nome: 'Sul', regiao: 'Sul', cor: '#5C4A3A' },
];
