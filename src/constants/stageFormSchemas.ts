export const PARTNER_PROFILES = {
    producer: {
      title: "🌱 Etapa Produtor",
      description: "Cadastro das informações da fazenda e produção",
      icon: "🌱",
      fields: [
        
        {
          name: "farmName",
          label: "Nome da Fazenda",
          type: "text",
          placeholder: "Ex: Fazenda Santa Maria",
          required: true
        },
        {
          name: "address",
          label: "Endereço Completo",
          type: "text",
          placeholder: "Ex: Rodovia MG-010, Km 45, Monte Verde-MG",
          required: true
        },
        {
          name: "coordinates",
          label: "Coordenadas Geográficas",
          type: "group",
          description: "Coordenadas para mapeamento da localização exata",
          fields: [
            {
              name: "lat",
              label: "Latitude",
              type: "number",
              step: "any",
              placeholder: "Ex: -22.9201",
              required: true
            },
            {
              name: "lng",
              label: "Longitude",
              type: "number",
              step: "any",
              placeholder: "Ex: -46.7652",
              required: true
            }
          ]
        },
        {
          name: "altitude",
          label: "Altitude (metros acima do nível do mar)",
          type: "number",
          placeholder: "Ex: 1200",
          required: true
        },
        
       
        {
          name: "shadeConsortium",
          label: "Sombra / Consórcio Agrícola",
          type: "textarea",
          placeholder: "Ex: Cultivado com árvores nativas e bananeiras para sombreamento"
        },
        {
          name: "producerStory",
          label: "História da Fazenda / Produtor",
          type: "textarea",
          placeholder: "Ex: Fazenda familiar há 3 gerações, dedicada à produção cafeeira desde 1882"
        },
        {
          name: "certifications",
          label: "Certificações",
          type: "multiselect",
          options: [
            { value: "organic", label: "Orgânico" },
            { value: "fair_trade", label: "Fair Trade" },
            { value: "rainforest", label: "Rainforest Alliance" },
            { value: "utz", label: "UTZ Certified" },
            { value: "bird_friendly", label: "Bird Friendly" }
          ]
        }
       
      ]
    },
  
    logistics: {
      title: "🚚 Logística",
      description: "Controle de transporte e movimentação do lote",
      icon: "🚚",
      fields: [
     
        {
          name: "transportCertifications",
          label: "Certificações de Transporte",
          type: "multiselect",
          options: [
            { value: "organic_certified", label: "Transporte Orgânico Certificado" },
            { value: "sustainable", label: "Transporte Sustentável" },
            { value: "carbon_neutral", label: "Carbono Neutro" }
          ]
        },
        
       
        {
          name: "vehicleType",
          label: "Tipo de Veículo",
          type: "select",
          options: [
            { value: "truck_refrigerated", label: "Caminhão Refrigerado" },
            { value: "truck_dry", label: "Caminhão Seco" },
            { value: "van", label: "Van" }, 
            { value: "container_ship", label: "Navio Container" },
            { value: "air_cargo", label: "Avião de Carga" }
          ],
          required: true
        },
        {
          name: "vehiclePlate",
          label: "Placa do Veículo",
          type: "text",
          placeholder: "Ex: ABC1D23",
          required: true
        }
       
        
     
      
      ]
    },
  
    warehouse: {
      title: "🏭 Armazém",
      description: "Controle de estocagem e condições do armazém",
      icon: "🏭",
      fields: [
        {
          name: "warehouseName",
          label: "Nome do Armazém",
          autoFill: "warehouseName" ,
          type: "text",
          placeholder: "Ex: Armazém Central São Paulo",
          required: true
        },
        {
          name: "location",
          label: "Localização",
          autoFill: "location" ,
          type: "text", 
          placeholder: "Ex: Av. das Nações, 1000 - Guarulhos, SP",
          required: true
        },
        {
          name: "coordinates",
          label: "Coordenadas do Armazém",
          type: "group",
          fields: [
            {
              name: "lat",
              label: "Latitude",
              autoFill: "coordinates.lat" ,
              type: "number",
              step: "any",
              placeholder: "Ex: -23.4255",
              required: true
            },
            {
              name: "lng",
              label: "Longitude", 
              autoFill: "coordinates.lng" ,
              type: "number",
              step: "any",
              placeholder: "Ex: -46.4784",
              required: true
            }
          ]
        },
        {
          name: "storageCapacity",
          label: "Capacidade de Armazenagem (kg/ton)",
          autoFill: "storageCapacity" ,
          type: "text",
          placeholder: "Ex: 50 toneladas",
          required: true
        },
        {
          name: "internalBatching",
          label: "Loteamento Interno",
          type: "textarea",
          placeholder: "Ex: Separado por microlotes, lote A1-A5 para cafés especiais"
        },
        {
          name: "batchPhotos",
          label: "Fotos do Lote / Bag",
          type: "file",
          description: "Fotos para storytelling e documentação visual"
        },
        {
          name: "storageType",
          label: "Tipo de Armazenamento",
          type: "select",
          options: [
            { value: "silo", label: "Silo" },
            { value: "big_bag", label: "Big Bag" },
            { value: "jute_bag", label: "Saco de Juta" },
            { value: "grain_pro", label: "Grain Pro" },
            { value: "vacuum", label: "Vácuo" }
          ]
        },
        {
          name: "temperature",
          label: "Temperatura Média (°C)",
          type: "number",
          placeholder: "Ex: 20"
        },
        {
          name: "humidity",
          label: "Umidade Relativa (%)",
          type: "number",
          placeholder: "Ex: 60"
        },
        {
          name: "stockEntryDate",
          label: "Data de Entrada no Armazém",
          type: "date"
        },
        {
          name: "stockExitDate",
          label: "Data de Saída do Armazém",
          type: "date"
        },
        {
          name: "storageDuration",
          label: "Tempo de Armazenamento (dias)",
          type: "number",
          placeholder: "Ex: 30"
        },
        {
          name: "inspectionDate",
          label: "Data da Última Inspeção",
          autoFill: "inspectionDate" ,
          type: "date"
        },
        {
          name: "pestControl",
          label: "Controle de Pragas",
          autoFill: "pestControl" ,
          type: "select",
          options: [
            { value: "none", label: "Nenhum" },
            { value: "preventive", label: "Preventivo" },
            { value: "corrective", label: "Corretivo" },
            { value: "biological", label: "Biológico" }
          ]
        },
        {
          name: "warehouseNotes",
          label: "Observações do Armazém",
          type: "textarea",
          placeholder: "Ex: Lotes inspecionados, embalagens verificadas, condições especiais de armazenamento..."
        }
      ]
    },
  
    grader: {
      title: "🔍 Classificação",
      description: "Análise técnica e sensorial do café",
      icon: "🔍",
      fields: [
        {
          name: "evaluatorName",
          label: "Nome do Classificador",
          type: "text",
          placeholder: "Ex: Maria Santos - Q-Grader",
          required: true
        },
        
      ]
    },
  
    roaster: {
      title: "🔥 Torra",
      description: "Registro do processo de torrefação",
      icon: "🔥",
      fields: [
        {
          name: "roasteryName",
          label: "Nome da Torrefação",
          type: "text",
          placeholder: "Ex: Torrefação Arte & Sabor",
          required: true
        },
        {
          name: "roasteryLocation",
          label: "Localização da Torrefação",
          type: "group",
          fields: [
            {
              name: "lat",
              label: "Latitude",
              type: "number", 
              step: "any",
              placeholder: "Ex: -23.5505",
              required: true
            },
            {
              name: "lng",
              label: "Longitude",
              type: "number",
              step: "any", 
              placeholder: "Ex: -46.6333",
              required: true
            }
          ]
        },
       
      ]
    },
  
    packager: {
      "title": "📦 Embalagem",
      "description": "Detalhes sobre o acondicionamento do café, garantindo frescor e qualidade até o consumidor final.",
      "icon": "📦",
      "fields": [
      
        {
          "name": "packagingCompany",
          "label": "Empresa de Embalagem",
          "type": "text",
          "placeholder": "Ex: Embalagens Café Premium Ltda.",
          "required": true
        },
       
        
       
        
       
      
      ]
    },
  
      distributor: 
      {
        "title": "🚛 Distribuição e Venda",
        "description": "Etapa final de logística que leva o café do torrador ao ponto de venda ou consumidor final.",
        "icon": "🚛",
        "fields": [
          
          {
            "name": "distributorName",
            "label": "Nome da Empresa de Logística/Distribuidora",
            "type": "text",
            "placeholder": "Ex: Distribuidora Café Brasil Ltda.",
            "required": true
          },
         
        
          
        ]
      },
  
    
    end_consumer: {
      title: "Barista & Final Preparation",
      description: "Record the brewing parameters and sensory experience",
      icon: "💡",
      fields: [
       
        {
          name: "baristaName",
          label: "Barista or Cafeteria Name",
          type: "text",
          placeholder: "e.g., Jane Doe at The Daily Grind",
          required: true
        }
       
      ]
    },
  
    sustainability: {
      title: "🌿 Sustainability & Social Impact",
      description: "Environmental and social practices of the batch",
      icon: "🌿",
      fields: [
        {
          name: "certifications",
          label: "Sustainability Certifications",
          type: "multiselect",
          options: [
            { value: "carbon_neutral", label: "Carbon Neutral" },
            { value: "b_corp", label: "B Corp" },
            { value: "rainforest_alliance", label: "Rainforest Alliance" },
            { value: "fair_trade", label: "Fair Trade" },
            { value: "organic", label: "Organic" },
            { value: "bird_friendly", label: "Bird Friendly" }
          ]
        },
       
        {
          name: "waterManagement",
          label: "Water Management",
          type: "select",
          placeholder: "Select the primary water practice...",
          options: [
            { value: "low_consumption", label: "Low Consumption (Natural/Honey Process)" },
            { value: "recirculation_system", label: "Recirculation/Reuse System" },
            { value: "efficient_irrigation", label: "Efficient Irrigation" },
            { value: "standard_washed", label: "Standard Washed Process" }
          ]
        },
        {
            name: "biodiversityPractices",
            label: "Biodiversity Practices",
            type: "multiselect",
            options: [
              { value: "shade_grown", label: "Shade-Grown" },
              { value: "native_species_corridors", label: "Native Species Corridors" },
              { value: "reforestation_projects", label: "Reforestation Projects" },
              { value: "organic_soil_management", label: "Organic Soil Management" },
              { value: "wildlife_protection", label: "Wildlife Protection Areas" }
            ]
        },
        {
            name: "renewableEnergyPractices",
            label: "Renewable Energy Usage",
            type: "multiselect",
            options: [
                { value: "solar_processing", label: "Solar (Processing)" },
                { value: "solar_roasting", label: "Solar (Roasting)" },
                { value: "biofuel_transport", label: "Biofuel (Transport)" },
                { value: "biomass_energy", label: "Biomass Energy" }
            ]
        },
        {
          name: "socialImpact",
          label: "Social Impact Initiatives",
          type: "textarea",
          placeholder: "Describe community projects, fair labor conditions, worker benefits, etc."
        }
      ]
    },
    beneficiamento: {
      "title": "Beneficiamento / Dry Mill",
      "description": "Etapa de processamento do café cereja ou pergaminho, onde ele é limpo, classificado e preparado para o próximo passo na cadeia.",
      "icon": "⚙️",
      "fields": [
        // Dados de Entrada/Saída
        {
          "name": "millingFacilityName",
          "label": "Nome da Unidade de Beneficiamento",
          "type": "text",
          "required": true,
          "placeholder": "Ex: Beneficiamento Serra Azul"
        },
       
    
    
       
      ]
    },
  
  };
  
  export const roles = [
    { value: 'producer', label: '🌱 Produtor' },
    { value: 'logistics', label: '🚚 Logística' },
    { value: 'warehouse', label: '🏭 Armazém' }, // Added warehouse role
    { value: 'grader', label: '🔍 Classificador' },
    { value: 'roaster', label: '🔥 Torrefador' },
    { value: 'packager', label: '📦 Embalador' },
    { value: 'distributor', label: '🚛 Distribuidor' },
    { value: 'end_consumer', label: '💡 Consumidor Final / Barista' },
    { value: 'sustainability', label: '🌿 Sustentabilidade' },
    { value: 'beneficiamento', label: '⚙️ Beneficiamento' }
  ];

export type FieldType = 'text' | 'number' | 'date' | 'textarea' | 'select' | 'multiselect' | 'group' | 'datetime-local' | 'file'; // Added 'file'

export interface FieldOption {
  value: string;
  label: string;
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  step?: string; // For number inputs
  min?: number; // For number inputs
  max?: number; // For number inputs
  options?: FieldOption[]; // For select and multiselect
  description?: string; // For groups
  fields?: FormField[]; // For groups
  autoFill?: string; // New property for auto-filling from enterprise profile
}

export interface PartnerProfileSchema {
  title: string;
  description: string;
  icon: string;
  fields: FormField[];
}

export type PartnerRoleKey = keyof typeof PARTNER_PROFILES;

// New constant for dynamic stage event schemas
export const STAGE_EVENT_SCHEMAS: { [key in PartnerRoleKey]?: PartnerProfileSchema } = {
  producer: {
    title: "Registro de Colheita",
    description: "Detalhes da colheita e preparação inicial do lote.",
    icon: "🌱",
    fields: [
      {
        name: "farmName",
        label: "Nome da Fazenda",
        type: "text",
        required: true,
        autoFill: 'farmName',
        placeholder: "Ex: Fazenda Santa Maria"
      },
      {
        name: "address",
        label: "Endereço Completo",
        type: "text",
        required: true,
        autoFill: 'address',
        placeholder: "Ex: Rodovia MG-010, Km 45, Monte Verde-MG"
      },
      {
        name: "coordinates",
        label: "Coordenadas Geográficas",
        type: "group",
        description: "Coordenadas para mapeamento da localização exata",
        required: false,
        fields: [
          {
            name: "lat",
            label: "Latitude",
            type: "number",
            step: "any",
            autoFill: 'coordinates.lat',
            placeholder: "Ex: -22.9201"
          },
          {
            name: "lng", 
            label: "Longitude",
            type: "number",
            step: "any",
            autoFill: 'coordinates.lng',
            placeholder: "Ex: -46.7652"
          }
        ]
      },
      {
        name: "altitude",
        label: "Altitude (metros acima do nível do mar)",
        type: "number",
        required: false,
        autoFill: 'altitude',
        placeholder: "Ex: 1200"
      },
      {
        name: "plantingDate",
        label: "Data do Plantio",
        type: "date",
        required: false
      },
      {
        name: "variety",
        label: "Variedade do Café",
        type: "select",
        required: true,
        options: [
          { value: "arabica", label: "Arábica" },
          { value: "bourbon", label: "Bourbon" },
          { value: "catuai", label: "Catuaí" },
          { value: "mundo_novo", label: "Mundo Novo" },
          { value: "caturra", label: "Caturra" },
          { value: "typica", label: "Typica" },
          { value: "robusta", label: "Robusta" },
          { value: "catucai_amarelo", label: "Catucaí Amarelo" }
        ]
      },
      {
        name: "cropYear",
        label: "Safra/Ano da Colheita",
        type: "text",
        required: true,
        placeholder: "Ex: 2025/26"
      },
      {
        name: "harvestDate",
        label: "Data da Colheita",
        type: "date",
        required: true
      },
      {
        name: "cropClimate",
        label: "Condições Climáticas na Safra",
        type: "textarea",
        required: false,
        placeholder: "Ex: Seca e temperaturas elevadas em fevereiro, seguidas de chuvas irregulares"
      },
      {
        name: "shadeConsortium",
        label: "Sombra / Consórcio Agrícola",
        type: "textarea",
        required: false,
        autoFill: 'shadeConsortium',
        placeholder: "Ex: Cultivado com árvores nativas e bananeiras para sombreamento"
      },
      {
        name: "producerStory",
        label: "História da Fazenda / Produtor",
        type: "textarea",
        autoFill: "producerStory" ,
        required: false,
        placeholder: "Ex: Fazenda familiar há 3 gerações, dedicada à produção cafeeira desde 1882"
      },
      {
        name: "harvestMethod",
        label: "Método de Colheita",
        type: "select",
        required: true,
        options: [
          { value: "manual", label: "Manual (Derriça)" },
          { value: "selective", label: "Seletiva" },
          { value: "mechanical", label: "Mecanizada" }
        ]
      },
      {
        name: "processingMethod",
        label: "Método de Processamento",
        type: "select",
        required: true,
        options: [
          { value: "natural", label: "Natural" },
          { value: "washed", label: "Lavado" },
          { value: "honey", label: "Honey" },
          { value: "semi-washed", label: "Semi-lavado" },
          { value: "anaerobic", label: "Anaeróbico" },
          { value: "carbonic_maceration", label: "Maceração Carbônica" }
        ]
      },
      {
        name: "beanDensity",
        label: "Densidade do Grão (g/L)",
        type: "number",
        required: false,
        placeholder: "Ex: 680"
      },
      {
        name: "moistureContent",
        label: "Teor de Umidade (%)",
        type: "number",
        required: false,
        step: "0.1",
        placeholder: "Ex: 11.5"
      },
      {
        name: "qualityScore",
        label: "Nota de Qualidade Inicial (0-100)",
        type: "number",
        required: false,
        min: 0,
        max: 100,
        placeholder: "Ex: 85"
      },
      {
        name: "certifications",
        label: "Certificações",
        type: "multiselect",
        required: false,
        autoFill: 'certifications',
        options: [
          { value: "organic", label: "Orgânico" },
          { value: "fair_trade", label: "Fair Trade" },
          { value: "rainforest", label: "Rainforest Alliance" },
          { value: "utz", label: "UTZ Certified" },
          { value: "bird_friendly", label: "Bird Friendly" },
          { value: "global_gap", label: "Global G.A.P." },
          { value: "brasil_sustentavel", label: "Brasil Sustentável" }
        ]
      },
      {
        name: "producerNotes",
        label: "Observações do Produtor",
        type: "textarea",
        required: false,
        placeholder: "Condições climáticas, técnicas de cultivo, desafios específicos, características especiais do terreno..."
      },
      {
        name: "estimatedVolume",
        label: "Volume Produzido (kg)",
        type: "number",
        required: true,
        min: 1,
        step: "0.1",
        placeholder: "Ex: 1500.5"
      },
      {
        name: "soilType",
        label: "Tipo de Solo",
        type: "select",
        required: false,
        options: [
          { value: "clay", label: "Argiloso" },
          { value: "sandy", label: "Arenoso" },
          { value: "clay_sandy", label: "Argilo-Arenoso" },
          { value: "limestone", label: "Calcário" },
          { value: "volcanic", label: "Vulcânico" },
          { value: "laterite", label: "Laterítico" }
        ]
      }
    ]
  },
  logistics: {
    title: "Registro de Transporte",
    description: "Informações sobre a coleta e condições de transporte.",
    icon: "🚚",
    fields: [
      {
        name: "transportCertifications",
        label: "Certificações de Transporte",
        type: "multiselect",
        autoFill: "transportCertifications" ,
        options: [
          { value: "organic_certified", label: "Transporte Orgânico Certificado" },
          { value: "sustainable", label: "Transporte Sustentável" },
          { value: "carbon_neutral", label: "Carbono Neutro" }
        ]
      },
      {
        name: "origin",
        label: "Local de Origem", 
        autoFill: "origin" ,
        type: "text",
        placeholder: "Ex: Fazenda Santa Maria, Monte Verde-MG"
      },
      {
        name: "originCoordinates",
        label: "Coordenadas de Origem",
        type: "group",
        fields: [
          {
            name: "lat",
            label: "Latitude",
           
            type: "number",
            step: "any",
            placeholder: "Ex: -22.9201"
          },
          {
            name: "lng",
            label: "Longitude",
        
            step: "any",
            placeholder: "Ex: -46.7652"
          }
        ]
      },
      {
        name: "destination",
        label: "Local de Destino",
        autoFill: "destination" ,
        type: "text",
        placeholder: "Ex: Armazém Central, São Paulo-SP"
      },
      {
        name: "destinationCoordinates",
        label: "Coordenadas de Destino",
        type: "group", 
        fields: [
          {
            name: "lat",
            label: "Latitude",
        
            type: "number",
            step: "any",
            placeholder: "Ex: -23.5505"
          },
          {
            name: "lng",
            label: "Longitude",
      
            type: "number", 
            step: "any",
            placeholder: "Ex: -46.6333"
          }
        ]
      },
      {
        name: "startTime",
        label: "Data e Hora de Partida",
        type: "datetime-local"
      },
      {
        name: "endTime", 
        label: "Data e Hora de Chegada",
        type: "datetime-local"
      },
      {
        name: "vehicleType",
        label: "Tipo de Veículo",
        autoFill: "vehicleType" ,
        type: "select",
        options: [
          { value: "truck_refrigerated", label: "Caminhão Refrigerado" },
          { value: "truck_dry", label: "Caminhão Seco" },
          { value: "van", label: "Van" }, 
          { value: "container_ship", label: "Navio Container" },
          { value: "air_cargo", label: "Avião de Carga" }
        ]
      },
      {
        name: "vehiclePlate",
        label: "Placa do Veículo",
        autoFill: "vehiclePlate" ,
        type: "text",
        placeholder: "Ex: ABC1D23"
      },
      {
        name: "driverName",
        label: "Nome do Motorista",
        autoFill: "driverName" ,
        type: "text",
        placeholder: "Ex: João Silva"
      },
      {
        name: "temperatureControl",
        label: "Temperatura Controlada (°C)",
        type: "number",
        placeholder: "Ex: 18"
      },
      {
        name: "humidityControl",
        label: "Umidade Controlada (%)",
        type: "number",
        placeholder: "Ex: 60"
      },
      {
        name: "distance",
        label: "Distância Percorrida (km)",
        type: "number",
        placeholder: "Ex: 350"
      },
      {
        name: "transportConditions",
        label: "Condições do Transporte",
        type: "textarea",
        placeholder: "Ex: Transporte hermético, sem umidade, protegido de luz solar direta, vibração mínima, condições de estrada..."
      },
      {
        name: "incidents",
        label: "Incidentes ou Observações",
        type: "textarea",
        placeholder: "Ex: Atraso por chuva, inspeção na estrada, condições especiais..."
      }
    ]
  },
  warehouse: {
    title: "Registro de Armazenagem",
    description: "Detalhes da entrada e condições de estocagem no armazém.",
    icon: "🏭",
    fields: [
      {
        name: "warehouseName",
        label: "Nome do Armazém",
        type: "text",
        required: true,
        autoFill: 'warehouseName',
        placeholder: "Ex: Armazém Central São Paulo"
      },
      {
        name: "location",
        label: "Localização",
        type: "text",
        required: true,
        autoFill: 'location',
        placeholder: "Ex: Av. das Nações, 1000 - Guarulhos, SP"
      },
      {
        name: "coordinates",
        label: "Coordenadas do Armazém",
        type: "group",
        required: false,
        fields: [
          {
            name: "lat",
            label: "Latitude",
            type: "number",
            step: "any",
            autoFill: 'coordinates.lat',
            placeholder: "Ex: -23.4255"
          },
          {
            name: "lng",
            label: "Longitude",
            type: "number",
            step: "any",
            autoFill: 'coordinates.lng',
            placeholder: "Ex: -46.4784"
          }
        ]
      },
      {
        name: "storageCapacity",
        label: "Capacidade de Armazenagem (kg/ton)",
        type: "text",
        required: false,
        autoFill: 'storageCapacity',
        placeholder: "Ex: 50 toneladas"
      },
      {
        name: "entryDate",
        label: "Data de Entrada",
        type: "date",
        required: true
      },
      {
        name: "storageLocation",
        label: "Localização no Armazém",
        type: "text",
        placeholder: "Ex: Pallet A-12, Corredor 3",
        required: true
      },
      {
        name: "humidityPercent",
        label: "Umidade do Ar (%)",
        type: "number",
        step: "0.1",
        placeholder: "Ex: 60.2"
      },
      {
        name: "temperatureC",
        label: "Temperatura (°C)",
        type: "number",
        step: "0.1",
        placeholder: "Ex: 20.0"
      },
      {
        name: "pestControlCheck",
        label: "Verificação de Pragas",
        type: "select",
        autoFill: 'pestControl', // Auto-fill from profile's pestControl
        options: [
          { value: "ok", label: "OK" },
          { value: "minor_issue", label: "Pequeno Problema" },
          { value: "major_issue", label: "Problema Grave" },
        ]
      },
      {
        name: "storageType",
        label: "Tipo de Armazenamento",
        type: "select",
        required: false,
        autoFill: 'storageType',
        options: [
          { value: "silo", label: "Silo" },
          { value: "big_bag", label: "Big Bag" },
          { value: "jute_bag", label: "Saco de Juta" },
          { value: "grain_pro", label: "Grain Pro" },
          { value: "vacuum", label: "Vácuo" }
        ]
      },
      {
        name: "warehouseNotes",
        label: "Observações do Armazém",
        type: "textarea",
        placeholder: "Ex: Lotes inspecionados, embalagens verificadas, condições especiais de armazenamento..."
      }
    ]
  },
  grader: {
    title: "Registro de Classificação",
    description: "Resultados da análise técnica e sensorial do café.",
    icon: "🔍",
    fields: [
      { name: "evaluationDate", label: "Data da Avaliação", type: "date", required: true },
      { name: "evaluatorName", label: "Nome do Classificador", type: "text", placeholder: "Ex: Ana Costa (Q-Grader)", required: true },
      { name: "cuppingScore", label: "Pontuação Cupping (SCA)", type: "number", step: "0.25", placeholder: "Ex: 88.50", required: true },
      { name: "sensoryNotes", label: "Notas Sensoriais", type: "textarea", placeholder: "Ex: Notas de chocolate amargo, caramelo, corpo sedoso." },
      { name: "defectsObserved", label: "Defeitos Observados", type: "text", placeholder: "Ex: 2 grãos pretos, 1 brocado" },
    ]
  },
  roaster: {
    title: "Registro de Torra",
    description: "Parâmetros e resultados do processo de torrefação.",
    icon: "🔥",
    fields: [
      { name: "roastDate", label: "Data da Torra", type: "date", required: true },
      { name: "roastProfile", label: "Perfil de Torra", type: "select", required: true, options: [
        { value: "light", label: "Clara" },
        { value: "medium", label: "Média" },
        { value: "dark", label: "Escura" },
      ]},
      { name: "finalTemperatureC", label: "Temperatura Final (°C)", type: "number", step: "0.1", placeholder: "Ex: 205.0", required: true },
      { name: "firstCrackTime", label: "Tempo 1º Crack (min:seg)", type: "text", placeholder: "Ex: 08:30" },
      { name: "roastLossPercent", label: "Perda de Peso na Torra (%)", type: "number", step: "0.1", placeholder: "Ex: 16.5" },
      { name: "roasterNotes", label: "Notas do Torrador", type: "textarea", placeholder: "Ex: Desenvolvimento aromático intenso, bom corpo." },
    ]
  },
  packager: {
    title: "Registro de Embalagem",
    description: "Detalhes do acondicionamento do café torrado.",
    icon: "📦",
    fields: [
      { name: "packagingDate", label: "Data da Embalagem", type: "date", required: true },
      { name: "packagingType", label: "Tipo de Embalagem", type: "select", required: true, options: [
        { value: "valve_bag", label: "Saco com Válvula" },
        { value: "vacuum_pack", label: "Embalagem a Vácuo" },
        { value: "can", label: "Lata" },
      ]},
      { name: "packageWeightGrams", label: "Peso por Pacote (gramas)", type: "number", placeholder: "Ex: 250", required: true },
      { name: "numberOfPackages", label: "Número de Pacotes", type: "number", placeholder: "Ex: 100" },
      { name: "bestBeforeDate", label: "Data de Validade", type: "date" },
    ]
  },
  distributor: {
    title: "Registro de Distribuição",
    description: "Informações sobre a entrega do café embalado.",
    icon: "🚛",
    fields: [
      { name: "dispatchDate", label: "Data de Despacho", type: "date", required: true },
      { name: "deliveryDate", label: "Data de Entrega Prevista", type: "date", required: true },
      { name: "deliveryLocation", label: "Local de Entrega", type: "text", placeholder: "Ex: Cafeteria Central", required: true },
      { name: "trackingNumber", label: "Número de Rastreamento", type: "text", placeholder: "Ex: TRK123456789" },
      { name: "deliveryNotes", label: "Notas de Entrega", type: "textarea", placeholder: "Ex: Entregue ao gerente da loja." },
    ]
  },
  end_consumer: {
    title: "Registro de Preparo Final",
    description: "Detalhes do preparo e experiência do consumidor.",
    icon: "💡",
    fields: [
      { name: "preparationDate", label: "Data do Preparo", type: "date", required: true },
      { name: "baristaName", label: "Nome do Barista", type: "text", placeholder: "Ex: Sofia Mendes", required: true },
      { name: "brewMethod", label: "Método de Preparo", type: "select", required: true, options: [
        { value: "espresso", label: "Espresso" },
        { value: "pour_over", label: "Hario V60 / Coado" },
        { value: "french_press", label: "French Press" },
        { value: "aeropress", label: "Aeropress" },
      ]},
      { name: "grindSize", label: "Moagem", type: "select", options: [
        { value: "fine", label: "Fina" },
        { value: "medium", label: "Média" },
        { value: "coarse", label: "Grossa" },
      ]},
      { name: "waterTemperatureC", label: "Temperatura da Água (°C)", type: "number", step: "0.1", placeholder: "Ex: 92.0" },
      { name: "sensoryExperience", label: "Experiência Sensorial", type: "textarea", placeholder: "Ex: Aroma floral, sabor frutado e finalização limpa." },
    ]
  },
  beneficiamento: {
    title: "Registro de Beneficiamento",
    description: "Detalhes do processamento do café cereja ou pergaminho.",
    icon: "⚙️",
    fields: [
      { name: "millingDate", label: "Data do Beneficiamento", type: "date", required: true },
      { name: "millingFacilityName", label: "Nome da Unidade", type: "text", placeholder: "Ex: Beneficiamento Serra Azul", required: true },
      { name: "inputWeightKg", label: "Peso de Entrada (kg)", type: "number", step: "0.01", placeholder: "Ex: 1000.00", required: true },
      { name: "outputWeightKg", label: "Peso de Saída (kg)", type: "number", step: "0.01", placeholder: "Ex: 850.00", required: true },
      { name: "yieldPercent", label: "Rendimento (%)", type: "number", step: "0.1", placeholder: "Ex: 85.0" },
      { name: "gradingResults", label: "Resultados da Classificação", type: "textarea", placeholder: "Ex: Peneira 16+, 2 defeitos por 300g." },
    ]
  },
  sustainability: {
    title: "Registro de Sustentabilidade",
    description: "Práticas ambientais e sociais aplicadas ao lote.",
    icon: "🌿",
    fields: [
      { name: "auditDate", label: "Data da Auditoria/Registro", type: "date", required: true },
      { name: "auditorName", label: "Auditor/Responsável", type: "text", placeholder: "Ex: Instituto Verde Brasil" },
      { name: "certificationsApplied", label: "Certificações Aplicadas", type: "multiselect", options: [
        { value: "carbon_neutral", label: "Carbono Neutro" },
        { value: "b_corp", label: "B Corp" },
        { value: "rainforest_alliance", label: "Rainforest Alliance" },
        { value: "fair_trade", label: "Fair Trade" },
        { value: "organic", label: "Orgânico" },
        { value: "bird_friendly", label: "Bird Friendly" }
      ]},
      { name: "environmentalImpactNotes", label: "Notas de Impacto Ambiental", type: "textarea", placeholder: "Ex: Redução de 30% no consumo de água no processamento." },
      { name: "socialImpactNotes", label: "Notas de Impacto Social", type: "textarea", placeholder: "Ex: Programa de capacitação para trabalhadores rurais." },
    ]
  },
};
  
export const roles = [
  { value: 'producer', label: '🌱 Produtor' },
  { value: 'logistics', label: '🚚 Logística' },
  { value: 'warehouse', label: '🏭 Armazém' }, // Added warehouse role
  { value: 'grader', label: '🔍 Classificador' },
  { value: 'roaster', label: '🔥 Torrefador' },
  { value: 'packager', label: '📦 Embalador' },
  { value: 'distributor', label: '🚛 Distribuidor' },
  { value: 'end_consumer', label: '💡 Consumidor Final / Barista' },
  { value: 'sustainability', label: '🌿 Sustentabilidade' },
  { value: 'beneficiamento', label: '⚙️ Beneficiamento' }
];

export type FieldType = 'text' | 'number' | 'date' | 'textarea' | 'select' | 'multiselect' | 'group' | 'datetime-local' | 'file'; // Added 'file'

export interface FieldOption {
  value: string;
  label: string;
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  step?: string; // For number inputs
  min?: number; // For number inputs
  max?: number; // For number inputs
  options?: FieldOption[]; // For select and multiselect
  description?: string; // For groups
  fields?: FormField[]; // For groups
  autoFill?: string; // New property for auto-filling from enterprise profile
}

export interface PartnerProfileSchema {
  title: string;
  description: string;
  icon: string;
  fields: FormField[];
}

export type PartnerRoleKey = keyof typeof PARTNER_PROFILES;

// New constant for dynamic stage event schemas
export const STAGE_EVENT_SCHEMAS: { [key in PartnerRoleKey]?: PartnerProfileSchema } = {
  producer: {
    title: "Registro de Colheita",
    description: "Detalhes da colheita e preparação inicial do lote.",
    icon: "🌱",
    fields: [
      {
        name: "farmName",
        label: "Nome da Fazenda",
        type: "text",
        required: true,
        autoFill: 'farmName',
        placeholder: "Ex: Fazenda Santa Maria"
      },
      {
        name: "address",
        label: "Endereço Completo",
        type: "text",
        required: true,
        autoFill: 'address',
        placeholder: "Ex: Rodovia MG-010, Km 45, Monte Verde-MG"
      },
      {
        name: "coordinates",
        label: "Coordenadas Geográficas",
        type: "group",
        description: "Coordenadas para mapeamento da localização exata",
        required: false,
        fields: [
          {
            name: "lat",
            label: "Latitude",
            type: "number",
            step: "any",
            autoFill: 'coordinates.lat',
            placeholder: "Ex: -22.9201"
          },
          {
            name: "lng", 
            label: "Longitude",
            type: "number",
            step: "any",
            autoFill: 'coordinates.lng',
            placeholder: "Ex: -46.7652"
          }
        ]
      },
      {
        name: "altitude",
        label: "Altitude (metros acima do nível do mar)",
        type: "number",
        required: false,
        autoFill: 'altitude',
        placeholder: "Ex: 1200"
      },
      {
        name: "plantingDate",
        label: "Data do Plantio",
        type: "date",
        required: false
      },
      {
        name: "variety",
        label: "Variedade do Café",
        type: "select",
        required: true,
        options: [
          { value: "arabica", label: "Arábica" },
          { value: "bourbon", label: "Bourbon" },
          { value: "catuai", label: "Catuaí" },
          { value: "mundo_novo", label: "Mundo Novo" },
          { value: "caturra", label: "Caturra" },
          { value: "typica", label: "Typica" },
          { value: "robusta", label: "Robusta" },
          { value: "catucai_amarelo", label: "Catucaí Amarelo" }
        ]
      },
      {
        name: "cropYear",
        label: "Safra/Ano da Colheita",
        type: "text",
        required: true,
        placeholder: "Ex: 2025/26"
      },
      {
        name: "harvestDate",
        label: "Data da Colheita",
        type: "date",
        required: true
      },
      {
        name: "cropClimate",
        label: "Condições Climáticas na Safra",
        type: "textarea",
        required: false,
        placeholder: "Ex: Seca e temperaturas elevadas em fevereiro, seguidas de chuvas irregulares"
      },
      {
        name: "shadeConsortium",
        label: "Sombra / Consórcio Agrícola",
        type: "textarea",
        required: false,
        autoFill: 'shadeConsortium',
        placeholder: "Ex: Cultivado com árvores nativas e bananeiras para sombreamento"
      },
      {
        name: "producerStory",
        label: "História da Fazenda / Produtor",
        type: "textarea",
        autoFill: "producerStory" ,
        required: false,
        placeholder: "Ex: Fazenda familiar há 3 gerações, dedicada à produção cafeeira desde 1882"
      },
      {
        name: "harvestMethod",
        label: "Método de Colheita",
        type: "select",
        required: true,
        options: [
          { value: "manual", label: "Manual (Derriça)" },
          { value: "selective", label: "Seletiva" },
          { value: "mechanical", label: "Mecanizada" }
        ]
      },
      {
        name: "processingMethod",
        label: "Método de Processamento",
        type: "select",
        required: true,
        options: [
          { value: "natural", label: "Natural" },
          { value: "washed", label: "Lavado" },
          { value: "honey", label: "Honey" },
          { value: "semi-washed", label: "Semi-lavado" },
          { value: "anaerobic", label: "Anaeróbico" },
          { value: "carbonic_maceration", label: "Maceração Carbônica" }
        ]
      },
      {
        name: "beanDensity",
        label: "Densidade do Grão (g/L)",
        type: "number",
        required: false,
        placeholder: "Ex: 680"
      },
      {
        name: "moistureContent",
        label: "Teor de Umidade (%)",
        type: "number",
        required: false,
        step: "0.1",
        placeholder: "Ex: 11.5"
      },
      {
        name: "qualityScore",
        label: "Nota de Qualidade Inicial (0-100)",
        type: "number",
        required: false,
        min: 0,
        max: 100,
        placeholder: "Ex: 85"
      },
      {
        name: "certifications",
        label: "Certificações",
        type: "multiselect",
        required: false,
        autoFill: 'certifications',
        options: [
          { value: "organic", label: "Orgânico" },
          { value: "fair_trade", label: "Fair Trade" },
          { value: "rainforest", label: "Rainforest Alliance" },
          { value: "utz", label: "UTZ Certified" },
          { value: "bird_friendly", label: "Bird Friendly" },
          { value: "global_gap", label: "Global G.A.P." },
          { value: "brasil_sustentavel", label: "Brasil Sustentável" }
        ]
      },
      {
        name: "producerNotes",
        label: "Observações do Produtor",
        type: "textarea",
        required: false,
        placeholder: "Condições climáticas, técnicas de cultivo, desafios específicos, características especiais do terreno..."
      },
      {
        name: "estimatedVolume",
        label: "Volume Produzido (kg)",
        type: "number",
        required: true,
        min: 1,
        step: "0.1",
        placeholder: "Ex: 1500.5"
      },
      {
        name: "soilType",
        label: "Tipo de Solo",
        type: "select",
        required: false,
        options: [
          { value: "clay", label: "Argiloso" },
          { value: "sandy", label: "Arenoso" },
          { value: "clay_sandy", label: "Argilo-Arenoso" },
          { value: "limestone", label: "Calcário" },
          { value: "volcanic", label: "Vulcânico" },
          { value: "laterite", label: "Laterítico" }
        ]
      }
    ]
  },
  logistics: {
    title: "Registro de Transporte",
    description: "Informações sobre a coleta e condições de transporte.",
    icon: "🚚",
    fields: [
      {
        name: "transportCertifications",
        label: "Certificações de Transporte",
        type: "multiselect",
        autoFill: "transportCertifications" ,
        options: [
          { value: "organic_certified", label: "Transporte Orgânico Certificado" },
          { value: "sustainable", label: "Transporte Sustentável" },
          { value: "carbon_neutral", label: "Carbono Neutro" }
        ]
      },
      {
        name: "origin",
        label: "Local de Origem", 
        autoFill: "origin" ,
        type: "text",
        placeholder: "Ex: Fazenda Santa Maria, Monte Verde-MG"
      },
      {
        name: "originCoordinates",
        label: "Coordenadas de Origem",
        type: "group",
        fields: [
          {
            name: "lat",
            label: "Latitude",
           
            type: "number",
            step: "any",
            placeholder: "Ex: -22.9201"
          },
          {
            name: "lng",
            label: "Longitude",
        
            step: "any",
            placeholder: "Ex: -46.7652"
          }
        ]
      },
      {
        name: "destination",
        label: "Local de Destino",
        autoFill: "destination" ,
        type: "text",
        placeholder: "Ex: Armazém Central, São Paulo-SP"
      },
      {
        name: "destinationCoordinates",
        label: "Coordenadas de Destino",
        type: "group", 
        fields: [
          {
            name: "lat",
            label: "Latitude",
        
            type: "number",
            step: "any",
            placeholder: "Ex: -23.5505"
          },
          {
            name: "lng",
            label: "Longitude",
      
            type: "number", 
            step: "any",
            placeholder: "Ex: -46.6333"
          }
        ]
      },
      {
        name: "startTime",
        label: "Data e Hora de Partida",
        type: "datetime-local"
      },
      {
        name: "endTime", 
        label: "Data e Hora de Chegada",
        type: "datetime-local"
      },
      {
        name: "vehicleType",
        label: "Tipo de Veículo",
        autoFill: "vehicleType" ,
        type: "select",
        options: [
          { value: "truck_refrigerated", label: "Caminhão Refrigerado" },
          { value: "truck_dry", label: "Caminhão Seco" },
          { value: "van", label: "Van" }, 
          { value: "container_ship", label: "Navio Container" },
          { value: "air_cargo", label: "Avião de Carga" }
        ]
      },
      {
        name: "vehiclePlate",
        label: "Placa do Veículo",
        autoFill: "vehiclePlate" ,
        type: "text",
        placeholder: "Ex: ABC1D23"
      },
      {
        name: "driverName",
        label: "Nome do Motorista",
        autoFill: "driverName" ,
        type: "text",
        placeholder: "Ex: João Silva"
      },
      {
        name: "temperatureControl",
        label: "Temperatura Controlada (°C)",
        type: "number",
        placeholder: "Ex: 18"
      },
      {
        name: "humidityControl",
        label: "Umidade Controlada (%)",
        type: "number",
        placeholder: "Ex: 60"
      },
      {
        name: "distance",
        label: "Distância Percorrida (km)",
        type: "number",
        placeholder: "Ex: 350"
      },
      {
        name: "transportConditions",
        label: "Condições do Transporte",
        type: "textarea",
        placeholder: "Ex: Transporte hermético, sem umidade, protegido de luz solar direta, vibração mínima, condições de estrada..."
      },
      {
        name: "incidents",
        label: "Incidentes ou Observações",
        type: "textarea",
        placeholder: "Ex: Atraso por chuva, inspeção na estrada, condições especiais..."
      }
    ]
  },
  warehouse: {
    title: "Registro de Armazenagem",
    description: "Detalhes da entrada e condições de estocagem no armazém.",
    icon: "🏭",
    fields: [
      {
        name: "warehouseName",
        label: "Nome do Armazém",
        type: "text",
        required: true,
        autoFill: 'warehouseName',
        placeholder: "Ex: Armazém Central São Paulo"
      },
      {
        name: "location",
        label: "Localização",
        type: "text",
        required: true,
        autoFill: 'location',
        placeholder: "Ex: Av. das Nações, 1000 - Guarulhos, SP"
      },
      {
        name: "coordinates",
        label: "Coordenadas do Armazém",
        type: "group",
        required: false,
        fields: [
          {
            name: "lat",
            label: "Latitude",
            type: "number",
            step: "any",
            autoFill: 'coordinates.lat',
            placeholder: "Ex: -23.4255"
          },
          {
            name: "lng",
            label: "Longitude",
            type: "number",
            step: "any",
            autoFill: 'coordinates.lng',
            placeholder: "Ex: -46.4784"
          }
        ]
      },
      {
        name: "storageCapacity",
        label: "Capacidade de Armazenagem (kg/ton)",
        type: "text",
        required: false,
        autoFill: 'storageCapacity',
        placeholder: "Ex: 50 toneladas"
      },
      {
        name: "entryDate",
        label: "Data de Entrada",
        type: "date",
        required: true
      },
      {
        name: "storageLocation",
        label: "Localização no Armazém",
        type: "text",
        placeholder: "Ex: Pallet A-12, Corredor 3",
        required: true
      },
      {
        name: "humidityPercent",
        label: "Umidade do Ar (%)",
        type: "number",
        step: "0.1",
        placeholder: "Ex: 60.2"
      },
      {
        name: "temperatureC",
        label: "Temperatura (°C)",
        type: "number",
        step: "0.1",
        placeholder: "Ex: 20.0"
      },
      {
        name: "pestControlCheck",
        label: "Verificação de Pragas",
        type: "select",
        autoFill: 'pestControl', // Auto-fill from profile's pestControl
        options: [
          { value: "ok", label: "OK" },
          { value: "minor_issue", label: "Pequeno Problema" },
          { value: "major_issue", label: "Problema Grave" },
        ]
      },
      {
        name: "storageType",
        label: "Tipo de Armazenamento",
        type: "select",
        required: false,
        autoFill: 'storageType',
        options: [
          { value: "silo", label: "Silo" },
          { value: "big_bag", label: "Big Bag" },
          { value: "jute_bag", label: "Saco de Juta" },
          { value: "grain_pro", label: "Grain Pro" },
          { value: "vacuum", label: "Vácuo" }
        ]
      },
      {
        name: "warehouseNotes",
        label: "Observações do Armazém",
        type: "textarea",
        placeholder: "Ex: Lotes inspecionados, embalagens verificadas, condições especiais de armazenamento..."
      }
    ]
  },
  
    grader: {
      title: "🔍 Classificação",
      description: "Análise técnica e sensorial do café",
      icon: "🔍",
      fields: [
        {
          name: "evaluatorName",
          label: "Nome do Classificador",
          type: "text",
          placeholder: "Ex: Maria Santos - Q-Grader",
          required: true
        },
        
      ]
    },
  
    roaster: {
      title: "🔥 Torra",
      description: "Registro do processo de torrefação",
      icon: "🔥",
      fields: [
        {
          name: "roasteryName",
          label: "Nome da Torrefação",
          type: "text",
          placeholder: "Ex: Torrefação Arte & Sabor",
          required: true
        },
        {
          name: "roasteryLocation",
          label: "Localização da Torrefação",
          type: "group",
          fields: [
            {
              name: "lat",
              label: "Latitude",
              type: "number", 
              step: "any",
              placeholder: "Ex: -23.5505",
              required: true
            },
            {
              name: "lng",
              label: "Longitude",
              type: "number",
              step: "any", 
              placeholder: "Ex: -46.6333",
              required: true
            }
          ]
        },
       
      ]
    },
  
    packager: {
      "title": "📦 Embalagem",
      "description": "Detalhes sobre o acondicionamento do café, garantindo frescor e qualidade até o consumidor final.",
      "icon": "📦",
      "fields": [
      
        {
          "name": "packagingCompany",
          "label": "Empresa de Embalagem",
          "type": "text",
          "placeholder": "Ex: Embalagens Café Premium Ltda.",
          "required": true
        },
       
        
       
        
       
      
      ]
    },
  
      distributor: 
      {
        "title": "🚛 Distribuição e Venda",
        "description": "Etapa final de logística que leva o café do torrador ao ponto de venda ou consumidor final.",
        "icon": "🚛",
        "fields": [
          
          {
            "name": "distributorName",
            "label": "Nome da Empresa de Logística/Distribuidora",
            "type": "text",
            "placeholder": "Ex: Distribuidora Café Brasil Ltda.",
            "required": true
          },
         
        
          
        ]
      },
  
    
    end_consumer: {
      title: "Barista & Final Preparation",
      description: "Record the brewing parameters and sensory experience",
      icon: "💡",
      fields: [
       
        {
          name: "baristaName",
          label: "Barista or Cafeteria Name",
          type: "text",
          placeholder: "e.g., Jane Doe at The Daily Grind",
          required: true
        }
       
      ]
    },
  
    sustainability: {
      title: "🌿 Sustainability & Social Impact",
      description: "Environmental and social practices of the batch",
      icon: "🌿",
      fields: [
        {
          name: "certifications",
          label: "Sustainability Certifications",
          type: "multiselect",
          options: [
            { value: "carbon_neutral", label: "Carbon Neutral" },
            { value: "b_corp", label: "B Corp" },
            { value: "rainforest_alliance", label: "Rainforest Alliance" },
            { value: "fair_trade", label: "Fair Trade" },
            { value: "organic", label: "Organic" },
            { value: "bird_friendly", label: "Bird Friendly" }
          ]
        },
       
        {
          name: "waterManagement",
          label: "Water Management",
          type: "select",
          placeholder: "Select the primary water practice...",
          options: [
            { value: "low_consumption", label: "Low Consumption (Natural/Honey Process)" },
            { value: "recirculation_system", label: "Recirculation/Reuse System" },
            { value: "efficient_irrigation", label: "Efficient Irrigation" },
            { value: "standard_washed", label: "Standard Washed Process" }
          ]
        },
        {
            name: "biodiversityPractices",
            label: "Biodiversity Practices",
            type: "multiselect",
            options: [
              { value: "shade_grown", label: "Shade-Grown" },
              { value: "native_species_corridors", label: "Native Species Corridors" },
              { value: "reforestation_projects", label: "Reforestation Projects" },
              { value: "organic_soil_management", label: "Organic Soil Management" },
              { value: "wildlife_protection", label: "Wildlife Protection Areas" }
            ]
        },
        {
            name: "renewableEnergyPractices",
            label: "Renewable Energy Usage",
            type: "multiselect",
            options: [
                { value: "solar_processing", label: "Solar (Processing)" },
                { value: "solar_roasting", label: "Solar (Roasting)" },
                { value: "biofuel_transport", label: "Biofuel (Transport)" },
                { value: "biomass_energy", label: "Biomass Energy" }
            ]
        },
        {
          name: "socialImpact",
          label: "Social Impact Initiatives",
          type: "textarea",
          placeholder: "Describe community projects, fair labor conditions, worker benefits, etc."
        }
      ]
    },
    beneficiamento: {
      "title": "Beneficiamento / Dry Mill",
      "description": "Etapa de processamento do café cereja ou pergaminho, onde ele é limpo, classificado e preparado para o próximo passo na cadeia.",
      "icon": "⚙️",
      "fields": [
        // Dados de Entrada/Saída
        {
          "name": "millingFacilityName",
          "label": "Nome da Unidade de Beneficiamento",
          "type": "text",
          "required": true,
          "placeholder": "Ex: Beneficiamento Serra Azul"
        },
       
    
    
       
      ]
    },
  
  };
  
export const roles = [
  { value: 'producer', label: '🌱 Produtor' },
  { value: 'logistics', label: '🚚 Logística' },
  { value: 'warehouse', label: '🏭 Armazém' }, // Added warehouse role
  { value: 'grader', label: '🔍 Classificador' },
  { value: 'roaster', label: '🔥 Torrefador' },
  { value: 'packager', label: '📦 Embalador' },
  { value: 'distributor', label: '🚛 Distribuidor' },
  { value: 'end_consumer', label: '💡 Consumidor Final / Barista' },
  { value: 'sustainability', label: '🌿 Sustentabilidade' },
  { value: 'beneficiamento', label: '⚙️ Beneficiamento' }
];

export type FieldType = 'text' | 'number' | 'date' | 'textarea' | 'select' | 'multiselect' | 'group' | 'datetime-local' | 'file'; // Added 'file'

export interface FieldOption {
  value: string;
  label: string;
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  step?: string; // For number inputs
  min?: number; // For number inputs
  max?: number; // For number inputs
  options?: FieldOption[]; // For select and multiselect
  description?: string; // For groups
  fields?: FormField[]; // For groups
  autoFill?: string; // New property for auto-filling from enterprise profile
}

export interface PartnerProfileSchema {
  title: string;
  description: string;
  icon: string;
  fields: FormField[];
}

export type PartnerRoleKey = keyof typeof PARTNER_PROFILES;

// New constant for dynamic stage event schemas
export const STAGE_EVENT_SCHEMAS: { [key in PartnerRoleKey]?: PartnerProfileSchema } = {
  producer: {
    title: "Registro de Colheita",
    description: "Detalhes da colheita e preparação inicial do lote.",
    icon: "🌱",
    fields: [
      {
        name: "farmName",
        label: "Nome da Fazenda",
        type: "text",
        required: true,
        autoFill: 'farmName',
        placeholder: "Ex: Fazenda Santa Maria"
      },
      {
        name: "address",
        label: "Endereço Completo",
        type: "text",
        required: true,
        autoFill: 'address',
        placeholder: "Ex: Rodovia MG-010, Km 45, Monte Verde-MG"
      },
      {
        name: "coordinates",
        label: "Coordenadas Geográficas",
        type: "group",
        description: "Coordenadas para mapeamento da localização exata",
        required: false,
        fields: [
          {
            name: "lat",
            label: "Latitude",
            type: "number",
            step: "any",
            autoFill: 'coordinates.lat',
            placeholder: "Ex: -22.9201"
          },
          {
            name: "lng", 
            label: "Longitude",
            type: "number",
            step: "any",
            autoFill: 'coordinates.lng',
            placeholder: "Ex: -46.7652"
          }
        ]
      },
      {
        name: "altitude",
        label: "Altitude (metros acima do nível do mar)",
        type: "number",
        required: false,
        autoFill: 'altitude',
        placeholder: "Ex: 1200"
      },
      {
        name: "plantingDate",
        label: "Data do Plantio",
        type: "date",
        required: false
      },
      {
        name: "variety",
        label: "Variedade do Café",
        type: "select",
        required: true,
        options: [
          { value: "arabica", label: "Arábica" },
          { value: "bourbon", label: "Bourbon" },
          { value: "catuai", label: "Catuaí" },
          { value: "mundo_novo", label: "Mundo Novo" },
          { value: "caturra", label: "Caturra" },
          { value: "typica", label: "Typica" },
          { value: "robusta", label: "Robusta" },
          { value: "catucai_amarelo", label: "Catucaí Amarelo" }
        ]
      },
      {
        name: "cropYear",
        label: "Safra/Ano da Colheita",
        type: "text",
        required: true,
        placeholder: "Ex: 2025/26"
      },
      {
        name: "harvestDate",
        label: "Data da Colheita",
        type: "date",
        required: true
      },
      {
        name: "cropClimate",
        label: "Condições Climáticas na Safra",
        type: "textarea",
        required: false,
        placeholder: "Ex: Seca e temperaturas elevadas em fevereiro, seguidas de chuvas irregulares"
      },
      {
        name: "shadeConsortium",
        label: "Sombra / Consórcio Agrícola",
        type: "textarea",
        required: false,
        autoFill: 'shadeConsortium',
        placeholder: "Ex: Cultivado com árvores nativas e bananeiras para sombreamento"
      },
      {
        name: "producerStory",
        label: "História da Fazenda / Produtor",
        type: "textarea",
        autoFill: "producerStory" ,
        required: false,
        placeholder: "Ex: Fazenda familiar há 3 gerações, dedicada à produção cafeeira desde 1882"
      },
      {
        name: "harvestMethod",
        label: "Método de Colheita",
        type: "select",
        required: true,
        options: [
          { value: "manual", label: "Manual (Derriça)" },
          { value: "selective", label: "Seletiva" },
          { value: "mechanical", label: "Mecanizada" }
        ]
      },
      {
        name: "processingMethod",
        label: "Método de Processamento",
        type: "select",
        required: true,
        options: [
          { value: "natural", label: "Natural" },
          { value: "washed", label: "Lavado" },
          { value: "honey", label: "Honey" },
          { value: "semi-washed", label: "Semi-lavado" },
          { value: "anaerobic", label: "Anaeróbico" },
          { value: "carbonic_maceration", label: "Maceração Carbônica" }
        ]
      },
      {
        name: "beanDensity",
        label: "Densidade do Grão (g/L)",
        type: "number",
        required: false,
        placeholder: "Ex: 680"
      },
      {
        name: "moistureContent",
        label: "Teor de Umidade (%)",
        type: "number",
        required: false,
        step: "0.1",
        placeholder: "Ex: 11.5"
      },
      {
        name: "qualityScore",
        label: "Nota de Qualidade Inicial (0-100)",
        type: "number",
        required: false,
        min: 0,
        max: 100,
        placeholder: "Ex: 85"
      },
      {
        name: "certifications",
        label: "Certificações",
        type: "multiselect",
        required: false,
        autoFill: 'certifications',
        options: [
          { value: "organic", label: "Orgânico" },
          { value: "fair_trade", label: "Fair Trade" },
          { value: "rainforest", label: "Rainforest Alliance" },
          { value: "utz", label: "UTZ Certified" },
          { value: "bird_friendly", label: "Bird Friendly" },
          { value: "global_gap", label: "Global G.A.P." },
          { value: "brasil_sustentavel", label: "Brasil Sustentável" }
        ]
      },
      {
        name: "producerNotes",
        label: "Observações do Produtor",
        type: "textarea",
        required: false,
        placeholder: "Condições climáticas, técnicas de cultivo, desafios específicos, características especiais do terreno..."
      },
      {
        name: "estimatedVolume",
        label: "Volume Produzido (kg)",
        type: "number",
        required: true,
        min: 1,
        step: "0.1",
        placeholder: "Ex: 1500.5"
      },
      {
        name: "soilType",
        label: "Tipo de Solo",
        type: "select",
        required: false,
        options: [
          { value: "clay", label: "Argiloso" },
          { value: "sandy", label: "Arenoso" },
          { value: "clay_sandy", label: "Argilo-Arenoso" },
          { value: "limestone", label: "Calcário" },
          { value: "volcanic", label: "Vulcânico" },
          { value: "laterite", label: "Laterítico" }
        ]
      }
    ]
  },
  logistics: {
    title: "Registro de Transporte",
    description: "Informações sobre a coleta e condições de transporte.",
    icon: "🚚",
    fields: [
      {
        name: "transportCertifications",
        label: "Certificações de Transporte",
        type: "multiselect",
        autoFill: "transportCertifications" ,
        options: [
          { value: "organic_certified", label: "Transporte Orgânico Certificado" },
          { value: "sustainable", label: "Transporte Sustentável" },
          { value: "carbon_neutral", label: "Carbono Neutro" }
        ]
      },
      {
        name: "origin",
        label: "Local de Origem", 
        autoFill: "origin" ,
        type: "text",
        placeholder: "Ex: Fazenda Santa Maria, Monte Verde-MG"
      },
      {
        name: "originCoordinates",
        label: "Coordenadas de Origem",
        type: "group",
        fields: [
          {
            name: "lat",
            label: "Latitude",
           
            type: "number",
            step: "any",
            placeholder: "Ex: -22.9201"
          },
          {
            name: "lng",
            label: "Longitude",
        
            step: "any",
            placeholder: "Ex: -46.7652"
          }
        ]
      },
      {
        name: "destination",
        label: "Local de Destino",
        autoFill: "destination" ,
        type: "text",
        placeholder: "Ex: Armazém Central, São Paulo-SP"
      },
      {
        name: "destinationCoordinates",
        label: "Coordenadas de Destino",
        type: "group", 
        fields: [
          {
            name: "lat",
            label: "Latitude",
        
            type: "number",
            step: "any",
            placeholder: "Ex: -23.5505"
          },
          {
            name: "lng",
            label: "Longitude",
      
            type: "number", 
            step: "any",
            placeholder: "Ex: -46.6333"
          }
        ]
      },
      {
        name: "startTime",
        label: "Data e Hora de Partida",
        type: "datetime-local"
      },
      {
        name: "endTime", 
        label: "Data e Hora de Chegada",
        type: "datetime-local"
      },
      {
        name: "vehicleType",
        label: "Tipo de Veículo",
        autoFill: "vehicleType" ,
        type: "select",
        options: [
          { value: "truck_refrigerated", label: "Caminhão Refrigerado" },
          { value: "truck_dry", label: "Caminhão Seco" },
          { value: "van", label: "Van" }, 
          { value: "container_ship", label: "Navio Container" },
          { value: "air_cargo", label: "Avião de Carga" }
        ]
      },
      {
        name: "vehiclePlate",
        label: "Placa do Veículo",
        autoFill: "vehiclePlate" ,
        type: "text",
        placeholder: "Ex: ABC1D23"
      },
      {
        name: "driverName",
        label: "Nome do Motorista",
        autoFill: "driverName" ,
        type: "text",
        placeholder: "Ex: João Silva"
      },
      {
        name: "temperatureControl",
        label: "Temperatura Controlada (°C)",
        type: "number",
        placeholder: "Ex: 18"
      },
      {
        name: "humidityControl",
        label: "Umidade Controlada (%)",
        type: "number",
        placeholder: "Ex: 60"
      },
      {
        name: "distance",
        label: "Distância Percorrida (km)",
        type: "number",
        placeholder: "Ex: 350"
      },
      {
        name: "transportConditions",
        label: "Condições do Transporte",
        type: "textarea",
        placeholder: "Ex: Transporte hermético, sem umidade, protegido de luz solar direta, vibração mínima, condições de estrada..."
      },
      {
        name: "incidents",
        label: "Incidentes ou Observações",
        type: "textarea",
        placeholder: "Ex: Atraso por chuva, inspeção na estrada, condições especiais..."
      }
    ]
  },
  warehouse: {
    title: "Registro de Armazenagem",
    description: "Detalhes da entrada e condições de estocagem no armazém.",
    icon: "🏭",
    fields: [
      {
        name: "warehouseName",
        label: "Nome do Armazém",
        type: "text",
        required: true,
        autoFill: 'warehouseName',
        placeholder: "Ex: Armazém Central São Paulo"
      },
      {
        name: "location",
        label: "Localização",
        type: "text",
        required: true,
        autoFill: 'location',
        placeholder: "Ex: Av. das Nações, 1000 - Guarulhos, SP"
      },
      {
        name: "coordinates",
        label: "Coordenadas do Armazém",
        type: "group",
        required: false,
        fields: [
          {
            name: "lat",
            label: "Latitude",
            type: "number",
            step: "any",
            autoFill: 'coordinates.lat',
            placeholder: "Ex: -23.4255"
          },
          {
            name: "lng",
            label: "Longitude",
            type: "number",
            step: "any",
            autoFill: 'coordinates.lng',
            placeholder: "Ex: -46.4784"
          }
        ]
      },
      {
        name: "storageCapacity",
        label: "Capacidade de Armazenagem (kg/ton)",
        type: "text",
        required: false,
        autoFill: 'storageCapacity',
        placeholder: "Ex: 50 toneladas"
      },
      {
        name: "entryDate",
        label: "Data de Entrada",
        type: "date",
        required: true
      },
      {
        name: "storageLocation",
        label: "Localização no Armazém",
        type: "text",
        placeholder: "Ex: Pallet A-12, Corredor 3",
        required: true
      },
      {
        name: "humidityPercent",
        label: "Umidade do Ar (%)",
        type: "number",
        step: "0.1",
        placeholder: "Ex: 60.2"
      },
      {
        name: "temperatureC",
        label: "Temperatura (°C)",
        type: "number",
        step: "0.1",
        placeholder: "Ex: 20.0"
      },
      {
        name: "pestControlCheck",
        label: "Verificação de Pragas",
        type: "select",
        autoFill: 'pestControl', // Auto-fill from profile's pestControl
        options: [
          { value: "ok", label: "OK" },
          { value: "minor_issue", label: "Pequeno Problema" },
          { value: "major_issue", label: "Problema Grave" },
        ]
      },
      {
        name: "storageType",
        label: "Tipo de Armazenamento",
        type: "select",
        required: false,
        autoFill: 'storageType',
        options: [
          { value: "silo", label: "Silo" },
          { value: "big_bag", label: "Big Bag" },
          { value: "jute_bag", label: "Saco de Juta" },
          { value: "grain_pro", label: "Grain Pro" },
          { value: "vacuum", label: "Vácuo" }
        ]
      },
      {
        name: "warehouseNotes",
        label: "Observações do Armazém",
        type: "textarea",
        placeholder: "Ex: Lotes inspecionados, embalagens verificadas, condições especiais de armazenamento..."
      }
    ]
  },
  
    grader: {
      title: "Registro de Classificação",
      description: "Resultados da análise técnica e sensorial do café.",
      icon: "🔍",
      fields: [
        {
          name: "evaluatorName",
          label: "Nome do Classificador",
          type: "text",
          placeholder: "Ex: Maria Santos - Q-Grader",
          required: true
        },
        
      ]
    },
  
    roaster: {
      title: "🔥 Torra",
      description: "Registro do processo de torrefação",
      icon: "🔥",
      fields: [
        {
          name: "roasteryName",
          label: "Nome da Torrefação",
          type: "text",
          placeholder: "Ex: Torrefação Arte & Sabor",
          required: true
        },
        {
          name: "roasteryLocation",
          label: "Localização da Torrefação",
          type: "group",
          fields: [
            {
              name: "lat",
              label: "Latitude",
              type: "number", 
              step: "any",
              placeholder: "Ex: -23.5505",
              required: true
            },
            {
              name: "lng",
              label: "Longitude",
              type: "number",
              step: "any", 
              placeholder: "Ex: -46.6333",
              required: true
            }
          ]
        },
       
      ]
    },
  
    packager: {
      "title": "📦 Embalagem",
      "description": "Detalhes sobre o acondicionamento do café, garantindo frescor e qualidade até o consumidor final.",
      "icon": "📦",
      "fields": [
      
        {
          "name": "packagingCompany",
          "label": "Empresa de Embalagem",
          "type": "text",
          "placeholder": "Ex: Embalagens Café Premium Ltda.",
          "required": true
        },
       
        
       
        
       
      
      ]
    },
  
      distributor: 
      {
        "title": "🚛 Distribuição e Venda",
        "description": "Etapa final de logística que leva o café do torrador ao ponto de venda ou consumidor final.",
        "icon": "🚛",
        "fields": [
          
          {
            "name": "distributorName",
            "label": "Nome da Empresa de Logística/Distribuidora",
            "type": "text",
            "placeholder": "Ex: Distribuidora Café Brasil Ltda.",
            "required": true
          },
         
        
          
        ]
      },
  
    
    end_consumer: {
      title: "Barista & Final Preparation",
      description: "Record the brewing parameters and sensory experience",
      icon: "💡",
      fields: [
       
        {
          name: "baristaName",
          label: "Barista or Cafeteria Name",
          type: "text",
          placeholder: "e.g., Jane Doe at The Daily Grind",
          required: true
        }
       
      ]
    },
  
    sustainability: {
      title: "🌿 Sustainability & Social Impact",
      description: "Environmental and social practices of the batch",
      icon: "🌿",
      fields: [
        {
          name: "certifications",
          label: "Sustainability Certifications",
          type: "multiselect",
          options: [
            { value: "carbon_neutral", label: "Carbon Neutral" },
            { value: "b_corp", label: "B Corp" },
            { value: "rainforest_alliance", label: "Rainforest Alliance" },
            { value: "fair_trade", label: "Fair Trade" },
            { value: "organic", label: "Organic" },
            { value: "bird_friendly", label: "Bird Friendly" }
          ]
        },
       
        {
          name: "waterManagement",
          label: "Water Management",
          type: "select",
          placeholder: "Select the primary water practice...",
          options: [
            { value: "low_consumption", label: "Low Consumption (Natural/Honey Process)" },
            { value: "recirculation_system", label: "Recirculation/Reuse System" },
            { value: "efficient_irrigation", label: "Efficient Irrigation" },
            { value: "standard_washed", label: "Standard Washed Process" }
          ]
        },
        {
            name: "biodiversityPractices",
            label: "Biodiversity Practices",
            type: "multiselect",
            options: [
              { value: "shade_grown", label: "Shade-Grown" },
              { value: "native_species_corridors", label: "Native Species Corridors" },
              { value: "reforestation_projects", label: "Reforestation Projects" },
              { value: "organic_soil_management", label: "Organic Soil Management" },
              { value: "wildlife_protection", label: "Wildlife Protection Areas" }
            ]
        },
        {
            name: "renewableEnergyPractices",
            label: "Renewable Energy Usage",
            type: "multiselect",
            options: [
                { value: "solar_processing", label: "Solar (Processing)" },
                { value: "solar_roasting", label: "Solar (Roasting)" },
                { value: "biofuel_transport", label: "Biofuel (Transport)" },
                { value: "biomass_energy", label: "Biomass Energy" }
            ]
        },
        {
          name: "socialImpact",
          label: "Social Impact Initiatives",
          type: "textarea",
          placeholder: "Describe community projects, fair labor conditions, worker benefits, etc."
        }
      ]
    },
    beneficiamento: {
      "title": "Beneficiamento / Dry Mill",
      "description": "Etapa de processamento do café cereja ou pergaminho, onde ele é limpo, classificado e preparado para o próximo passo na cadeia.",
      "icon": "⚙️",
      "fields": [
        // Dados de Entrada/Saída
        {
          "name": "millingFacilityName",
          "label": "Nome da Unidade de Beneficiamento",
          "type": "text",
          "required": true,
          "placeholder": "Ex: Beneficiamento Serra Azul"
        },
       
    
    
       
      ]
    },
  
  };