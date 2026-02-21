import { Routes, Route } from "react-router-dom";
import "./App.css";

import PharmaGuard from "./components/PharmaGuard";
import GuestLayout from "./components/GuestLayout";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<GuestLayout />}>
        <Route path="/" element={<PharmaGuard />} />

        
        </Route>
      </Routes>
    </div>
  );
}

export default App;
