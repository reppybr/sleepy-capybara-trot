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
import { MapPin, LocateFixed, X, Plus, Loader2 } from 'lucide-react';
import { PARTNER_PROFILES } from '@/constants/partnerProfiles';
import { FormField, PartnerProfileSchema, PartnerRoleKey, FieldOption } from '@/types/forms';
import Badge from '@/components/common/Badge';
import { supabase } from '@/integrations/supabase/client';
import { roles } from '@/constants/roles'; // Import roles for display

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
  const { profile: user, session, loading: authLoading } = useSupabaseAuth();
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
      if (user.role === 'brand_owner') {
        navigate('/dashboard');
      } else {
        navigate('/tasks');
      }
      return;
    }

    // Crucial check: if user has no role assigned, they shouldn't be here
    if (user && !user.role) {
      toast.error("Seu papel ainda não foi atribuído. Por favor, entre em contato com o administrador.");
      navigate('/login'); // Redirect back to login with instructions
      return;
    }

    // If user and role are present, load the schema for that role
    if (user && user.role) {
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
    setErrors(prev => ({ ...prev, [fieldName]: '' }));
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
    if (!currentProfileSchema) {
      // This case should ideally not be reached due to the redirect above
      newErrors.general = "Nenhum esquema de perfil carregado.";
      setErrors(newErrors);
      return false;
    }

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

    if (!user || !user.role) { // Ensure user and role are present
      toast.error("Usuário não autenticado ou papel não atribuído.");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Salvando perfil operacional...", { id: "save-profile" });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 

      const profile_metadata = { ...formData };
      let companyName = user.name || 'Empresa Desconhecida';

      if (currentProfileSchema) {
        const nameField = currentProfileSchema.fields.find(f =>
          f.name === 'farmName' || f.name === 'warehouseName' || f.name === 'roasteryName' || f.name === 'packagingCompany' || f.name === 'distributorName' || f.name === 'millingFacilityName'
        );
        if (nameField && formData[nameField.name]) {
          companyName = formData[nameField.name];
        }
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          name: companyName,
          // The role is already set, no need to update it here
          profile_metadata: profile_metadata,
          is_profile_complete: true
        })
        .eq('auth_user_id', user.auth_user_id);

      if (updateError) {
        throw updateError;
      }

      toast.success("Perfil Operacional Atualizado!", { id: "save-profile" });
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

  const getRoleLabel = (roleValue: PartnerRoleKey) => {
    const role = roles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  };

  const renderField = (field: FormField, currentData: any, groupName?: string) => {
    const fieldId = groupName ? `${groupName}-${field.name}` : field.name;
    const value = groupName ? currentData?.[groupName]?.[field.name] : currentData?.[field.name];
    const hasError = errors[field.name];

    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
      case 'datetime-local':
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

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3">Carregando perfil...</span>
      </div>
    );
  }

  if (!currentProfileSchema) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">Nenhum formulário de perfil disponível para o seu papel.</p>
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
        <p className="text-md text-slate-400 mt-1">
          Preencha os detalhes para o seu papel como <span className="font-semibold text-primary">{getRoleLabel(user.role)}</span>.
        </p>
      </div>

      {/* Dynamic Form Container */}
      <Card className="p-6 space-y-6 bg-slate-800/60 backdrop-blur-md border border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentProfileSchema.fields.map(field => renderField(field, formData))}
          <div className="flex justify-end pt-4">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary-foreground" />
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