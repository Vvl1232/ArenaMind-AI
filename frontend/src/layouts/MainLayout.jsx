/**
 * StadiumPilot AI — MainLayout
 *
 * Root layout with Navbar + Sidebar + Content area.
 */

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="pt-24 lg:pl-60 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
