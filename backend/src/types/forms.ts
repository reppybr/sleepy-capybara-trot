// This is a subset of types needed by the backend.
// It's kept separate to avoid dependency on the frontend codebase.

export type PartnerRoleKey = 
  | 'producer' 
  | 'logistics' 
  | 'warehouse' 
  | 'grader' 
  | 'roaster' 
  | 'packager' 
  | 'distributor' 
  | 'end_consumer' 
  | 'sustainability' 
  | 'beneficiamento' 
  | 'brand_owner' 
  | 'admin'      // For admin users
  | 'system'     // For system-generated events
  | 'movement';  // For custody transfers