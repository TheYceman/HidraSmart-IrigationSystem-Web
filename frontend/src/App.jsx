import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RedirectPage from './pages/RedirectPage';
import Login from './pages/Login';
import ContactUs from './pages/ContactUs';
import VentanaVacia from './pages/EjemploVacia';

import PanelAplicaciones from './pages/PanelAplicaciones';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RedirectPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/panel-aplicaciones" element={<PanelAplicaciones />} />
        <Route path="/ventana-ejemplo" element={<VentanaVacia />} />
        <Route path="*" element={<RedirectPage />} />
      </Routes>
    </Router>
  );
}

export default App;