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
          type: "text",
          placeholder: "Ex: Armazém Central São Paulo",
          required: true
        },
        {
          name: "location",
          label: "Localização",
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
              type: "number",
              step: "any",
              placeholder: "Ex: -23.4255",
              required: true
            },
            {
              name: "lng",
              label: "Longitude",
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
          type: "text",
          placeholder: "Ex: 50 toneladas",
          required: true
        },
       
        {
          name: "inspectionDate",
          label: "Data da Última Inspeção",
          type: "date"
        },
        {
          name: "pestControl",
          label: "Controle de Pragas",
          type: "select",
          options: [
            { value: "none", label: "Nenhum" },
            { value: "preventive", label: "Preventivo" },
            { value: "corrective", label: "Corretivo" },
            { value: "biological", label: "Biológico" }
          ]
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
    { value: 'warehouse', label: '🏭 Armazém' },
    { value: 'grader', label: '🔍 Classificador' },
    { value: 'roaster', label: '🔥 Torrefador' },
    { value: 'packager', label: '📦 Embalador' },
    { value: 'distributor', label: '🚛 Distribuidor' },
    { value: 'end_consumer', label: '💡 Consumidor Final / Barista' },
    { value: 'sustainability', label: '🌿 Sustentabilidade' },
    { value: 'beneficiamento', label: '⚙️ Beneficiamento' }
  ];

export type FieldType = 'text' | 'number' | 'date' | 'textarea' | 'select' | 'multiselect' | 'group';

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
  options?: FieldOption[]; // For select and multiselect
  description?: string; // For groups
  fields?: FormField[]; // For groups
}

export interface PartnerProfileSchema {
  title: string;
  description: string;
  icon: string;
  fields: FormField[];
}

export type PartnerRoleKey = keyof typeof PARTNER_PROFILES;