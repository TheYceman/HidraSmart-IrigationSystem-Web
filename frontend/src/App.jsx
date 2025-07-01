import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Páginas
import RedirectPage from './pages/RedirectPage';
import Login from './pages/Login';
import ContactUs from './pages/ContactUs';

import PanelAplicaciones from './pages/PanelAplicaciones';
import GestorConsumos from './pages/GestorConsumos';

// Estilos GLOBALES
import '../public/styles/common/custom-scrollbar.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RedirectPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/panel-aplicaciones" element={<PanelAplicaciones />} />
        <Route path="/panel-aplicaciones/gestor-consumos" element={<GestorConsumos />} />
        <Route path="*" element={<RedirectPage />} />
      </Routes>
    </Router>
  );
}

export default App;