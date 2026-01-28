"use client"

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Blockchain {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

interface AppState {
  activeBlockchain: string;
  blockchains: Blockchain[];
}

type AppAction = 
  | { type: 'SET_BLOCKCHAIN'; payload: string };

const initialState: AppState = {
  activeBlockchain: 'aleo',
  blockchains: [
    {
      id: 'aleo',
      name: 'Aleo',
      icon: '/aleo-icon.png',
      enabled: true,
    },
    {
      id: 'midnight',
      name: 'Midnight',
      icon: '/midnight-icon.svg',
      enabled: false,
    },
    {
      id: 'canton',
      name: 'Canton',
      icon: '/canton-icon.png',
      enabled: false,
    },
  ],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_BLOCKCHAIN':
      return {
        ...state,
        activeBlockchain: action.payload,
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}