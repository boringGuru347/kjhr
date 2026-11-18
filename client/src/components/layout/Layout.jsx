import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const pageConfig = {
  "/dashboard": {
    title: "Dashboard",
    description:
      "Track forecast performance and compare expected vs actual UK wind generation."
  },
  "/generation": {
    title: "Generation",
    description:
      "Review half-hourly generation intervals and day-level forecast coverage."
  },
  "/forecast-accuracy": {
    title: "Forecast Accuracy",
    description:
      "Evaluate MAE, RMSE, bias, and forecast availability across selected dates."
  }
};

function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const currentMeta = useMemo(() => {
    return pageConfig[pathname] || pageConfig["/dashboard"];
  }, [pathname]);

  return (
    <div className="min-h-screen bg-appBg text-ink">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpen={() => setSidebarOpen(true)}
      />

      <div className="lg:pl-72">
        <main className="mx-auto w-full max-w-[1400px] px-4 pb-10 pt-16 md:px-6 lg:px-8 lg:pt-6">
          <Header title={currentMeta.title} description={currentMeta.description} />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
