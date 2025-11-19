import { PartnerProfileSchema } from '@/types/forms';

export const distributorStageSchema: PartnerProfileSchema = {
  title: "Registro de Distribuição",
  description: "Informações sobre a entrega do café embalado.",
  icon: "🚛",
  fields: [
    { name: "dispatchDate", label: "Data de Despacho", type: "date", required: true },
    { name: "deliveryDate", label: "Data de Entrega Prevista", type: "date", required: true },
    { name: "deliveryLocation", label: "Local de Entrega", type: "text", placeholder: "Ex: Cafeteria Central", required: true },
    { name: "trackingNumber", label: "Número de Rastreamento", type: "text", placeholder: "Ex: TRK123456789" },
    { name: "deliveryNotes", label: "Notas de Entrega", type: "textarea", placeholder: "Ex: Entregue ao gerente da loja." },
  ]
};