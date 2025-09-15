import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import type { Categoria, Plato, PlatoConOpciones, Opciones } from '../types/type'


// Context Type
interface DataContextType {
  platos: Plato[];
  setPlatos: (platos: Plato[]) => void;
  categorias: Categoria[];
  setCategorias: (categorias: Categoria[]) => void;
}

// Context + Provider
const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  return (
    <DataContext.Provider value={{ platos, setPlatos, categorias, setCategorias }}>
      {children}
    </DataContext.Provider>
  );
};

// Hook para usar en cualquier componente
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData debe usarse dentro de DataProvider");
  }
  return context;
};
