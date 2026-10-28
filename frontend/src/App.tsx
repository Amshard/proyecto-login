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
import CambioPosiciones from './pages/Procesos/CambioPosiciones';
import RespaldaRolVigente from './pages/Procesos/RespaldaRolVigente';
import RolesTurnoLinea from './pages/Procesos/ParaCalificacion/RolesTurnoLinea';
import ActualizaCalificacion from './pages/Procesos/ParaCalificacion/ActualizaCalificacion';
import ActualizaIncidencias from './pages/Procesos/ParaCalificacion/ActualizaIncidencias';
import AsignacionIncidencias from './pages/Procesos/ParaCalificacion/AsignacionIncidencias';
import Califica from './pages/Procesos/ParaCalificacion/Califica';
import CargaIncidencias from './pages/Procesos/ParaCalificacion/CargaIncidencias';
import PreparaExpedientes from './pages/Procesos/ParaCalificacion/PreparaExpedientes';
import RolDescansos from './pages/Procesos/RolDescansos';
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
  ['/procesos/respalda-rol-vigente', <RespaldaRolVigente />],
  ['/procesos/rol-de-descansos', <RolDescansos />],
  ['/procesos/para-calificacion/prepara-expedientes-para-asignar-incidencias', <PreparaExpedientes />],
  ['/procesos/para-calificacion/carga-incidencias-desde-archivos-excel', <CargaIncidencias />],
  ['/procesos/para-calificacion/asignacion-de-incidencias', <AsignacionIncidencias />],
  ['/procesos/para-calificacion/roles-por-turno-y-linea-promedia-calificacion', <RolesTurnoLinea />],
  ['/procesos/para-calificacion/califica', <Califica />],
  ['/procesos/para-calificacion/actualiza-incidencias-x-expediente', <ActualizaIncidencias />],
  ['/procesos/para-calificacion/actualiza-calificacion-x-rango-por-cambio-de-linea-y-turno', <ActualizaCalificacion />],
  ['/procesos/cambio-de-posiciones-en-el-rol', <CambioPosiciones />],
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
