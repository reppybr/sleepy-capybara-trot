import { PartnerProfileSchema } from '@/types/forms';

export const graderStageSchema: PartnerProfileSchema = {
  title: "🔍 Classificação",
  description: "Análise técnica e sensorial do café",
  icon: "🔍",
  fields: [
    {
      name: "evaluatorName",
      autoFill: "evaluatorName" ,
      label: "Nome do Classificador",
      type: "text",
      placeholder: "Ex: Maria Santos - Q-Grader"
    },
    {
      name: "evaluationDate",
      label: "Data da Avaliação", 
      type: "date"
    },
    {
      name: "sensoryNotes",
      label: "Notas Sensoriais Detalhadas (SCA)",
      type: "textarea",
      placeholder: "Ex: Formulário SCA completo com fragrância, sabor, aftertaste, acidez, corpo, balance, uniformidade, xícara limpa, doçura, geral"
    },
    {
      name: "cupsNumber",
      label: "Número de Xícaras no Cupping",
      type: "number",
      placeholder: "Ex: 5"
    },
    {
      name: "officialReport",
      label: "Laudo Oficial (Imagem/Upload)",
      type: "file",
      description: "Upload do laudo oficial de classificação"
    },
    {
      name: "scaScore",
      label: "Pontuação SCA (0-100)",
      type: "number",
      min: 0,
      max: 100,
      step: 0.25,
      placeholder: "Ex: 85.5"
    },
    {
      name: "defectPercentage",
      label: "Percentual de Defeitos (%)",
      type: "number", 
      step: 0.1,
      placeholder: "Ex: 3.2"
    },
    {
      name: "screenSize",
      label: "Peneira",
      type: "select",
      options: [
        { value: "18+", label: "18 acima" },
        { value: "17", label: "17" },
        { value: "16", label: "16" },
        { value: "15", label: "15" },
        { value: "14", label: "14" },
        { value: "13-", label: "13 abaixo" }
      ]
    },
    {
      name: "moistureContent",
      label: "Teor de Umidade (%)",
      type: "number",
      step: 0.1,
      placeholder: "Ex: 11.2"
    },
    {
      name: "waterActivity",
      label: "Atividade de Água (Aw)",
      type: "number",
      step: 0.01,
      placeholder: "Ex: 0.58"
    },
    {
      name: "beanDensity",
      label: "Densidade do Grão (g/L)",
      type: "number",
      placeholder: "Ex: 720"
    },
    {
      name: "aroma",
      label: "Aroma",
      type: "select",
      options: [
        { value: "floral", label: "Floral" },
        { value: "fruity", label: "Frutado" },
        { value: "nutty", label: "Avelã/Nozes" },
        { value: "chocolate", label: "Chocolate" },
        { value: "caramel", label: "Caramelo" },
        { value: "spicy", label: "Especiarias" },
        { value: "herbal", label: "Herbal" }
      ]
    },
    {
      name: "flavor",
      label: "Sabor",
      type: "text",
      placeholder: "Ex: Frutas vermelhas, chocolate amargo, caramelo"
    },
    {
      name: "body",
      label: "Corpo",
      type: "select", 
      options: [
        { value: "light", label: "Leve" },
        { value: "medium", label: "Médio" },
        { value: "heavy", label: "Encorpado" },
        { value: "creamy", label: "Cremoso" }
      ]
    },
    {
      name: "acidity",
      label: "Acidez",
      type: "select",
      options: [
        { value: "low", label: "Baixa" },
        { value: "medium", label: "Média" },
        { value: "high", label: "Alta" },
        { value: "bright", label: "Brilhante" },
        { value: "citric", label: "Cítrica" },
        { value: "malic", label: "Málica" }
      ]
    },
    {
      name: "aftertaste",
      label: "Finalização",
      type: "text",
      placeholder: "Ex: Persistente, limpa, adocicada, duradoura"
    },
    {
      name: "balance",
      label: "Equilíbrio",
      type: "select",
      options: [
        { value: "excellent", label: "Excelente" },
        { value: "good", label: "Bom" },
        { value: "regular", label: "Regular" },
        { value: "poor", label: "Ruim" }
      ]
    },
    {
      name: "qualityNotes",
      label: "Observações de Qualidade",
      type: "textarea", 
      placeholder: "Defeitos identificados, uniformidade, potencial de torra, características especiais..."
    }
  ]
};