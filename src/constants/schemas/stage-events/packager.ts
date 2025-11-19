import { PartnerProfileSchema } from '@/types/forms';

export const packagerStageSchema: PartnerProfileSchema = {
  title: "Registro de Embalagem",
  description: "Detalhes do acondicionamento do café torrado.",
  icon: "📦",
  fields: [
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
};