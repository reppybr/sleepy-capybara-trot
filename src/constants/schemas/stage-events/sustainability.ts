import { PartnerProfileSchema } from '@/types/forms';

export const sustainabilityStageSchema: PartnerProfileSchema = {
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
};