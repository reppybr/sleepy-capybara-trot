export type FieldType = 'text' | 'number' | 'date' | 'textarea' | 'select' | 'multiselect' | 'group' | 'datetime-local' | 'file';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  step?: string; // For number inputs
  min?: number; // For number inputs
  max?: number; // For number inputs
  options?: FieldOption[]; // For select and multiselect
  description?: string; // For groups
  fields?: FormField[]; // For groups
  autoFill?: string; // New property for auto-filling from enterprise profile
}

export interface PartnerProfileSchema {
  title: string;
  description: string;
  icon: string;
  fields: FormField[];
}

export type PartnerRoleKey = 'producer' | 'logistics' | 'warehouse' | 'grader' | 'roaster' | 'packager' | 'distributor' | 'end_consumer' | 'sustainability' | 'beneficiamento' | 'brand_owner';