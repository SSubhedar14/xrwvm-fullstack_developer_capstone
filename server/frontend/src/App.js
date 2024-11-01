import LoginPanel from "./components/Login/Login";
import Register from "./components/Register/Register"; // Import Register component
import { Routes, Route } from "react-router-dom";
import Dealer from "./components/Dealers/Dealer"
import Dealers from './components/Dealers/Dealers';
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPanel />} />,
      <Route path="/register" element={<Register />} />,
      <Route path="/dealers" element={<Dealers/>} />,
      <Route path="/dealer/:id" element={<Dealer/>} />
    </Routes>
  );
}

export default App;
