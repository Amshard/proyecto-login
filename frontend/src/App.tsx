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
import Login from './pages/Login/Login';
import SectionPage from './pages/SectionPage';

const PROTECTED_ROUTES: [path: string, element: ReactElement][] = [
  ['/cambio-password', <ChangePassword />],
  ['/catalogos/permanencias', <CatalogoPermanencias />],
  ['/catalogos/lineas', <CatalogoLineas />],
  ['/catalogos/estaciones', <CatalogoEstaciones />],
  ['/catalogos/descansos', <CatalogoDescansos />],
  ['/catalogos/taquillas', <CatalogoTaquillas />],
  ['/catalogos/personal-de-taquilla', <CatalogoPersonal />],
  ['/catalogos/personal-provisional', <PersonalProvisional />],
  ['/:section/:item', <SectionPage />],
  ['/:section/:group/:item', <SectionPage />],
];

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      {PROTECTED_ROUTES.map(([path, element]) => (
        <Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
      ))}
    </Routes>
  );
}

export default App;
