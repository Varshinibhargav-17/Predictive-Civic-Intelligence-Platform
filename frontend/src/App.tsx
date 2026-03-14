import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ComplaintPage from "./pages/ComplaintPage";
import TriagePage from "./pages/TriagePage";
import ForecastPage from "./pages/ForecastPage";
import BiasPage from "./pages/BiasPage";
import ComparePage from "./pages/ComparePage";
import InvestigatePage from "./pages/InvestigatePage";

const App: React.FC = (): React.JSX.Element => {
  const [activeView, setActiveView] = useState<"authority" | "public">("authority");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              activeView={activeView}
              onViewChange={setActiveView}
            />
          }
        >
          <Route index element={<Dashboard activeView={activeView} />} />
          <Route path="complaint" element={<ComplaintPage />} />
          <Route path="triage" element={<TriagePage />} />
          <Route path="forecast" element={<ForecastPage />} />
          <Route path="bias" element={<BiasPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="investigate" element={<InvestigatePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
