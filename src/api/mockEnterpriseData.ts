import { PartnerRoleKey } from '@/constants/stageFormSchemas';

// This mock data simulates what would be stored in a database for each registered enterprise.
// Keyed by public_key for easy lookup.
export const mockEnterpriseData: { [publicKey: string]: { role: PartnerRoleKey; profile_metadata: any } } = {
  '0xbrandownerkey123': {
    role: 'brand_owner',
    profile_metadata: {
      brandName: 'Café do Futuro',
      brandStory: 'Nossa fazenda cultiva cafés especiais com paixão e tradição, garantindo qualidade e sustentabilidade em cada grão.',
      website: 'https://www.cafedofuturo.com',
      logoUrl: '/public/placeholder.svg',
    },
  },
  'WORKER-WALLET-456': { // Logistics Partner (TransCafé Express)
    role: 'logistics',
    profile_metadata: {
      companyName: 'TransCafé Express',
      transportCertifications: ["organic_certified", "sustainable"],
      origin: "Fazenda Santa Clara, Monte Verde-MG",
      originCoordinates: { lat: -22.9201, lng: -46.7652 },
      destination: "Armazém Central, São Paulo-SP",
      destinationCoordinates: { lat: -23.5505, lng: -46.6333 },
      vehicleType: "truck_dry",
      vehiclePlate: "ABC1D23",
      driverName: "Maria Oliveira",
      operationalEmail: 'ops@transcafe.com.br',
      technicalResponsible: 'Maria Oliveira',
    },
  },
  '0xabc...123': { // Producer (Café do Sol Ltda.)
    role: 'producer',
    profile_metadata: {
      farmName: "Café do Sol Ltda.",
      address: "Rua das Flores, 123, Zona Rural, MG",
      coordinates: { lat: -20.0, lng: -44.0 },
      altitude: 950,
      shadeConsortium: "Cultivo sombreado com árvores frutíferas.",
      producerStory: "Produtores de café especial desde 1950.",
      certifications: ["organic", "fair_trade"],
    },
  },
  '0xvelozkey789': { // Transportadora Veloz (Logistics)
    role: 'logistics',
    profile_metadata: {
      companyName: 'Transportadora Veloz',
      transportCertifications: ["sustainable"],
      origin: "Fazenda Esperança, Serra Negra-SP",
      originCoordinates: { lat: -22.6, lng: -46.7 },
      destination: "Torrefação Aroma Fino, Campinas-SP",
      destinationCoordinates: { lat: -22.9099, lng: -47.0626 },
      vehicleType: "truck_refrigerated",
      vehiclePlate: "XYZ5678",
      driverName: "João da Silva",
      operationalEmail: 'contato@veloz.com',
      technicalResponsible: 'João da Silva',
    },
  },
  '0xesperancakey123': { // Fazenda Esperança (Producer - for demo login)
    role: 'producer',
    profile_metadata: {
      farmName: "Fazenda Esperança",
      address: "Estrada do Café, Km 10, Serra Negra, SP",
      coordinates: { lat: -22.6, lng: -46.7 },
      altitude: 1100,
      shadeConsortium: "Cultivo em consórcio com eucaliptos.",
      producerStory: "Tradição e inovação na produção de cafés finos.",
      certifications: ["fair_trade", "global_gap"],
    },
  },
  '0xwarehousekey123': { // Armazém Global (Warehouse - for demo login)
    role: 'warehouse',
    profile_metadata: {
      warehouseName: "Armazém Global",
      location: "Av. Industrial, 500 - Jundiaí, SP",
      coordinates: { lat: -23.2183, lng: -46.8703 },
      storageCapacity: "100 toneladas",
      internalBatching: "Lotes separados por origem e variedade, identificados por QR Code.",
      storageType: "big_bag",
      temperature: 22,
      humidity: 65,
      inspectionDate: "2024-10-15",
      pestControl: "preventive",
      warehouseNotes: "Instalações modernas com controle de temperatura e umidade."
    },
  },
  '0xghi...789': { // Roaster (Torrefação Aroma Fino)
    role: 'roaster',
    profile_metadata: {
      roasteryName: "Torrefação Aroma Fino",
      roasteryLocation: { lat: -22.9099, lng: -47.0626 },
    },
  },
  // Adicione mais dados mockados para outros papéis conforme necessário, correspondendo aos seus PARTNER_PROFILES
};

// Helper function to get enterprise data by public key
export const getEnterpriseDataByPublicKey = (publicKey: string) => {
  return mockEnterpriseData[publicKey];
};