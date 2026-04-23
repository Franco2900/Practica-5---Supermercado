import { createContext, useState } from "react";

export const CarritoContext = createContext();

export function CarritoProvider({ children }) 
{
  const [carrito, setCarrito] = useState([]);

  return (
    <CarritoContext.Provider value={{ carrito, setCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
}
