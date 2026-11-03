// Apunte de estudio: Aquí reúno la lógica de AdminLayout que utiliza esta parte del proyecto.
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        variant="admin"
        onMenuClick={() => setSidebarAbierto(!sidebarAbierto)}
      />

      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar
          isOpen={sidebarAbierto}
          onClose={() => setSidebarAbierto(false)}
        />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
