import { PartnerProfileSchema, PartnerRoleKey } from '@/types/forms';

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
        name: "batchPhotos",
        label: "Fotos do Lote / Bag",
        type: "file",
        description: "Fotos para storytelling e documentação visual"
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
      "title": "Registro de Embalagem",
      "description": "Detalhes do acondicionamento do café torrado.",
      "icon": "📦",
      "fields": [
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
  
      distributor: 
      {
        "title": "Registro de Distribuição",
        "description": "Informações sobre a entrega do café embalado.",
        "icon": "🚛",
        "fields": [
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
      title: "Registro de Sustentabilidade",
      description: "Práticas ambientais e sociais aplicadas ao lote.",
      icon: "🌿",
      fields: [
        { name: "auditDate", label: "Data da Auditoria/Registro", type: "date", required: true },
        { name: "auditorName", label: "Auditor/Responsável", type: "text", placeholder: "Ex: Instituto Verde Brasil" },
        {
          name: "certifications",
          label: "Certificações Aplicadas ao Lote",
          autoFill: "certifications",
          type: "multiselect",
          options: [
            { value: "carbon_neutral", label: "Carbono Neutro" },
            { value: "b_corp", label: "B Corp" },
            { value: "rainforest_alliance", label: "Rainforest Alliance" },
            { value: "fair_trade", label: "Fair Trade" },
            { value: "organic", label: "Orgânico" },
            { value: "bird_friendly", label: "Bird Friendly" }
          ]
        },
        {
          name: "carbonFootprint",
          label: "Pegada de Carbono do Lote (kg CO₂ per kg)",
          type: "number",
          placeholder: "Ex: 2.5"
        },
        {
          name: "waterManagement",
          label: "Gestão de Água no Lote",
          autoFill: "waterManagement",
          type: "select",
          placeholder: "Selecione a prática principal...",
          options: [
            { value: "low_consumption", label: "Baixo Consumo (Processo Natural/Honey)" },
            { value: "recirculation_system", label: "Sistema de Recirculação/Reuso" },
            { value: "efficient_irrigation", label: "Irrigação Eficiente" },
            { value: "standard_washed", label: "Processo Lavado Padrão" }
          ]
        },
        {
          name: "biodiversityPractices",
          label: "Práticas de Biodiversidade no Lote",
          autoFill: "biodiversityPractices",
          type: "multiselect",
          options: [
            { value: "shade_grown", label: "Cultivo Sombreado" },
            { value: "native_species_corridors", label: "Corredores de Espécies Nativas" },
            { value: "reforestation_projects", label: "Projetos de Reflorestamento" },
            { value: "organic_soil_management", label: "Manejo Orgânico do Solo" },
            { value: "wildlife_protection", label: "Áreas de Proteção da Vida Selvagem" }
          ]
        },
        {
          name: "renewableEnergyPractices",
          label: "Uso de Energia Renovável no Lote",
          autoFill: "renewableEnergyPractices",
          type: "multiselect",
          options: [
            { value: "solar_processing", label: "Solar (Processamento)" },
            { value: "solar_roasting", label: "Solar (Torra)" },
            { value: "biofuel_transport", label: "Biocombustível (Transporte)" },
            { value: "biomass_energy", label: "Energia de Biomassa" }
          ]
        },
        {
          name: "socialImpactNotes",
          label: "Notas de Impacto Social do Lote",
          autoFill: "socialImpact",
          type: "textarea",
          placeholder: "Descreva projetos comunitários, condições de trabalho, etc., específicos para este lote."
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
            { "value": "15/16", label": "Peneira 15/16" },
            { "value": "14/15", label": "Peneira 14/15" }
          ]
        },
        {
          "name": "defectTypes",
          "label": "Principais Defeitos Encontrados",
          "description": "Tipos de grãos defeituosos que afetam a qualidade do lote.",
          "type": "multiselect",
          "options": [
            { "value": "black", "label": "Pretos" },
            { "value": "sour", "label": "Verdes / Ardidos" },
            { "value": "broken", "label": "Quebrados" },
            { "value": "insect_damage", "label": "Dano por Inseto" },
            { "value": "immature", "label": "Imaturos" },
            { "value": "foreign_material", label": "Material Estranho" }
          ]
        },
        {
          "name": "storageType",
          "label": "Tipo de Embalagem para Armazenamento",
          "type": "select",
          "required": true,
          "options": [
            { "value": "jute_bag", "label": "Saco de Juta Tradicional" },
            { "value": "grain_pro", "label": "Saco Hermético (GrainPro)" },
            { "value": "big_bag", "label": "Big Bag (a granel)" },
            { "value": "other", "label": "Outro" }
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