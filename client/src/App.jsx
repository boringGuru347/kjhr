import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import GenerationPage from "./pages/GenerationPage";
import ForecastAccuracyPage from "./pages/ForecastAccuracyPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/generation" element={<GenerationPage />} />
        <Route path="/forecast-accuracy" element={<ForecastAccuracyPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
