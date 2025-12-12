import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Results from "./pages/Results";
import PastSearches from "./pages/PastSearches";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/results" element={<Results />} />
      <Route path="/past" element={<PastSearches />} />
    </Routes>
  );
}
