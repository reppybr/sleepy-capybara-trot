import { PartnerProfileSchema } from '@/types/forms';

export const logisticsStageSchema: PartnerProfileSchema = {
  title: "Registro de Transporte",
  description: "Informações sobre a coleta e condições de transporte.",
  icon: "🚚",
  fields: [
    {
      name: "transportCertifications",
      label: "Certificações de Transporte",
      type: "multiselect",
      autoFill: "transportCertifications" ,
      options: [
        { value: "organic_certified", label: "Transporte Orgânico Certificado" },
        { value: "sustainable", label: "Transporte Sustentável" },
        { value: "carbon_neutral", label: "Carbono Neutro" }
      ]
    },
    {
      name: "origin",
      label: "Local de Origem", 
      autoFill: "origin" ,
      type: "text",
      placeholder: "Ex: Fazenda Santa Maria, Monte Verde-MG"
    },
    {
      name: "originCoordinates",
      label: "Coordenadas de Origem",
      type: "group",
      fields: [
        {
          name: "lat",
          label: "Latitude",
         
          type: "number",
          step: "any",
          placeholder: "Ex: -22.9201"
        },
        {
          name: "lng",
          label: "Longitude",
      
          step: "any",
          placeholder: "Ex: -46.7652"
        }
      ]
    },
    {
      name: "destination",
      label: "Local de Destino",
      autoFill: "destination" ,
      type: "text",
      placeholder: "Ex: Armazém Central, São Paulo-SP"
    },
    {
      name: "destinationCoordinates",
      label: "Coordenadas de Destino",
      type: "group", 
      fields: [
        {
          name: "lat",
          label: "Latitude",
      
          type: "number",
          step: "any",
          placeholder: "Ex: -23.5505"
        },
        {
          name: "lng",
          label: "Longitude",
    
          type: "number", 
          step: "any",
          placeholder: "Ex: -46.6333"
        }
      ]
    },
    {
      name: "startTime",
      label: "Data e Hora de Partida",
      type: "datetime-local"
    },
    {
      name: "endTime", 
      label: "Data e Hora de Chegada",
      type: "datetime-local"
    },
    {
      name: "vehicleType",
      label: "Tipo de Veículo",
      autoFill: "vehicleType" ,
      type: "select",
      options: [
        { value: "truck_refrigerated", label: "Caminhão Refrigerado" },
        { value: "truck_dry", label: "Caminhão Seco" },
        { value: "van", label: "Van" }, 
        { value: "container_ship", label: "Navio Container" },
        { value: "air_cargo", label: "Avião de Carga" }
      ]
    },
    {
      name: "vehiclePlate",
      label: "Placa do Veículo",
      autoFill: "vehiclePlate" ,
      type: "text",
      placeholder: "Ex: ABC1D23"
    },
    {
      name: "driverName",
      label: "Nome do Motorista",
      autoFill: "driverName" ,
      type: "text",
      placeholder: "Ex: João Silva"
    },
    {
      name: "temperatureControl",
      label: "Temperatura Controlada (°C)",
      type: "number",
      placeholder: "Ex: 18"
    },
    {
      name: "humidityControl",
      label: "Umidade Controlada (%)",
      type: "number",
      placeholder: "Ex: 60"
    },
    {
      name: "distance",
      label: "Distância Percorrida (km)",
      type: "number",
      placeholder: "Ex: 350"
    },
    {
      name: "transportConditions",
      label: "Condições do Transporte",
      type: "textarea",
      placeholder: "Ex: Transporte hermético, sem umidade, protegido de luz solar direta, vibração mínima, condições de estrada..."
    },
    {
      name: "incidents",
      label: "Incidentes ou Observações",
      type: "textarea",
      placeholder: "Ex: Atraso por chuva, inspeção na estrada, condições especiais..."
    }
  ]
};