import { PartnerProfileSchema } from '@/types/forms';

export const endConsumerStageSchema: PartnerProfileSchema = {
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
};