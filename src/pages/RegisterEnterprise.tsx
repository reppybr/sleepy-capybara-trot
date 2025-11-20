"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { MapPin, LocateFixed, X, Plus } from 'lucide-react';
import { PARTNER_PROFILES } from '@/constants/partnerProfiles'; // Import PARTNER_PROFILES from new file
import { FormField, PartnerProfileSchema, PartnerRoleKey, FieldOption } from '@/types/forms'; // Import types from new file
import Badge from '@/components/common/Badge'; // Using common Badge component
import { supabase } from '@/integrations/supabase/client'; // Import supabase client

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

const RegisterEnterprise: React.FC = () => {
  const navigate = useNavigate();
  const { profile: user, session, loading: authLoading } = useSupabaseAuth(); // Get authLoading
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentProfileSchema, setCurrentProfileSchema] = useState<PartnerProfileSchema | null>(null);

  useEffect(() => {
    if (!authLoading && (!session || !user)) {
      navigate('/login');
      return;
    }

    if (user && user.is_profile_complete) {
      // If profile is already complete, redirect to dashboard/tasks
      if (user.role === 'brand_owner') {
        navigate('/dashboard');
      } else {
        navigate('/tasks');
      }
      return;
    }

    if (user) {
      const userRoleKey = user.role;
      const schema = PARTNER_PROFILES[userRoleKey];
      if (schema) {
        setCurrentProfileSchema(schema);
        setFormData(getInitialFormData(schema));
        // In a real app, you'd fetch existing data and pre-fill here
      } else {
        toast.error("Esquema de perfil não encontrado para o seu papel.");
        navigate('/dashboard'); // Redirect if no schema
      }
    }
  }, [session, user, navigate, authLoading]);

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
  };

  const handleRemoveMultiSelectItem = (fieldName: string, itemToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: (prev[fieldName] || []).filter((v: string) => v !== itemToRemove),
    }));
  };

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!currentProfileSchema) return false;

    const checkField = (field: FormField, currentData: any, groupName?: string) => {
      const value = groupName ? currentData?.[groupName]?.[field.name] : currentData?.[field.name];
      if (field.required && (!value || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0))) {
        newErrors[field.name] = `O campo '${field.label}' é obrigatório.`;
      }
      if (field.type === 'group' && field.fields) {
        field.fields.forEach(subField => checkField(subField, currentData, field.name));
      }
    };

    currentProfileSchema.fields.forEach(field => checkField(field, formData));

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, currentProfileSchema]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleChange('lat', position.coords.latitude, 'coordinates');
          handleChange('lng', position.coords.longitude, 'coordinates');
          toast.success("Localização atual obtida com sucesso!");
        },
        (error) => {
          toast.error(`Erro ao obter localização: ${error.message}`);
          console.error("Geolocation error:", error);
        }
      );
    } else {
      toast.error("Geolocalização não é suportada pelo seu navegador.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!user) {
      toast.error("Usuário não autenticado.");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Salvando perfil operacional...", { id: "save-profile" });

    try {
      // Simulate API call to save profile metadata
      await new Promise(resolve => setTimeout(resolve, 1000)); 

      // Construct payload for profile_metadata
      const profile_metadata = { ...formData };
      let companyName = user.name || 'Empresa Desconhecida'; // Default to user's name

      // Try to find a more specific company name from form data
      if (currentProfileSchema) {
        const nameField = currentProfileSchema.fields.find(f =>
          f.name === 'farmName' || f.name === 'warehouseName' || f.name === 'roasteryName' || f.name === 'packagingCompany' || f.name === 'distributorName' || f.name === 'millingFacilityName'
        );
        if (nameField && formData[nameField.name]) {
          companyName = formData[nameField.name];
        }
      }

      // Update the user's profile in the 'users' table
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          name: companyName, // Update the user's display name
          profile_metadata: profile_metadata, // Store the form data as profile_metadata
          is_profile_complete: true // Mark profile as complete
        })
        .eq('auth_user_id', user.auth_user_id);

      if (updateError) {
        throw updateError;
      }

      toast.success("Perfil Operacional Atualizado!", { id: "save-profile" });
      // Redirect based on role after completing profile
      if (user.role === 'brand_owner') {
        navigate('/dashboard');
      } else {
        navigate('/tasks');
      }
    } catch (error: any) {
      toast.error(error.message || "Falha ao salvar o perfil. Tente novamente.", { id: "save-profile" });
      console.error("Error saving profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField, currentData: any, groupName?: string) => {
    const fieldId = groupName ? `${groupName}-${field.name}` : field.name;
    const value = groupName ? currentData?.[groupName]?.[field.name] : currentData?.[field.name];
    const hasError = errors[field.name];

    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
      case 'datetime-local': // Added datetime-local
        return (
          <div key={fieldId} className="grid gap-2">
            <Label htmlFor={fieldId} className="text-primary-foreground">
              {field.label} {field.required && <span className="text-red-500">*</span>}
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
            <Label htmlFor={fieldId} className="text-primary-foreground">
              {field.label} {field.required && <span className="text-red-500">*</span>}
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
            <Label htmlFor={fieldId} className="text-primary-foreground">
              {field.label} {field.required && <span className="text-red-500">*</span>}
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
            <Label htmlFor={fieldId} className="text-primary-foreground">
              {field.label} {field.required && <span className="text-red-500">*</span>}
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
            {field.name === 'coordinates' && (
              <Button
                type="button"
                variant="secondary"
                onClick={getCurrentLocation}
                className="w-full flex items-center gap-2"
              >
                <LocateFixed className="h-4 w-4" /> Usar minha localização atual
              </Button>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field.fields?.map(subField => renderField(subField, currentData, field.name))}
            </div>
          </fieldset>
        );
      default:
        return null;
    }
  };

  if (!currentProfileSchema) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">Carregando perfil ou perfil não disponível...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-primary-foreground flex items-center gap-2">
          <span className="text-primary">{currentProfileSchema.icon}</span> {currentProfileSchema.title}
        </h1>
        <p className="text-md text-slate-400 mt-1">{currentProfileSchema.description}</p>
      </div>

      {/* Dynamic Form Container */}
      <Card className="p-6 space-y-6 bg-slate-800/60 backdrop-blur-md border border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentProfileSchema.fields.map(field => renderField(field, formData))}
          <div className="flex justify-end pt-4">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Salvando...</span>
                </span>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Salvar Perfil Operacional</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RegisterEnterprise;