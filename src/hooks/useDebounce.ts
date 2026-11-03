// Apunte de estudio: Aquí espero antes de actualizar el valor de búsqueda; limpio el temporizador cuando cambia la entrada.
import { useEffect, useState } from 'react';

export function useDebounce<T>(valor: T, delay = 3000): T {
  const [debounced, setDebounced] = useState<T>(valor);

  // Aquí programo la espera y la limpio para no conservar un temporizador anterior.
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(valor), delay);
    return () => clearTimeout(timer);
  }, [valor, delay]);

  return debounced;
}

