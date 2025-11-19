import { PartnerProfileSchema, PartnerRoleKey } from '@/types/forms';

export const PARTNER_PROFILES: { [key in PartnerRoleKey]?: PartnerProfileSchema } = {
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
          name: "storageType",
          label: "Tipos de Armazenamento Oferecidos",
          type: "multiselect",
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
          label: "Umidade Relativa Média (%)",
          type: "number",
          placeholder: "Ex: 60"
        },
        {
          name: "inspectionDate",
          label: "Data da Última Inspeção da Instalação",
          autoFill: "inspectionDate" ,
          type: "date"
        },
        {
          name: "pestControl",
          label: "Política de Controle de Pragas",
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
          label: "Observações Gerais do Armazém",
          type: "textarea",
          placeholder: "Informações sobre as instalações, certificações, horários de funcionamento, etc."
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
          name: "preparationMethod",
          label: "Preparation Method",
          type: "select",
          placeholder: "Select the primary brew method...",
          options: [
            { value: "espresso", label: "Espresso" },
            { value: "v60", label: "Hario V60" },
            { value: "aeropress", label: "AeroPress" },
            { value: "french_press", label: "French Press" },
            { value: "chemex", label: "Chemex" },
            { value: "kalita_wave", label: "Kalita Wave" },
            { value: "cold_brew", label: "Cold Brew" },
            { value: "batch_brew", label: "Batch Brew (Percolator)" }
          ]
        },
        {
          name: "baristaName",
          label: "Barista or Cafeteria Name",
          autoFill: "baristaName" ,
          type: "text",
          placeholder: "e.g., Jane Doe at The Daily Grind"
        },
        {
          name: "grindSize",
          label: "Grind Size",
          type: "select",
          placeholder: "Select grind size...",
          options: [
              { value: "extra_fine", label: "Extra Fine (Turkish)" },
              { value: "fine", label: "Fine (Espresso)" },
              { value: "medium_fine", label: "Medium-Fine (V60, AeroPress)" },
              { value: "medium", label: "Medium (Drip, Chemex)" },
              { value: "medium_coarse", label: "Medium-Coarse (Chemex)" },
              { value: "coarse", label: "Coarse (French Press)" },
              { value: "extra_coarse", label: "Extra Coarse (Cold Brew)" }
          ]
        },
        {
          name: "doseIn",
          label: "Dose (grams)",
          type: "number",
          placeholder: "e.g., 18.5"
        },
        {
          name: "doseOut",
          label: "Yield (grams)",
          type: "number",
          placeholder: "e.g., 38"
        },
        {
          name: "extractionTime",
          label: "Extraction Time (seconds)",
          type: "number",
          placeholder: "e.g., 28"
        },
        {
          name: "waterTemperature",
          label: "Water Temperature (°C)",
          type: "number",
          placeholder: "e.g., 94"
        },
        {
          name: "tastingNotes",
          label: "Perceived Tasting Notes",
          type: "multiselect",
          placeholder: "Select perceived notes...",
          options: [
            { value: "floral", label: "Floral" },
            { value: "fruity", label: "Fruity" },
            { value: "citrus", label: "Citrus" },
            { value: "chocolate", label: "Chocolate" },
            { value: "caramel", label: "Caramel" },
            { value: "nutty", label: "Nutty" },
            { value: "spicy", label: "Spicy" },
            { value: "winy", label: "Winy / Alcoholic" },
            { value: "herbaceous", label: "Herbaceous" }
          ]
        },
        {
          name: "consumerFeedback",
          label: "General Notes & Consumer Feedback",
          type: "textarea",
          placeholder: "e.g., Used in the 2025 Barista Championship, customers noted high sweetness..."
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
          autoFill: "certifications" ,
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
            name: "carbonFootprint",
            label: "Carbon Footprint (kg CO₂ per kg)",
            type: "number",
            placeholder: "e.g., 2.5"
        },
        {
          name: "waterManagement",
          label: "Water Management",
          autoFill: "waterManagement" ,
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
            autoFill: "biodiversityPractices" ,
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
            autoFill: "renewableEnergyPractices" ,
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
          autoFill: "socialImpact" ,
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
        {
          "name": "millingFacilityName",
          "label": "Nome da Unidade de Beneficiamento",
          autoFill: "millingFacilityName" ,
          "type": "text",
          "required": true,
          "placeholder": "Ex: Beneficiamento Serra Azul"
        },
        {
          "name": "operationDate",
          "label": "Data do Beneficiamento",
          "type": "date",
          "required": true
        },
        {
          "name": "incomingWeightKg",
          "label": "Peso de Entrada (kg)",
          "type": "number",
          "required": true,
          "placeholder": "Ex: 1500"
        },
        {
          "name": "finalGreenWeightKg",
          "label": "Peso Final Café Verde (kg)",
          "type": "number",
          "required": true,
          "placeholder": "Ex: 1250"
        },
        {
          "name": "moistureAfterProcessing",
          "label": "Umidade Final (%)",
          "type": "number",
          "step": 0.1,
          "required": true,
          "placeholder": "Ex: 11.5"
        },
        {
          "name": "processingSteps",
          "label": "Etapas de Classificação Executadas",
          "type": "multiselect",
          "options": [
            { "value": "hulling", "label": "Descascamento" },
            { "value": "sieving", "label": "Peneiramento" },
            { "value": "density_separation", label: "Separação por Densidade" },
            { "value": "color_sorting", label: "Classificação por Cor" }
          ]
        },
        {
          "name": "mainSieveSize",
          "label": "Tamanho da Peneira Principal",
          "description": "Tamanho do grão que corresponde à maior parte do lote.",
          "type": "select",
          "options": [
            { "value": "18+", "label": "Peneira 18+" },
            { "value": "17/18", "label": "Peneira 17/18" },
            { "value": "16/17", label": "Peneira 16/17" },
            { "value": "15/16", label: "Peneira 15/16" },
            { "value": "14/15", label: "Peneira 14/15" }
          ]
        },
        {
          "name": "defectTypes",
          "label": "Principais Defeitos Encontrados",
          "description": "Tipos de grãos defeituosos que afetam a qualidade do lote.",
          "type": "multiselect",
          "options": [
            { "value": "black", label: "Pretos" },
            { "value": "sour", label: "Verdes / Ardidos" },
            { "value": "broken", label: "Quebrados" },
            { "value": "insect_damage", label: "Dano por Inseto" },
            { "value": "immature", label: "Imaturos" },
            { "value": "foreign_material", label: "Material Estranho" }
          ]
        },
        {
          "name": "storageType",
          "label": "Tipo de Embalagem para Armazenamento",
          "type": "select",
          "required": true,
          "options": [
            { "value": "jute_bag", label: "Saco de Juta Tradicional" },
            { "value": "grain_pro", label: "Saco Hermético (GrainPro)" },
            { "value": "big_bag", label: "Big Bag (a granel)" },
            { "value": "other", label: "Outro" }
          ]
        },
        {
          "name": "storageNotes",
          "label": "Observações sobre Armazenamento",
          "type": "textarea",
          "placeholder": "Ex: Lote armazenado em ambiente com controle de umidade."
        },
        {
          "name": "isMicrolot",
          "label": "Este Lote é um Microlote?",
          "type": "select",
          "options": [{ "value": "yes", "label": "Sim" }, { "value": "no", "label": "Não" }]
        },
        {
          "name": "beneficiamentoNotes",
          "label": "Observações Finais sobre o Lote",
          "type": "textarea",
          "placeholder": "Ex: Este lote foi separado por seu perfil sensorial único. "
        }
      ]
    },
  
  };