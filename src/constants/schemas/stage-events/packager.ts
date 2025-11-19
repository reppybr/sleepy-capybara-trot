import { PartnerProfileSchema } from '@/types/forms';

export const packagerStageSchema: PartnerProfileSchema = {
  title: "Registro de Embalagem",
  description: "Detalhes do acondicionamento do café torrado.",
  icon: "📦",
  fields: [
    {
      name: "packagingCompany",
      label: "Empresa de Embalagem",
      autoFill: "packagingCompany" ,
      type: "text",
      placeholder: "Ex: Embalagens Café Premium Ltda.",
      required: true
    },
    {
      name: "packagingImage",
      label: "Link da Imagem da Embalagem",
      type: "text",
      placeholder: "Ex: https://link-para-a-imagem.com/embalagem.jpg",
    },
    {
      name: "packagingDesign",
      label: "Design e Descrição da Embalagem",
      type: "textarea",
      placeholder: "Ex: Embalagem em design 'Edição Especial', com informações de preparo e arte personalizada.",
    },
    // Detalhes da Embalagem
    {
      name: "packagingType",
      label: "Tipo de Embalagem",
      type: "select",
      required: true,
      options: [
        { value: "pouch_bag", label: "Stand-up Pouch Bag" },
        { value: "block_bottom_bag", label: "Block Bottom Bag" },
        { value: "tin_can", label: "Lata Metálica" },
        { value: "degassing_valve_bag", label: "Saco com Válvula de Degaseificação" },
        { value: "doypack", label: "Doypack" },
        { value: "grain_pro", label: "Saco GrainPro" }
      ]
    },
    {
      name: "packageSize",
      label: "Tamanho da Embalagem",
      type: "select",
      required: true,
      options: [
        { value: "250g", label: "250g" },
        { value: "500g", label: "500g" },
        { value: "1kg", label: "1kg" },
        { value: "2kg", label: "2kg" },
        { value: "5kg", label: "5kg" },
        { value: "60kg", label: "60kg (Saco)" }
      ]
    },
    {
      name: "freshnessSeal",
      label: "Tecnologia de Frescor",
      type: "multiselect",
      options: [
        { value: "degassing_valve", label: "Válvula de Degaseificação" },
        { value: "zip_seal", label: "Zíper de Vedação (Zip-lock)" },
        { value: "gas_flushing", label: "Pulsão de Gás (Flushing)" },
        { value: "hermetic_seal", label: "Vedação Hermética" }
      ]
    },
    {
      name: "packagingDate",
      label: "Data da Embalagem",
      type: "date",
      required: true
    },
    {
      name: "bestBeforeDate",
      label: "Data de Validade (Melhor antes de)",
      type: "date",
    },
    {
      name: "preparationMessage",
      label: "Recomendações de Preparo",
      type: "textarea",
      placeholder: "Ex: 'Ideal para V60, com 25g de café e 350ml de água, 92°C.'",
    }
  ]
};