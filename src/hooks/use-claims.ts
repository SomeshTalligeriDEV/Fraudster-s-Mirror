'use client';

import { useContext } from 'react';
import { ClaimsContext } from '@/app/dashboard/claims-provider';

export function useClaims() {
  const context = useContext(ClaimsContext);
  if (context === undefined) {
    throw new Error('useClaims must be used within a ClaimsProvider');
  }
  return context;
}
