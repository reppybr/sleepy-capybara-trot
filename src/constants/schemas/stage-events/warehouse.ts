import { PartnerProfileSchema } from '@/types/forms';

export const warehouseStageSchema: PartnerProfileSchema = {
  title: "Registro de Armazenagem",
  description: "Detalhes da entrada e condições de estocagem no armazém.",
  icon: "🏭",
  fields: [
    {
      name: "warehouseName",
      label: "Nome do Armazém",
      type: "text",
      required: true,
      autoFill: 'warehouseName',
      placeholder: "Ex: Armazém Central São Paulo"
    },
    {
      name: "location",
      label: "Localização",
      type: "text",
      required: true,
      autoFill: 'location',
      placeholder: "Ex: Av. das Nações, 1000 - Guarulhos, SP"
    },
    {
      name: "coordinates",
      label: "Coordenadas do Armazém",
      type: "group",
      required: false,
      fields: [
        {
          name: "lat",
          label: "Latitude",
          type: "number",
          step: "any",
          autoFill: 'coordinates.lat',
          placeholder: "Ex: -23.4255"
        },
        {
          name: "lng",
          label: "Longitude",
          type: "number",
          step: "any",
          autoFill: 'coordinates.lng',
          placeholder: "Ex: -46.4784"
        }
      ]
    },
    {
      name: "storageCapacity",
      label: "Capacidade de Armazenagem (kg/ton)",
      type: "text",
      required: false,
      autoFill: 'storageCapacity',
      placeholder: "Ex: 50 toneladas"
    },
    {
      name: "entryDate",
      label: "Data de Entrada",
      type: "date",
      required: true
    },
    {
      name: "storageLocation",
      label: "Localização no Armazém",
      type: "text",
      placeholder: "Ex: Pallet A-12, Corredor 3",
      required: true
    },
    {
      name: "humidityPercent",
      label: "Umidade do Ar (%)",
      type: "number",
      step: "0.1",
      placeholder: "Ex: 60.2"
    },
    {
      name: "temperatureC",
      label: "Temperatura (°C)",
      type: "number",
      step: "0.1",
      placeholder: "Ex: 20.0"
    },
    {
      name: "pestControlCheck",
      label: "Verificação de Pragas",
      type: "select",
      autoFill: 'pestControl', // Auto-fill from profile's pestControl
      options: [
        { value: "ok", label: "OK" },
        { value: "minor_issue", label: "Pequeno Problema" },
        { value: "major_issue", label: "Problema Grave" },
      ]
    },
    {
      name: "storageType",
      label: "Tipo de Armazenamento",
      type: "select",
      required: false,
      autoFill: 'storageType',
      options: [
        { value: "silo", label: "Silo" },
        { value: "big_bag", label: "Big Bag" },
        { value: "jute_bag", label: "Saco de Juta" },
        { value: "grain_pro", label: "Grain Pro" },
        { value: "vacuum", label: "Vácuo" }
      ]
    },
    {
      name: "batchPhotos",
      label: "Fotos do Lote / Bag",
      type: "file",
      description: "Fotos para storytelling e documentação visual"
    },
    {
      name: "warehouseNotes",
      label: "Observações do Armazém",
      type: "textarea",
      placeholder: "Ex: Lotes inspecionados, embalagens verificadas, condições especiais de armazenamento..."
    }
  ]
};