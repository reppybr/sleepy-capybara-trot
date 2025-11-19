import { PartnerProfileSchema } from '@/types/forms';

export const beneficiamentoStageSchema: PartnerProfileSchema = {
  title: "Beneficiamento / Dry Mill",
  description: "Etapa de processamento do café cereja ou pergaminho, onde ele é limpo, classificado e preparado para o próximo passo na cadeia.",
  icon: "⚙️",
  fields: [
    {
      name: "millingFacilityName",
      label: "Nome da Unidade de Beneficiamento",
      autoFill: "millingFacilityName" ,
      type: "text",
      required: true,
      placeholder: "Ex: Beneficiamento Serra Azul"
    },
    {
      name: "operationDate",
      label: "Data do Beneficiamento",
      type: "date",
      required: true
    },
    {
      name: "incomingWeightKg",
      label: "Peso de Entrada (kg)",
      type: "number",
      required: true,
      placeholder: "Ex: 1500"
    },
    {
      name: "finalGreenWeightKg",
      label: "Peso Final Café Verde (kg)",
      type: "number",
      required: true,
      placeholder: "Ex: 1250"
    },
    {
      name: "moistureAfterProcessing",
      label: "Umidade Final (%)",
      type: "number",
      step: 0.1,
      required: true,
      placeholder: "Ex: 11.5"
    },
    {
      name: "processingSteps",
      label: "Etapas de Classificação Executadas",
      type: "multiselect",
      options: [
        { value: "hulling", label: "Descascamento" },
        { value: "sieving", label: "Peneiramento" },
        { value: "density_separation", label: "Separação por Densidade" },
        { value: "color_sorting", label: "Classificação por Cor" }
      ]
    },
    {
      name: "mainSieveSize",
      label: "Tamanho da Peneira Principal",
      description: "Tamanho do grão que corresponde à maior parte do lote.",
      type: "select",
      options: [
        { value: "18+", label: "Peneira 18+" },
        { value: "17/18", label: "Peneira 17/18" },
        { value: "16/17", label: "Peneira 16/17" },
        { value: "15/16", label: "Peneira 15/16" },
        { value: "14/15", label: "Peneira 14/15" }
      ]
    },
    {
      name: "defectTypes",
      label: "Principais Defeitos Encontrados",
      description: "Tipos de grãos defeituosos que afetam a qualidade do lote.",
      type: "multiselect",
      options: [
        { value: "black", label: "Pretos" },
        { value: "sour", label: "Verdes / Ardidos" },
        { value: "broken", label: "Quebrados" },
        { value: "insect_damage", label: "Dano por Inseto" },
        { value: "immature", label: "Imaturos" },
        { value: "foreign_material", label: "Material Estranho" }
      ]
    },
    {
      name: "storageType",
      label: "Tipo de Embalagem para Armazenamento",
      type: "select",
      required: true,
      options: [
        { value: "jute_bag", label: "Saco de Juta Tradicional" },
        { value: "grain_pro", label: "Saco Hermético (GrainPro)" },
        { value: "big_bag", label: "Big Bag (a granel)" },
        { value: "other", label: "Outro" }
      ]
    },
    {
      name: "storageNotes",
      label: "Observações sobre Armazenamento",
      type: "textarea",
      placeholder: "Ex: Lote armazenado em ambiente com controle de umidade."
    },
    {
      name: "isMicrolot",
      label: "Este Lote é um Microlote?",
      type: "select",
      options: [{ value: "yes", label: "Sim" }, { value: "no", label: "Não" }]
    },
    {
      name: "beneficiamentoNotes",
      label: "Observações Finais sobre o Lote",
      type: "textarea",
      placeholder: "Ex: Este lote foi separado por seu perfil sensorial único. "
    }
  ]
};