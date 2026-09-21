import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import CatalogoDescansos from './pages/Catalogos/CatalogoDescansos';
import CatalogoEstaciones from './pages/Catalogos/CatalogoEstaciones';
import CatalogoLineas from './pages/Catalogos/CatalogoLineas';
import CatalogoPermanencias from './pages/Catalogos/CatalogoPermanencias';
import CatalogoPersonal from './pages/Catalogos/CatalogoPersonal';
import CatalogoTaquillas from './pages/Catalogos/CatalogoTaquillas';
import PersonalProvisional from './pages/Catalogos/PersonalProvisional';
import ChangePassword from './pages/Login/ChangePassword';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login/Login';
import Register from './pages/Login/Register';
import SectionPage from './pages/SectionPage';
import './App.css';

const PROTECTED_ROUTES: [path: string, element: ReactElement][] = [
  ['/dashboard', <Dashboard />],
  ['/cambio-password', <ChangePassword />],
  ['/dashboard/catalogos/permanencias', <CatalogoPermanencias />],
  ['/dashboard/catalogos/lineas', <CatalogoLineas />],
  ['/dashboard/catalogos/estaciones', <CatalogoEstaciones />],
  ['/dashboard/catalogos/descansos', <CatalogoDescansos />],
  ['/dashboard/catalogos/taquillas', <CatalogoTaquillas />],
  ['/dashboard/catalogos/personal-de-taquilla', <CatalogoPersonal />],
  ['/dashboard/catalogos/personal-provisional', <PersonalProvisional />],
  ['/dashboard/:section/:item', <SectionPage />],
  ['/dashboard/:section/:group/:item', <SectionPage />],
];

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {PROTECTED_ROUTES.map(([path, element]) => (
        <Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
      ))}
    </Routes>
  );
}

export default App;
