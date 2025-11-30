import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListOverviewPage from "./ListOverviewPage";
import ListDetailPage from "./ListDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lists" element={<ListOverviewPage />} />
        <Route path="/lists/:id" element={<ListDetailPage />} />
        <Route path="*" element={<ListOverviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}
