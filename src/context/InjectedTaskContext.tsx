import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface InjectedTask {
  id: string;
  batchId: string;
  producer: string;
  arrivalDate: string;
  daysWaiting: number;
  status: string;
  actionLabel: string;
  role: string;
  assignedToPublicKey: string;
}

interface InjectedTaskContextType {
  injectedTask: InjectedTask | null;
  setInjectedTask: (task: InjectedTask | null) => void;
}

const InjectedTaskContext = createContext<InjectedTaskContextType | undefined>(undefined);

export const InjectedTaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [injectedTask, setInjectedTask] = useState<InjectedTask | null>(null);

  return (
    <InjectedTaskContext.Provider value={{ injectedTask, setInjectedTask }}>
      {children}
    </InjectedTaskContext.Provider>
  );
};

export const useInjectedTask = () => {
  const context = useContext(InjectedTaskContext);
  if (context === undefined) {
    throw new Error('useInjectedTask must be used within an InjectedTaskProvider');
  }
  return context;
};