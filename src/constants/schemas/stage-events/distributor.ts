import { PartnerProfileSchema } from '@/types/forms';

export const distributorStageSchema: PartnerProfileSchema = {
  title: "Registro de Distribuição",
  description: "Informações sobre a entrega do café embalado.",
  icon: "🚛",
  fields: [
    // Identificação e Dados Gerais
    {
      "name": "distributorName",
      "label": "Nome da Empresa de Logística/Distribuidora",
      "type": "text",
      autoFill: "distributorName" ,
      "placeholder": "Ex: Distribuidora Café Brasil Ltda.",
      "required": true
    },
    {
      "name": "distributionDate",
      "label": "Data do Envio",
      "type": "date",
      "required": true
    },
    {
      "name": "transportMode",
      "label": "Modo de Transporte",
      "type": "select",
      "options": [
        { "value": "ground", "label": "Terrestre (Caminhão)" },
        { "value": "air", "label": "Aéreo" },
        { "value": "sea", "label": "Marítimo" },
        { "value": "other", "label": "Outro" }
      ]
    },
    // Detalhes da Venda
    {
      "name": "destinationAddress",
      "label": "Endereço de Destino",
      "type": "group",
      "description": "Local de entrega do lote.",
      "fields": [
        {
          "name": "street",
          "label": "Rua e Número",
          "type": "text",
          "placeholder": "Ex: Rua das Flores, 123"
        },
        {
          "name": "city",
          "label": "Cidade",
          "type": "text",
          "placeholder": "Ex: São Paulo"
        },
        {
          "name": "state",
          "label": "Estado/Província",
          "type": "text",
          "placeholder": "Ex: SP"
        },
        {
          "name": "country",
          "label": "País",
          "type": "text",
          "placeholder": "Ex: Brasil"
        }
      ]
    },
    {
      "name": "salesChannel",
      "label": "Canal de Venda",
      "description": "Onde o consumidor irá encontrar o produto.",
      "type": "multiselect",
      "options": [
        { "value": "e-commerce", "label": "E-commerce" },
        { "value": "specialty_coffee_shop", "label": "Cafeteria Especializada" },
        { "value": "retail_store", "label": "Loja de Varejo" },
        { "value": "supermarket", "label": "Supermercado" },
        { "value": "horeca", "label": "HORECA (Hotéis, Restaurantes e Cafés)" }
      ]
    },
    {
      "name": "clientType",
      "label": "Tipo de Cliente (se aplicável)",
      "type": "select",
      "options": [
        { "value": "cafe", "label": "Cafeteria" },
        { "value": "roaster", "label": "Torrefação" },
        { "value": "wholesaler", "label": "Atacadista" },
        { "value": "retailer", "label": "Varejista" },
        { "value": "final_consumer", "label": "Consumidor Final" }
      ]
    },
    // Rastreabilidade e Notas
    {
      "name": "distributionNotes",
      "label": "Observações sobre a Distribuição",
      "type": "textarea",
      "placeholder": "Ex: Lote enviado em paletes selados. Entregue com temperatura controlada."
    }
  ]
};