import { NextResponse } from 'next/server';

// Hunter Google Maps — Places API (New) oficial. Scraping direto do Maps viola os Termos de Uso.
export async function POST(req: Request) {
  const { textQuery, lat = -22.9068, lng = -43.1729, raioKm = 15, limite = 20 } = await req.json();
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key || key.includes('AQUI')) {
    return NextResponse.json({ mock: true, places: MOCK.map((p) => ({ ...p, displayName: { text: p.displayName.text } })) });
  }
  const r = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.location',
    },
    body: JSON.stringify({
      textQuery, languageCode: 'pt-BR', pageSize: Math.min(limite, 20),
      locationBias: { circle: { center: { latitude: lat, longitude: lng }, radius: Math.min(raioKm, 50) * 1000 } },
    }),
  });
  const j = await r.json();
  return NextResponse.json({ mock: false, places: j.places ?? [], erro: j.error?.message }, { status: r.ok ? 200 : r.status });
}

const MOCK = [
  { id: 'ChIJ-mock-santaclara', displayName: { text: 'Igreja Santa Clara' }, formattedAddress: 'R. Santa Clara, 100 - Copacabana, Rio de Janeiro - RJ', nationalPhoneNumber: '(21) 3333-1212', websiteUri: 'https://santaclararj.org', rating: 4.8, userRatingCount: 120, location: { latitude: -22.968, longitude: -43.186 } },
  { id: 'ChIJ-mock-solar', displayName: { text: 'Solar Real Eventos' }, formattedAddress: 'Estr. do Joá, 500 - Barra da Tijuca, Rio de Janeiro - RJ', nationalPhoneNumber: '(21) 98888-1010', websiteUri: 'https://solarreal.com.br', rating: 4.9, userRatingCount: 342, location: { latitude: -23.0, longitude: -43.29 } },
  { id: 'ChIJ-mock-villa', displayName: { text: 'Villa Rica' }, formattedAddress: 'Praia de Botafogo, 300 - Botafogo, Rio de Janeiro - RJ', nationalPhoneNumber: '(21) 96666-3030', websiteUri: 'https://villarica.com.br', rating: 4.7, userRatingCount: 210, location: { latitude: -22.946, longitude: -43.182 } },
  { id: 'ChIJ-mock-jardim', displayName: { text: 'Espaço Jardim Botânico' }, formattedAddress: 'R. Jardim Botânico, 1000 - Rio de Janeiro - RJ', nationalPhoneNumber: '(21) 3222-4545', websiteUri: 'https://espacojb.com.br', rating: 4.6, userRatingCount: 98, location: { latitude: -22.967, longitude: -43.224 } },
  { id: 'ChIJ-mock-candelaria', displayName: { text: 'Igreja da Candelária' }, formattedAddress: 'Praça Pio X - Centro, Rio de Janeiro - RJ', nationalPhoneNumber: '(21) 2233-2324', websiteUri: '', rating: 4.9, userRatingCount: 5400, location: { latitude: -22.901, longitude: -43.178 } },
];
