import { PartnerProfileSchema } from '@/types/forms';

export const producerStageSchema: PartnerProfileSchema = {
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
};