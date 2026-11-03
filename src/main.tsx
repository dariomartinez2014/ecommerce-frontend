// Apunte de estudio: Aquí monto la aplicación y conecto su entrada con el elemento raíz del HTML.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { CartProvider } from "./context/CartContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
);
