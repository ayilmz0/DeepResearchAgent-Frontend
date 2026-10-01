import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Research from "./pages/Research";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/research/:id" element={<Research />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;