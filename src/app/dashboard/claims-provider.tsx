'use client';

import { mockClaims } from '@/lib/data';
import type { Claim } from '@/lib/types';
import { createContext, useState, ReactNode } from 'react';

interface ClaimsContextType {
  claims: Claim[];
  addClaim: (claim: Claim) => void;
  updateClaim: (updatedClaim: Claim) => void;
  getClaimById: (id: string) => Claim | undefined;
}

export const ClaimsContext = createContext<ClaimsContextType | undefined>(undefined);

export function ClaimsProvider({ children }: { children: ReactNode }) {
  const [claims, setClaims] = useState<Claim[]>(mockClaims);

  const addClaim = (claim: Claim) => {
    setClaims(prevClaims => [claim, ...prevClaims]);
  };

  const updateClaim = (updatedClaim: Claim) => {
    setClaims(prevClaims =>
      prevClaims.map(c => (c.id === updatedClaim.id ? updatedClaim : c))
    );
  };

  const getClaimById = (id: string) => {
    return claims.find(c => c.id === id);
  };

  return (
    <ClaimsContext.Provider value={{ claims, addClaim, updateClaim, getClaimById }}>
      {children}
    </ClaimsContext.Provider>
  );
}
