import { PartnerProfileSchema } from '@/types/forms';

export const roasterStageSchema: PartnerProfileSchema = {
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
};