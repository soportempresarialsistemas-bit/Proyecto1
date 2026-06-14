// ─── Geography Data ────────────────────────────────────────────────────────────

export interface GeoState { name: string; cities: string[] }
export interface GeoCountry { name: string; states: GeoState[] }

export const COUNTRIES: GeoCountry[] = [
  { name: "Colombia", states: [
    { name: "Amazonas", cities: ["Leticia","Puerto Nariño"] },
    { name: "Antioquia", cities: ["Medellín","Bello","Itagüí","Envigado","Apartadó","Turbo","Rionegro","Manizales"] },
    { name: "Arauca", cities: ["Arauca","Saravena","Tame"] },
    { name: "Atlántico", cities: ["Barranquilla","Soledad","Malambo","Sabanalarga"] },
    { name: "Bolívar", cities: ["Cartagena","Magangué","Mompós"] },
    { name: "Boyacá", cities: ["Tunja","Duitama","Sogamoso","Chiquinquirá"] },
    { name: "Caldas", cities: ["Manizales","La Dorada","Chinchiná"] },
    { name: "Caquetá", cities: ["Florencia","San Vicente del Caguán"] },
    { name: "Casanare", cities: ["Yopal","Aguazul","Villanueva"] },
    { name: "Cauca", cities: ["Popayán","Santander de Quilichao"] },
    { name: "Cesar", cities: ["Valledupar","Aguachica","Codazzi"] },
    { name: "Chocó", cities: ["Quibdó","Istmina"] },
    { name: "Córdoba", cities: ["Montería","Lorica","Sahagún","Cereté"] },
    { name: "Cundinamarca", cities: ["Bogotá D.C.","Soacha","Facatativá","Zipaquirá","Chía","Fusagasugá"] },
    { name: "Guainía", cities: ["Inírida"] },
    { name: "Guaviare", cities: ["San José del Guaviare"] },
    { name: "Huila", cities: ["Neiva","Pitalito","Garzón"] },
    { name: "La Guajira", cities: ["Riohacha","Maicao","Uribia"] },
    { name: "Magdalena", cities: ["Santa Marta","Ciénaga","Fundación"] },
    { name: "Meta", cities: ["Villavicencio","Acacías","Granada"] },
    { name: "Nariño", cities: ["Pasto","Tumaco","Ipiales","Tumaco"] },
    { name: "Norte de Santander", cities: ["Cúcuta","Ocaña","Pamplona","Villa del Rosario"] },
    { name: "Putumayo", cities: ["Mocoa","Puerto Asís"] },
    { name: "Quindío", cities: ["Armenia","Calarcá","Montenegro"] },
    { name: "Risaralda", cities: ["Pereira","Dosquebradas","Santa Rosa de Cabal"] },
    { name: "San Andrés y Providencia", cities: ["San Andrés","Providencia"] },
    { name: "Santander", cities: ["Bucaramanga","Floridablanca","Girón","Piedecuesta","Barrancabermeja"] },
    { name: "Sucre", cities: ["Sincelejo","Corozal","Sampués"] },
    { name: "Tolima", cities: ["Ibagué","Espinal","Melgar","Honda"] },
    { name: "Valle del Cauca", cities: ["Cali","Buenaventura","Palmira","Buga","Tuluá","Cartago"] },
    { name: "Vaupés", cities: ["Mitú"] },
    { name: "Vichada", cities: ["Puerto Carreño"] },
  ]},
  { name: "Venezuela", states: [
    { name: "Caracas", cities: ["Caracas"] },
    { name: "Miranda", cities: ["Los Teques","Guarenas","Guatire"] },
    { name: "Zulia", cities: ["Maracaibo","Cabimas"] },
    { name: "Carabobo", cities: ["Valencia","Puerto Cabello"] },
    { name: "Lara", cities: ["Barquisimeto"] },
  ]},
  { name: "Ecuador", states: [
    { name: "Pichincha", cities: ["Quito"] },
    { name: "Guayas", cities: ["Guayaquil"] },
    { name: "Azuay", cities: ["Cuenca"] },
    { name: "Manabí", cities: ["Portoviejo","Manta"] },
  ]},
  { name: "Perú", states: [
    { name: "Lima", cities: ["Lima","Callao"] },
    { name: "Arequipa", cities: ["Arequipa"] },
    { name: "La Libertad", cities: ["Trujillo"] },
    { name: "Cusco", cities: ["Cusco"] },
  ]},
  { name: "México", states: [
    { name: "Ciudad de México", cities: ["Ciudad de México"] },
    { name: "Jalisco", cities: ["Guadalajara","Zapopan"] },
    { name: "Nuevo León", cities: ["Monterrey","San Pedro Garza García"] },
    { name: "Puebla", cities: ["Puebla","Cholula"] },
  ]},
  { name: "Argentina", states: [
    { name: "Buenos Aires", cities: ["Buenos Aires","La Plata","Mar del Plata"] },
    { name: "Córdoba", cities: ["Córdoba","Villa Carlos Paz"] },
    { name: "Santa Fe", cities: ["Rosario","Santa Fe"] },
    { name: "Mendoza", cities: ["Mendoza"] },
  ]},
  { name: "Chile", states: [
    { name: "Región Metropolitana", cities: ["Santiago"] },
    { name: "Valparaíso", cities: ["Valparaíso","Viña del Mar"] },
    { name: "Biobío", cities: ["Concepción"] },
  ]},
  { name: "Brasil", states: [
    { name: "São Paulo", cities: ["São Paulo","Campinas","Santos"] },
    { name: "Rio de Janeiro", cities: ["Rio de Janeiro","Niterói"] },
    { name: "Minas Gerais", cities: ["Belo Horizonte","Uberlândia"] },
  ]},
  { name: "España", states: [
    { name: "Madrid", cities: ["Madrid","Alcalá de Henares"] },
    { name: "Cataluña", cities: ["Barcelona","Girona","Tarragona"] },
    { name: "Andalucía", cities: ["Sevilla","Málaga","Granada"] },
    { name: "Valencia", cities: ["Valencia","Alicante"] },
  ]},
  { name: "Estados Unidos", states: [
    { name: "California", cities: ["Los Ángeles","San Francisco","San Diego"] },
    { name: "Florida", cities: ["Miami","Orlando","Tampa"] },
    { name: "New York", cities: ["New York","Buffalo"] },
    { name: "Texas", cities: ["Houston","Dallas","San Antonio"] },
    { name: "Illinois", cities: ["Chicago"] },
  ]},
  { name: "Panamá", states: [
    { name: "Panamá", cities: ["Ciudad de Panamá"] },
    { name: "Chiriquí", cities: ["David"] },
  ]},
  { name: "Costa Rica", states: [
    { name: "San José", cities: ["San José"] },
    { name: "Alajuela", cities: ["Alajuela"] },
  ]},
  { name: "Bolivia", states: [
    { name: "La Paz", cities: ["La Paz","El Alto"] },
    { name: "Santa Cruz", cities: ["Santa Cruz de la Sierra"] },
    { name: "Cochabamba", cities: ["Cochabamba"] },
  ]},
  { name: "Paraguay", states: [
    { name: "Asunción", cities: ["Asunción"] },
    { name: "Central", cities: ["Luque","Fernando de la Mora"] },
  ]},
  { name: "Uruguay", states: [
    { name: "Montevideo", cities: ["Montevideo"] },
    { name: "Canelones", cities: ["Las Piedras","Canelones"] },
  ]},
  { name: "Otro", states: [
    { name: "Otro", cities: ["Otro"] },
  ]},
];

export function getStatesForCountry(country: string): GeoState[] {
  return COUNTRIES.find(c => c.name === country)?.states ?? [];
}

export function getCitiesForState(country: string, state: string): string[] {
  return getStatesForCountry(country).find(s => s.name === state)?.cities ?? [];
}

export const COUNTRY_NAMES = COUNTRIES.map(c => c.name);
