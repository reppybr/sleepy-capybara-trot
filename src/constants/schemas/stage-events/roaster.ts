import { PartnerProfileSchema } from '@/types/forms';

export const roasterStageSchema: PartnerProfileSchema = {
  title: "Registro de Torra",
  description: "Parâmetros e resultados do processo de torrefação.",
  icon: "🔥",
  fields: [
    {
      name: "roasteryName",
      autoFill: "roasteryName" ,
      label: "Nome da Torrefação",
      type: "text",
      placeholder: "Ex: Torrefação Arte & Sabor",
      required: true
    },
    {
      name: "roasteryLocation",
      label: "Localização da Torrefação",
      type: "group",
      fields: [
        {
          name: "lat",
          label: "Latitude",
          autoFill: "roasteryLocation.lat" ,
          type: "number", 
          step: "any",
          placeholder: "Ex: -23.5505",
          required: true
        },
        {
          name: "lng",
          label: "Longitude",
          autoFill: "roasteryLocation.lng" ,
          type: "number",
          step: "any", 
          placeholder: "Ex: -46.6333",
          required: true
        }
      ]
    },
    {
      name: "roastNumber",
      label: "Número da Torra",
      type: "select",
      required: true,
      options: [
        { value: "test_roast", label: "1ª Torra Teste" },
        { value: "final_roast", label: "Torra Final" },
        { value: "production", label: "Produção" }
      ]
    },
    {
      name: "roastDestination",
      label: "Destino da Torra",
      type: "select",
      required: true,
      options: [
        { value: "espresso", label: "Espresso" },
        { value: "filter", label: "Filtro" },
        { value: "microlot", label: "Microlote Exclusivo" },
        { value: "blend", label: "Blend" }
      ]
    },
    {
      name: "postRoastProtocol",
      label: "Protocolo de Prova Pós-Torra",
      type: "textarea",
      placeholder: "Ex: Cupping de validação realizado 24h após torra com equipe de Q-Graders"
    },
    {
      name: "roastProfile",
      label: "Perfil de Torra",
      type: "select",
      required: true,
      options: [
        { value: "light", label: "Clara" },
        { value: "medium_light", label: "Média-Clara" },
        { value: "medium", label: "Média" },
        { value: "medium_dark", label: "Média-Escura" },
        { value: "dark", label: "Escura" },
        { value: "espresso", label: "Espresso" },
        { value: "filter", label: "Filtro" },
        { value: "french", label: "Francesa" }
      ]
    },
    {
      name: "roastDate",
      label: "Data da Torra",
      type: "date",
      required: true
    },
    {
      name: "batchSize",
      label: "Tamanho do Lote (kg)",
      type: "number",
      placeholder: "Ex: 15",
      required: true
    },
    {
      name: "chargeTemperature",
      label: "Temperatura de Carga (°C)",
      type: "number",
      placeholder: "Ex: 180"
    },
    {
      name: "temperature",
      label: "Temperatura Máxima (°C)",
      type: "number",
      placeholder: "Ex: 215"
    },
    {
      name: "dropTemperature",
      label: "Temperatura de Descarga (°C)", 
      type: "number",
      placeholder: "Ex: 198"
    },
    {
      name: "duration",
      label: "Duração Total (minutos)",
      type: "number",
      placeholder: "Ex: 12"
    },
    {
      name: "firstCrack",
      label: "Primeiro Crack (minuto)",
      type: "number",
      step: "0.1",
      placeholder: "Ex: 8.5"
    },
    {
      name: "secondCrack",
      label: "Segundo Crack (minuto)", 
      type: "number",
      step: "0.1",
      placeholder: "Ex: 11.2"
    },
    {
      name: "developmentTime",
      label: "Tempo de Desenvolvimento (min)",
      type: "number",
      step: "0.1",
      placeholder: "Ex: 2.5"
    },
    {
      name: "developmentRatio",
      label: "Taxa de Desenvolvimento (%)",
      type: "number",
      step: "0.1",
      placeholder: "Ex: 20.8"
    },
    {
      name: "roasterType",
      label: "Tipo de Torradeira",
      type: "select",
      options: [
        { value: "drum", label: "Tambor" },
        { value: "fluid_bed", label: "Leito Fluidizado" },
        { value: "hot_air", label: "Ar Quente" }
      ]
    },
    {
      name: "roastNotes",
      label: "Observações da Torra",
      type: "textarea",
      placeholder: "Notas de sabor desenvolvidas, uniformidade, aroma, desafios específicos, ajustes de perfil..."
    }
  ]
};