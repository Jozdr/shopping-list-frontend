import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./app/AppProvider";
import AppToolbar from "./components/AppToolbar";
import ListOverviewPage from "./ListOverviewPage";
import ListDetailPage from "./ListDetailPage";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppToolbar />
        <Routes>
          <Route path="/lists" element={<ListOverviewPage />} />
          <Route path="/lists/:id" element={<ListDetailPage />} />
          <Route path="*" element={<ListOverviewPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
