import { PartnerProfileSchema } from '@/types/forms';

export const graderStageSchema: PartnerProfileSchema = {
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
};