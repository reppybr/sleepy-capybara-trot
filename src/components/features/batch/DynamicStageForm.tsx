"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Loader2, Save, X, CheckCircle } from 'lucide-react'; // Added CheckCircle icon
import { STAGE_EVENT_SCHEMAS } from '@/constants/stageEventSchemas'; // Import STAGE_EVENT_SCHEMAS from new file
import { FormField, PartnerRoleKey, FieldOption, PartnerProfileSchema } from '@/types/forms'; // Import types from new file
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { registerStage } from '@/api/batchService';
import Badge from '@/components/common/Badge';
import { getEnterpriseDataByPublicKey } from '@/api/mockEnterpriseData'; // Import mock enterprise data

interface DynamicStageFormProps {
  batchId: string;
  partnerType: PartnerRoleKey;
  onStageAdded: () => void;
}

// Helper to get initial form data from schema
const getInitialFormData = (schema: PartnerProfileSchema | undefined) => {
  const initialData: { [key: string]: any } = {};
  if (!schema) return initialData;

  const processFields = (fields: FormField[]) => {
    fields.forEach(field => {
      if (field.type === 'group' && field.fields) {
        initialData[field.name] = {};
        field.fields.forEach(subField => {
          initialData[field.name][subField.name] = '';
        });
      } else if (field.type === 'multiselect') {
        initialData[field.name] = [];
      } else {
        initialData[field.name] = '';
      }
    });
  };
  processFields(schema.fields);
  return initialData;
};

export const DynamicStageForm: React.FC<DynamicStageFormProps> = ({ batchId, partnerType, onStageAdded }) => {
  const { profile } = useSupabaseAuth();
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set()); // Track auto-filled fields

  const stageSchema = STAGE_EVENT_SCHEMAS[partnerType];

  useEffect(() => {
    if (stageSchema) {
      const initialData = getInitialFormData(stageSchema);
      let newFormData = { ...initialData };
      const newAutoFilledFields = new Set<string>();

      if (profile?.public_key) {
        const enterpriseProfile = getEnterpriseDataByPublicKey(profile.public_key);
        if (enterpriseProfile && enterpriseProfile.profile_metadata) {
          const profileData = enterpriseProfile.profile_metadata;

          // Function to recursively merge profile data into form data
          const mergeData = (formFields: FormField[], currentFormData: any, currentProfileData: any, path: string = '') => {
            formFields.forEach(field => {
              const fullPath = path ? `${path}.${field.name}` : field.name;
              if (field.type === 'group' && field.fields && currentProfileData[field.name]) {
                if (!currentFormData[field.name]) currentFormData[field.name] = {};
                mergeData(field.fields, currentFormData[field.name], currentProfileData[field.name], fullPath);
              } else if (currentProfileData[field.name] !== undefined) {
                currentFormData[field.name] = currentProfileData[field.name];
                newAutoFilledFields.add(fullPath);
              }
            });
          };

          mergeData(stageSchema.fields, newFormData, profileData);
        }
      }
      setFormData(newFormData);
      setAutoFilledFields(newAutoFilledFields);
    }
  }, [stageSchema, profile?.public_key]);

  const handleChange = (fieldName: string, value: any, groupName?: string) => {
    setFormData(prev => {
      if (groupName) {
        return {
          ...prev,
          [groupName]: {
            ...prev[groupName],
            [fieldName]: value,
          },
        };
      }
      return { ...prev, [fieldName]: value };
    });
    setErrors(prev => ({ ...prev, [fieldName]: '' })); // Clear error on change

    // Remove from autoFilledFields if user edits it
    const fullPath = groupName ? `${groupName}.${fieldName}` : fieldName;
    if (autoFilledFields.has(fullPath)) {
      setAutoFilledFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(fullPath);
        return newSet;
      });
    }
  };

  const handleMultiSelectChange = (fieldName: string, selectedValue: string) => {
    setFormData(prev => {
      const currentValues = prev[fieldName] || [];
      if (currentValues.includes(selectedValue)) {
        return { ...prev, [fieldName]: currentValues.filter((v: string) => v !== selectedValue) };
      } else {
        return { ...prev, [fieldName]: [...currentValues, selectedValue] };
      }
    });
    setErrors(prev => ({ ...prev, [fieldName]: '' }));

    // Remove from autoFilledFields if user edits it
    if (autoFilledFields.has(fieldName)) {
      setAutoFilledFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
    }
  };

  const handleRemoveMultiSelectItem = (fieldName: string, itemToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: (prev[fieldName] || []).filter((v: string) => v !== itemToRemove),
    }));
    // Remove from autoFilledFields if user edits it
    if (autoFilledFields.has(fieldName)) {
      setAutoFilledFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
    }
  };

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!stageSchema) return false;

    const checkField = (field: FormField, currentData: any, groupName?: string) => {
      const value = groupName ? currentData?.[groupName]?.[field.name] : currentData?.[field.name];
      if (field.required && (!value || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0))) {
        newErrors[field.name] = `O campo '${field.label}' é obrigatório.`;
      }
      if (field.type === 'group' && field.fields) {
        field.fields.forEach(subField => checkField(subField, currentData, field.name));
      }
    };

    stageSchema.fields.forEach(field => checkField(field, formData));

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, stageSchema]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!profile) {
      toast.error("Usuário não autenticado.");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Registrando etapa na blockchain...", { id: "register-stage" });

    try {
      const response = await registerStage(
        batchId,
        formData,
        profile.public_key,
        profile.name,
        partnerType, // Use partnerType as stage type
        stageSchema?.title || 'Etapa Registrada' // Use schema title as stage title
      );

      toast.success(response.message, { id: "register-stage" });
      onStageAdded(); // Notify parent component that stage was added
    } catch (error: any) {
      toast.error(error.message || "Falha ao registrar a etapa. Tente novamente.", { id: "register-stage" });
      console.error("Error registering stage:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField, currentData: any, groupName?: string) => {
    const fieldId = groupName ? `${groupName}-${field.name}` : field.name;
    const value = groupName ? currentData?.[groupName]?.[field.name] : currentData?.[field.name];
    const hasError = errors[field.name];
    const fullPath = groupName ? `${groupName}.${field.name}` : field.name;
    const isAutoFilled = autoFilledFields.has(fullPath);

    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
        return (
          <div key={fieldId} className="grid gap-2">
            <Label htmlFor={fieldId} className="text-primary-foreground flex items-center gap-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
              {isAutoFilled && <CheckCircle className="h-3 w-3 text-green-500" title="Preenchido automaticamente" />}
            </Label>
            <Input
              id={fieldId}
              type={field.type}
              step={field.step}
              value={value || ''}
              onChange={(e) => handleChange(field.name, e.target.value, groupName)}
              placeholder={field.placeholder}
              className={cn("bg-slate-700 border-slate-600 text-primary-foreground", { "border-red-500": hasError })}
            />
            {hasError && <p className="text-red-500 text-xs mt-1">{hasError}</p>}
          </div>
        );
      case 'textarea':
        return (
          <div key={fieldId} className="grid gap-2">
            <Label htmlFor={fieldId} className="text-primary-foreground flex items-center gap-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
              {isAutoFilled && <CheckCircle className="h-3 w-3 text-green-500" title="Preenchido automaticamente" />}
            </Label>
            <Textarea
              id={fieldId}
              value={value || ''}
              onChange={(e) => handleChange(field.name, e.target.value, groupName)}
              placeholder={field.placeholder}
              className={cn("bg-slate-700 border-slate-600 text-primary-foreground min-h-[80px]", { "border-red-500": hasError })}
            />
            {hasError && <p className="text-red-500 text-xs mt-1">{hasError}</p>}
          </div>
        );
      case 'select':
        return (
          <div key={fieldId} className="grid gap-2">
            <Label htmlFor={fieldId} className="text-primary-foreground flex items-center gap-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
              {isAutoFilled && <CheckCircle className="h-3 w-3 text-green-500" title="Preenchido automaticamente" />}
            </Label>
            <Select onValueChange={(val) => handleChange(field.name, val, groupName)} value={value || ''}>
              <SelectTrigger className={cn("bg-slate-700 border-slate-600 text-primary-foreground", { "border-red-500": hasError })}>
                <SelectValue placeholder={field.placeholder || `Selecione ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-primary-foreground">
                {field.options?.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && <p className="text-red-500 text-xs mt-1">{hasError}</p>}
          </div>
        );
      case 'multiselect':
        const selectedItems = value as string[] || [];
        const availableOptions = field.options?.filter(opt => !selectedItems.includes(opt.value)) || [];
        return (
          <div key={fieldId} className="grid gap-2">
            <Label htmlFor={fieldId} className="text-primary-foreground flex items-center gap-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
              {isAutoFilled && <CheckCircle className="h-3 w-3 text-green-500" title="Preenchido automaticamente" />}
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedItems.map(itemValue => {
                const option = field.options?.find(opt => opt.value === itemValue);
                return (
                  <Badge key={itemValue} variant="secondary" className="flex items-center gap-1">
                    {option?.label || itemValue}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveMultiSelectItem(field.name, itemValue)} />
                  </Badge>
                );
              })}
            </div>
            <Select onValueChange={(val) => handleMultiSelectChange(field.name, val)} value="">
              <SelectTrigger className={cn("bg-slate-700 border-slate-600 text-primary-foreground", { "border-red-500": hasError })}>
                <SelectValue placeholder={`Adicionar ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-primary-foreground">
                {availableOptions.length > 0 ? (
                  availableOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-options" disabled>Nenhuma opção disponível</SelectItem>
                )}
              </SelectContent>
            </Select>
            {hasError && <p className="text-red-500 text-xs mt-1">{hasError}</p>}
          </div>
        );
      case 'group':
        return (
          <fieldset key={fieldId} className="border border-slate-700 rounded-md p-4 space-y-4">
            <legend className="text-lg font-semibold text-primary-foreground px-2">
              {field.label}
            </legend>
            {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field.fields?.map(subField => renderField(subField, currentData, field.name))}
            </div>
          </fieldset>
        );
      default:
        return null;
    }
  };

  if (!stageSchema) {
    return (
      <Card className="p-6 bg-slate-800/60 backdrop-blur-md border border-slate-700">
        <p className="text-muted-foreground text-lg text-center">
          Nenhum formulário de etapa definido para o seu papel ({partnerType}).
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6 bg-slate-800/60 backdrop-blur-md border border-slate-700">
      <h3 className="text-xl font-bold text-primary-foreground">{stageSchema.title}</h3>
      <p className="text-muted-foreground">{stageSchema.description}</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {stageSchema.fields.map(field => renderField(field, formData))}
        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary-foreground" />
                <span>Registrando...</span>
              </span>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <span>Registrar Etapa</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};